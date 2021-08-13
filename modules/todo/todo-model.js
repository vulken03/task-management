const { Op } = require("sequelize");
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
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("error");
    throw err;
  }
};

const getTask = async (startDate, endDate, userid) => {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
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
            [Op.lt]: NOW,
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
      console.log("user", getTaskDetails);
      return getTaskDetails;
    } else {
      const err = new Error("Error while getting data");
      throw err;
    }
  } catch (err) {
    console.log("err", err);
    throw error;
  }
};

const getExcelFile=()=>{
  
}

module.exports = {
  task,
  complete_task,
  update_task,
  delete_task,
  getTask,
};
