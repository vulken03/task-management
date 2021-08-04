const db = require('../../models')
const user = db.user
const userLogin = db.Session
const Task = db.task
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { Op } = require('sequelize')
//const excel = require('exceljs')
const sequelize = require('sequelize')
const admin = db.admin_module


const createSessionAdmin = (admin) => {

    return new Promise((resolve, reject) => {

        const adminId = admin.admin_id

        userLogin.create({
            user_id: adminId,
            login_time: +moment().unix(),
            time_to_leave: +moment().add(1, 'days').unix(),
            is_loggedout: 0,
            is_admin: 1
        })
            .then((session) => {

                resolve(session)
            }).catch((err) => {
                reject(err)
            })
    })

}

const generateJwtToken = (user, uuid, isAdmin) => {
    return new Promise((resolve, reject) => {
        const userId = isAdmin == 1 ? user.admin_id : user.user_id
        const username = user.username

        const token = jwt.sign({
            uuid,
            userId,
            username,
            isAdmin

        }, 'onlinewebtutorkey', {
            expiresIn: '24h',
            algorithm: 'HS384'
        })

        resolve(token)
    })
}



const Adminlogin = (adminData) => {

    return new Promise((resolve, reject) => {
        let isSuccessful = false
        let token = ''

        admin.findOne({
            where: {
                username: adminData.username
            }
        }).then((admin) => {
            if (admin) {
                if (adminData.password === admin.password) {

                    isSuccessful = true
                    createSessionAdmin(admin).then((session) => {
                        generateJwtToken(admin, session.uuid, session.is_admin).then((accessToken) => {
                            token = accessToken

                            resolve({
                                isSuccessful,
                                token
                            })
                        }).catch(err => {
                            console.log('err', err)
                            reject(err)
                        })
                    }).catch(err => {
                        console.log('err', err)
                        reject(err)
                    })
                }
                else {
                    resolve({
                        isSuccessful,
                        token
                    })
                }
            } else {
                resolve({
                    isSuccessful,
                    token
                })
            }
        })
    })
}


const getAllTasks = async (startDate, endDate) => {

    try {
        const getAllTaskDetails = await Task.findAll({

            
            where: {
                [Op.or]: {
                    start_date: { [Op.between]: [startDate, endDate] },
                    end_date: { [Op.between]: [startDate, endDate] }
                }

            }, 
              attributes: [[sequelize.fn('COUNT','*'), 'n_tasks'],'user.username'],

            include: {
                model: user,
                attributes: []
            },
            group:'task.user_id',
            raw:true
        })

        if (getAllTaskDetails) {
            console.log("getall",getAllTaskDetails)
            return getAllTaskDetails
           
        }
        else {
            console.log('error')
        }
    } catch (error) {
        console.log('error', error)
    }
}
const logout=async(uuid)=>{

    try{
    const loginData=await userLogin.findOne({
        where:{
            uuid
        }
    })

    if(loginData){
        await userLogin.update({is_loggedout:1},{
        
            where:{
                uuid
            }
         
        })
        return true
    }
   }catch(error){
       console.log('error',error)
   }
}

module.exports = {
getAllTasks,
Adminlogin,
logout
}