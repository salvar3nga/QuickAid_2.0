const router = require('express').Router();
const Emergency = require('../models/emergency');
const Volunteer = require('../models/volunteer');
const ExpressError = require('../helpers/ExpressError');
const catchAsync = require('../helpers/catchAsync');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('../models/emergency');
const dotenv = require('dotenv').config();

const mapBoxGeocode = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mapBoxGeocode({accessToken: mapBoxToken});





router.use(methodOverride('_method'));

const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];




//EMERGENCY ROUTES

router.get("/emergencies", async (req,res)=>{
    const emergencies = await Emergency.find({}).populate('volunteer')
    
    res.render('Emergency/emergencies', {emergencies});
})



router.post("/emergencies", async (req, res)=>{

    const geoData = await geocoder.forwardGeocode({
        query: `${req.body.emergency.city}, GW-BS`,
        limit: 1,
    }).send()


    const emergency = new Emergency(req.body.emergency);
    emergency.location = geoData.body.features[0].geometry;
    await emergency.save();

    req.flash('success', 'Successfully created an emergency');

    res.redirect(`/emergencies/${emergency._id}`);
});

router.get("/emergencies/new", (req, res)=>{
    res.render('Emergency/newEmergency', {countries});
});

router.get("/emergencies/:id", async (req,res)=>{
    const {id} = req.params;

    const emergency = await Emergency.findById(id).populate('volunteer');
    res.render('Emergency/emergencyDetails', {emergency});
})

router.get("/emergencies/:id/edit", async(req,res)=>{
    const {id} = req.params;

    const emergency = await Emergency.findById(id);

    res.render('Emergency/editEmergency', {emergency});
});

router.get("/emergencies/:id/volunteers/assign", async (req,res)=>{
    const {id} = req.params;

    const volunteers = await Volunteer.find({});
    // const emergency = await Emergency.findById(id);

    // emergency.volunteer = volunteers;
    // volunteers.emergency = emergency;


    res.render('Emergency/assignVolunteer', {volunteers, id});

});

    //ASSIGN

router.post("/emergencies/:id/volunteers/:vol_id", async (req, res)=>{
    const {id, vol_id} = req.params;

    const emergency = await Emergency.findById(id);
    const volunteer = await Volunteer.findById(vol_id);
    emergency.isActive = true;

    volunteer.emergency.push(emergency);
    emergency.volunteer = volunteer;


    volunteer.isBusy = true;
    
    /* 
        TODO: set availability to false on volunteer etc...
    */
 
    await emergency.save();
    await volunteer.save();

    req.flash('success', 'Successfully assigned');


    res.redirect(`/emergencies/${emergency._id}`);

});

router.put('/emergencies/:id', catchAsync(async(req,res, next)=>{
    const {id} = req.params;

    const updatedEmergency = await Emergency.findByIdAndUpdate(id, {...req.body.emergency});
    
    res.redirect(`/emergencies/${updatedEmergency._id}`);
}));
//Unassign
router.put('/emergencies/:id/volunteers/:vol_id', catchAsync(async(req,res, next)=>{
    const {id, vol_id} = req.params;

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(vol_id, {$pull:{emergency: id}});
    
    updatedVolunteer.isBusy = false;
    const emergency = await Emergency.findById(id);
    emergency.volunteer = undefined;
    emergency.isActive = false;
    
    await emergency.save();
    await updatedVolunteer.save();


    res.redirect(`/emergencies/${emergency._id}`);
    
}));

router.delete('/emergencies/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;

     await Emergency.findByIdAndDelete(id);

    res.redirect('/emergencies');
}));



module.exports = router;

