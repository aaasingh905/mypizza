//protecting register and login route
// if user is already authenticated

function guest (req, res, next) {
    if(!req.isAuthenticated())
    {
        return next()
    }
    return res.redirect('/')
}

module.exports = guest;