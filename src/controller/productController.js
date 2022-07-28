const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');
const aws = require("aws-sdk")

const { isValidName, isValidObjectId, isValid, isValidNumber } = require('../validation/valid')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) { return reject({ "error": err }) }
            return resolve(data.Location)
        })
    })
}

// ---------------------------------------------------
const createProduct = async function (req, res) {
    try {
        let data = req.body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes } = data
        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Data is required to create a product" }) }

        if (!isValid(title)) { return res.status(400).send({ status: false, message: "Enter title" }) }
        if (!isValidName(title)) { return res.status(400).send({ status: false, message: "Enter valid title" }) }

        if (!isValid(description)) { return res.status(400).send({ status: false, message: "Enter description" }) }
        if (!isValidName(description)) { return res.status(400).send({ status: false, message: "Enter valid description" }) }

        if (!isValid(price)) { return res.status(400).send({ status: false, message: "Enter price" }) }
        if (!isValidNumber(price)) { return res.status(400).send({ status: false, message: "Enter valid price" }) }

        if (!isValid(currencyId)) { return res.status(400).send({ status: false, message: "Enter currencyId" }) }
        if (currencyId != "INR") { return res.status(400).send({ status: false, message: "Currency must be in INR only" }) }

        if (!isValid(currencyFormat)) { return res.status(400).send({ status: false, message: "Enter currencyFormat" }) }
        if (currencyFormat != "₹") { return res.status(400).send({ status: false, message: "Currency must be in ₹ only" }) }


        let files = req.files
        if (!(files && files.length)) { return res.status(400).send({ status: false, message: " Please Provide The productImage" }) }
        const uploadedproductImage = await uploadFile(files[0])
        data.productImage = uploadedproductImage

        if (!isValid(availableSizes)) { return res.status(400).send({ status: false, message: "Enter availableSizes" }) }
        let size = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        if (!size.includes(availableSizes).split(","))
            return res.status(400).send({status: false,msg: "Invalid size,select from 'S','XS',M','X','L','XXL','XL'"});
      

        if (typeof isFreeShipping != 'undefined') {
            isFreeShipping = isFreeShipping.trim()
            if (!["true", "false"].includes(isFreeShipping)) {
                return res.status(400).send({ status: false, message: "isFreeshipping is a boolean type only" });
            }
        }

        if (!isValidName(style)) { return res.status(400).send({ status: false, message: "Enter valid style" }) }

        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title already exists" })


        let savedata = await productModel.create(data)
        return res.status(201).send({ status: true, message: 'products created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({ status: false, message: err });
    }
}

// ===========================================================================================
 
const getProduct = async function(req,res) {
    try{
        let filter = {}
        if(req.query)

       { 
        
        let data = req.query
 
       
        let {name, size, priceSort, priceGreaterThan, priceLessThan} = data
 
        if(name)
        {
            if(!isValid(name)){
                return res.status(400).send({status : false, message : "Enter product name"})
            }
 
            filter['title'] = name
          //  console.log(filter)
        }
 
        if(size){
            if(!isValid(size)){
                return res.status(400).send({status : false, message : "Enter size"})
            }
   
            filter['availableSizes'] = size.toUpperCase()
        }
       
        if(priceGreaterThan){
            if(!isValid(priceGreaterThan)){
                return res.status(400).send({status : false, messsage : "Enter value for priceGreaterThan field"})
            }
 
            filter['price'] = {
                '$gt' : priceGreaterThan
            }
        }
 
        if(priceLessThan){
            if(!isValid(priceLessThan)){
                return res.status(400).send({status : false, messsage : "Enter value for priceLessThan"})
            }
 
            filter['price'] = {
                '$lt' : priceLessThan
            }
        }
 
        if(priceLessThan && priceGreaterThan){
            filter['price'] = { '$lt' : priceLessThan, '$gt' : priceGreaterThan}
        }
 
        if(priceSort)
        {
            if((priceSort == 1 || priceSort == -1))
 {
            let filterProduct = await productModel.find({filter,isDeleted:false}).sort({price: priceSort})
           // console.log(filterProduct)
        

   
            if(!filterProduct)
            {
                return res.status(404).send({status : false, message : "No products found with this query"})
            }
 
            return res.status(200).send({status : false, message : "Success", data : filterProduct})
        }

        return res.status(400).send({status:false,message:"priceSort must have 1 or -1 as input"})
    }
    }

        console.log(filter)

       if(Object.keys(filter).length>0)
       { let filterProduct = await productModel.find({ $and: [filter, { isDeleted: false }] })

       // console.log(filterProduct.length)
        if(filterProduct.length<=0){
            return res.status(404).send({status:false,message:"No products found with given query"})
        }

        return res.status(200).send({status : false, message : "Success", data : filterProduct})
 }
 
    
            let findProduct = await productModel.find({isDeleted:false})
            console.log(findProduct)
       
            if(findProduct){
                console.log(findProduct)
                return res.status(200).send({status : false, message : "Success", data : findProduct})
            }
            else{
                return res.status(404).send({status : false, message : "No products found with this query"})
            }
        
 
 }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })      
    }
}
// =========================================
const getProductByParam = async function (req, res) {
    try {
        let productId = req.params.productId;

        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: 'Please provide valid productId' }) }

        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return res.status(404).send({ status: false, message: "No product found" })

        return res.status(200).send({ status: true, message: 'Success', data: product })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

