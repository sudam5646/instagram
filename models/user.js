const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dpyh4930b/image/upload/v1611152113/no_photo_tk9l2h.png"
    },
    followers : [{type:ObjectId,ref:"User"}],
    following : [{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)