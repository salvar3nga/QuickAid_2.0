const execute = () =>{

    const express = require('express');
    const app = express();
    const dotenv = require('dotenv').config();
    const path = require('path');
    const volunteerRouter = require('./Router/volunteerRoutes');
    const emergencyRouter = require('./Router/emergencyRoutes');
    const mongoose = require('mongoose');
    const methodOverride = require('method-override');
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./helpers/ExpressError');

    const port = process.env.PORT || 3030;

    // dotenv.config();

    app.engine('ejs', ejsMate);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');

    mongoose.set('useFindAndModify', false);

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    app.use(volunteerRouter);
    app.use(emergencyRouter);
    app.use(methodOverride('_method'));
    
    
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
    // })

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