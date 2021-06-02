const Tweets = require('../models/tweet');
exports.getAllTweet = (req,res,next) =>{
    console.log("dd");
    Tweets.find().then(result=>{
       res.status(200).json({
           message:"Data Found",
           error:0,
           result:result
       })
    }).catch(err=>{
        res.status(422).json({
            message:"Error",
            error:1,
            status:422
        });
    })
   
}
exports.createTweet = (req,res,next)=>{
    
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;
    const id =req.body.userId;
    const tweet = new Tweets({
        userId:id,
        title:title,
        description:description,
        tags:tag
    })
    console.log(tweet);
    
    tweet.save().then(result=>{
        res.status(201).json({
            message:"Data Found",
            error:0,
            status: 200,
            post:result
        });
    }).catch(err=>{
       if(!err.statusCode){
           err.statusCode = 422;
       }
       err.message = "Failed to post Tweet";
       next(err);
    })
    
}
exports.getSingleTweet =(req,res,next)=>{
    const id = req.body.id;
     Tweets.findById({_id:id}).then(result=>{
        if(!result){
            res.status(200).json({
                status:200,
                error:0,
                message: "No Data Found"
            })
        }else{
            res.status(200).json({
                status:200,
                error:0,
                message: "Data Found",
                result: result
            })
        }
     }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 422;
        }
        err.message = "Something Went Wrong";
        next(err);
    })
}
exports.editTweet =(req,res,next)=>{
    const descrption = req.body.description;
    const title = req.body.title;
    const id = req.body.id;
    Tweets.findById({_id:id}).then(result=>{
        if(!result){
            res.status(200).json({
                status:200,
                error:0,
                message: "No Data Found"
            })
        }else{
            if(title!=""){
                result.title = title;
            }
            result.description = descrption;
            result.save().then(result=>{
                res.status(200).json({
                    status:200,
                    error:0,
                    message: "Data Updated"
                })
            }).catch(err=>{
                if(!err.statusCode){
                    err.statusCode = 422;
                }
                err.message = "Something Went Wrong";
                next(err);
            })
        }
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 422;
        }
        err.message = "Something Went Wrong";
        next(err);
    })
}
exports.deleteTweet= (req,res,next)=>{
  const id = req.body.id;
  Tweets.findById({
      _id:id
  }).then(result=>{
      if(result){
          Tweets.findByIdAndRemove({_id:id}).then(result=>{
            res.status(200).json({
                status:200,
                error:0,
                message: "Removed Successfully"
              })
          }).catch(err=>{
            if(!err.statusCode){
                err.statusCode = 422;
            }
            err.message = "Something Went Wrong";
            next(err);
          })
      }else{
        res.status(200).json({
            status:200,
            error:0,
            message: "No Data Found"
          })
      }
  }).catch(err=>{
    if(!err.statusCode){
        err.statusCode = 422;
    }
    err.message = "Something Went Wrong";
    next(err);
  })
}