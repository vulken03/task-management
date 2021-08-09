// TODO - Usage of dotenv - require('dotenv').config()
const express=require('express')
const api=require('./routes/index')
const db=require('./database') // TODO: store this in global object global._DB & use this instead of using require!
const{errorHandler}=require('./utils/error')
const middleware=require('./middleware')
//const config=
// const {authenticateRequest}=require('./middleware/sessionMiddleware')

const app=express()

app.use(express.json())

middleware(app)

api(app)

app.use(errorHandler)

const PORT=8085


db.sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port no ${PORT}`)
  })
}).catch((err) => {
  console.log('Error while syncing database...',err)
})


