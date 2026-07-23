const {Booking, Category, User, UserProfile, TutoringService} = require('../models/index.js')

class Controller {
    // static async home(req, res) {
    //     try {
    //         res.render('home')
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }
    // }
    
    static async listCategory(req, res) {
        try {
           const {id} = req.params
            const category = await Category.findByPk(id, {
                include : [
                    {
                    model : TutoringService,
                    include : [User]
                }
                ]
            });

            if (!category) {
            return res.status(404).send("Error: Kategori dengan ID tersebut tidak ditemukan.");
        }
            

            res.render('category', {category})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    // static async listTutor(req, res) {
    //     try {
    //         const data = await TutoringService.findAll()
    //         res.render("detailTutor", {data})
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