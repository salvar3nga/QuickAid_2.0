const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


const volunteerSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    // address:{
    //     type: String,
        
    // },
    // city: {
    //     type: String
    // },
    // state: {
    //     type: String
    // },
    // postal: {
    //     type: String,
    //     default: 'N/A'
    // },
    // country: {
    //     type: String,
    //     default: 'Guinea-Bissau'
    // },
    phone: {
        type: Number,
        min: 7,
        required: true
    },

});

module.exports = mongoose.model('Volunteer', volunteerSchema);