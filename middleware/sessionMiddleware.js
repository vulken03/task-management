const moment = require("moment")
const jwt = require("jsonwebtoken")
const { constants } = require("../utils/constant")
//const moment=require('moment')
const config=require('../configuration/config')


let verifyJWT = async (req) => { // TODO: pass only those arguments that are needed in the function defination
  // try {
    let token = req.headers["authorization"];

    let userData = jwt.verify(token,config.get('jwt.key'), {
      algorithms: ["HS384"],
    });
    if (userData) {
      return userData;
    } else {
      const error = new Error("userData not found");
      throw error;
    }
  // } catch (err) {
  //   console.log("err", err);
  //   throw err;
  // }
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

let isValidUser = async ({ isAdmin, userId, ...additional_prop }) => {
  try {
    // if (additional_prop.new_prop) 
    let isUserValid = false;
    let fetchedUser = null;
    if (isAdmin == 1) {
      fetchedUser = await _DB.admin_module.findOne({
        where: {
          admin_id: userId,
        },
      });
    } else {
      fetchedUser = await _DB.user.findOne({
        where: {
          user_id: userId,
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

  try { // TODO: check what happens when there's an error after removing try catch block!
    if (req.headers.authorization) {
      // throw new Error()
      let userData = await verifyJWT(req);

      let isSessionValid = await isValidSession(userData.uuid);
      if (!isSessionValid) {
        const error = new Error(constants.errors.isExpired);
        return next(error);
      }
      if (true) {
        userData.new_prop = 'abc'
      }
      let { isUserValid, user } = await isValidUser(userData);
      if (isUserValid) {
        req.user = user;
        req.user.uuid = userData.uuid;
        req.isAdmin = userData.isAdmin;
        next();
      } else {
        next(new Error("Invalid user id"));
      }
    } else {
      next(new Error("Invalid authorization"))
      // const error = new Error("Invalid authorization");
      // throw error;
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = {
  authenticateRequest
};
