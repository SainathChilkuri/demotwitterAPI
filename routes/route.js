const express = require('express');
const isAuth = require('../middleware/is-auth')
const controller = require('../controller/post_controller');
const rout = express.Router();
rout.post('/createPost',isAuth,controller.createPost);
rout.post('/feeds',isAuth,controller.getAllPost);
rout.post('/likePost',isAuth,controller.likePost);
rout.post('/commentPost',isAuth,controller.commentPost);
// rout.post('/editTweet',isAuth,controller.editTweet)
// rout.post('/deleteTweet',isAuth,controller.deleteTweet)
module.exports = rout;