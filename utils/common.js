const multer = require("multer");
const { constants } = require("./constant");
let Validator = require("jsonschema").Validator;
let v = new Validator();
const schemaValidator = (schema, schemaStructure) => {
  let isValid = false;
  let error = null;

  const validationResult = v.validate(schema, schemaStructure);

  if (validationResult.valid) {
    isValid = true;
  } else {
    error = new Error("problem while validating data");
    throw error;
  }
  return {
    isValid,
    error,
  };
};

const allowAdminOnly = (req, res, next) => {
  if (req.isAdmin == 1) {
    next();
  } else {
    return next(new error(constants.errors.routeAccessDenied));
  }
};

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    const filename = file.originalname.split(".");
    const uniqueFileName = req.user.uuid + "." + filename[1];
    console.log(file.originalname);
    cb(null, uniqueFileName);
  },
});
const uploadFile = multer({ storage: storage, fileFilter: excelFilter });

module.exports = {
  schemaValidator,
  allowAdminOnly,
  uploadFile,
};
