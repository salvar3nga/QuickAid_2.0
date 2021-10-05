const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;


const UserSchema = new Schema({
    name: String,
    phone: Number,
    superAdmin:{
        type: Boolean,
        default: false
    },
    created:{
        type: Date,
        default: new Date()
    },
    address:{
        type: String,
    },
    city: {
        type: String
    },

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);