const express = require('express')
const Controller = require('../controllers/controller')
const { authentication, authorization } = require('../middlewares/auth')

const router = express.Router()

router.get(
    '/',
    authentication,
    authorization('student'),
    Controller.studentHome
)

router.post(
    '/bookings/:serviceId',
    authentication,
    authorization('student'),
    Controller.createBooking
)

router.get(
    '/bookings',
    authentication,
    authorization('student'),
    Controller.myBookings
)

router.post(
    '/bookings/:id/cancel',
    authentication,
    authorization('student'),
    Controller.cancelBooking
)

module.exports = router