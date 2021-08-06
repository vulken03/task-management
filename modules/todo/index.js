
const express=require('express') // TODO - not required!
const router=express.Router() // TODO - not required!
const todoService=require('./todo-services')
const authentication=require('../../middleware/sessionMiddleware') // TODO - not required!


router.post('/task',authentication.authenticateRequest,todoService.tasks)
router.put('/completetask/:id',authentication.authenticateRequest,todoService.complete_tasks)
router.put('/updatetask/:id',authentication.authenticateRequest,todoService.update_tasks)
router.delete('/deletetask/:id',authentication.authenticateRequest,todoService.task_delete)
router.get('/getTask',authentication.authenticateRequest,todoService.task_details)
module.exports=router

// TODO - code present here is not as per the project that was given to you for reference!
