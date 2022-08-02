//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,

    },
    currencyId: {
      type: String,
      required: true,
    },
    currencyFormat: {
      type: String,
      required: true,
    },
    isFreeShipping: {
      type: Boolean,
      default: false
    },
    productImage: {
      type: String,
      required: true
    },
    style: {
      type: String,
    },
    availableSizes: {
      type: [String],
      enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    installments: {
      type: Number
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

//........................................exporting Schema..................................//
module.exports = mongoose.model("Product", productSchema);                         //provides an interface to the database like CRUD operation
