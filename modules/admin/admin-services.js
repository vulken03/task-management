const { constants } = require("../../utils/constant");
const common = require("../../utils/common");
const user_data = require("./admin-schema");
const admin_model = require("./admin-model");
const url = require("url");

const admin_login = async (req, res, next) => {
  let admin = req.body;
  //let userid=req.user.id
  //task(userid,user)
  try {
    const { isValid, error } = common.schemaValidator(
      admin,
      user_data.newUserSchema
    );
    if (!isValid) {
      next(error);
    }
    await admin_model
      .Adminlogin(admin)
      .then(({ isSuccessful, token }) => {
        if (isSuccessful) {
          res.status(constants.responseCodes.success).json({
            message: constants.responseMessage.success,
            token,
          });
        } else {
          const error = new Error("Error while admin login");
          next(error);
        }
      })
      .catch((error) => {
        console.log("error", error);
        next(error);
      });
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

const allTaskDetails = async (req, res, next) => {
  try {
    let Currenturl = url.parse(req.url, true);

    let date = Currenturl.query;
    //console.log(date)
    const { isValid, error } = common.schemaValidator(
      date,
      user_data.getTaskSchema
    );
    if (!isValid) {
      return next(error);
    }

    const getAllTasks = await admin_model.getAllTasks(
      date.start_date,
      date.end_date
    );
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      getAllTasks,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const isLogout = await admin_model.logout(uuid);

    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      isLogout,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  allTaskDetails,
  admin_login,
  logout,
};
