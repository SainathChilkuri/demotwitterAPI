const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image:{
        type: String,
        required: true
    },
    caption:{
        type: String,
        required:true
    },
    likes:{
        type:Number,
        required:true
    },
    comments:[
        {
            author:{
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: false
            },
            comment:{
                type: String,
                required: false
            }
        }
    ]
},{
    timestamps:true
})
module.exports = mongoose.model('Post',postSchema);