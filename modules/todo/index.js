// const express=require('express') // TODO - not required!
// const router=express.Router() // TODO - not required!
const todoService = require("./todo-services");
const {uploadFile}= require("../../utils/common");
// const authentication=require('../../middleware/sessionMiddleware') // TODO - not required!

// router.post('/task',todoService.tasks)
// router.put('/completetask/:id',authentication.authenticateRequest,todoService.complete_tasks)
// router.put('/updatetask/:id',authentication.authenticateRequest,todoService.update_tasks)
// router.delete('/deletetask/:id',authentication.authenticateRequest,todoService.task_delete)
// router.get('/getTask',authentication.authenticateRequest,todoService.task_details)
module.exports = (app) => {
  app.post("/task", todoService.tasks);
  app.put("/completetask/:id", todoService.complete_tasks);
  app.put("/updatetask/:id", todoService.update_tasks);
  app.delete("/deletetask/:id", todoService.task_delete);
  app.get("/getTask", todoService.task_details);
  app.get("/getTodayTask", todoService.getTodayTask);
  app.get("/downloadTemplate", todoService.downloadTemplate);
  app.post(
    "/createMultipleTasks",
    uploadFile.single("excelfile"),
    todoService.createMultipleTasks
  );
};

// TODO - code present here is not as per the project that was given to you for reference!
