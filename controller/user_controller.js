const User = require('../models/user');
const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
exports.registerUser=(req,res,next)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    User.find({
        email:email
    }).then(result=>{
        if(!result[0]){
            crypt.hash(password,12).then(hashed=>{
                const user= new User({
                    firstname:firstname,
                    lastname:lastname,
                    dob:dob,
                    gender:gender,
                    email:email,
                    mobile:mobile,
                    password:hashed,
                    follow:{
                        followers:[],
                        following:[]
                    },
                    post:[]
                });
                user.save().then(result=>{
                     res.status(200).json({
                         status:200,
                         error:0,
                         message:"SuccessFully Registered User"
                     })
                }).catch(err=>{
                    if(!err.statusCode){
                        err.statusCode = 422;
                    }
                    err.message = "User Registration Failed";
                    next(err);
                })
            }).catch(err=>{
                if(!err.statusCode){
                    err.statusCode = 422;
                }
                err.message = "User Registration Failed";
                next(err);
            })
           
        }else{
            const err = Error();
            err.statusCode = 422;
            err.message = "Email Already Exist";
            next(err);
        }
    })
   
}
exports.loginUser = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.find({
        email:email
    }).populate({
        path:"follow.following",
        select:"firstname lastname"
    }).populate({
        path:"follow.followers",
        select:"firstname lastname"
    })
    .populate({
        path:"posts",
    }).then(result=>{
        console.log(result);
        if(!result[0]){
            const err = Error();
            err.statusCode = 422;
            err.message = "User Not Exist";
            next(err);
        }else{
            crypt.compare(password,result[0].password).then(pass=>{
                if(pass){

                    const token = jwt.sign({
                        userId: result[0]._id,
                        email:result[0].email
                    },"mysecretkey");
                    res.status(200).json({
                        status:200,
                        error:0,
                        message:"SuccessFully Logged In",
                        access_token: token,
                        user: result
                    })
                }else{
                    const error = Error();
                    error.statusCode = 422;
                    error.message = "Password Not Matched";
                    next(error);
                }
            }).catch(err=>{
                err.statusCode = 422;
                err.message = "Something Went Wrong";
                next(err);
            })
        
        }
    })
}
// exports.getMyTweet = (req,res,next)=>{
   
//   const id= req.body.id;
//   if(id!=req.userId){
//       const error = Error("Invalid Authorization");
//     error.statusCode = 422;
//    throw error;
//   }
//   Tweets.find({userId:id}).then(result=>{
//      res.status(200).json({
//          error:0,
//          status:200,
//          message:"Successfully fetched tweets",
//          tweets: result
//      })
//   }).catch(err=>{
//     err.statusCode = 422;
//     err.message = "Something Went Wrong";
//     next(err);
//   })
// }
exports.deleteAccount = (req,res,next)=>{
    const id = req.body.userId;
    const tokenUserId = req.userId;
    if(tokenUserId!=id){
        const error = Error("UnAuthorized");
        throw error;
    }
    User.findOne({
        _id: id
    }).then(result=>{
        if(!result){
            const error = Error("No User Exist");
            throw error;
        }else{
           User.deleteOne({
               _id:result._id
           }).then(data=>{
              res.status(200).json({
                  status:200,
                  error:0,
                  message:"Account Deleted"
              })
           }).catch(err=>{
            err.message = " Something Went Wrong";
            err.statusCode =422;
            next(err);
           })
        }
    }).catch(err=>{
        err.message = "User Not Found";
        err.statusCode =422;
        next(err);
    })

}
exports.followUser=async(req,res,next)=>{
 const userID = req.body.userId;
 const followUserID = req.body.followUserId;

 try{
    if(req.userId != userID){
        const error = new Error("Invalid Authorization");
        error.statusCode = 422;
        throw error;
    }
    const user =await User.findOne({
        _id:userID
    })
    if(!user){
        const error = new Error("user not found");
        error.statusCode = 422;
        throw error;
    }
    const follow = await User.findOne({
        _id:followUserID
    });
    if(!follow){
        const error = new Error("user not found");
        error.statusCode = 422;
        throw error;
    }
   if(user.follow.following.includes(follow._id)){
    const error = new Error("Already Followed");
    error.statusCode = 422;
    throw error;
   }
    user.follow.following.push(follow._id);
    follow.follow.followers.push(user._id);
    const save = await user.save();
    const followSave = await follow.save();
    const getUser = await User.find({
        _id:userID
    }).populate({
        path:"follow.following",
        select:"firstname lastname"
    }).populate({
        path:"follow.followers",
        select:"firstname lastname"
    });
    res.status(200).json({
        user: getUser
    })
 }catch(error){
     error.statusCode = 422;
     next(error);
 }
 
}