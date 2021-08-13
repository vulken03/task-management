const jwt = require("jsonwebtoken");
const moment = require("moment");
const { constants } = require("../../utils/constant");
const { validatePassword } = require("../../utils/encrypt");
const config = require("../../configuration/config");
var nodemailer = require("nodemailer");
const { raw } = require("body-parser");
const user_register = async (userData) => {
  console.log("userData", userData.username);
  try {
    const users = await _DB.user.findOne({
      where: {
        username: userData.username,
      },
    });
    if (users) {
      const err = new Error(constants.errors.user);
      throw err;
    } else await _DB.user.create(userData);

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
      text: `Welcome ${userData.username}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return true;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

const createSession = (user) => {
  return new Promise((resolve, reject) => {
    const userId = user.user_id;

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

const generateJwtToken = (user, uuid, isAdmin) => {
  return new Promise((resolve, reject) => {
    const userId = isAdmin == 1 ? user.admin_id : user.user_id;
    const username = user.username;

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

const login = async (userData) => {
  // TODO: Use async await in this function instead of raw promises!
  //   return new Promise((resolve, reject) => {
  //     let isSuccessful = false;
  //     let token = "";

  //     user
  //       .findOne({
  //         where: {
  //           username: userData.username,
  //         },
  //       })
  //       .then((users) => {
  //         if (users) {
  //           const isValidate = validatePassword(
  //             userData.password,
  //             users.password.split(":")[1],
  //             users.password.split(":")[1]
  //           );
  //           if (isValidate) {
  //             isSuccessful = true;
  //             createSession(users)
  //               .then((session) => {
  //                 generateJwtToken(users, session.uuid, session.is_admin)
  //                   .then((accessToken) => {
  //                     token = accessToken;

  //                     resolve({
  //                       isSuccessful,
  //                       token,
  //                     });
  //                   })
  //                   .catch((err) => {
  //                     console.log("err", err);
  //                     reject(err);
  //                   });
  //               })
  //               .catch((err) => {
  //                 console.log("err", err);
  //                 reject(err);
  //               });
  //           } else {
  //             resolve({
  //               isSuccessful,
  //               token,
  //             });
  //           }
  //         } else {
  //           resolve({
  //             isSuccessful,
  //             token,
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });
  //   });
  try {
    let users = await _DB.user.findOne({
      where: {
        username: userData.username,
      },
    });

    if (users) {
      const isValidate = validatePassword(
        userData.password,
        users.password.split(":")[1],
        users.password.split(":")[0] // TODO: correct this
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
    throw error;
  }
};
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
    console.log("error", error);
    throw error;
  }
};

const passwordResetMail = async (userData) => {
  try {
    const User = await _DB.user.findOne({
      where: {
        email: userData.email,
      },
      raw:true
    },);
    if (User) {
      const session = await createPasswordResetSession(User.user_id);
      if (session) {
        const token = await generatePasswordResetJwt(
          User.user_id,
          session.uuid,
          User.username,
          User.password
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
            to: userData.email,
            subject: "Reset password mail",
            text: `Token: ${token}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              throw error;
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          return true;
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
    console.log("error", error);
    throw error;
  }
};

const passwordReset = async (userId, userData) => {
  try {
    const findUser = await _DB.user.findOne({
      where: {
        user_id: userId,
      },
    });
    if (findUser) {
      const passwordUpdate = await findUser.update({
        password: userData.password,
      });
      return passwordUpdate;
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    throw error;
  }
};

const createPasswordResetSession = async(userid) => {
  return await _DB.Session.create({
    user_id: userid,
    login_time: +moment().unix(),
    time_to_leave: +moment().add(1, "hours").unix(),
    is_loggedout: 0,
    is_admin: 0,
  });
};

const generatePasswordResetJwt = async(userId, uuid, username, password) => {
  return jwt.sign(
    {
      uuid,
      userId,
      username,
    },
    'onlinewebtutorkey',
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
