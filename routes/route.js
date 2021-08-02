
const express=require('express')
const router=express.Router()
const userService=require('../modules/todo/todo-services')
const authentication=require('../middleware/sessionMiddleware')

router.post('/user_registration',userService.signup)
router.post('/user_login',userService.login)
router.post('/admin_login',userService.admin_login)
router.post('/task',authentication.authenticateRequest,userService.tasks)
router.put('/completetask/:id',authentication.authenticateRequest,userService.complete_tasks)
router.delete('/deletetask/:id',authentication.authenticateRequest,userService.task_delete)
router.get('/getTask',authentication.authenticateRequest,userService.task_details)
//router.get('/getAllTasks',authentication.authenticateRequest,userService.allTaskDetails)
module.exports=router

