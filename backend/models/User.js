const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId:{type: String, unique: true,sparse:true}, //for Google users
    email:{type:String,required: true,unique:true,sparse: true},
    password: {type:String},
    name:{type: String},
    createdAt: {type:Date,default: Date.now}
});
module.exports = mongoose.model("User",userSchema);