const execute = () =>{

    if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config();
    }

    const express = require('express');
    const app = express();
    const path = require('path');
    const volunteerRouter = require('./Router/volunteerRoutes');
    const emergencyRouter = require('./Router/emergencyRoutes');
    const userRouter = require('./Router/userRoutes');
    const userModel = require('./models/user');
    const helmet = require('helmet');


    const mongoose = require('mongoose');
    const mongoSanitize = require('express-mongo-sanitize');
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./helpers/ExpressError');
    const flash = require('connect-flash');

    const session = require('express-session');
    const MongoStore = require('connect-mongo');
    const passport = require('passport');
    const localStrategy = require('passport-local');

    const i18next = require('i18next');
    const backendI18 = require('i18next-fs-backend');
    const i18NextMiddleware = require('i18next-http-middleware');

    const port = process.env.PORT || 3000;
    const DEV_DB = process.env.MONGO_DB || 'mongodb://localhost:27017/quickAid'
    const secret = process.env.SECRET || 'changeMe'

  

    app.engine('ejs', ejsMate);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);


    i18next
        .use(backendI18)
        .use(i18NextMiddleware.LanguageDetector)
        .init({
            backend: {
                loadPath: './I18n/locales/{{lng}}/{{ns}}.json'
            },
            fallbackLng: 'en',
            preload: ['en', 'pt']
        });

  

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    app.use(methodOverride('_method'));
    app.use(mongoSanitize());

    const store = new MongoStore({
        useUnifiedTopology: true,
        mongoUrl: DEV_DB,
        secret: secret,
        touchAfter: 24 * 60 * 60,
    });

    store.on('error', function(e){
        console.log('+++ERROR WHILE STORING SESSION+++', e);
    })
    
    const sessionConfig ={
        store,
        name: 'session',
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie:{
            httpOnly: true,
            // secure: true,
            expires: Date.now() + 1000*60*60*24*7,
            maxAge: 1000*60*60*24*7
        }
    }
    app.use(session(sessionConfig)); 
    app.use(flash());
    app.use(helmet({contentSecurityPolicy: false}));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(i18NextMiddleware.handle(i18next));


    passport.use(new localStrategy(userModel.authenticate()));
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    app.use((req,res, next)=>{
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    })
    
    app.use(volunteerRouter);
    app.use(emergencyRouter);
    app.use(userRouter);

    
    
    
    //Connect to the DB DEV_DB

    mongoose.connect(DEV_DB, 
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