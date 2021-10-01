const mongoose = require('mongoose');
const {Schema} = mongoose;



const emergencySchema = new Schema({
    city: String,
    street: String,
    description: String,
    isActive:{
        type: Boolean,
        default: false
    },
    completed:{
        type: Boolean,
        default: false
    },
    volunteer: {
        type: Schema.Types.ObjectId,
        ref:"Volunteer"
    },
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    emergencyDate:{
        type: Date,
        default: new Date()
    },
})


module.exports = mongoose.model('Emergency', emergencySchema);
