//use .env file
require('dotenv').config()
const express = require('express');
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const app = express()
const mongoDbStore = require('connect-mongo')(session)
app.use(express.json())
app.use(flash())

app.use(express.urlencoded({extended:false}))

//database connection
const url = 'mongodb+srv://Ecommerce_user:Anurag@0207@everyneedsfound.77luk.mongodb.net/pizza?retryWrites=true&w=majority';

mongoose.connect(url,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, 
useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',()=> {
    console.log('Database Connected');
}).catch(err => {
    console.log('connection failed' );
})



//session store
let mongoStore = new mongoDbStore({
    mongooseConnection: connection,
    collection: 'session'
})
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore, //save session here
    saveUninitialized:false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}

}))

//Passport Config
app.use(passport.initialize())
app.use(passport.session())
const passportInit= require('./app/config/passport')
passportInit(passport)
//initialize flash


const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')

const path = require('path');

const PORT = process.env.PORT || 3004

app.use((req,res,next) => {
    res.locals.session=req.session;
    res.locals.user=req.user;
    next()
})
app.use(expressLayout)

app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.use(express.static('public'))

require('./routes/web')(app)

//session config




app.listen(PORT, () => {
    console.log('listening on port 3004')
})