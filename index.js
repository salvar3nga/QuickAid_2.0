const execute = () =>{

    const express = require('express');
    const app = express();
    const dotenv = require('dotenv').config();
    const path = require('path');
    const router = require('./Router/routes');
    const mongoose = require('mongoose');
    const methodOverride = require('method-override');
    const Volunteer = require('./Models/volunteer');
    const port = process.env.PORT || 3030;



    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');

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






    function routeListener(){

        app.put('/volunteers/:id', async (req, res)=>{
            const {id} = req.params;
            const {name, lastName, phone} = req.body;

            const volunteer = await Volunteer.findById(id);

            
            volunteer.firstName = name;
            volunteer.lastName = lastName;
            volunteer.phone= phone;
        
            const updatedVolunteer = await volunteer.save();
            res.redirect(`/volunteers/${updatedVolunteer._id}`);
        });


        app.delete('/volunteers/:id', async (req,res)=>{
            const {id} = req.params;

            const deletedVolunteer = await Volunteer.findByIdAndDelete(id);

            res.redirect('/volunteers');
        })
    }

    

}


const main = ()=>{
    execute();
}

main();