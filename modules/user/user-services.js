const { constants } = require('../../utils/constant')
const common = require('../../utils/common')
const user_data = require('./user-schema')
const user_model = require('./user-model')
//const log_in=require('./todo-model')

const signup = async (req, res, next) => {
    let user = req.body
    //console.log('data',user)

    try {
        const { isValid, error } = common.schemaValidator(user, user_data.newUserSchema)

        if (!isValid) {
            return next(error)
        }

        const user_value = await user_model.user_register(user)
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
        await user_model.login(user).then(({ isSuccessful, token }) => {

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

const logout=async(req,res,next)=>{
    const uuid=req.user.uuid
    const isLogout=await user_model.logout(uuid)
    if(isLogout){
        res.status(constants.responseCodes.success).json({
            message: constants.responseMessage.success,
            isLogout
        })
    }else{
        res.status(constants.responseCodes.error).json({
            message: constants.responseMessage.error
        })
    }
}

module.exports = {
    signup,
    login,
    logout
}

