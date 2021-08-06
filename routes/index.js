const express=require('express')
const router=express.Router()
//const Routes=require('./route')
const userRoutes=require('../modules/user')
const todoRoutes=require('../modules/todo')
const adminRoutes=require('../modules/admin')
router.use(userRoutes)
router.use(todoRoutes)
router.use(adminRoutes)
module.exports=router

// TODO: code present here is not as per the project that was given to you for reference!
