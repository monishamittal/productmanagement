//--------------------Import Models for using in this module--------------------
const mongoose = require("mongoose");

//-------------------------Create Schema--------------------
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        valid: true,
        unique: true,
        trim: true
    },

    profileImage: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        valid: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        shipping: {
            street: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            pincode: {
                type: Number,
                required: true,
                trim: true
            }
        },
        billing: {
            street: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            pincode: {
                type: Number,
                required: true,
                trim: true
            }
        },
    },
}, { timestamps: true });

//--------------------provides an interface to the database like CRUD operation-------------------- 
module.exports = mongoose.model("User", userSchema);                     