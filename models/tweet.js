const { SchemaType } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tweetModel = new Schema({
    userId:{
       type: Object,
       required:true
        
    },
   title:{
       type: String,
       required:true
   },
   description:{
       type:String,
       required:true
   },
   tags:{
       type:Array,
       required:true,
   },
},{timestamps:true});
module.exports = mongoose.model('Tweets',tweetModel);