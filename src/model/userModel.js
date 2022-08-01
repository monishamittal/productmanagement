//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const userSchema = new mongoose.Schema({
    fname: {
        type:String, 
        required:true
    },
    lname: {
        type:String, 
        required:true
    },
    email: {
        type:String, 
        required:true, 
        valid:true, 
        unique:true},
    profileImage: {
        type:String, 
        required:true
    },                          // s3 link
    phone: {
        type:String, 
        required:true, 
        unique:true, 
        valid:true 
    }, 
    password: {
        type:String, 
        required:true
    },                   // encrypted password
    address: {
      shipping: {
        street: {type:String, required:true},
        city: {type:String, required:true},
        pincode: {type:Number, required:true}
      },
      billing: {
        street: {type:String, required:true},
        city: {type:String, required:true},
        pincode: {type:Number, required:true}
      },
    },
    
    },{ timestamps: true });


module.exports = mongoose.model("User", userSchema);                         //provides an interface to the database like CRUD operation