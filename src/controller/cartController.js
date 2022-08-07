//--------------------requiring modules-------------------
const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const cartModel = require('../model/cartModel');
const { isValidObjectId } = require('../validation/valid')

//--------------------------------CREATE CART API ----------------------------------
const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(404).send({ status: false, message: "Invalid UserId" }) }

        // ------------------------DB CALL FOR CHECKING USERID FROM USERMODEL------------------
        let checkId = await userModel.findById(userId)
        if (!checkId)
            return res.status(200).send({ status: true, msg: "Not ok" })

        let cart = req.body
        let { productId } = cart
        if (Object.keys(cart).length < 1) { return res.status(400).send({ status: false, message: "create cart" }) }
        if (!isValidObjectId(productId)) { return res.status(404).send({ status: false, message: "Invalid productId" }) }

        // -----------------------DB CALL FOR CHECKING PRODUCTID FROM PRODUCTMODEL------------------
        let productIdNew = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productIdNew) {
            return res.status(200).send({ status: true, msg: "Not ok productId" })
        }

        // -------------------------------TO CREATE A NEW CART-----------------
        let arr1 = []
        let products = {
            productId: productId,
            quantity: 1
        }
        arr1.push(products)
        let priceCalculated = productIdNew.price * products.quantity

        // -------------------------------IF CART IS NOT CREATED OF A PARTICULAR USER IT WILL CREATE IT-----------------
        let cartData = await cartModel.findOne({ userId: userId })
        if (!cartData) {
            let createCart = {
                userId: userId, items: arr1,
                totalPrice: priceCalculated, totalItems: 1
            }
            let saveData = await cartModel.create(createCart)
            return res.status(201).send({ status: true, msg: "newcart", data: saveData })
        }

        // -------------------------------WHEN CART IS ALREADY CREATED IT WILL UPDATE THE CART BY ITEMS(PRODUCT,QUANTITY,PRICE,ITEMS)------------------
        if (cartData) {
            let arr2 = cartData.items
            let productAdded = {
                productId: productId,
                quantity: 1
            }

            // ------------------COMPARE THE PRODUCTID IF NOT PRESENT IT WILL CREATE ONE IF PRESENT IT WILL UPDATE THE QUANTITY------------------
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
                items: arr2,
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

//------------------------------------update cart---------------------------
const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(404).send({ status: false, message: "Invalid UserId" }) }

        // -------------------------------DB CALL FOR CHECKING USERID FROM USERMODEL------------------
        let checkId = await userModel.findById(userId)
        if (!checkId)
            return res.status(200).send({ status: true, msg: "Not ok" })

        let cart = req.body
        let { productId, removeProduct } = cart
        if (Object.keys(cart).length < 1) { return res.status(400).send({ status: false, message: "create cart" }) }
        if (!isValidObjectId(productId)) { return res.status(404).send({ status: false, message: "Invalid productId" }) }

        if (!(removeProduct == 1 || removeProduct == 0)) {
            return res.status(400).send({ status: false, message: "Remove Product Should only be 1 and 0 (1 - To Reduce Quantity & 0 - To Remove Product)" })
        }

        // -------------------------------DB CALL FOR CHECKING PRODUCTID FROM PRODUCTMODEL------------------
        let productIdNew = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productIdNew) {
            return res.status(200).send({ status: true, msg: "Not ok productId" })
        }

        // -------------------------------IF CART IS NOT CREATED OF A PARTICULAR USER IT WILL CREATE IT-----------------
        let cartData = await cartModel.findOne({ userId: userId })

        //----------------------IF CART IS FOUND IN DB--------------------- 
        //-------------------TO ADD PRODUCTS IF CART IS ALREADY CREATED----------------------
        if (cartData) {

            //-------------------product will be reduced by one quantity----------------
            if (removeProduct == 1) {
                let arr1 = cartData.items
                let compareProductId = arr1.findIndex((obj) => obj.productId == productId);
                if (compareProductId == -1) {
                    return res.status(200).send({ status: false, message: "ProductId is not available in the cart" })
                }
                else {
                    arr1[compareProductId].quantity -= 1;
                    if (arr1[compareProductId].quantity == 0) {
                        arr1.splice(compareProductId, 1)
                    }
                }

                let priceUpdated = cartData.totalPrice - (productIdNew.price)
                let itemsUpdated = arr1.length

                let createCartNew = {
                    items: arr1,
                    totalPrice: priceUpdated, totalItems: itemsUpdated
                }
                let saveData = await cartModel.findOneAndUpdate({ userId: userId }, createCartNew, { new: true })
                return res.status(201).send({ status: true, msg: "quantity reduced by 1 ", data: saveData })
            }

            //-----------------------product will be removed from cart------------------------
            if (removeProduct == 0) {

                let arr2 = cartData.items

                let compareProductId = arr2.findIndex((obj) => obj.productId == productId);
                if (compareProductId == -1) {
                    return res.status(200).send({ status: false, message: "ProductId is not available in the cart" })
                }
                else {
                    let arr3 = arr2.splice(compareProductId, 1)
                    let quantity = arr3[0].quantity
                    let priceUpdated = cartData.totalPrice - (productIdNew.price * quantity)
                    let itemsUpdated = arr2.length

                    let createCartNew = {
                        items: arr2,
                        totalPrice: priceUpdated, totalItems: itemsUpdated
                    }
                    let saveData = await cartModel.findOneAndUpdate({ userId: userId }, createCartNew, { new: true })
                    return res.status(201).send({ status: true, msg: "keydeleted", data: saveData })
                }
            }

        }

        //-------------------IF CART IS NOT FOUND IN DB---------------------
        if (!cartData) {
            return res.status(400).send({ status: false, message: "Cart Do Not Exits" })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

//------------------------------------------get cart------------------------
const getCart = async (req, res) => {
    try {
        let userId = req.params.userId;

        //------------------checking if the cart exist with this userId or not----------
        let findCart = await cartModel.findOne({ userId: userId }).populate('items.productId');
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        res.status(200).send({ status: true, message: "Success", data: findCart })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//--------------------------------delete cart----------------------------
const deleteCart = async (req, res, next) => {
    try {
        let userId = req.params.userId;

        //-------------------checking if the cart exist with this userId or not------------------------
        let findCart = await cartModel.findOne({ userId: userId });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        //-----------------------------checking for an empty cart-------------------
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Cart is already empty" });

        //---------------------------cart will be deleted------------------------
        await cartModel.updateOne(
            { _id: findCart._id },
            { items: [], totalPrice: 0, totalItems: 0 },
        )

        res.status(204).send({ status: true, message: "Success" })
        next();
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//------------------------making apis public-------------------------
module.exports = { createCart, updateCart, getCart, deleteCart }