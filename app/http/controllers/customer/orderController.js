const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.SECRET_KEY)
function orderController () {
    return {
        store (req, res) {
            // Validate Request 
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({message:"All fields are required"})

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
                    //req.flash('success','Order placed successfully')
               
                    //Strip Payment
                    if(paymentType === 'card'){
                        stripe.charges.create ({
                            amount: req.session.cart.totalPrice * 100,
                            source:stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(result => {
                            placedOrder.paymentStatus = true;
                            placedOrder.paymentType = paymentType;
                            placedOrder.save().then(result=>{
                                console.log(result);
                                // Emit 
                                 const eventEmitter = req.app.get('eventEmitter')
                                 eventEmitter.emit('orderPlaced',result) //emitted id and status on change of status
                                 delete req.session.cart   
                                 return res.json({message:'Payment successful, Order Successfully Placed'})
                            }).catch(err => {
                                console.log(err)
                            })
                        }).catch(err => {
                                  delete req.session.cart
                                 return res.json({message:'Payment failed, You can pay at delivery'})
                            
                        })
                    }
                    else {
                        delete req.session.cart
                        return res.json({message:'Order Successfully Placed'})
                    }

                })
                
            })
            .catch(error => {
                return res.status(500).json({message:'Something went wrong'})
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