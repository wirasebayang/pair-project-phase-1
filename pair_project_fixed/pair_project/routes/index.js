const express = require('express')
const Controller = require('../controllers/controller')
const { authentication } = require('../middlewares/auth')

const router = express.Router()

router.get('/', Controller.landingPage)

router.get('/register', Controller.register)
router.post('/register', Controller.postRegister)

router.get('/login', Controller.login)
router.post('/login', Controller.postLogin)

router.get('/logout', Controller.logout)

router.get(
    '/category',
    authentication,
    Controller.listCategory
)

router.get(
    '/category/:id',
    authentication,
    Controller.categoryDetail
)

router.get(
    '/services',
    authentication,
    Controller.listServices
)

router.get(
    '/services/:id',
    authentication,
    Controller.serviceDetail
)

module.exports = router