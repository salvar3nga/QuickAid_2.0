const router = require('express').Router();
const Emergency = require('../models/emergency');
const Volunteer = require('../models/volunteer');
const ExpressError = require('../helpers/ExpressError');
const catchAsync = require('../helpers/catchAsync');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('../models/emergency');
const {isLoggedIn} = require('../helpers/middleware');

const dotenv = require('dotenv').config();

const mapBoxGeocode = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mapBoxGeocode({accessToken: mapBoxToken});





router.use(methodOverride('_method'));





//EMERGENCY ROUTES

router.get("/emergencies", isLoggedIn, async (req,res)=>{
    const emergencies = await Emergency.find({}).populate('volunteer')
    
    res.render('Emergency/emergencies', {emergencies});
})



router.post("/emergencies", isLoggedIn, async (req, res)=>{

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

router.get("/emergencies/new", isLoggedIn, (req, res)=>{
    res.render('Emergency/newEmergency');
});

router.get("/emergencies/:id", isLoggedIn, async (req,res)=>{
    const {id} = req.params;

    const emergency = await Emergency.findById(id).populate('volunteer');
    res.render('Emergency/emergencyDetails', {emergency});
})

router.get("/emergencies/:id/edit", isLoggedIn, async(req,res)=>{
    const {id} = req.params;

    const emergency = await Emergency.findById(id);

    res.render('Emergency/editEmergency', {emergency});
});

router.get("/emergencies/:id/volunteers/assign", isLoggedIn, async (req,res)=>{
    const {id} = req.params;

    const volunteers = await Volunteer.find({});
    // const emergency = await Emergency.findById(id);

    // emergency.volunteer = volunteers;
    // volunteers.emergency = emergency;


    res.render('Emergency/assignVolunteer', {volunteers, id});

});

    //ASSIGN

router.post("/emergencies/:id/volunteers/:vol_id", isLoggedIn, async (req, res)=>{
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

router.put('/emergencies/:id', isLoggedIn, catchAsync(async(req,res, next)=>{
    const {id} = req.params;

    const updatedEmergency = await Emergency.findByIdAndUpdate(id, {...req.body.emergency});
    
    res.redirect(`/emergencies/${updatedEmergency._id}`);
}));
//Unassign
router.put('/emergencies/:id/volunteers/:vol_id', isLoggedIn, catchAsync(async(req,res, next)=>{
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

router.delete('/emergencies/:id', isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;

     await Emergency.findByIdAndDelete(id);

    res.redirect('/emergencies');
}));



module.exports = router;

