const { Op } = require("sequelize");
const readXlsxFile = require("read-excel-file/node");
const { logger } = require("../../utils/logger");
//const excel = require('exceljs')

const task = async (userid, taskDetails) => {
  try {
    const todayDate = new Date();
    const date1 = new Date(taskDetails.start_date);
    const date2 = new Date(taskDetails.end_date);
    if (date1 < date2 && date1 >= todayDate) {
      await _DB.task.create({
        task_name: taskDetails.task_name,
        start_date: taskDetails.start_date,
        end_date: taskDetails.end_date,
        user_id: userid,
      });
      return true;
    } else {
      const error = new Error(
        "enddate must be later timestamp than startdate or startdate greater than current date"
      );
      throw error;
    }
  } catch (error) {
    logger.error("error", error);
    throw error;
  }
};

const update_task = async (userid, taskDetails, taskid) => {
  try {
    const todayDate = new Date();
    const date1 = new Date(taskDetails.start_date);
    const date2 = new Date(taskDetails.end_date);
    const taskData = await _DB.task.findOne({
      where: {
        task_id: taskid,
        user_id: userid,
      },
    });
    if (taskData) {
      if (taskData.user_id == userid && date1 < date2 && date1 >= todayDate) {
        await taskData.update(taskDetails);
        return true;
      } else {
        const error = new Error(
          "enddate must be later timestamp than startdate or startdate greater than current date"
        );
        throw error;
      }
    } else {
      const err = new Error("task not found with this id");
      throw err;
    }
  } catch (error) {
    logger.error("error", error);
    throw error;
  }
};

const complete_task = async (userid, taskDetails, taskid) => {
  try {
    const taskData = await _DB.task.findOne({
      where: {
        task_id: taskid,
        user_id: userid,
      },
    });
    if (taskData) {
      if (taskData.user_id == userid) {
        await taskData.update(taskDetails);
        return true;
      }
    } else {
      const err = new Error("task notFound with this taskid");
      throw err;
    }
  } catch (error) {
    logger.error("error", error);
    throw error;
  }
};

const delete_task = async (userid, taskid) => {
  try {
    const taskData = await _DB.task.findOne({
      where: {
        task_id: taskid,
      },
    });

    console.log("taskdata", taskData);
    if (taskData) {
      if (taskData.user_id == userid && taskData.is_complete == false) {
        await taskData.destroy();
      } else {
        const err = new Error("task is completed");
        throw err;
      }
    }
  } catch (err) {
    logger.error("error");
    throw err;
  }
};

const getTask = async (startDate, endDate, userid) => {
  try {
    const getTaskDetails = await _DB.task.findAll({
      where: {
        user_id: userid,
        [Op.or]: {
          start_date: { [Op.between]: [startDate, endDate] },
          end_date: { [Op.between]: [startDate, endDate] },
        },
      },
      attributes: {
        include: ["task_name", "is_complete", "start_date", "end_date"],
      },

      include: {
        model: _DB.user,
        attributes: ["username"],
      },
      raw: true,
    });
    // } else {
    //
    // }
    if (getTaskDetails) {
      console.log("user", getTaskDetails);
      return getTaskDetails;
    } else {
      const err = new Error("Error while getting data");
      throw err;
    }
  } catch (err) {
    logger.error("err", err);
    throw error;
  }
};

const todayTask = async (startDate, endDate, userid) => {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const date = new Date();
    let getTaskDetails = null;
    if (startDate && endDate) {
      getTaskDetails = await _DB.task.findAll({
        where: {
          user_id: userid,
          [Op.or]: {
            start_date: { [Op.between]: [startDate, endDate] },
            end_date: { [Op.between]: [startDate, endDate] },
          },
        },
        attributes: {
          include: ["task_name", "is_complete", "start_date", "end_date"],
        },

        include: {
          model: _DB.user,
          attributes: ["username"],
        },
        raw: true,
      });
    } else {
      getTaskDetails = await _DB.task.findAll({
        where: {
          user_id: userid,
          start_date: {
            [Op.gt]: TODAY_START,
            [Op.lt]: date,
          },
        },
        attributes: {
          include: ["task_name", "is_complete", "start_date", "end_date"],
        },

        include: {
          model: _DB.user,
          attributes: ["username"],
        },
        raw: true,
      });
    }
    if (getTaskDetails) {
      return getTaskDetails;
    } else {
      throw new Error("no tasks found");
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const createMultipleTask = async (userid, filename) => {
  try {
    const schema = {
      task_name: {
        prop: "task_name",
        type: String,
      },
      start_date: {
        prop: "start_date",
        type: Date,
      },
      end_date: {
        prop: "end_date",
        type: Date,
      },
    };
    let path = __basedir + "/assets/uploads/" + filename;
    readXlsxFile(path
      // , {
      // schema,
      // transformData(data) {
      //   return data.filter(
      //     (row) => row.filter((column) => column !== null).length > 0
      //   );
      // },
    //}
    ).then(async (rows) => {
      // console.log("data", data);
      // console.log("rows", rows);
      rows.shift();
      let tutorials = [];

      rows.forEach((row) => {
        let tutorial = {
          task_name: row[0],
          start_date: row[1],
          end_date: row[2],
          user_id: userid,
        };
        tutorials.push(tutorial);
      });
      await _DB.task.bulkCreate(tutorials);
    });
  } catch (err) {
    logger.error("err", err);
    throw err;
  }
};

module.exports = {
  task,
  complete_task,
  update_task,
  delete_task,
  getTask,
  todayTask,
  createMultipleTask,
};
