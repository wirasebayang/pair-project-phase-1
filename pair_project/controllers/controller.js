const { where } = require('sequelize');
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
        const { categoryId } = req.query;

       const categories = await Category.findAll({
                include: [
                    {
                        model: TutoringService,
                        include: [User]
                    }
                ]
            });

        res.render('categori', {
            category: categories,
            selectedCategory: categoryId
        });

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

    static async detailTutor(req, res){
        try {
            const {id}= req.params
            const tutor = await TutoringService.findByPk(id,{
                include : [
                    Category,
                    {
                    model : User,
                    include : [UserProfile]
                }
                ]
            })
            res.render('detailTutor', {tutor})
            // res.send(tutor)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async addBooking(req, res){
        try {
            const {id}= req.params
            // const StudentId = req.session.UserId
            const StudentId = 1;

            await Booking.create({
                 ServiceId: id,
                StudentId : StudentId,
                status: 'Pending'
            })

            res.redirect(`/mybookings`);
            // res.send(booking)
        } catch (error) {
            console.log(error)
            // res.send(error)
            return res.status(500).send(error.message);
        }
    }



    static async myBooking(req, res){
        try {
             const studentId = 1;

            // const studentId = req.session.UserId;
            const bookings = await Booking.findAll({
                where : {StudentId: studentId},
                include:[
                    {
                        model: TutoringService,
                        include:[
                            {
                                model:User
                            }
                        ]
                    }
                ]
            })
            // console.log("DATA BOOKINGS:", JSON.stringify(bookings, null, 2));
            console.log("DATA DARI DB:", bookings);
            res.render('booking', {bookings})
        } catch (error) {
            console.log(error)
            // res.send(error)
            return res.status(500).send(error.message);
        }
    }

    static async getAddService(req, res){
        try {
            const categories = await Category.findAll();
            res.render('add-service',{categories});
        } catch (error) {
            console.log(error)
            // res.send(error)
            return res.status(500).send(error.message);
        }
    }

    static async postAddService(req, res) {
        try {
            const { name, CategoryId, price, description, imageUrl } = req.body;
            // Ambil UserId dari session tutor yang sedang login

            if (!CategoryId || !price || isNaN(Number(CategoryId)) || isNaN(Number(price))) {
            return res.status(400).send("Error: Kategori dan Harga harus diisi dengan angka yang valid!");
        }
            const UserId = req.session.UserId || 1; 

            await TutoringService.create({
                name,
                CategoryId: Number(CategoryId),
                price: Number(price),
                description,
                imageUrl,
                UserId
            });

            res.redirect('/category'); 
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    static async updateStatus(req, res){
        try {
            const {id} = req.params

            const booking = await Booking.findByPk(id)

            await booking.update({
                status :"Confirmed"
            })
            res.redirect('/mybookings');
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    // static async detailTutor(req, res){
    //     try {
            
    //     } catch (error) {
    //         console.log(error)
    //         res.send(error)
    //     }
    // }

    // static async detailTutor(req, res){
    //     try {
            
    //     } catch (error) {
    //         console.log(error)
    //         res.send(error)
    //     }
    // }

}

module.exports = Controller