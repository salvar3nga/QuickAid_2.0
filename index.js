const execute = () =>{

    const express = require('express');
    const app = express();
    const dotenv = require('dotenv').config();
    const path = require('path');
    const router = require('./Router/routes');
    const mongoose = require('mongoose');
    const methodOverride = require('method-override');
    const Volunteer = require('./models/volunteer');
    const ejsMate = require('ejs-mate');
    const catchAsync = require('./helpers/catchAsync')
    const ExpressError = require('./helpers/ExpressError');
    const {registerValidation} = require('./helpers/joiValidation');

    const port = process.env.PORT || 3030;


    app.engine('ejs', ejsMate);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');

    mongoose.set('useFindAndModify', false);

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    app.use(router);
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


    
        routeListener();



    app.listen(port, ()=>{
        console.log(`Server running on Port ${port}`);
    })


    //404
    // app.use((req,res)=>{
    //     res.status(404).send('Page not found');
    // })


    function routeListener(){

        app.put('/volunteers/:id', catchAsync(async (req, res, next) =>{
            const {id} = req.params;

            const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, {...req.body.volunteer})

            console.log(req.body.volunteer)

            res.redirect(`/volunteers/${updatedVolunteer._id}`);
        }));


        app.delete('/volunteers/:id', catchAsync(async (req,res)=>{
            const {id} = req.params;

            const deletedVolunteer = await Volunteer.findByIdAndDelete(id);

            res.redirect('/volunteers');
        }));
    }

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