const { constants } = require('./constant')

exports.errorHandler = (err, req, res, next) => {
  res.status(constants.responseCodes.error).json({
    message: constants.responseMessage.error,
    error: err.message
  })
}