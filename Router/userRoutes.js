const router = require("express").Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const User = require('../models/user');
const methodOverride = require('method-override');
const passport = require("passport");
const {isLoggedIn, verifyPasswordMatching} = require('../helpers/middleware');


router.use(methodOverride('_method'));



router.get('/register', isLoggedIn, (req,res)=>{
    res.render('Users/register');
});

router.post('/register', isLoggedIn, verifyPasswordMatching, catchAsync(async(req,res)=>{
    try{

        const {name, username, phone, address, city, password, passwordRepeat} = req.body;
        let superAdmin = false;
        if(req.body.superAdmin) superAdmin = true;
        
        const newAdmin = new User({name, username, phone, address, city, superAdmin});
        const registeredUser = await User.register(newAdmin, password)
        console.log(registeredUser);
        req.flash('success', 'Successfully created a new user')
        res.redirect('/volunteers');
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));


router.get('/login', (req,res)=>{
    res.render('Users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res)=>{
    const redirectURL = req.session.returnToURL || '/volunteers'
    delete req.session.returnToURL;
    res.redirect(redirectURL)
});

router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login');
});



module.exports = router;
