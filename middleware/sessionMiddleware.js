const moment = require("moment")
const jwt = require("jsonwebtoken")
const { constants } = require("../utils/constant")
//const moment=require('moment')
const config=require('../configuration/config')


let verifyJWT = async (req) => {
  try {
    let token = req.headers["authorization"];

    let userData = jwt.verify(token,config.get('jwt.key'), {
      // TODO: read secret from config file!
      algorithms: ["HS384"],
    });
    if (userData) {
      return userData;
    } else {
      const error = new Error("userData not found");
      throw error;
    }
    // TODO: return appropriate error or flag when userData is empty/null
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

let isValidSession = async (uuid) => {
  try {
    let isValid = false;
    let userSession = await _DB.Session.findOne({
      where: {
        uuid,
      },
    });

    if (userSession) {
      const timeToLeave = moment.unix(userSession.time_to_leave);
      const isExpired = moment().isAfter(timeToLeave);

      if (!isExpired && !userSession.is_loggedout) {
        isValid = true;
      }

      if (isExpired) {
        await _DB.Session.update(
          { is_loggedout: 1 },
          {
            fields: ["is_loggedout"],
          }
        );
      }
    }

    return isValid;
  } catch (err) {
    console.log(`error while validating user with ${uuid}`);

    throw err;
  }
};

let isValidUser = async (user) => {
  try {
    let isUserValid = false;
    let fetchedUser = null;
    if (user.isAdmin == 1) {
      fetchedUser = await _DB.admin_module.findOne({
        where: {
          admin_id: user.userId,
        },
      });
    } else {
      fetchedUser = await _DB.user.findOne({
        where: {
          user_id: user.userId,
        },
        raw: true
      });
    }
    // TODO: usage of raw: true missing when performing only read operation!!
    if (fetchedUser) {
      isUserValid = true;
    }
    return {
      isUserValid,
      user: fetchedUser,
    };
  } catch (error) {
    console.log(`error occured while fetching with userid ${user.id}`);
    throw error;
  }
};

let authenticateRequest = async (req, res, next) => {
  if (constants.insecureRoutes.includes(req.url)) {

    return next();
  }

  try {
    if (req.headers.authorization) {
     
      let userData = await verifyJWT(req);

      let isSessionValid = await isValidSession(userData.uuid);
      if (!isSessionValid) {
        const error = new Error(constants.errors.isExpired);
        return next(error);
      }
      let { isUserValid, user } = await isValidUser(userData);
      if (isUserValid) {
        req.user = user;
        req.user.uuid = userData.uuid;
        req.isAdmin = userData.isAdmin;
        return next();
      } else {
        const err = new Error("Invalid user id");
        next(err); // TODO: Unnecessary use of throw, remove this! next(err) is enough..
      }
    } else {
      const error = new Error("Invalid authorization");
      throw error;
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = {
  authenticateRequest
};
