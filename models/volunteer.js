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
    address:{
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    birthday: {
        type: String
    },
    personalID: {
        type: String
    },
    licenseNR: {
        type: String
    },
    phone: {
        type: Number,
        min: 7,
        required: true
    },
    isBusy: {
        type: Boolean,
        default: false
    },
    hasCar: {
        type: Boolean,
        default: false
    },
    emergency:[
        {
            type: Schema.Types.ObjectId,
            ref: "Emergency"
        }
    ],
    registrationDate:{
        type: Date,
        default: new Date()
    }

    // previousEmergencies: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Emergency"
    //     }
    // ]

});

module.exports = mongoose.model('Volunteer', volunteerSchema);