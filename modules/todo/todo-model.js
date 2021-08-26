const { Op } = require("sequelize");
const readXlsxFile = require("read-excel-file/node");
const { logger } = require("../../utils/logger");
//const excel = require('exceljs')

/**
 * create task
 * @async
 * @method
 * @param {number} userid
 * @typedef {Object} taskDetails
 * @property {string} task_name taskname
 * @property {string} start_date from when task is start
 * @property {string} end_date endDate of task
 * @returns {boolean} if task created then returns true
 */

/**
 * @type {taskDetails}
 */

const task = async (userid, { start_date, end_date, task_name }) => {
  // try {
  //const { start_date, end_date, task_name } = taskDetails;
  const todayDate = new Date();
  const date1 = new Date(start_date);
  const date2 = new Date(end_date);
  if (date1 < date2 && date1 >= todayDate) {
    await _DB.task.create({
      task_name,
      start_date,
      end_date,
      user_id: userid,
    });
    return true;
  } else {
    const error = new Error(
      "enddate must be later timestamp than startdate or startdate greater than current date"
    );
    throw error;
  }
  // } catch (error) {
  //   logger.error(`error ${error}`);
  //   throw error;
  // }
};

/**
 * update task
 * @async
 * @method
 * @param {number} userid
 * @param {number} taskid
 * @typedef {Object} taskDetails
 * @property {string} task_name taskname
 * @property {string} start_date from when task is start
 * @property {string} end_date endDate of task
 * @returns {boolean} if task created then returns true
 */

/**
 * @type {taskDetails}
 */

const update_task = async ({ userid, taskDetails, taskid }) => {
  // try {
  const todayDate = new Date();
  const { start_date, end_date } = taskDetails;
  const date1 = new Date(start_date);
  const date2 = new Date(end_date);
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
  // } catch (error) {
  //   logger.error(`error ${error}`);
  //   throw error;
  // }
};

/**
 * complete task
 * @async
 * @method
 * @param {number} userid
 * @param {number} taskid
 * @typedef {Object} taskDetails
 * @property {boolean} is_completed  indicate task is completed or not
 * @property {string} completed_on task completion date
 * @returns {boolean} if task created then returns true
 */

/**
 * @type {taskDetails}
 */

const complete_task = async ({ taskid, userid, ...taskDetails }) => {
  //console.log('taskd',taskDetails)
  //try {
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
  //} catch (error) {
  //logger.error(`error ${error}`);
  //throw error;
  //}
};

/**
 * delete task
 * @async
 * @method
 * @param {number} userid
 * @param {number} taskid
 * @returns {void}
 */
const delete_task = async ({ userid, taskid }) => {
  // try {
  const taskData = await _DB.task.findOne({
    where: {
      task_id: taskid,
    },
  });

  console.log(`taskdata ${taskData}`);
  if (taskData) {
    if (taskData.user_id == userid && taskData.is_complete == false) {
      await taskData.destroy();
    } else {
      const err = new Error("task is completed");
      throw err;
    }
  }
  // } catch (err) {
  //   logger.error(`error ${err}`);
  //   throw err;
  // }
};
/**
 * task details in excel file
 * @async
 * @method
 * @param {string} startDate when task started
 * @param {string} endDate  when task ended
 * @param {number} userid
 * @returns {taskDetails}
 */

/**
 * @typedef {Object} taskDetails
 * @property {string} task_name taskname
 * @property {boolean} is_complete indicate task is completed or not
 * @property {string} start_date when task started
 * @property {string} end_date when task ended
 * @property {string} username name of the user
 */
const getTask = async (startDate, endDate, userid ) => {
  // try {
  let getTaskDetails = await _DB.task.findAll({
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
    console.log(`user ${getTaskDetails}`);
    return getTaskDetails;
  } else {
    const err = new Error("Error while getting data");
    throw err;
  }
  // } catch (err) {
  //   logger.error(`err ${err}`);
  //   throw error;
  // }
};

/**
 * task details
 * @async
 * @method
 * @param {string} startDate when task started
 * @param {string} endDate  when task ended
 * @param {number} userid
 * @returns {taskDetails}
 */

/**
 * @typedef {Object} taskDetails
 * @property {string} task_name taskname
 * @property {boolean} is_complete indicate task is completed or not
 * @property {string} start_date when task started
 * @property {string} end_date when task ended
 * @property {string} username name of the user
 */

const todayTask = async (startDate, endDate, userid) => {
  // try {
  let where_condition = null;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const date = new Date();
  if (startDate && endDate) {
    where_condition = {
      user_id: userid,
      [Op.or]: {
        start_date: { [Op.between]: [startDate, endDate] },
        end_date: { [Op.between]: [startDate, endDate] },
      },
    };
  } else {
    where_condition = {
      user_id: userid,
      start_date: {
        [Op.gt]: TODAY_START,
        [Op.lt]: date,
      },
    };
  }

  const getTaskDetails = await _DB.task.findAll({
    where: where_condition,
    attributes: {
      include: ["task_name", "is_complete", "start_date", "end_date"],
    },

    include: {
      model: _DB.user,
      attributes: ["username"],
    },
    raw: true,
  });

  if (getTaskDetails) {
    return getTaskDetails;
  } else {
    throw new Error("no tasks found");
  }
  // } catch (err) {
  //   logger.error(err);
  //   throw err;
  // }
};

/**
 * create multiple task
 * @async
 * @method
 * @param {number} userid
 * @param {string} filename name of the file
 * @returns {void}
 */

const createMultipleTask = async ({ userid, filename }) => {
  // try {
  let path = `${__basedir}/assets/uploads/${filename}`;

  let rows = await readXlsxFile(path);
  console.log(rows);
  if (rows) {
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
    const multiplecreate = await _DB.task.bulkCreate(tutorials);
    if (multiplecreate) {
      return multiplecreate;
    } else {
      throw new Error("tasks are not created");
    }
  }
  // } catch (err) {
  //   logger.error(`err ${err}`);
  //   throw err;
  // }
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
