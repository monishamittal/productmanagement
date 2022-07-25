//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;

//................................. Create Schema .........................//
const productSchema = new mongoose.Schema(
    {
        
  title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
    },
    { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("Product", productSchema);                         //provides an interface to the database like CRUD operation
