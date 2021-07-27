const router = require("express").Router();
const Volunteer = require('../Models/volunteer');




router.get("/", (req, res)=>{

    res.redirect('/dashboard')
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


router.get('/volunteers', async (req,res)=>{
    //Query for all volunteers    
    const volunteers = await Volunteer.find({});
    res.render('volunteers', {volunteers});
});

// Form to create a new volunteer
router.get('/volunteers/new', (req,res)=>{

    res.render('newVolunteer');
});

router.post('/volunteers', async (req, res)=>{
    const {name, lastName, phone} = req.body;

    const newVolunteer = new Volunteer({
        firstName: name,
        lastName: lastName,
        phone: phone
    });

    await newVolunteer.save();

    res.redirect(`/volunteers/${newVolunteer._id}`);

});


router.get('/volunteers/:id', async(req,res)=>{
    const {id} = req.params;
    // Volunteer.findOne({_id: id});
    const volunteer = await Volunteer.findById(id);
    res.render('volunteerDetails', {volunteer});
});
router.delete('/volunteers/:id', async(req,res)=>{
    res.send('Deleting...')
})

router.get('/volunteers/:id/edit', async (req,res)=>{
    const {id} = req.params;
    const volunteer = await Volunteer.findById(id);
    res.render('editVolunteer', {volunteer});
});

/* PUT and DELETE REQUESTS ARE CURRENTLY SERVED ON INDEX JS */
// router.put('/volunteers/:id', (req, res, next)=>{
//     console.log(req.body);
//     res.send('PUT REQUEST')
// });






module.exports = router;