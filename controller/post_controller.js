
const Post = require('../models/post')
const User = require('../models/user')
exports.getAllPost = async(req,res,next) =>{
    const id =req.body.userId;
    try{
        if(req.userId != id){
            const error = new Error("Invalid Authorization");
            error.statusCode = 422;
            throw error;
        }
        const feed =  await Post.find().populate({
            path:'creator',
            select:'firstname lastname'
        });
        res.status(200).json({
            status:200,
            error:0,
            message: "Successfully fetched Posts",
            posts:feed
        })
    }catch(error){
        next(error);
    }  
}
exports.createPost = async(req,res,next)=>{
    const image = req.body.image;
    const caption = req.body.caption;
    const id = req.body.userId;
  
    try{
        const post = new Post({
            creator:id,
            image:image,
            caption:caption,
            likes:0,
            comments:[]
        })
        if(req.userId != id){
            const error = new Error("Invalid Authorization");
            error.statusCode = 422;
            throw error;
        }
        
        const user= await User.findOne({_id:id});
        if(!user){
            const error = new Error("User Not Found");
            error.statusCode = 422;
            throw error;
        }
        const save= await post.save();
        user.posts.push(save._id);
         await user.save();
         const updatedUser = await User.findOne({_id:id}).populate({
            path:"posts",
        })
            res.status(201).json({
                message:"Data Found",
                error:0,
                status: 200,
                post:updatedUser
            });
    }catch(error){

        next(error);
    }
}
exports.likePost = async(req,res,next)=>{
    const userId = req.body.userId;
    const postId = req.body.postId;
    try{
      if(req.userId != userId){
        const error = new Error("Invalid Authorization");
        error.statusCode = 422;
        throw error;
      }
      const post = await Post.findOne({
          _id:postId
      });
      post.likes = post.likes + 1;
      const result = await post.save();
      res.status(200).json({
        message:"Liked the Post",
        error:0,
        status: 200,
        post:result
      })
      
    }catch(error){
        next(error);
    }
}
exports.commentPost =async(req,res,next)=>{
const userId = req.body.userId;
const postId = req.body.postId;
const comment = req.body.comment;
try{
    if(req.userId != userId){
        const error = new Error("Invalid Authorization");
        error.statusCode = 422;
        throw error;
      }
    const post = await Post.findOne({
        _id:postId
    });
    post.comments.push({
        author: userId,
        comment: comment
    })
    const save = await post.save();
    res.status(200).json({
        message:"comment done",
        error:0,
        status: 200,
        post:save
    })
}catch(error){
    next(error);
}
}
// exports.editTweet =(req,res,next)=>{
//     const descrption = req.body.description;
//     const title = req.body.title;
//     const id = req.body.id;
//     Tweets.findById({_id:id}).then(result=>{
//         if(!result){
//             res.status(200).json({
//                 status:200,
//                 error:0,
//                 message: "No Data Found"
//             })
//         }else{
//             if(title!=""){
//                 result.title = title;
//             }
//             result.description = descrption;
//             result.save().then(result=>{
//                 res.status(200).json({
//                     status:200,
//                     error:0,
//                     message: "Data Updated"
//                 })
//             }).catch(err=>{
//                 if(!err.statusCode){
//                     err.statusCode = 422;
//                 }
//                 err.message = "Something Went Wrong";
//                 next(err);
//             })
//         }
//     }).catch(err=>{
//         if(!err.statusCode){
//             err.statusCode = 422;
//         }
//         err.message = "Something Went Wrong";
//         next(err);
//     })
// }
// exports.deleteTweet= (req,res,next)=>{
//   const id = req.body.id;
//   Tweets.findById({
//       _id:id
//   }).then(result=>{
//       if(result){
//           Tweets.findByIdAndRemove({_id:id}).then(result=>{
//             res.status(200).json({
//                 status:200,
//                 error:0,
//                 message: "Removed Successfully"
//               })
//           }).catch(err=>{
//             if(!err.statusCode){
//                 err.statusCode = 422;
//             }
//             err.message = "Something Went Wrong";
//             next(err);
//           })
//       }else{
//         res.status(200).json({
//             status:200,
//             error:0,
//             message: "No Data Found"
//           })
//       }
//   }).catch(err=>{
//     if(!err.statusCode){
//         err.statusCode = 422;
//     }
//     err.message = "Something Went Wrong";
//     next(err);
//   })
// }