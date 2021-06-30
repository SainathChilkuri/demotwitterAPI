const express = require('express');
const helmet = require('helmet');   
const app = express();
app.use(helmet());
const mongoose = require('mongoose');
const router = require('./routes/route');
const uroute = require('./routes/user_route')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Methods',"POST, GET, PUT, DELETE");
    res.setHeader('Access-Control-Allow-Headers',"Content-Type, Authorization");
    next();
})
app.use('/v1/posts',router);
app.use('/v1/users',uroute);
app.use('/',(req,res,next)=>{
    const err=Error("Route Not Found");
    err.status = 501;
   throw err;
})
app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        status:status,
        error:1,
        message:message
    })
})
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tweetcluster.zm3c5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(result=>{
    console.log(result);
    app.listen(process.env.PORT|| 3000);
}).catch(err=>{
    console.log(err);
})
