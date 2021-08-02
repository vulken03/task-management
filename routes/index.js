const express=require('express')
const router=express.Router()
const Routes=require('./route')

router.use(Routes)

module.exports=router
