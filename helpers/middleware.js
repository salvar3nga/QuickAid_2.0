
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnToURL = req.originalUrl;
        req.flash('error', 'Please log in!')
        return res.redirect('/login');
    }
    next();
}
