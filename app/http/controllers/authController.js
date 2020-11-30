function authController(){

    return {
        login(req,res){
            res.render('Auth/Login')
        },
        register(req,res){
            res.render('Auth/Register')
        }
    }
}

module.exports = authController