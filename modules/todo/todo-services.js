const { constants } = require('../../utils/constant')
const common = require('../../utils/common')
const user_data = require('./todo-schema')
const todo_model = require('./todo-model')
const excel=require('exceljs')
const url=require('url')
//const log_in=require('./todo-model')

const tasks = async (req, res, next) => {

    let user = req.body
    let userId = req.user.user_id
    try {
        const { isValid, error } = common.schemaValidator(user, user_data.newTaskSchema)
        if (!isValid) {
            return next(error)
        }

        const user_task = await todo_model.task(userId, user)

        if (user_task) {
            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                user_task
            })
        }
        else {
            res.status(constants.responseCodes.error).json({
                message: constants.responseMessage.error
            })
        }
    } catch (error) {
        console.log('error', error)
    }

}
const update_tasks = async (req, res, next) => {

    try {
        let userid = req.user.user_id
        let taskid = req.params.id
        let taskDetails =req.body

        const updateTask = await todo_model.update_task(userid, taskDetails, taskid)

        if (updateTask) {
            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                updateTask
            })
        }
        else {
            res.status(constants.responseCodes.error).json({
                message: constants.responseMessage.error
            })
        }
    } catch (error) {
        next(error)
        console.log('error', error)
    }

}

const complete_tasks = async (req, res, next) => {

    try {
        let userid = req.user.user_id
        let taskid = req.params.id
        let taskDetails = {
            completed_on:new Date(),
            is_complete: 1
        }

        const completeTask = await todo_model.complete_task(userid, taskDetails, taskid)

        if (completeTask) {
            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                completeTask
            })
        }
        else {
            res.status(constants.responseCodes.error).json({
                message: constants.responseMessage.error
            })
        }
    } catch (error) {
        next(error)
        console.log('error', error)
    }

}

const task_delete=async(req,res,next)=>{

    try{
        let userid=req.user.user_id
        let taskid=req.params.id
        const DeleteTask=await todo_model.delete_task(userid,taskid)

     
            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                DeleteTask
            })
        


    }catch(error){
        next(error)
        console.log('error',error)
    }
}

 const task_details=async(req,res,next)=>{
     try{

         let userid=req.user.user_id
         let Currenturl=url.parse(req.url,true)
         
         let date=Currenturl.query
        // console.log(date)
         const { isValid, error } = common.schemaValidator(date, user_data.getTaskSchema)
         if (!isValid) {
             return next(error)
         }

         let getAllTasks=await todo_model.getTask(date.start_date,date.end_date,userid)

         if(getAllTasks){
        let tasks=[]
        getAllTasks.forEach(element => {
            tasks.push({
                task_name:element.task_name,
                is_complete:element.is_complete,
                start_date:element.start_date,
                end_date:element.end_date
            })
        })
        let workbook=new excel.Workbook()
        let worksheet=workbook.addWorksheet('tasks')
        worksheet.columns = [
            { header: "task_name", key: "task_name", width:15 },
            { header: "is_complete", key: "is_complete", width: 15 },
            { header: "start_date", key: "start_date", width: 15 },
            { header: "end_date", key: "end_date", width: 15 }
          ];
      
          // Add Array Rows
          worksheet.addRows(tasks)
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "tutorials.xlsx"
          )
          res.status(constants.responseCodes.success)
          await workbook.xlsx.write(res)
      
    }
    else{
     
        res.status(constants.responseCodes.error).json({
            message: constants.responseMessage.error
        })
    }

     }catch(err){
         next(err)
     }
 }
 
module.exports = {
    tasks,
    update_tasks,
    complete_tasks,
    task_delete,
    task_details
}

