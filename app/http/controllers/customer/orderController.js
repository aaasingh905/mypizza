const Order = require('../../../models/order')
const moment = require('moment')
function orderController () {
    return {
        store (req, res) {
            // Validate Request 
            const { phone, address } = req.body
            if(!phone || !address) {
                req.flash('error', 'All fields required')
                return res.redirect('/cart')

            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            })

            order.save()
            .then(result => {
                Order.populate(result,{path:'customerId'},(err, placedOrder)=>{
                    req.flash('success','Order placed successfully')
                delete req.session.cart
                // Emit 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced',placedOrder) //emitted id and status on change of status
                return res.redirect('/customers/orders')
                })
                
            })
            .catch(error => {
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res){
            const orders = await Order.find({customerId: req.user._id},
                null,{sort: { 'createdAt': -1 } })
                res.header('Cache-Control', 'no-store')
                res.render('customers/orders', {orders:orders, moment:moment})
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id).catch(err => {
                console.log(err)
            })
            //authorise user for perticular order
            if(req.user._id.toString() === order.customerId.toString()){

               return res.render('customers/singleOrder', {order})

            }
            else {
               return res.redirect('/')
            }

        }
    }

    
}

module.exports = orderController;