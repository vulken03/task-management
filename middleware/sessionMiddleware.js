const moment = require('moment')
const jwt = require('jsonwebtoken')
const { constants } = require('../utils/constant')
//const moment=require('moment')
const db = require('../models')
const Session = db.Session
const User = db.user
const admin=db.admin_module

let verifyJWT = async (req) => {

    try {
       
        let token=req.headers['authorization']

        let userData = jwt.verify(token,
            'onlinewebtutorkey',{
                algorithms:['HS384']
            }
        )
        //console.log('userData',userData)
        return userData

    } catch (err) {
        console.log('err', err)
        throw err
    }

}

let isValidSession = async (uuid) => {
    try {

        let isValid = false
        let userSession = await Session.findOne({
            where: {
                uuid
            }
        })

        if (userSession) {

            const timeToLeave = moment.unix(userSession.time_to_leave)
            const isExpired = moment().isAfter(timeToLeave)

            if (!isExpired && !userSession.is_loggedout) {
                isValid = true
            }

            if (isExpired) {
                await Session.update({ is_loggedout: 1 }, {
                    fields: ['is_loggedout']
                })
            }
        }

        return isValid

    } catch (err) {

        console.log(`error while validating user with ${uuid}`)

        throw err

    }
}

let isValidUser = async (user) => {
    try {
        let isUserValid = false
        let fetchedUser = null
        if(user.isAdmin==1){
            fetchedUser=await admin.findOne({
                where:{
                admin_id:user.userId
                }
            })
        }else{
        fetchedUser =await User.findOne({

           
            where: {
                user_id: user.userId
            }

        })
    }
        if (fetchedUser) {

            isUserValid = true
        }
        return {
            isUserValid,
            user: fetchedUser
        }

    } catch (error) {

        console.log(`error occured while fetching with userid ${user.id}`)
        throw error
    }
}

let authenticateRequest = async (req, res, next) => {
    if (constants.insecureRoutes.includes(req.url)) {
        return next()
    }

    try {
        if (req.headers.authorization) {
            let userData = await verifyJWT(req)

            let isSessionValid = await isValidSession(userData.uuid)
            if (!isSessionValid) {
                const error = new error(constants.errors.isExpired)
                return next(error)
            }
            let { isUserValid, user } =await isValidUser(userData)
            if (isUserValid) {
                req.user = user
                req.user.uuid = userData.uuid
                req.isAdmin=userData.isAdmin
                return next()
            }else {
                const err = new Error('Invalid user id')
                next(err)
                throw err
              }


        }else{
            const error=new Error('Invalid authorization')
            
        }
    } catch (error) {
        console.log('error', error)
        throw error
    }
}

module.exports={
    authenticateRequest
}