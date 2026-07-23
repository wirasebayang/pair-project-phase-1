const express = require('express')
const Controller = require('../controllers/controller')
const { authentication, authorization } = require('../middlewares/auth')
const uploadImage = require('../middlewares/upload')

const router = express.Router()

router.get(
    '/',
    authentication,
    authorization('tutor'),
    Controller.tutorHome
)

router.get(
    '/services/add',
    authentication,
    authorization('tutor'),
    Controller.addServiceForm
)

router.post(
    '/services/add',
    authentication,
    authorization('tutor'),
    uploadImage,
    Controller.postAddService
)

router.get(
    '/services/edit/:id',
    authentication,
    authorization('tutor'),
    Controller.editServiceForm
)

router.post(
    '/services/edit/:id',
    authentication,
    authorization('tutor'),
    uploadImage,
    Controller.postEditService
)

router.post(
    '/services/delete/:id',
    authentication,
    authorization('tutor'),
    Controller.deleteService
)

router.get(
    '/services/my/list',
    authentication,
    authorization('tutor'),
    Controller.myServices
)

router.get(
    '/bookings',
    authentication,
    authorization('tutor'),
    Controller.tutorBookings
)

router.post(
    '/bookings/:id/status',
    authentication,
    authorization('tutor'),
    Controller.updateBookingStatus
)

module.exports = router