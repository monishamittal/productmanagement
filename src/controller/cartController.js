const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const cartModel = require('../model/cartModel');

const { isValidObjectId } = require('../validation/valid')

// --------------------------------CREATE CART API ----------------------------------
const createCart = async function (req, res) {
    try {        
        let userId = req.params.userId
        if(!isValidObjectId(userId)){return res.status(404).send({ status: false, message: "Invalid UserId" })}

// -------------------------------DB CALL FOR CHECKING USERID FROM USERMODEL------------------
        let checkId = await userModel.findById(userId)
        if (!checkId)
            return res.status(200).send({ status: true, msg: "Not ok" })

        let cart = req.body
        let { productId } = cart
        if (Object.keys(cart).length < 1) { return res.status(400).send({ status: false, message: "create cart" }) }
        if(!isValidObjectId(productId)){return res.status(404).send({ status: false, message: "Invalid productId" })}
        
// -------------------------------DB CALL FOR CHECKING PRODUCTID FROM PRODUCTMODEL------------------
        let productIdNew = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productIdNew) {
            return res.status(200).send({ status: true, msg: "Not ok productId" })
        }

// -------------------------------TO CREATE A NEW CART-----------------
        let arr1=[]
        let products = {
            productId:productId,
            quantity:1
        }
        arr1.push(products)
        let priceCalculated = productIdNew.price * products.quantity

// -------------------------------IF CART IS NOT CREATED OF A PARTICULAR USER IT WILL CREATE IT-----------------
        let cartData = await cartModel.findOne({ userId: userId })
        if (!cartData) {
            let createCart = {
                userId: userId, items:arr1,
                totalPrice: priceCalculated , totalItems: 1
            }
            let saveData = await cartModel.create(createCart)
            return res.status(201).send({ status: true, msg: "newcart", data: saveData })
        }

// -------------------------------WHEN CART IS ALREADY CREATED IT WILL UPDATE THE CART BY ITEMS(PRODUCT,QUANTITY,PRICE,ITEMS)------------------
        if (cartData) {
            let arr2= cartData.items
            let productAdded = {
                productId:productId,
                quantity:1
            }

// ------------------------------COMPARE THE PRODUCTID IF NOT PRESENT IT WILL CREATE ONE IF PRESENT IT WILL UPDATE THE QUANTITY------------------
            let compareProductId = arr2.findIndex((obj) => obj.productId == productId);
            if (compareProductId == -1) {
                arr2.push(productAdded)
            } else {
                arr2[compareProductId].quantity += 1;
            }

            let priceUpdated = cartData.totalPrice + (productIdNew.price * products.quantity)
            let itemsUpdated = arr2.length

// -------------------------------CREATE THE UPDATED CART------------------
            let createCartNew = {
                items:arr2,
                totalPrice: priceUpdated, totalItems: itemsUpdated
            }
            let saveData = await cartModel.findOneAndUpdate({ userId: userId }, createCartNew, { new: true })
            return res.status(201).send({ status: true, msg: "addcart", data: saveData })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// ===================================================

const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let {productId,cartId,} = req.body

        //checking for a valid user input
        let findCart = await cartModel.findOne({ userId: userId });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this userId` });

        //cheaking the catId is valid or not

        if (isValid(cartId)) {
            return res.status(400).send({ status: false, message: "Enter a valid cartId" });
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Enter a valid cartId" });
        }

        //checking if productId exist or not in Product Collection
        let checkProduct = await productModel.findById({ _id: productId });
        if (!checkProduct) return res.status(404).send({ status: false, message: 'No product found with this productId' });

        //checking if productId exist or not in Cart Collection
        let checkProductId = await cartModel.findOne({ _id: findCart._id, 'productId': { $in: productId } });
        if (!checkProductId) return res.status(404).send({ status: false, message: 'No product found in the cart with this productId' });



    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
// ===================================================================================
const getCart = async (req, res) => {
    try {
        let userId = req.params.userId;

        //checking if the cart exist with this userId or not
        let findCart = await Cart.findOne({ userId: userId }).populate('items.productId');
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        res.status(200).send({ status: true, message: "Success", data: findCart })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
// ==================================================================================



const deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId;

        //checking if the cart exist with this userId or not
        let findCart = await Cart.findOne({ userId: userId });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        //checking for an empty cart
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Cart is already empty" });

        await cartModel.updateOne(
            { _id: findCart._id },
            { items: [], totalPrice: 0, totalItems: 0 },
        )

        res.status(204).send({ status: true, message: "Success" })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}




module.exports = { createCart, updateCart, getCart, deleteCart }