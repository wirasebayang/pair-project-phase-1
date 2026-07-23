const {
    Booking,
    Category,
    User,
    UserProfile,
    TutoringService
} = require('../models/index.js')

const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

class Controller {

    static async landingPage(req, res) {
        try {
            res.render('landingPage')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            res.render('register')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {

            const {
                username,
                email,
                password,
                role
            } = req.body

            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            username
                        },
                        {
                            email
                        }
                    ]
                }
            })

            if (existingUser) {

                let errorMessage = 'Username atau E-mail sudah terdaftar'

                if (existingUser.username === username) {
                    errorMessage = 'Username sudah terdaftar'
                }

                if (existingUser.email === email) {
                    errorMessage = 'E-mail sudah terdaftar'
                }

                return res.render('register', {
                    error: errorMessage
                })
            }

            await User.create({
                username,
                email,
                password,
                role
            })

            res.redirect('/login')

        } catch (error) {

            if (error.name === 'SequelizeValidationError') {

                const errors = error.errors.map(
                    el => el.message
                )

                return res.render('register', {
                    errors
                })
            }

            if (error.name === 'SequelizeUniqueConstraintError') {

                const errors = error.errors.map(
                    el => el.message
                )

                return res.render('register', {
                    errors
                })
            }

            console.log(error)
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            res.render('login')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postLogin(req, res) {

        try {

            const {
                username,
                password
            } = req.body

            const user = await User.findOne({
                where: {
                    username
                }
            })

            if (!user) {
                return res.render('login', {
                    error: 'Username atau password salah'
                })
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            )

            if (!isMatch) {
                return res.render('login', {
                    error: 'Username atau password salah'
                })
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            }

            if (user.role === 'admin') {
                return res.redirect('/admin')
            }

            if (user.role === 'tutor') {
                return res.redirect('/tutor')
            }

            if (user.role === 'student') {
                return res.redirect('/student')
            }

            return res.redirect('/')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async logout(req, res) {

        try {

            req.session.destroy((error) => {

                if (error) {
                    console.log(error)
                    return res.send(error)
                }

                res.redirect('/')

            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async adminHome(req, res) {

        try {

            res.render('adminHome', {
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async tutorHome(req, res) {

        try {

            res.render('tutorHome', {
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async studentHome(req, res) {

        try {

            res.render('studentHome', {
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async listCategory(req, res) {

        try {

            const data = await Category.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('category', {
                data,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async categoryDetail(req, res) {

        try {

            const {
                id
            } = req.params

            const category = await Category.findByPk(id)

            if (!category) {
                return res.send('Category tidak ditemukan')
            }

            const services = await TutoringService.findAll({
                where: {
                    CategoryId: id
                },
                include: [
                    {
                        model: Category
                    },
                    {
                        model: User
                    }
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('categoryDetail', {
                category,
                services,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async listServices(req, res) {

        try {

            const services = await TutoringService.findAll({
                include: [
                    {
                        model: Category
                    },
                    {
                        model: User
                    }
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('services', {
                services,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async serviceDetail(req, res) {

        try {

            const {
                id
            } = req.params

            const service = await TutoringService.findByPk(
                id,
                {
                    include: [
                        {
                            model: Category
                        },
                        {
                            model: User
                        }
                    ]
                }
            )

            if (!service) {
                return res.send('Service tidak ditemukan')
            }

            res.render('serviceDetail', {
                service,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async addCategoryForm(req, res) {

        try {

            res.render('categoryForm', {
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async postAddCategory(req, res) {

        try {

            const {
                name
            } = req.body

            await Category.create({
                name
            })

            res.redirect('/category')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async editCategoryForm(req, res) {

        try {

            const {
                id
            } = req.params

            const category = await Category.findByPk(id)

            if (!category) {
                return res.send('Category tidak ditemukan')
            }

            res.render('categoryForm', {
                category,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async postEditCategory(req, res) {

        try {

            const {
                id
            } = req.params

            const {
                name
            } = req.body

            await Category.update(
                {
                    name
                },
                {
                    where: {
                        id
                    }
                }
            )

            res.redirect('/category')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async deleteCategory(req, res) {

        try {

            const {
                id
            } = req.params

            await Category.destroy({
                where: {
                    id
                }
            })

            res.redirect('/category')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async addServiceForm(req, res) {

        try {

            const categories = await Category.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('serviceForm', {
                categories,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async postAddService(req, res) {

        try {

            const {
                name,
                description,
                price,
                imageUrl,
                CategoryId
            } = req.body

            await TutoringService.create({
                name,
                description,
                price,
                imageUrl,
                CategoryId,
                UserId: req.session.user.id
            })

            res.redirect('/tutor/services/my/list')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async editServiceForm(req, res) {

        try {

            const {
                id
            } = req.params

            const service = await TutoringService.findOne({
                where: {
                    id,
                    UserId: req.session.user.id
                }
            })

            if (!service) {
                return res.send('Service tidak ditemukan atau bukan milik kamu')
            }

            const categories = await Category.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('serviceForm', {
                service,
                categories,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async postEditService(req, res) {

        try {

            const {
                id
            } = req.params

            const {
                name,
                description,
                price,
                imageUrl,
                CategoryId
            } = req.body

            const [updated] = await TutoringService.update(
                {
                    name,
                    description,
                    price,
                    imageUrl,
                    CategoryId
                },
                {
                    where: {
                        id,
                        UserId: req.session.user.id
                    }
                }
            )

            if (!updated) {
                return res.send('Service tidak ditemukan atau bukan milik kamu')
            }

            res.redirect('/tutor/services/my/list')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async deleteService(req, res) {

        try {

            const {
                id
            } = req.params

            const deleted = await TutoringService.destroy({
                where: {
                    id,
                    UserId: req.session.user.id
                }
            })

            if (!deleted) {
                return res.send('Service tidak ditemukan atau bukan milik kamu')
            }

            res.redirect('/tutor/services/my/list')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async myServices(req, res) {

        try {

            const services = await TutoringService.findAll({
                where: {
                    UserId: req.session.user.id
                },
                include: [
                    {
                        model: Category
                    },
                    {
                        model: User
                    }
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            res.render('myServices', {
                services,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async createBooking(req, res) {

        try {

            const {
                serviceId
            } = req.params

            const service = await TutoringService.findByPk(serviceId)

            if (!service) {
                return res.send('Layanan tutoring tidak ditemukan')
            }

            const existingBooking = await Booking.findOne({
                where: {
                    ServiceId: serviceId,
                    StudentId: req.session.user.id
                }
            })

            if (existingBooking) {
                return res.send('Kamu sudah melakukan booking untuk layanan ini')
            }

            await Booking.create({
                ServiceId: serviceId,
                StudentId: req.session.user.id,
                status: 'pending'
            })

            res.redirect('/student/bookings')

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async myBookings(req, res) {

        try {

            const bookings = await Booking.findAll({
                where: {
                    StudentId: req.session.user.id
                },
                include: [
                    {
                        model: TutoringService,
                        as: 'Service',
                        include: [
                            {
                                model: Category
                            },
                            {
                                model: User
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            res.render('myBookings', {
                bookings,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

    static async tutorBookings(req, res) {

        try {

            const bookings = await Booking.findAll({
                include: [
                    {
                        model: User,
                        as: 'Student'
                    },
                    {
                        model: TutoringService,
                        as: 'Service',
                        where: {
                            UserId: req.session.user.id
                        },
                        include: [
                            {
                                model: Category
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            res.render('tutorBookings', {
                bookings,
                user: req.session.user
            })

        } catch (error) {

            console.log(error)
            res.send(error)
        }
    }

}

module.exports = Controller