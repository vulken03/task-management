
const express=require('express')
const router=express.Router()
const todoService=require('./todo-services')
const authentication=require('../../middleware/sessionMiddleware')


router.post('/task',authentication.authenticateRequest,todoService.tasks)
router.put('/completetask/:id',authentication.authenticateRequest,todoService.complete_tasks)
router.put('/updatetask/:id',authentication.authenticateRequest,todoService.update_tasks)
router.delete('/deletetask/:id',authentication.authenticateRequest,todoService.task_delete)
router.get('/getTask',authentication.authenticateRequest,todoService.task_details)
module.exports=router

