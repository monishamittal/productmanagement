//--------------------Import Models for using in this module--------------------
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

//--------------------Create Schema--------------------
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [{
            productId: {
                type: ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
        totalPrice: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
    }, { timestamps: true })

//--------------------provides an interface to the database like CRUD operation--------------------
module.exports = mongoose.model('Cart', cartSchema)