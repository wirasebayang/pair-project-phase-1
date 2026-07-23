const express = require('express');
const Controller = require('./controllers/controller');
const app = express()
const port = 3000
// const router = require('.')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', Controller.landingPage)
app.get('/register', Controller.register)
app.post('/register', Controller.postRegister)
app.get('/login', Controller.login)
app.post('/login', Controller.postLogin)
app.get('/home', Controller.home)

app.get('/category', Controller.listCategory)
// app.get('/tutor', Controller.listTutor)

app.listen(port, () => {
  console.log(`Server runnig on http:localhost:${port}`)
})