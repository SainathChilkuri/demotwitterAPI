const express = require('express');
const isAuth = require('../middleware/is-auth');
const userController = require('../controller/user_controller')
const userroute = express.Router();
userroute.post('/registerUser',userController.registerUser);
userroute.post('/login',userController.loginUser);
userroute.post('/followUser',isAuth,userController.followUser);
userroute.post('/deleteMyAccount',isAuth,userController.deleteAccount);
module.exports = userroute;