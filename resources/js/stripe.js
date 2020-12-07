
import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import {CardWidget} from './CardWidget';


export async function initStripe() {
    const stripe = await loadStripe
    ('pk_test_51HvgDuGb2LQBsCkJaqrWmOMXeiCz8vtL1T21jpJQjtCOe2R1iqPWE2xMtFEJpbIZl6q30MDWxtRaVanMyuBhVYj6009Uk9wwGf');
    
    let card = null;
    //paymentType based card detail input box
    const paymentType = document.querySelector('#paymentType')
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change',(e) => {
        if(e.target.value === 'card') {
            card = new CardWidget(stripe)
            card.mount()
            //display card details widget
            }

        else {
        //Nothing
        card.destroy();
        }
})


const paymentForm = document.querySelector('#payment-form');
if(paymentForm){
paymentForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    let formData = new FormData(paymentForm)
    let formObject = {}

    for(let [key,value] of formData.entries()) {
    formObject[key]=value
    }

if(!card) {
    placeOrder(formObject)
    return;
}
else {
    //Verify card 
   const token = await card.createToken()
        formObject.stripeToken = token.id
        placeOrder(formObject)

     }
    
})
}
}
