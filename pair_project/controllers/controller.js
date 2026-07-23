const { Booking, Category, User, UserProfile, TutoringService } = require('../models/index.js')
const bcrypt = require('bcrypt')

class Controller {
    static async landingPage(req, res) {
        try {
            res.render('landingPage')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            res.render('register')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const { username, email, password, role } = req.body

            await User.create({
                username,
                email,
                password,
                role
            })

            res.redirect('/login')
        } catch (error) {

            if (error.name == "SequelizeValidationError") {
                let errors = error.errors.map(el => 
                    el.message
                )
                res.send(errors)
                console.log(errors);
            }
        }
    }

    static async login(req, res) {
        try {
            res.render('login')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
            

            res.redirect('/home')
        } catch (error) {

            if (error.name == "SequelizeValidationError") {
                let errors = error.errors.map(el => 
                    el.message
                )
                res.send(errors)
                console.log(errors);
            }
        }
    }

    static async home(req, res) {
        try {
            res.render('home')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    static async listCategory(req, res) {
        try {
            const data = await Category.findAll()

            res.render('category', { data })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }

    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }

    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }

    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }

    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }

    // static async home(req, res) {
    //     try {

    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }
}

module.exports = Controller