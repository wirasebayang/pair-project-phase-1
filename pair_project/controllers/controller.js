const {Booking, Category, User, UserProfile, TutoringService} = require('../models/index.js')

class Controller {
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

            res.render('category', {data})
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
}

module.exports = Controller