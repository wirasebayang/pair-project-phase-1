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
            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async register(req, res) {
        try {
            res.render('register')
        } catch (error) {
            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            if (!['tutor', 'student'].includes(role)) {
                return res.render('register', {
                    error: 'Role tidak valid, pilih tutor atau student',
                    old: req.body
                })
            }

            if (existingUser) {

                let errorMessage = 'Username atau E-mail sudah terdaftar'

                if (existingUser.username === username) {
                    errorMessage = 'Username sudah terdaftar'
                }

                if (existingUser.email === email) {
                    errorMessage = 'E-mail sudah terdaftar'
                }

                return res.render('register', {
                    error: errorMessage,
                    old: req.body
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
                    errors,
                    old: req.body
                })
            }

            if (error.name === 'SequelizeUniqueConstraintError') {

                const errors = error.errors.map(
                    el => el.message
                )

                return res.render('register', {
                    errors,
                    old: req.body
                })
            }

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async login(req, res) {
        try {
            res.render('login')
        } catch (error) {
            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async postLogin(req, res) {

        try {

            const {
                username,
                password
            } = req.body

            if (!username || !password) {
                return res.render('login', {
                    error: 'Username dan password wajib diisi',
                    old: { username }
                })
            }

            const user = await User.findOne({
                where: {
                    username
                }
            })

            if (!user) {
                return res.render('login', {
                    error: 'Username atau password salah',
                    old: { username }
                })
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            )

            if (!isMatch) {
                return res.render('login', {
                    error: 'Username atau password salah',
                    old: { username }
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async logout(req, res) {

        try {

            req.session.destroy((error) => {

                if (error) {
                    console.error(error)
                    return res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
                }

                res.redirect('/')

            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async adminHome(req, res) {

        try {

            res.render('adminHome', {
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async tutorHome(req, res) {

        try {

            res.render('tutorHome', {
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async studentHome(req, res) {

        try {

            res.render('studentHome', {
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async home(req, res) {

        try {

            res.render('home', {
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async categoryDetail(req, res) {

        try {

            const {
                id
            } = req.params

            const category = await Category.findByPk(id)

            if (!category) {
                return res.status(404).render('error', { message: 'Category tidak ditemukan' })
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
                        model: User,
                        include: [
                            {
                                model: UserProfile
                            }
                        ]
                    }
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            const bookedServiceIds = await Controller.getBookedServiceIds(req.session.user)

            res.render('categoryDetail', {
                category,
                services,
                user: req.session.user,
                bookedServiceIds
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    // ServiceId yang masih punya booking aktif (bukan cancelled) milik student,
    // dipakai view untuk menonaktifkan tombol Booking. Non-student selalu kosong.
    static async getBookedServiceIds(sessionUser) {

        if (sessionUser.role !== 'student') {
            return []
        }

        const bookings = await Booking.findAll({
            where: {
                StudentId: sessionUser.id,
                status: {
                    [Op.ne]: 'cancelled'
                }
            }
        })

        return bookings.map(el => el.ServiceId)
    }

    static async listServices(req, res) {

        try {

            const {
                search
            } = req.query

            const where = {}

            if (search) {
                where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }

            const services = await TutoringService.findAll({
                where,
                include: [
                    {
                        model: Category
                    },
                    {
                        model: User,
                        include: [
                            {
                                model: UserProfile
                            }
                        ]
                    }
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            const bookedServiceIds = await Controller.getBookedServiceIds(req.session.user)

            res.render('services', {
                services,
                user: req.session.user,
                bookedServiceIds,
                search: search || ''
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                            model: User,
                            include: [
                                {
                                    model: UserProfile
                                }
                            ]
                        }
                    ]
                }
            )

            if (!service) {
                return res.status(404).render('error', { message: 'Service tidak ditemukan' })
            }

            const bookedServiceIds = await Controller.getBookedServiceIds(req.session.user)

            res.render('serviceDetail', {
                service,
                user: req.session.user,
                isBooked: bookedServiceIds.includes(service.id)
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async addCategoryForm(req, res) {

        try {

            res.render('categoryForm', {
                category: null,
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

                const errors = error.errors.map(
                    el => el.message
                )

                return res.render('categoryForm', {
                    errors,
                    category: req.body,
                    user: req.session.user
                })
            }

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async editCategoryForm(req, res) {

        try {

            const {
                id
            } = req.params

            const category = await Category.findByPk(id)

            if (!category) {
                return res.status(404).render('error', { message: 'Category tidak ditemukan' })
            }

            res.render('categoryForm', {
                category,
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

                const errors = error.errors.map(
                    el => el.message
                )

                return res.render('categoryForm', {
                    errors,
                    category: {
                        ...req.body,
                        id: req.params.id
                    },
                    user: req.session.user
                })
            }

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                service: null,
                categories,
                user: req.session.user
            })

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async postAddService(req, res) {

        try {

            const {
                name,
                description,
                price,
                CategoryId
            } = req.body

            if (req.uploadError) {

                const categories = await Category.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                })

                return res.render('serviceForm', {
                    errors: [req.uploadError],
                    service: req.body,
                    categories,
                    user: req.session.user
                })
            }

            const imageUrl = req.file ? '/uploads/' + req.file.filename : null

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

            if (error.name === 'SequelizeValidationError') {

                const errors = error.errors.map(
                    el => el.message
                )

                const categories = await Category.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                })

                return res.render('serviceForm', {
                    errors,
                    service: req.body,
                    categories,
                    user: req.session.user
                })
            }

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                return res.status(404).render('error', { message: 'Service tidak ditemukan atau bukan milik kamu' })
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                CategoryId
            } = req.body

            if (req.uploadError) {

                const categories = await Category.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                })

                return res.render('serviceForm', {
                    errors: [req.uploadError],
                    service: {
                        ...req.body,
                        id
                    },
                    categories,
                    user: req.session.user
                })
            }

            const payload = {
                name,
                description,
                price,
                CategoryId
            }

            if (req.file) {
                payload.imageUrl = '/uploads/' + req.file.filename
            }

            const [updated] = await TutoringService.update(
                payload,
                {
                    where: {
                        id,
                        UserId: req.session.user.id
                    }
                }
            )

            if (!updated) {
                return res.status(404).render('error', { message: 'Service tidak ditemukan atau bukan milik kamu' })
            }

            res.redirect('/tutor/services/my/list')

        } catch (error) {

            if (error.name === 'SequelizeValidationError') {

                const errors = error.errors.map(
                    el => el.message
                )

                const categories = await Category.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                })

                return res.render('serviceForm', {
                    errors,
                    service: {
                        ...req.body,
                        id: req.params.id
                    },
                    categories,
                    user: req.session.user
                })
            }

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                return res.status(404).render('error', { message: 'Service tidak ditemukan atau bukan milik kamu' })
            }

            res.redirect('/tutor/services/my/list')

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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
                        model: User,
                        include: [
                            {
                                model: UserProfile
                            }
                        ]
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async createBooking(req, res) {

        try {

            const {
                serviceId
            } = req.params

            const service = await TutoringService.findByPk(serviceId)

            if (!service) {
                return res.status(404).render('error', { message: 'Layanan tutoring tidak ditemukan' })
            }

            const existingBooking = await Booking.findOne({
                where: {
                    ServiceId: serviceId,
                    StudentId: req.session.user.id,
                    status: {
                        [Op.ne]: 'cancelled'
                    }
                }
            })

            if (existingBooking) {
                return res.status(400).render('error', { message: 'Kamu sudah melakukan booking untuk layanan ini' })
            }

            await Booking.create({
                ServiceId: serviceId,
                StudentId: req.session.user.id,
                bookingDate: new Date(),
                status: 'pending'
            })

            res.redirect('/student/bookings')

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
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

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async updateBookingStatus(req, res) {

        try {

            const {
                id
            } = req.params

            const {
                status
            } = req.body

            if (!['confirmed', 'completed'].includes(status)) {
                return res.status(400).render('error', { message: 'Status tidak valid' })
            }

            const booking = await Booking.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: TutoringService,
                        as: 'Service',
                        where: {
                            UserId: req.session.user.id
                        }
                    }
                ]
            })

            if (!booking) {
                return res.status(404).render('error', { message: 'Booking tidak ditemukan atau bukan untuk layanan kamu' })
            }

            const allowedTransitions = {
                pending: 'confirmed',
                confirmed: 'completed'
            }

            if (allowedTransitions[booking.status] !== status) {
                return res.status(400).render('error', { message: `Booking berstatus ${booking.status} tidak bisa diubah menjadi ${status}` })
            }

            booking.status = status
            await booking.save()

            res.redirect('/tutor/bookings')

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

    static async cancelBooking(req, res) {

        try {

            const {
                id
            } = req.params

            const booking = await Booking.findOne({
                where: {
                    id,
                    StudentId: req.session.user.id
                }
            })

            if (!booking) {
                return res.status(404).render('error', { message: 'Booking tidak ditemukan atau bukan milik kamu' })
            }

            if (!booking.canBeCancelled()) {
                return res.status(400).render('error', { message: `Booking berstatus ${booking.status} tidak bisa dibatalkan` })
            }

            booking.status = 'cancelled'
            await booking.save()

            res.redirect('/student/bookings')

        } catch (error) {

            console.error(error)
            res.status(500).render('error', { message: 'Terjadi kesalahan pada server' })
        }
    }

}

module.exports = Controller