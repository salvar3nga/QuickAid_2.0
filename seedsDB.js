/*
    Seeds' purpose is to generate some initial Data
*/

const mongoose = require('mongoose');
const Volunteer = require('./models/volunteer');
const dotenv = require('dotenv').config();

//Connect to the DB
mongoose.connect(process.env.DATABASE, 
    {useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('...Seed connected to DATABASE');
    })
    .catch((err)=>{
        console.log(err);
    });

// const volunteer = new Volunteer({
//     firstName: 'Josh',
//     lastName: 'Doe'
// });

// volunteer.save()
// .then((volunteer)=>{
//     console.log("Volunteer inserted");
//     console.log(volunteer);
// })
// .catch(err => {
//     console.log(`Error while inserting Volunteer ${err}`);
// })


// insert multiple volunteers
const initialVolunteers = [
    {
        firstName: 'Josh',
        lastName: 'Doe',
        phone: 1234567
    },
    {
        firstName: 'Carl',
        lastName: 'Minoe',
        phone: 9873546
    },
    {
        firstName: 'Rebecca',
        lastName: 'Patel',
        phone: 7654321
    },
];

Volunteer.insertMany(initialVolunteers)
.then((volunteer)=>{
    console.log("Volunteers inserted");
    console.log(volunteer);
})
.catch(err => {
    console.log(`Error while inserting Volunteers ${err}`);
})



