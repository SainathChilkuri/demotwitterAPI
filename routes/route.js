const express = require('express');
const isAuth = require('../middleware/is-auth')
const controller = require('../controller/tweet_controller');
const rout = express.Router();
rout.get('/getAllTweet',isAuth,controller.getAllTweet);
rout.post('/postTweet',isAuth,controller.createTweet);
rout.post('/getSingleTweet',isAuth,controller.getSingleTweet);
rout.post('/editTweet',isAuth,controller.editTweet)
rout.post('/deleteTweet',isAuth,controller.deleteTweet)
module.exports = rout;