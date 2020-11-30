const Menu = require('../../models/menu')

function homeController(){

    return {
        index(req,res){

         //fetching data from database 
         Menu.find().then(pizzas =>{
            return res.render('Home', {pizzas:pizzas})
         })  
        
        }
    }
}

module.exports = homeController