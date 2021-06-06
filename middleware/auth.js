const jwt=require('jsonwebtoken');
const config= require('config');

module.exports = function(req,res,next){
    //1) get token from the header
    const token= req.header('x-auth-token');//hum token request ke header me hi bhejenge toh wahan check karna hai 

    //2) check if no token
    if(!token)
    {
        return res.status(401).json({msg:'No token, authorization denied'});
    }

    //3) if token is present, then we need to verify that token
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));//this will decode the token

        req.user = decoded.user;//now we need to take the request object and assign the value to the user
        //now we can use this req.user in any of our protected routes
        next();
    }catch(err)
    {
        res.status(401).json({msg: 'Token is not valid'});
    }
};