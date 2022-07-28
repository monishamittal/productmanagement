const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');

const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidNumber } = require('../validation/valid')



// const getCart = async (req, res) =>{
//     try {
//       let userId = req.params.userId;
  
//       //checking if the cart exist with this userId or not
//       let findCart = await Cart.findOne({ userId: userId }).populate('items.productId');
//       if(!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });
  
//       res.status(200).send({ status: true, message: "Success", data: findCart })
//     } catch (err) {
//       res.status(500).send({ status: false, error: err.message })
//     }
//   }


// const deleteCart = async (req, res) =>{
//     try {
//       let userId = req.params.userId;
  
//       //checking if the cart exist with this userId or not
//       let findCart = await Cart.findOne({ userId: userId });
//       if(!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });
  
//       //checking for an empty cart
//       if(findCart.items.length == 0) return res.status(400).send({ status: false, message: "Cart is already empty" });
  
//       await cartModel.updateOne(
//         {_id: findCart._id},
//         {items: [], totalPrice: 0, totalItems: 0},
//       )
  
//       res.status(204).send({ status: true, message: "Success"})
//     } catch (err) {
//       res.status(500).send({ status: false, error: err.message })
//     }
//   }




// module.exports = { createCart, updateCart,getCart ,deleteCart}