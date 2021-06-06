const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check,validationResult } = require('express-validator');
const config= require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@route GET api/auth
//@desc  Test route
//@access Public

const User = require('../../models/User');

router.get('/', auth, async(req,res) =>{
    try{
        const user= await User.findById(req.user.id).select('-password');//this will get everything except password
        res.json(user);

    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

} 
);

//@route POST api/auth
//@desc Authenticate user and get token
//@access Public

router.post('/',[
    check('email','Please include a valid Email').isEmail(),
    check('password','Password is Required').exists()//because when we are loggin in, we just enter email and password
],

async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body; //we just have email and password in the request object
    try{
        //1) We'll check if the user already exists or not 
        //grab the user
        let user= await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({errors:[{ msg: "Invalid Credentials"}] });
        }
        
        // 2) We need to match our Email and password by using compare method in bcrypt
        const isMatch = await bcrypt.compare(password,user.password);//(actualpass,encrypted pass)

        if(!isMatch)
        {
            return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }



        //3) Return a JWT
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



module.exports = router;

