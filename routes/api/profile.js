const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Profile');
const Profile = require('../../models/User');
const {check,validationResult} = require('express-validator');

//@route GET api/profile/me
//@desc  Get current user's profile
//@access Private
router.get('/me',auth,async(req,res) => {
    try{
        //we want to populate this with the name of the user and his avatar, and those things are in the user model not in the profile model, 
        //so we'll use populate method to add those stuff to this query
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name', 'avatar']);
        //check for profile
        if(!profile)
        {
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);

    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//Here, we are goint to create the route to actually create or update a profile 
//It's gonna be a POST request that takes in some data, so we need out express-validator as well

//@route POST api/profile
//@desc  Create or Update a user's profile
//@access Private
router.post('/',[auth, 
    check('status','Status is Required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
],
async(req,res) =>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin} = req.body;
    //now we need to check whether these particular fields are filled or not before submitting to the database
    //Build profile object
    const profileFields = {};
    profileFields.user=req.user.id;
    if(company)profileFields.company=company;
    if(website)profileFields.website=website;
    if(location)profileFields.location=location;
    if(bio)profileFields.bio=bio;
    if(status)profileFields.status=status;
    if(githubusername)profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(skill => skill.trim());
    }
    console.log(profileFields.skills);
    res.send("Hello!");//Dummy response
}
);

module.exports = router;
