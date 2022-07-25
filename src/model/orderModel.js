//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;

//................................. Create Schema .........................//
const orderSchema = new mongoose.Schema(
    {
        
    },
    { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("Order", orderSchema);                         //provides an interface to the database like CRUD operation
