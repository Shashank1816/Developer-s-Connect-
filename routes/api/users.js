const express = require ('express');
const User=require('../../models/User');//we require our model
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check,validationResult } = require('express-validator');
const config= require('config');

const router = express.Router();

//@route POST api/users
//@desc  Register User
//@access Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid Email').isEmail(),
    check('password','Enter atleast 6 characters').isLength({min:6}),
],

async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password} = req.body;
    try{
        //1) We'll check if the user already exists or not 
        //grab the user
        let user= await User.findOne({email});
        if(user)
        {
            return res.status(400).json({errors:[{ msg: "User already Exists"}] });
        }
        

        //2) Now we'll get the user's gravatar (first we require gravatar package)
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });

        user= new User({
            name,email,avatar,password
        });//this is not saved in the database untill now 


        //3) Now we need to encrypt the password, for that we require bcrypt
        //for encrypting we need a salt
        const salt=await bcrypt.genSalt(10);
        //Now we need the password and hash it 
        user.password = await bcrypt.hash(password,salt);
        await user.save();


        //4)Return a JWT
        //firstly, we'll create our payload
        const payload={
            user:{
                id:user.id
            }
        };

        //now we'll sign the token passing the payload, a secret that's in the default.json and an expiration date which is optional

        jwt.sign(payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err,token)=>{
                if(err)throw err;
                res.json({token});
            }
        );
       
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
    

module.exports=router;
