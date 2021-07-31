const router = require("express").Router();
const Volunteer = require('../models/volunteer');
const Emergency = require('../models/emergency');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const {volunteerValidation} = require('../helpers/joiValidation');



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

//EMERGENCY ROUTES

router.get("/emergencies/new", (req, res)=>{
    res.render('Emergency/newEmergency');
});

router.post("/emergencies", async (req, res)=>{
    const emergency = new Emergency(req.body);
    
    await emergency.save();

    res.redirect(`/emergencies/${emergency._id}`);
});

router.get("/emergencies/:id", async (req,res)=>{
    const {id} = req.params;

    const emergency = await Emergency.findById(id);

    res.render('Emergency/emergencyDetails', {emergency});
})


   
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
// router.put('/volunteers/:id', (req, res, next)=>{
    //     console.log(req.body);
    //     res.send('PUT REQUEST')
    // });
    
    
    // router.delete('/volunteers/:id', async(req,res)=>{
    //     res.send('Deleting...')
    // })
    
    


module.exports = router;