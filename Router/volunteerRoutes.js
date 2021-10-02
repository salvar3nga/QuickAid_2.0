const router = require("express").Router();
const Volunteer = require('../models/volunteer');
const Emergency = require('../models/emergency');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const {isLoggedIn} = require('../helpers/middleware');
const {volunteerValidation} = require('../helpers/joiValidation');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));


const validateVolunteer = (req, res, next)=>{

        
    
    const {error} = volunteerValidation.validate(req.body);
    
    if(error){
        console.log(error);
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

const states = [
    'bafata','biombo',
    'bissau','bolama',
    'cacheu', 'gabu', 
    'oio', 'quinara', 'tombali'];

   
// VOLUNTEER ROUTES
router.get("/", (req, res)=>{

    res.redirect('/volunteers')
})


router.get('/volunteers', isLoggedIn, catchAsync(async (req,res)=>{
    //Query for all volunteers    
    const volunteers = await Volunteer.find({});
    res.render('Volunteer/volunteers', {volunteers});
}));

// Form to create a new volunteer
router.get('/volunteers/new', isLoggedIn, (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'Something went wrong, please sign in!')
        return res.redirect('/login');
    }
    res.render('Volunteer/newVolunteer', {states});
});

router.post('/volunteers', isLoggedIn, validateVolunteer, catchAsync(async (req, res)=>{
    
    
    const newVolunteer = new Volunteer(req.body.volunteer);
    
    await newVolunteer.save();

    req.flash('success', 'Successfully created a new volunteer');

    res.redirect(`/volunteers/${newVolunteer._id}`);

}));


router.get('/volunteers/:id', isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params;

    // const volunteer = await Volunteer.findById(id).populate('emergency');

    // if(!volunteer){
    //     req.flash('error', 'Volunteer not found');
    //     res.redirect('/volunteers');    
    // }else{
    //     res.render('Volunteer/volunteerDetails', {volunteer});
    // }


    try{
        const volunteer = await Volunteer.findById(id)
        .populate('emergency')
        .populate('previousEmergencies');

        res.render('Volunteer/volunteerDetails', {volunteer});
    }catch(err){
        req.flash('error', 'Volunteer not found');
        res.redirect('/volunteers');    

    }
    
       
    

}));

router.get('/volunteers/:id/edit', isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const volunteer = await Volunteer.findById(id);
    res.render('Volunteer/editVolunteer', {volunteer, states});
}));

/* PUT and DELETE REQUESTS ARE CURRENTLY SERVED ON INDEX JS */

router.put('/volunteers/:id', isLoggedIn, catchAsync(async (req, res, next) =>{
    const {id} = req.params;

    try{
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, {...req.body.volunteer})

        req.flash('success', 'Successfully updated volunteer');
    
        res.redirect(`/volunteers/${updatedVolunteer._id}`);
    }catch(err){
        req.flash('error', 'Volunteer not found');
        res.redirect('/volunteers');    

    }

}));


router.delete('/volunteers/:id', isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;


    //TODO: Delete all previous emergencies as well
    
    const deletedVolunteer = await Volunteer.findByIdAndDelete(id);

    res.redirect('/volunteers');
}));
    

router.post('/volunteers/:id/emergencies/:em_id', isLoggedIn, catchAsync(async(req,res)=>{
    const {id, em_id} = req.params;
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, {$pull:{emergency:em_id}});
    const emergency = await Emergency.findById(em_id);

    emergency.isActive = false;
    emergency.completed = true;

    updatedVolunteer.isBusy = false;
    updatedVolunteer.previousEmergencies.push(emergency);
    updatedVolunteer.emergencyClosed +=1;


    await emergency.save();
    await updatedVolunteer.save();

    res.redirect('/emergencies');

    
}))
    


module.exports = router;