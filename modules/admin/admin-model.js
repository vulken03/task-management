const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
//const excel = require('exceljs')
const sequelize = require("sequelize");
const config = require("../../configuration/config");
const createSessionAdmin = (admin) => {
  return new Promise((resolve, reject) => {
    const adminId = admin.admin_id;

    _DB.Session.create({
      user_id: adminId,
      login_time: +moment().unix(),
      time_to_leave: +moment().add(1, "days").unix(),
      is_loggedout: 0,
      is_admin: 1,
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

const Adminlogin = (adminData) => {
  return new Promise((resolve, reject) => {
    let isSuccessful = false;
    let token = "";

    _DB.admin_module
      .findOne({
        where: {
          username: adminData.username,
        },
      })
      .then((admin) => {
        if (admin) {
          if (adminData.password === admin.password) {
            isSuccessful = true;
            createSessionAdmin(admin)
              .then((session) => {
                generateJwtToken(admin, session.uuid, session.is_admin)
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
      });
  });
};

const getAllTasks = async (startDate, endDate) => {
  try {
    const getAllTaskDetails = await _DB.task.findAll({
      where: {
        [Op.or]: {
          start_date: { [Op.between]: [startDate, endDate] },
          end_date: { [Op.between]: [startDate, endDate] },
        },
      },
      attributes: [[sequelize.fn("COUNT", "*"), "n_tasks"], "user.username"],

      include: {
        model: _DB.user,
        attributes: [],
      },
      group: "task.user_id",
      raw: true,
    });

    if (getAllTaskDetails) {
      console.log("getall", getAllTaskDetails);
      return getAllTaskDetails;
    } else {
      const error = new Error("Error while getting data");
      throw error;
    }
  } catch (error) {
    console.log("error", error);
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
      const err = new Error("error while loggedout");
      throw err;
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = {
  getAllTasks,
  Adminlogin,
  logout,
};
