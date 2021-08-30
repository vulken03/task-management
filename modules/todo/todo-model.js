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
const getTask = async (startDate, endDate, userid) => {
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
  let where_condition = { user_id: userid };
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const date = new Date();
  if (startDate && endDate) {
    where_condition[Op.or] = {
      //user_id: userid
      start_date: { [Op.between]: [startDate, endDate] },
      end_date: { [Op.between]: [startDate, endDate] },
    };
  } else if (startDate) {
    where_condition.start_date = {
      [Op.gte]: startDate,
    };
  } else if (endDate) {
    where_condition.end_date = {
      [Op.lte]: endDate,
    };
  } else {
    where_condition.start_date = {
      //user_id: userid,
      [Op.gt]: TODAY_START,
      [Op.lt]: date,
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

// const createMultipleTask = async ({ userid, filename }) => {
//   // try {
//   let path = `${__basedir}/assets/uploads/${filename}`;

//   let rows = await readXlsxFile(path);
//   //console.log(rows);
//   const multipletasks = async (tutorials, tasks = []) => {
//     if (rows && rows.length > 0) {
//       rows.shift();

//       rows.forEach((row) => {
//         let tutorial = {
//           task_name: row[0],
//           start_date: row[1],
//           end_date: row[2],
//           user_id: userid,
//         };
//         tutorials.push(tutorial);
//       });
//       const my_object = tutorials.pop();
//       const add_object = tasks.push(my_object);
//       const task_create = await _DB.task.create(add_object);
//       const createTasks = await multipletasks(tutorials, tasks);
//       if (createTasks) {
//         return true;
//       } else {
//         throw new Error("Error while creating tasks");
//       }
//     } else {
//       return false;
//     }
//   };
//   // if (rows && rows.length > 0) {
//   //   rows.shift();
//   //   //let tutorials = [];

//   //   rows.forEach(async(row) => {
//   //     let tutorial = {
//   //       task_name: row[0],
//   //       start_date: row[1],
//   //       end_date: row[2],
//   //       user_id: userid,
//   //     };
//   //     //tutorials.push(tutorial);
//   //     const multiplecreate = await _DB.task.create(tutorial);
//   //     if (multiplecreate) {
//   //       return multiplecreate;
//   //     } else {
//   //       throw new Error("tasks are not created");
//   //     }
//   //   });
//   // } else {
//   //   return false;
//   // }
// };

const createMultiTask = async ({ userid, filename }) => {
  const path = `${__basedir}/assets/uploads/${filename}`;
  const my_array = await readXlsxFile(path);
  const result = await recurse({ my_array, userid });
  if (result) {
    return result;
  } else {
    throw new Error("error while creating tasks");
  }
};
const recurse = async ({
  my_array,
  processed_entries = [],
  failed_entries = [],
  userid,
}) => {
  try {
    if (my_array.length === 0) {
      return { processed_entries, failed_entries };
    }
    const my_object = my_array.pop();
    let tutorial = {
      task_name: my_object[0],
      start_date: my_object[1],
      end_date: my_object[2],
      user_id: userid,
    };
    const data = await _DB.task.create(tutorial);
    if (data) {
      processed_entries.push(data.task_name);
    }
    return recurse({ my_array, processed_entries, failed_entries, userid });
  } catch (error) {
    //reject(error);
    failed_entries.push(data.task_name);
    return recurse({ my_array, processed_entries, failed_entries, userid });
  }
};
module.exports = {
  task,
  complete_task,
  update_task,
  delete_task,
  getTask,
  todayTask,
  createMultiTask,
};
