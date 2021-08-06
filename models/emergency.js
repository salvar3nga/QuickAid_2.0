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

/* 
    FOR ADDING IN A VOLUNTEER TO THE EMERGENCY 

    const makeEmergency = async()=>{
        const em = new Emergency({
            description: 'Bla bla bla',
            city: 'Bla',
            street: 'Bla Bla Bla',
        })

        //IMPORTANT LINE
        em.volunteer.push({
            firstName: 'Raul',
            lastName: 'Börger',
            phone: 12345678
        })
        const savedEmergency = em.save();
    }

    or

    const user = await User.findById(id);
    user.addresses.push({})...
    ...
*/

module.exports = mongoose.model('Emergency', emergencySchema);
