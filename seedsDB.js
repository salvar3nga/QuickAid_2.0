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
        phone: 1234567,
        address: 'Rua da alma',
        city: 'Bissau',
        state: 'Bissau',
        personalID: '123hz385',
        licenseNR: '934hzdi28'
    },
    {
        firstName: 'Andre',
        lastName: 'Morse',
        phone: 1234567,
        address: 'Rua da amizade',
        city: 'Gabu',
        state: 'Gabu',
        personalID: '123hz385',
        licenseNR: '934hzdi28'
    },
    {
        firstName: 'Galin',
        lastName: 'Marcos',
        phone: 1234567,
        address: 'Rua da fronteira',
        city: 'Pitche',
        state: 'Gabu',
        personalID: '123hz385',
        licenseNR: '934hzdi28'
    },
    
];

const resetDB = async() =>{
    // await Volunteer.deleteMany({});

    Volunteer.insertMany(initialVolunteers)
    .then((volunteer)=>{
        console.log("Volunteers inserted");
        console.log(volunteer);
    })
    .catch(err => {
        console.log(`Error while inserting Volunteers ${err}`);
    })
}

resetDB();





