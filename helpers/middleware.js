
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnToURL = req.originalURL;
        req.flash('error', 'Please log in!')
        return res.redirect('/login');
    }
    next();
}
