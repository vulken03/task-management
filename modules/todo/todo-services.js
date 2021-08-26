const { constants } = require("../../utils/constant");
const common = require("../../utils/common");
const user_data = require("./todo-schema");
const todo_model = require("./todo-model");
const excel = require("exceljs");
const url = require("url");
//const log_in=require('./todo-model')

const tasks = async (req, res, next) => {
  let user = req.body;
  let userId = req.user.user_id;
  try {
    const { isValid, error } = common.schemaValidator(
      user,
      user_data.newTaskSchema
    );
    if (!isValid) {
      return next(error);
    }

    const user_task = await todo_model.task(userId, user);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      user_task,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
const update_tasks = async (req, res, next) => {
  let userid = req.user.user_id;
  let taskid = req.params.id;
  let taskDetails = req.body;
  try {
    const { isValid, error } = common.schemaValidator(
      taskDetails,
      user_data.newTaskSchema
    );
    if (!isValid) {
      return next(error);
    }
    const updateTask = await todo_model.update_task(
      {userid,
      taskDetails,
      taskid}
    );

    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      updateTask,
    });
  } catch (error) {
    next(error);
    console.log("error", error);
  }
};

const complete_tasks = async (req, res, next) => {
  try {
    let userid = req.user.user_id;
    let taskid = req.params.id;
    // let taskDetails = {
    //   completed_on: new Date(),
    //   is_complete: 1,
    // };

    const completeTask = await todo_model.complete_task({
      userid,
      completed_on: new Date(),
      is_complete: 1,
      taskid,
    });
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      completeTask,
    });
  } catch (error) {
    next(error);
    console.log("error", error);
  }
};

const task_delete = async (req, res, next) => {
  try {
    let userid = req.user.user_id;
    let taskid = req.params.id;
    const DeleteTask = await todo_model.delete_task({userid, taskid});

    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      DeleteTask,
    });
  } catch (error) {
    next(error);
    console.log("error", error);
  }
};

const task_details = async (req, res, next) => {
  try {
    let userid = req.user.user_id;
    let Currenturl = url.parse(req.url, true);

    let date = Currenturl.query;
    // console.log(date)
    const { isValid, error } = common.schemaValidator(
      date,
      user_data.getTaskSchema
    );
    if (!isValid) {
      return next(error);
    }

    const{start_date,end_date}=date
    let getAllTasks = await todo_model.getTask(
      start_date,
      end_date,
      userid
    );

    if (getAllTasks) {
      let tasks = [];
      getAllTasks.forEach((element) => {
        tasks.push({
          task_name: element.task_name,
          is_complete: element.is_complete,
          start_date: element.start_date,
          end_date: element.end_date,
        });
      });
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("tasks");
      worksheet.columns = [
        { header: "task_name", key: "task_name", width: 15 },
        { header: "is_complete", key: "is_complete", width: 15 },
        { header: "start_date", key: "start_date", width: 15 },
        { header: "end_date", key: "end_date", width: 15 },
      ];

      // Add Array Rows
      worksheet.addRows(tasks);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
      );
      res.status(constants.responseCodes.success);
      await workbook.xlsx.write(res);
    } else {
      res.status(constants.responseCodes.error).json({
        message: constants.responseMessage.error,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getTodayTask = async (req, res, next) => {
  try {
    let userid = req.user.user_id;
    let Currenturl = url.parse(req.url, true);

    let date = Currenturl.query;
    // console.log(date)
    const { isValid, error } = common.schemaValidator(
      date,
      user_data.getTaskSchema
    );
    if (!isValid) {
      return next(error);
    }
    const { start_date, end_date } = date;
    let getTask = await todo_model.todayTask(start_date, end_date, userid);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      getTask,
    });
  } catch (err) {
    next(err);
  }
};

const downloadTemplate = async (req, res, next) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Template");

  worksheet.columns = [
    { header: "task_name", key: "task_name", width: 15 },
    { header: "start_date", key: "start_date", width: 15 },
    { header: "end_date", key: "end_date", width: 15 },
  ];
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "template.xlsx"
  );
  res.status(constants.responseCodes.success);
  await workbook.xlsx.write(res);
};

const createMultipleTasks = async (req, res, next) => {
  try {
    const userid = req.user.user_id;
    const filename = req.file.filename;
    let allTasks = await todo_model.createMultipleTask({ userid, filename });
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      allTasks,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  tasks,
  update_tasks,
  complete_tasks,
  task_delete,
  task_details,
  getTodayTask,
  downloadTemplate,
  createMultipleTasks,
};
