const express = require('express');

const app = express()

const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')

const path = require('path')

const PORT = process.env.PORT || 3004


app.use(expressLayout)

app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.use(express.static('public'))
app.get('/',(req, res)=> {
res.render('Home')
})

app.use(express.static('public'))
app.get('/cart',(req, res)=> {
res.render('customers/cart')
})

app.use(express.static('public'))
app.get('/login',(req, res)=> {
res.render('Auth/Login')
})

app.use(express.static('public'))
app.get('/register',(req, res)=> {
res.render('Auth/Register')
})
app.listen(PORT, () => {
    console.log('listening on port 3004')
})