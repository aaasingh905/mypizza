const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController(){

    return {
        logout(req,res){
            req.logout()
            return res.redirect('/')
        },
        login(req,res){
            res.render('Auth/Login')
        },
        postLogin(req,res, next){
            passport.authenticate('local',(err,user,info) => {
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                    req.flash('error',info.message)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },
        register(req,res){
            res.render('Auth/Register')
        },
       async postRegister(req,res){
            const { name, email, password } = req.body
            //Validate Request
            if(!name || !email || !password){
                //sending message in flash to show form is incomplete
                req.flash('error','All Fields are required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            //check if email already exist
            User.exists({email:email},(err,result)=> {
                if(result){
                req.flash('error','Email already exists')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')}
            })
//Hashing password for security using bcrypt package
const hashedPassword = await bcrypt.hash(password, 10).catch(error => {
    req.flash('error','Something went wrong')
                return res.redirect('/register')
})  
//create a user
        const user = new User({
            name: name,
            email:email,
            password: hashedPassword
        })

        user.save().then(()=> {
            return res.redirect('/')
        }).catch(err => {
            req.flash('error','Something went wrong')
                return res.redirect('/register')
        })
            console.log(req.body)
        }
    }
}

module.exports = authController