
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnToURL = req.originalUrl;
        req.flash('error', 'Please log in!')
        return res.redirect('/login');
    }
    next();
}

module.exports.verifyPasswordMatching = (req, res, next)=>{
    const {password, passwordRepeat} = req.body;

    if(!(password === passwordRepeat)){
        req.flash('error', 'Passwords do not match!');
        return res.redirect('/register');
    }
    next();
}