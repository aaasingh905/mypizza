function auth (req, res, next) {
    if(req.isAuthenticated())
    {
        if(req.user.role==='admin') {
        return res.redirect('/admin/orders')
        }
        return next() 
    }
    return res.redirect('/login')
}

module.exports = auth;