const mongoose = require('mongoose');
const {Schema} = mongoose;



const emergencySchema = new Schema({
    description: String,
    city: String,
    street: String,
    // volunteer:[
    //     {
    //         // _id: {id: false},
    //         firstName: String,
    //         lastName: String,
    //         phone: Number
    //     }
    // ]
    volunteer: {
        type: Schema.Types.ObjectId,
        ref:"Volunteer"
    }
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
