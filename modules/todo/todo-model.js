const db = require('../../models')
const user = db.User_Registration
const userLogin = db.Session
const createTask = db.task
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { Op } = require('sequelize')
//const excel = require('exceljs')
const sequelize = require('sequelize')
const admin = db.admin_module
const user_register = async (userData) => {

    //console.log('userData', userData)
    try {
        const users = await user.findOne({
            where: {
                username: userData.username
            }
        })
        if (!users) {

            await user.create(userData)

            return true
        }
        else {
            throw new Error("user with this username is already created")
        }
    } catch (err) {

        console.log("err", err);
    }
}


const createSession = (user) => {

    return new Promise((resolve, reject) => {

        const userId = user.userId

        userLogin.create({
            userId,
            login_time: +moment().unix(),
            time_to_leave: +moment().add(1, 'days').unix(),
            is_loggedout: 0,
            is_admin: 0
        })
            .then((session) => {

                resolve(session)
            }).catch((err) => {
                reject(err)
            })
    })
}

const createSessionAdmin = (admin) => {

    return new Promise((resolve, reject) => {

        const adminId = admin.adminId

        userLogin.create({
            userId: adminId,
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
        const userId = isAdmin == 1 ? user.adminId : user.userId
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

const login = (userData) => {

    return new Promise((resolve, reject) => {
        let isSuccessful = false
        let token = ''

        user.findOne({
            where: {
                username: userData.username
            }
        }).then((users) => {
            if (users) {
                if (userData.password === users.password) {

                    isSuccessful = true
                    createSession(users).then((session) => {
                        generateJwtToken(users, session.uuid, session.is_admin).then((accessToken) => {
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

const task = async (userid, taskDetails) => {

    try {


        await createTask.create({

            task_name: taskDetails.task_name,
            start_date: taskDetails.start_date,
            userId: userid
        })
        return true

    } catch (error) {
        console.log('error', error)
    }

}

const complete_task = async (userid, taskDetails, taskid) => {
    try {
        const taskData = await createTask.findOne({
            where: {
                taskId: taskid
            }
        })
        if (taskData) {

            if (taskData.userId == userid) {
                await createTask.update(taskDetails, {
                    where: {
                        taskId: taskid,
                        userId: userid
                    }
                })
                return true
            }

        }
    } catch (error) {
        console.log('error', error)
    }
}

const delete_task = async (userid, taskid) => {
    try {

        const taskData = await createTask.findOne({
            where: {
                taskId: taskid
            }
        })

        console.log('taskdata', taskData)
        if (taskData) {
            if (taskData.userId == userid && taskData.complete_status == true) {

                await createTask.destroy({

                    where: {
                        taskId: taskid
                    }

                })
            } else {
                console.log('task is not yet completed')
            }
        }

    } catch (err) {

        console.log('error')
    }
}

const getTask = async (startDate, endDate, userid) => {
    try {
        const getTaskDetails = await createTask.findAll({
            where: {
                userId: userid,
                [Op.or]: {
                    start_date: { [Op.between]: [startDate, endDate] },
                    end_date: { [Op.between]: [startDate, endDate] }
                }
            }
            , attributes: {
                include: ['task_name', 'complete_status', 'start_date', 'end_date']
            },

            include: {
                model: user,
                attributes: ['username']
            }
        })

        if (getTaskDetails) {
            console.log('user', getTaskDetails)
            return getTaskDetails
        }
        else {
            console.log('no task found')
        }

    } catch (err) {
        console.log('err', err)
    }
}

const getAllTasks = async (startDate, endDate) => {

    try {
        const getAllTaskDetails = await createTask.findAll({

            
            where: {
                [Op.or]: {
                    start_date: { [Op.between]: [startDate, endDate] },
                    end_date: { [Op.between]: [startDate, endDate] }
                }

            }, 
              attributes: ['task_name', 'complete_status', 'start_date', 'end_date'
              //[sequelize.fn('COUNT', sequelize.col('*')), 'n_tasks']
            ],

            include: {
                model: user,
                attributes: ['username']
            },
            //group: [sequelize.col(createTask.userId)],
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
module.exports = {
    user_register,
    createSession,
    login,
    task,
    complete_task,
    delete_task,
    getTask,
    getAllTasks,
    Adminlogin
}