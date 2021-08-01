const router = require("express").Router();
const Volunteer = require('../models/volunteer');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
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


   
// VOLUNTEER ROUTES
router.get("/", (req, res)=>{

    res.redirect('/volunteers')
})

router.get('/dashboard', (req, res)=>{
    res.render('dashboard');
})

router.get("/login", (req, res)=>{
    
    res.render('login')
})

router.post('/login', (req, res)=>{
    const {username, password} = req.body;

    if(!(username == admin.username) && (password == admin.password)){
        console.log(`${username} ,${admin.username}, ${password}, ${admin.password}`);
        res.send("not loggged in");
    }
    else{
        console.log(`${username} ,${admin.username}, ${password}, ${admin.password}`);
        //res.render('dashboard');
    }
   
})


router.get('/volunteers', catchAsync(async (req,res)=>{
    //Query for all volunteers    
    const volunteers = await Volunteer.find({});
    res.render('Volunteer/volunteers', {volunteers});
}));

// Form to create a new volunteer
router.get('/volunteers/new', (req,res)=>{

    res.render('Volunteer/newVolunteer');
});

router.post('/volunteers', validateVolunteer, catchAsync(async (req, res)=>{
    
   
    const newVolunteer = new Volunteer(req.body.volunteer);

    await newVolunteer.save();

    res.redirect(`/volunteers/${newVolunteer._id}`);

}));


router.get('/volunteers/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    // Volunteer.findOne({_id: id});
    const volunteer = await Volunteer.findById(id);
    res.render('Volunteer/volunteerDetails', {volunteer});
}));

router.get('/volunteers/:id/edit', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const volunteer = await Volunteer.findById(id);
    res.render('Volunteer/editVolunteer', {volunteer});
}));

/* PUT and DELETE REQUESTS ARE CURRENTLY SERVED ON INDEX JS */

router.put('/volunteers/:id', catchAsync(async (req, res, next) =>{
    const {id} = req.params;

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, {...req.body.volunteer})


    res.redirect(`/volunteers/${updatedVolunteer._id}`);
}));


router.delete('/volunteers/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;

    const deletedVolunteer = await Volunteer.findByIdAndDelete(id);

    res.redirect('/volunteers');
}));
    
    


module.exports = router;