//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const productSchema = new mongoose.Schema(
    {
        
  title: {
    type:String,
    required:true,
    unique:true,
    trim:true
},
  description: {
    type:String,
    required:true,
    trim:true
},
  price: {
    type:Number, 
    required:true,
    trim:true

},
  currencyId: {
    type:String,
    required:true,
    trim:true
    //  INR
    },
  currencyFormat: {
    type:String,
    required:true,
    trim:true
    },
  isFreeShipping: {
    type:Boolean,
    default: false,
    trim:true
},
  productImage: {
    type:String,
    required:true,
    trim:true
},  // s3 link
  style: {
    type:String,
    trim:true
  },
  availableSizes: {
    type:[String],
    //  at least one size,
      enum:["S", "XS","M","X", "L","XXL", "XL"],
      //lowerCase:true
     
      trim:true
    },
  installments: {
    type:Number,
    trim:true
},
  deletedAt: {
    type:Date,
    //  when the document is deleted
    }, 
  isDeleted: {
    type:Boolean,
     default: false
},
    },
    { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("Product", productSchema);                         //provides an interface to the database like CRUD operation
