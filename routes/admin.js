const express = require('express')
const Controller = require('../controllers/controller')
const { authentication, authorization } = require('../middlewares/auth')

const router = express.Router()

router.get(
    '/',
    authentication,
    authorization('admin'),
    Controller.adminHome
)

router.get(
    '/category/add',
    authentication,
    authorization('admin'),
    Controller.addCategoryForm
)

router.post(
    '/category/add',
    authentication,
    authorization('admin'),
    Controller.postAddCategory
)

router.get(
    '/category/edit/:id',
    authentication,
    authorization('admin'),
    Controller.editCategoryForm
)

router.post(
    '/category/edit/:id',
    authentication,
    authorization('admin'),
    Controller.postEditCategory
)

router.post(
    '/category/delete/:id',
    authentication,
    authorization('admin'),
    Controller.deleteCategory
)

module.exports = router