const { constants } = require('../../utils/constant')
const common = require('../../utils/common')
const user_data = require('./todo-schema')
const sign_up = require('./todo-model')
const task = require('../../models/task')
const moment=require('moment')
const excel=require('exceljs')
const url=require('url')
//const log_in=require('./todo-model')

const signup = async (req, res, next) => {
    let user = req.body
    //console.log('data',user)

    try {
        const { isValid, error } = common.schemaValidator(user, user_data.newUserSchema)

        if (!isValid) {
            return next(error)
        }

        const user_value = await sign_up.user_register(user)
        if (user_value) {
            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                user_value
            })
        }

        else {
            res.status(constants.responseCodes.error).json({
                message: constants.responseMessage.error
            })
        }


    } catch (err) {

        next(err)
    }

}


const login = async (req, res, next) => {
    let user = req.body
    //let userid=req.user.id
    //task(userid,user)
    try {
        const { isValid, error } = common.schemaValidator(user, user_data.newUserSchema)
        if (!isValid) {
            return next(error)
        }
        await sign_up.login(user).then(({ isSuccessful, token }) => {

            if (isSuccessful) {
                res.status(constants.responseCodes.success).json({
                    message: constants.responseMessage.success,
                    token
                })
            }
            else{
                res.status(constants.responseCodes.error).json({
                    message: constants.responseMessage.error
                })
            }
        }).catch((error) => {
            console.log('error', error)
        })

    } catch (error) {
        console.log('err', error)
        res.status(constants.responseCodes.success).json({
            message: error
        })
    }

}

const admin_login = async (req, res, next) => {
    let admin = req.body
    //let userid=req.user.id
    //task(userid,user)
    try {
        const { isValid, error } = common.schemaValidator(admin, user_data.newUserSchema)
        if (!isValid) {
            return next(error)
        }
        await sign_up.Adminlogin(admin).then(({ isSuccessful, token }) => {

            if (isSuccessful) {
                res.status(constants.responseCodes.success).json({
                    message: constants.responseMessage.success,
                    token
                })
            }
            else{
                res.status(constants.responseCodes.error).json({
                    message: constants.responseMessage.error
                })
            }
        }).catch((error) => {
            console.log('error', error)
        })

    } catch (error) {
        console.log('err', error)
        res.status(constants.responseCodes.success).json({
            message: error
        })
    }

}

const tasks = async (req, res, next) => {

    let user = req.body
    let userId = req.user.userId
    try {
        const { isValid, error } = common.schemaValidator(user, user_data.newTaskSchema)
        if (!isValid) {
            return next(error)
        }

        const user_task = await sign_up.task(userId, user)

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

const complete_tasks = async (req, res, next) => {

    try {
        let userid = req.user.userId
        let taskid = req.params.id
        let taskDetails = {
            end_date:new Date(),
            complete_status: 1
        }

        const completeTask = await sign_up.complete_task(userid, taskDetails, taskid)

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
        let userid=req.user.userId
        let taskid=req.params.id
        const DeleteTask=await sign_up.delete_task(userid,taskid)

     
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

         let userid=req.user.userId
         let Currenturl=url.parse(req.url,true)
         
         let date=Currenturl.query
        // console.log(date)
         const { isValid, error } = common.schemaValidator(date, user_data.getTaskSchema)
         if (!isValid) {
             return next(error)
         }

         let getAllTasks=await sign_up.getTask(date.start_date,date.end_date,userid)

         if(getAllTasks){
        let tasks=[]
        getAllTasks.forEach(element => {
            tasks.push({
                task_name:element.task_name,
                complete_status:element.complete_status,
                start_date:element.start_date,
                end_date:element.end_date
            })
        })
        let workbook=new excel.Workbook()
        let worksheet=workbook.addWorksheet('tasks')
        worksheet.columns = [
            { header: "task_name", key: "task_name", width:15 },
            { header: "complete_status", key: "complete_status", width: 15 },
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
 const allTaskDetails=async(req,res,next)=>{
    try{
        let Currenturl=url.parse(req.url,true)
        
        let date=Currenturl.query
        //console.log(date)
        const { isValid, error } = common.schemaValidator(date, user_data.getTaskSchema)
        if (!isValid) {
            return next(error)
 
        }

        const getAllTasks=await sign_up.getAllTasks(date.start_date,date.end_date)

        if(getAllTasks){

            res.status(constants.responseCodes.success).json({
                message: constants.responseMessage.success,
                getAllTasks
            })
        }
        else{
           
            res.status(constants.responseCodes.error).json({
            message: constants.responseMessage.error
        })
        }
       
 }catch(error){
     console.log('error',error)
 }
}
module.exports = {
    signup,
    login,
    tasks,
    complete_tasks,
    task_delete,
    task_details,
    allTaskDetails,
    admin_login
}

