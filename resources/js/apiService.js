import axios from 'axios'
import Noty from 'noty'

export function placeOrder (formObject) {
    axios.post('/orders', formObject)
    .then(res => {
        new Noty({
            type:'success',
            timeout:1000,
            text: res.data.message
        }).show();

        //To redirect to ordes page
        setTimeout(() => {
        window.location.href ='/customers/orders'
        }, 1000);
    })
    .catch(err=>{
        new Noty({
            type:'success',
            timeout:1000,
            text: err.res.data.message
        }).show();
    })
}