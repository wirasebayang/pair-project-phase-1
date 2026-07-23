const express = require('express');
const Controller = require('./controllers/controller');
const app = express()
const port = 3000
// const router = require('.')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

const session = require('express-session');

app.use(session({
    secret: 'rahasia-anda',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', Controller.landingPage)
app.get('/register', Controller.register)
app.post('/register', Controller.postRegister)
app.get('/login', Controller.login)
app.post('/login', Controller.postLogin)
app.get('/home', Controller.home)
app.get('/category', Controller.listCategory)
app.get('/mybookings', Controller.myBooking)
app.get('/services/add', Controller.getAddService);
app.post('/services/add', Controller.postAddService);
app.get('/tutor/:id', Controller.detailTutor)

app.post('/booking/confirm/:id', Controller.updateStatus);

app.post('/booking/:id', Controller.addBooking)

// app.post('/booking/:id', Controller.addBooking)
// app.get('/tutor', Controller.listTutor)

app.listen(port, () => {
  console.log(`Server runnig on http:localhost:${port}`)
})