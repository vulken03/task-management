const db = require("../../models");
const user = db.user;
const Task = db.task;
const { Op } = require("sequelize");
//const excel = require('exceljs')

const task = async (userid, taskDetails) => {
  try {
    await Task.create({
      task_name: taskDetails.task_name,
      start_date: taskDetails.start_date,
      end_date: taskDetails.end_date,
      user_id: userid,
    });
    return true;
  } catch (error) {
    console.log("error", error);
  }
};

const update_task = async (userid, taskDetails, taskid) => {
  try {
    const taskData = await Task.findOne({
      where: {
        task_id: taskid,
      },
    });
    if (taskData) {
      if (taskData.user_id == userid) {
        await Task.update(taskDetails, {
          where: {
            task_id: taskid,
            user_id: userid,
          },
        });
      }
      return true;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const complete_task = async (userid, taskDetails, taskid) => {
  try {
    const taskData = await Task.findOne({
      where: {
        task_id: taskid,
      },
    });
    if (taskData) {
      if (taskData.user_id == userid) {
        await Task.update(taskDetails, {
          where: {
            task_id: taskid,
            user_id: userid,
          },
        });
        return true;
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

const delete_task = async (userid, taskid) => {
  try {
    const taskData = await Task.findOne({
      where: {
        task_id: taskid,
      },
    });

    console.log("taskdata", taskData);
    if (taskData) {
      if (taskData.user_id == userid && taskData.is_complete == true) {
        await Task.destroy({
          where: {
            task_id: taskid,
          },
        });
      } else {
        console.log("task is not yet completed");
      }
    }
  } catch (err) {
    console.log("error");
  }
};

const getTask = async (startDate, endDate, userid) => {
  try {
    const getTaskDetails = await Task.findAll({
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
        model: user,
        attributes: ["username"],
      },
    });

    if (getTaskDetails) {
      console.log("user", getTaskDetails);
      return getTaskDetails;
    } else {
      console.log("no task found");
    }
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = {
  task,
  complete_task,
  update_task,
  delete_task,
  getTask
};
