const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Profile');
const Profile = require('../../models/User');

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

module.exports = router;
