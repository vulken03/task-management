// const express=require('express')
// const router=express.Router()
const userService=require('./user-services')
// const authentication=require('../../middleware/sessionMiddleware')
//const common=require('../utils/common')

// router.post('/user_registration',userService.signup)
// router.post('/user_login',userService.login)
// router.post('/user_logout',authentication.authenticateRequest,userService.logout)
module.exports=(app)=>{
    //console.log('abc')
    app.post('/user_registration',userService.signup)
    app.post('/user_login',userService.login)
    app.post('/user_logout',userService.logout)
}