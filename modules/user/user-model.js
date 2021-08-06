const db = require("../../models");
const user = db.user;
const userLogin = db.Session;
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { constants } = require("../../utils/constant");
const user_register = async (userData) => {
  //console.log('userData', userData)
  try {
    const users = await user.findOne({
      where: {
        username: userData.username,
      },
    });
    if (users) {
      const err = new Error(constants.errors.user);
      throw err;
    }
    await user.create(userData);

    return true;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

const createSession = (user) => {
  return new Promise((resolve, reject) => {
    const userId = user.user_id;

    userLogin
      .create({
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
      "onlinewebtutorkey",
      {
        expiresIn: "24h",
        algorithm: "HS384",
      }
    );

    resolve(token);
  });
};

const login = (userData) => { // TODO: Use async await in this function instead of raw promises!
  return new Promise((resolve, reject) => {
    let isSuccessful = false;
    let token = "";

    user
      .findOne({
        where: {
          username: userData.username,
        },
      })
      .then((users) => {
        if (users) {
          if (userData.password === users.password) {
            isSuccessful = true;
            createSession(users)
              .then((session) => {
                generateJwtToken(users, session.uuid, session.is_admin)
                  .then((accessToken) => {
                    token = accessToken;

                    resolve({
                      isSuccessful,
                      token,
                    });
                  })
                  .catch((err) => {
                    console.log("err", err);
                    reject(err);
                  });
              })
              .catch((err) => {
                console.log("err", err);
                reject(err);
              });
          } else {
            resolve({
              isSuccessful,
              token,
            });
          }
        } else {
          resolve({
            isSuccessful,
            token,
          });
        }
      }).catch((err)=>{
          throw err
      })
  });
};

const logout = async (uuid) => {
  try {
    const loginData = await userLogin.findOne({
      where: {
        uuid,
      },
    });

    if (loginData) {
      await userLogin.update(
        { is_loggedout: 1 },
        {
          where: {
            uuid,
          },
        }
      );
      return true
    }

    else{
       const err=new Error(constants.errors.failedLoggingout)
        throw err
    }

  } catch (error) {
    console.log("error", error);
    throw error
  }
};

module.exports = {
  user_register,
  createSession,
  login,
  logout,
};
