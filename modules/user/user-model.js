const jwt = require("jsonwebtoken");
const moment = require("moment");
const { constants } = require("../../utils/constant");
const { validatePassword } = require("../../utils/encrypt");
const config = require("../../configuration/config");
var nodemailer = require("nodemailer");
const { raw } = require("body-parser");
const { logger } = require("../../utils/logger");

/**
 * return new_user object
 * @typedef {Object} new_user
 * @property {string} username -username(unique)
 * @property {string} password -password
 * @property {string} phoneno -phoneno
 * @property {string} email -email address
 */

/**
 * user registration
 * @async
 * @method
 * @typedef {object} userData -user object
 * @property {string} username -username(unique)
 * @property {string} password -password
 * @property {string} phoneno -phoneno
 * @property {string} email -email address
 * @returns {new_user} - value of new registered user
 */

/**
 * @type {userData}
 */
const user_register = async (userData) => {
  const { username } = userData;
  console.log(`userData ${username}`);
  try {
    const users = await _DB.user.findOne({
      where: {
        username,
      },
    });
    if (users) {
      const err = new Error(constants.errors.user);
      throw err;
    } else {
      const new_User = await _DB.user.create(userData);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      var mailOptions = {
        from: process.env.user,
        to: userData.email,
        subject: "Welcome mail",
        text: `Welcome ${username}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          logger.info(`Email sent: ${info.response}`);
        }
      });
      return new_User;
    }
  } catch (err) {
    logger.error(`err ${err}`);
    throw err;
  }
};

const createSession = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    const userId = user_id;

    _DB.Session.create({
      user_id: userId,
      login_time: +moment().unix(),
      time_to_leave: +moment().add(1, "days").unix(),
      is_loggedout: 0,
      is_admin: 0,
    })
      .then((session) => {
        resolve(session);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const generateJwtToken = ({ username, admin_id, user_id }, uuid, isAdmin) => {
  return new Promise((resolve, reject) => {
    const userId = isAdmin == 1 ? admin_id : user_id;

    const token = jwt.sign(
      {
        uuid,
        userId,
        username,
        isAdmin,
      },
      config.get("jwt.key"),
      {
        expiresIn: "24h",
        algorithm: "HS384",
      }
    );

    resolve(token);
  });
};

/**
 * user_login
 * @async
 * @method
 * @typedef {object} userData
 * @property {string} username -username
 * @property {string} password -password
 * @returns {string} -jwttoken
 */
/**
 * @type {userData}
 */
const login = async ({ username, password }) => {
  try {
    let users = await _DB.user.findOne({
      where: {
        username,
      },
    });

    if (users) {
      const isValidate = validatePassword(
        password,
        users.password.split(":")[1],
        users.password.split(":")[0]
      );
      if (isValidate) {
        const session = await createSession(users);
        if (session) {
          const jwt = await generateJwtToken(
            users,
            session.uuid,
            session.is_admin
          );
          if (jwt) {
            return jwt;
          } else {
            const error = new Error("error while generating jwt");
            throw error;
          }
        } else {
          const error = new Error("error while creating session");
          throw error;
        }
      } else {
        const error = new Error("you entered wrong password");
        throw error;
      }
    } else {
      const error = new Error("user not found with this username");
      throw error;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
/**
 * user_logout
 * @async
 * @method
 * @param {uuid} uuid -uuid
 * @returns {boolean} loginData-is_loggedOut is become true or false
 */
const logout = async (uuid) => {
  try {
    const loginData = await _DB.Session.findOne({
      where: {
        uuid,
      },
    });

    if (loginData) {
      await loginData.update({ is_loggedout: 1 });
      return true;
    } else {
      const err = new Error(constants.errors.failedLoggingout);
      throw err;
    }
  } catch (error) {
    logger.error(`error ${error}`);
    throw error;
  }
};

/**
 * forget_password
 * @async
 * @method
 * @typedef {Object} userData userDetails
 * @property {email} email user Email
 * @returns {void}
 */
/**
 *
 * @type {userData}
 */
const passwordResetMail = async ({ email }) => {
  try {
    const User = await _DB.user.findOne({
      where: {
        email,
      },
      raw: true,
    });
    if (User) {
      const { user_id, username, password } = User;
      const session = await createPasswordResetSession(user_id);
      if (session) {
        const token = await generatePasswordResetJwt(
          user_id,
          session.uuid,
          username,
          password
        );
        if (token) {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.user,
              pass: process.env.pass,
            },
          });

          var mailOptions = {
            from: process.env.user,
            to: email,
            subject: "Reset password mail",
            text: `Token: ${token}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              throw error;
            } else {
              logger.info(`Email sent:  ${info.response}`);
            }
          });
        } else {
          throw new Error("Error occured while generating token");
        }
      } else {
        throw new Error("Error occured while create session");
      }
    } else {
      throw new Error("User not found with this email-id");
    }
  } catch (error) {
    logger.error(`error ${error}`);
    throw error;
  }
};

/**
 * password reset
 * @param {number} userId
 * @typedef {Object} userData
 * @property {string} password
 * @returns {void}
 */

const passwordReset = async (userId, { password }) => {
  try {
    const findUser = await _DB.user.findOne({
      where: {
        user_id: userId,
      },
    });
    if (findUser) {
      const passwordUpdate = await findUser.update({
        password,
      });
      return passwordUpdate;
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    logger.error(`error ${error}`);
    throw error;
  }
};

const createPasswordResetSession = async (userid) => {
  return await _DB.Session.create({
    user_id: userid,
    login_time: +moment().unix(),
    time_to_leave: +moment().add(1, "hours").unix(),
    is_loggedout: 0,
    is_admin: 0,
  });
};

const generatePasswordResetJwt = async (userId, uuid, username, password) => {
  return jwt.sign(
    {
      uuid,
      userId,
      username,
    },
    password,
    {
      expiresIn: "1h",
      algorithm: "HS384",
    }
  );
};

module.exports = {
  user_register,
  createSession,
  login,
  logout,
  passwordResetMail,
  passwordReset,
};