// ==================================================
const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        //if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        let checkproduct = await productModel.findById({ _id: productId })
        if (!checkproduct) { return res.status(404).send({ status: false, message: "product not found" })}

        let productdata = req.body

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage,style,availableSizes,installments,isDeleted } = productdata
        
        if (Object.keys(productdata).length < 1) { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }

        if (title) {
            if (!isValidName(title)) {   
                return res.status(400).send({ status: false, message: "wrong title"})
            }
        }

        if (description) {
            if (!isValidName(description)) {
                return res.status(400).send({ status: false, message: "wrong description" })
            }
        }

        if (price) {
            if (!isValidNumber(price)) {
                return res.status(400).send({ status: false, message: "price is missing" })
            }
        }

        if (typeof isFreeShipping != 'undefined') {
            isFreeShipping = isFreeShipping.trim()
            if (!["true", "false"].includes(isFreeShipping)) {
                return res.status(400).send({ status: false, message: "isFreeshipping is a boolean type only" });
            }
        }
        if (productImage) {
            if (!isValidProfile(productImage)) {   
                return res.status(400).send({ status: false, message: "productImage is missing" })
            }
        }
        if (style) {
            if (!isValidName(style)) {
                return res.status(400).send({ status: false, message: "style is missing" })
            }
        }
        
        if (availableSizes) {   
            let size = ["S", "XS", "M", "X", "L", "XXL", "XL"];
    if (!size.includes(availableSizes))
        return res.status(400).send({
            status: false,
            msg: "Invalid size,select from 'S','XS',M','X','L','XXL','XL'",
        });

        }
        

        let UpdateProductData = await productModel.findOneAndUpdate({ _id: productId }, productdata, { new: true })
        return res.status(201).send({ status: true, message: "product Updated", productdata: UpdateProductData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// =======================================================
const deleteProduct = async function (req, res) {
    try {
        let ProductId = req.params.productId
        let date = new Date()

        let Product = await productModel.findOne({ _id: ProductId, isDeleted: false })
        if (!Product) { return res.status(404).send({ status: false, message: "Product not exist in DB" }) }

        let check = await productModel.findOneAndUpdate({ _id: BookId }, { isDeleted: true, deletedAt: date }, { new: true })
        return res.status(200).send({ status: true, message: "success", data: check })

    } catch (err) {
        res.status(500).send({ status: false, message: err })
    }
}

module.exports = { createProduct, deleteProduct, getProductByParam, getProduct ,updateProduct}
// updateProduct }