const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');

const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidNumber } = require('../validation/valid')


const createProduct = async function (req, res) {
    try {
        let data = req.body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data
        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Data is required to create a product" }) }

        if (!isValid(title)) { return res.status(400).send({ status: false, message: "Enter title" }) }
        if (!isValidName(title)) { return res.status(400).send({ status: false, message: "Enter valid title" }) }

        if (!isValid(description)) { return res.status(400).send({ status: false, message: "Enter description" }) }
        if (!isValidName(description)) { return res.status(400).send({ status: false, message: "Enter valid description" }) }

        if (!isValid(price)) { return res.status(400).send({ status: false, message: "Enter price" }) }
        if (!isValidNumber(price)) { return res.status(400).send({ status: false, message: "Enter valid price" }) }

        if (!isValid(currencyId)) { return res.status(400).send({ status: false, message: "Enter currencyId" }) }

        if (!isValid(currencyFormat)) { return res.status(400).send({ status: false, message: "Enter currencyFormat" }) }
        // if (!isValid(productImage)) { return res.status(400).send({ status: false, message: "Enter productImage" }) }
        if (!isValid(availableSizes)) { return res.status(400).send({ status: false, message: "Enter availableSizes" }) }

        // if (!isBoolean(isFreeShipping)) { return res.status(400).send({ status: false, message: "isFreeShipping can only be true/false" }) }

        if (!isValid(style)) { return res.status(400).send({ status: false, message: "Enter style" }) }
        if (!isValidName(style)) { return res.status(400).send({ status: false, message: "Enter valid style" }) }

        if (!isValid(installments)) { return res.status(400).send({ status: false, message: "Enter installments" }) }
        if (!isValidNumber(installments)) { return res.status(400).send({ status: false, message: "Enter valid installments" }) }

        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title already exists" })


        let savedata = await productModel.create(data)
        return res.status(201).send({ status: true, message: 'products created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({ status: false, message: err });
    }
}

// const getProduct = async function (req, res) {
//     try {


//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

const getProductByParam = async function (req, res) {
    try{
        let productId = req.params.productId;
    
        //checking is product id is valid or not
        if (!isValidObjectId(productId)){
          return res.status(400).send({ status: false, message: 'Please provide valid productId' })
        }
      
        //getting the product by it's ID
        const product = await productModel.findOne({ _id: productId, isDeleted:false})
        if(!product) return res.status(404).send({ status: false, message:"No product found"})
    
        return res.status(200).send({ status: true, message: 'Success', data: product})
      } 
      catch (err) {
        res.status(500).send({ status: false, error: err.message })
      }
}

// const updateProduct = async function (req, res) {
//     try {


//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }


const deleteProduct = async function (req, res) {

    try {
        let ProductId = req.params.productId
        let date = new Date()

        let Product = await productModel.findOne({ _id: ProductId, isDeleted: false })
        if (!Product) { return res.status(404).send({ status: false, message: "Product not exist in DB" }) }

        let check = await productModel.findOneAndUpdate(
            { _id: BookId }, { isDeleted: true, deletedAt: date }, { new: true })

        return res.status(200).send({ status: true, message: "success", data: check })


    } catch (err) {
        res.status(500).send({ status: false, message: err })
    }
}

module.exports = { createProduct, deleteProduct,getProductByParam }
// ,getProduct,updateProduct }