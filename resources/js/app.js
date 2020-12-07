 import axios from 'axios'
 import Noty from 'noty';
 import { initAdmin } from './admin'
 import { initStripe } from './stripe'
 import moment from 'moment'

 //getting array of all add to cart buttons on page
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

//for each button
function updateCart (pizza) {
    axios.post('/update-cart',pizza)
    .then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            text: 'Item added to cart'
        }).show();

    }).catch(err => {
        new Noty({
            type:'error',
            timeout:1000,
            text: 'Something went wrong'
        }).show();
    })
}
addToCart.forEach((btn)=>{
    btn.addEventListener('click', (ele) => {
        //parsing recieved string to JSON
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


//change order status in customer page
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

initStripe();
//socket
//after adding script in app.js
//io method will be available here

let socket = io()

if(order){
    //sending info to create room
socket.emit('join',`order_${order._id}`)
//order_hjsjjjsdjknsk

}
let adminPath = window.location.pathname
if(adminPath.includes('admin')) {
initAdmin(socket)

    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout:1000,
        text: `${updatedOrder.status}`
    }).show();
})

