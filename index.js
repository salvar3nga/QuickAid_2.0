const execute = () =>{

    if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config();
    }

    const express = require('express');
    const app = express();
    const path = require('path');
    const volunteerRouter = require('./Router/volunteerRoutes');
    const emergencyRouter = require('./Router/emergencyRoutes');

    const userModel = require('./models/user');


    const mongoose = require('mongoose');
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./helpers/ExpressError');
    const flash = require('connect-flash');

    const session = require('express-session');
    const passport = require('passport');
    const localStrategy = require('passport-local');

    const port = process.env.PORT || 3030;

  

    app.engine('ejs', ejsMate);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

  

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    app.use(methodOverride('_method'));
    
    const sessionConfig ={
        secret: 'changeMe',
        resave: false,
        saveUninitialized: true,
        cookie:{
            httpOnly: true,
            expires: Date.now() + 1000*60*60*24*7,
            maxAge: 1000*60*60*24*7
        }
    }
    app.use(session(sessionConfig)); 
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new localStrategy(userModel.authenticate()));
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    app.use((req,res,next)=>{
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    })
    
    app.use(volunteerRouter);
    app.use(emergencyRouter);
    
    
    
    //Connect to the DB
    mongoose.connect(process.env.DATABASE, 
        {useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            console.log('...CONNECTED TO DATABASE');
        })
        .catch((err)=>{
            console.log(err);
        });


       


    app.listen(port, ()=>{
        console.log(`Server running on Port ${port}`);
    })


    //404
    // app.use((req,res)=>{
    //     res.status(404).send('Page not found');
    // }f)

    // Unknown route
    app.all('*', (req, res, next)=>{
        next(new ExpressError('Page not Found', 404));
    });

    //Error Handler
   app.use((err, req, res, next)=>{
        const { statusCode=500} = err;
        if(!err.message) err.message='Something went wrong';
        res.status(statusCode).render('error', {err});
   });

    

    

}


const main = ()=>{
    execute();
}

main();