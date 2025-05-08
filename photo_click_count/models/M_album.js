const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    photo_name:{
        type:String
    },
    photo_description:{
        type:String,
        default:null
    },
    photo_url:{
        type:String
    },
    total_view:{
        type:Number,
        default:0
    },
    total_like:{
        type:Number,
        default:0
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const album = mongoose.model('album', albumSchema);
module.exports=album;  //export the model
