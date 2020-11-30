 import axios from 'axios'
 import Noty from 'noty';
 

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