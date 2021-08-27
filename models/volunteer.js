const mongoose = require('mongoose');

const {Schema} = mongoose;
const Emergency = require('./emergency');


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
    emergencyClosed: {
        type: Number,
        default: 0
    },
    emergency:[
        {
            type: Schema.Types.ObjectId,
            ref: "Emergency"
        }
    ],
    previousEmergencies:[
        {
            type: Schema.Types.ObjectId,
            ref: "Emergency"
        }
    ],
    registrationDate:{
        type: Date,
        default: new Date()
    }

});

// Delete all previous emergencies after a volunteer has been removed
volunteerSchema.post('findOneAndDelete', async function(volunteer){
    if(volunteer){
        await Emergency.deleteMany({
            _id:{
                $in: volunteer.previousEmergencies
            }
        })
    }
})

module.exports = mongoose.model('Volunteer', volunteerSchema);