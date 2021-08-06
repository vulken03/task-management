// TODO - Usage of dotenv - require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser') // TODO - if using latest version of express then this is not reuired!
const api=require('./routes')
const app=express()
const db=require('./models') // TODO: store this in global object global._DB & use this instead of using require!
const{errorHandler}=require('./utils/error')
const {authenticateRequest}=require('./middleware/sessionMiddleware')
app.use(bodyParser.json()) // TODO: remove this
app.use(bodyParser.urlencoded({extended:true})) // TODO: remove this
app.use('/todo',api) // TODO: remove this..routes specific code should go under routes/index.js
app.use(authenticateRequest) // TODO: remove this & create a index.js file and keep middleware specific code there!
app.use(errorHandler)
const PORT=8085 // TODO: Use convict to manage environment specific(dev/qa/prod) configurations in project


db.sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port no ${PORT}`)
  })
}).catch((err) => {
  console.log('Error while syncing database...',err)
})


