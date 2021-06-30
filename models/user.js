const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    follow:{
        followers: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
            }
        ],
        following: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
            }
        ],
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: false
        }
    ]
},{timestamps:true});
module.exports = mongoose.model("User",userSchema);