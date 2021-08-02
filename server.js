const express=require('express')
const bodyParser=require('body-parser')
const api=require('./routes')
const app=express()
const db=require('./models')
const {authenticateRequest}=require('./middleware/sessionMiddleware')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/todo',api)
app.use(authenticateRequest)
const PORT=8085


db.sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port no ${PORT}`)
  })
}).catch((err) => {
  console.log('Error while syncing database...',err)
})
