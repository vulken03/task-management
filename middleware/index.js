const{authenticateRequest}=require('./sessionMiddleware')
module.exports=(app)=>{
    app.use(authenticateRequest)
}