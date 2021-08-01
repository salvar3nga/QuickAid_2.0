const mongoose = require('mongoose');

const {Schema} = mongoose;


const volunteerSchema = new Schema({
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
    emergency:[
        {
            type: Schema.Types.ObjectId,
            ref: "Emergency"
        }
    ],

    // previousEmergencies: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Emergency"
    //     }
    // ]

});

module.exports = mongoose.model('Volunteer', volunteerSchema);