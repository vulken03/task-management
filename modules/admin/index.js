// const express=require('express')
// const router=express.Router()
const adminService = require("./admin-services");
// const authentication=require('../../middleware/sessionMiddleware')
const common = require("../../utils/common");

// router.post('/admin_login',adminService.admin_login)
// router.get('/getAllTasks',authentication.authenticateRequest,common.allowAdminOnly,adminService.allTaskDetails)
// router.post('/admin_logout',authentication.authenticateRequest,common.allowAdminOnly,adminService.logout)
module.exports = (app) => {
  app.post("/admin_login", adminService.admin_login);
  app.get("/getAllTasks", common.allowAdminOnly, adminService.allTaskDetails);
  app.post("/admin_logout", common.allowAdminOnly, adminService.logout);
};
