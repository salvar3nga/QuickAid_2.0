const router = require("express").Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const User = require('../models/user');
const methodOverride = require('method-override');
const passport = require("passport");


router.use(methodOverride('_method'));



router.get('/login', (req,res)=>{
    res.render('Users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res)=>{
    req.flash('success', 'Welcome');
    const redirectURL = req.session.returnToURL || '/volunteers'
    res.redirect(redirectURL)
});

router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login');
});



module.exports = router;
