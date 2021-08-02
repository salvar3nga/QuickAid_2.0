const router = require('express').Router();
const Emergency = require('../models/emergency');
const Volunteer = require('../models/volunteer');
const ExpressError = require('../helpers/ExpressError');
const catchAsync = require('../helpers/catchAsync');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));




//EMERGENCY ROUTES

router.get("/emergencies", async (req,res)=>{
    const emergencies = await Emergency.find({}).populate('volunteer')
    
    res.render('Emergency/emergencies', {emergencies});
})



router.post("/emergencies", async (req, res)=>{
    const emergency = new Emergency(req.body.emergency);
    
    await emergency.save();

    res.redirect(`/emergencies/${emergency._id}`);
});

router.get("/emergencies/new", (req, res)=>{
    res.render('Emergency/newEmergency');
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


router.post("/emergencies/:id/volunteers/:vol_id", async (req, res)=>{
    const {id, vol_id} = req.params;

    const emergency = await Emergency.findById(id);
    const volunteer = await Volunteer.findById(vol_id);
    emergency.isActive = true;

    volunteer.emergency.push(emergency);
    emergency.volunteer = volunteer;
    
    /* 
        TODO: set availability to false on volunteer etc...
    */
 
    await emergency.save();
    await volunteer.save();

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

    const emergency = await Emergency.findById(id);
    const volunteer = await Volunteer.findById(vol_id);

    emergency.volunteer = undefined;
    emergency.isActive = false;

    volunteer.emergency = undefined;
    
    await emergency.save();
    await volunteer.save();


    res.redirect(`/emergencies/${emergency._id}`);
    
}));

router.delete('/emergencies/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;

     await Emergency.findByIdAndDelete(id);

    res.redirect('/emergencies');
}));



module.exports = router;

