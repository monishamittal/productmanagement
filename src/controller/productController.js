const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');

const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidNumber } = require('../validation/valid')


const createProduct = async function (req, res) {
    try {
        let data = req.body
        let { title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments } = data
        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Data is required to create a product" }) }

        if (!isValid(title)) { return res.status(400).send({ status: false, message: "Enter title" })}
        if (!isValidName(title)) { return res.status(400).send({ status: false, message: "Enter valid title" })}

        if (!isValid(description)) { return res.status(400).send({ status: false, message: "Enter description" })}
        if (!isValidName(description)) { return res.status(400).send({ status: false, message: "Enter valid description" })}

        if (!isValid(price)) { return res.status(400).send({ status: false, message: "Enter price" }) }
        if (!isValidNumber(price)) { return res.status(400).send({ status: false, message: "Enter valid price" })}

        if (!isValid(currencyId)) { return res.status(400).send({ status: false, message: "Enter currencyId" }) }

        if (!isValid(currencyFormat)) { return res.status(400).send({ status: false, message: "Enter currencyFormat" }) }
        // if (!isValid(productImage)) { return res.status(400).send({ status: false, message: "Enter productImage" }) }
        if (!isValid(availableSizes)) { return res.status(400).send({ status: false, message: "Enter availableSizes" }) }

        // if (!isBoolean(isFreeShipping)) { return res.status(400).send({ status: false, message: "isFreeShipping can only be true/false" }) }



        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title already exists" })


        let savedata = await productModel.create(data)
        return res.status(201).send({ status: true, message: 'products created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
}

// const getProduct = async function (req, res) {
//     try {
      

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

// const getProductByParam = async function (req, res) {
//     try {
      

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

// const updateProduct = async function (req, res) {
//     try {
      

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

// const deleteProduct = async function (req, res) {
//     try {
      

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

module.exports = {createProduct}
// ,getProduct,getProductByParam,updateProduct,deleteProduct }