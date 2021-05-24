const mongoose= require('mongoose');
const config = require('config');
const db=config.get('mongoURI');

//connecting DB
const connectDB=async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true, //warning ghalavnya sathi
            useCreateIndex: true,
            useUnifiedTopology: true,
          });
          console.log('MongoDB connected');//tab tak await karna hai jab tak mongoose connect na hojae
    }
    catch(err){
        console.log(err.message);
    //exit process with failure
    process.exit(1);
    }    
}

module.exports=connectDB;

