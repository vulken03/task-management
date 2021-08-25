const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
//const excel = require('exceljs')
const sequelize = require("sequelize");
const config = require("../../configuration/config");
const { logger } = require("../../utils/logger");
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
 * admin_login
 * @async
 * @method
 * @typedef {object} adminData
 * @property {string} username -username
 * @property {string} password -password
 * @returns {void}
 */
/**
 * @type {adminData}
 */

const Adminlogin = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    let isSuccessful = false;
    let token = "";

    _DB.admin_module
      .findOne({
        where: {
          username,
        },
      })
      .then((admin) => {
        if (admin) {
          if (password === admin.password) {
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
                    console.log(`err ${err}`);
                    reject(err);
                  });
              })
              .catch((err) => {
                console.log(`err ${err}`);
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

/**
 * all users with task count
 * @async
 * @method
 * @param {string} startDate when task started
 * @param {string} endDate  when task ended
 * @returns {taskDetails}
 */

/**
 * @typedef {Object} taskDetails
 * @property {string} username name of the user
 * @property {number} n_tasks total tasks performed by user
 */

const getAllTasks = async (startDate, endDate) => {
  try {
    const getAllTaskDetails = await _DB.task.findAll({
      limit: 10,
      offset: 0,
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
      console.log(`getall ${getAllTaskDetails}`);
      return getAllTaskDetails;
    } else {
      const error = new Error("Error while getting data");
      throw error;
    }
  } catch (error) {
    logger.error(`error ${error}`);
    throw error;
  }
};
/**
 * admin_logout
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
      const err = new Error("error while loggedout");
      throw err;
    }
  } catch (error) {
    logger.error(`error ${error}`);
    throw error;
  }
};

module.exports = {
  getAllTasks,
  Adminlogin,
  logout,
};
