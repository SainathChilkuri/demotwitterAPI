const express = require('express');
const app = express();
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
app.use('/v1/tweets',router);
app.use('/v1/user',uroute);
app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        status:status,
        error:1,
        message:message
    })
})
mongoose.connect('mongodb+srv://sainath:SAI0000300003@tweetcluster.zm3c5.mongodb.net/tweetsDB?retryWrites=true&w=majority').then(result=>{
    console.log(result);
    app.listen(3000);
}).catch(err=>{
    console.log(err);
})
