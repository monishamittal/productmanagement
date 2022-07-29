const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');
const { uploadFile } = require("./aws")

const { isValidName,isValidString, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidNumber } = require('../validation/valid')

const isValidSize = (sizes) => {
    return ["S", "XS","M","X", "L","XXL", "XL"].includes(sizes);
  }

const createProduct = async function (req, res) {
    try {
        let data = req.body
        let file = req.files

        // if (!isValidObjectId(data))
        //     return res.status(400).send({ status: false, message: "Please enter user datails!" });

            let { title, description, price, currencyId, currencyFormat, isFreeShipping, style,  installments} = data

            if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Please enter title!" })
        }

        let titleInUse = await productModel.findOne({title})
        if (titleInUse) {
            return res.status(400).send({status: false, message: "Title already in use! Please provide unique title."})
        }

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Please enter description!" })
        }

        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "Please enter price!" })
        }

        if (isNaN(price)|| price < 0) {
            return res.status(400).send({status: false, message: "Price should be a positive number!"})
        }

        data.price = Number(price).toFixed(2)

        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, message: "Please enter currencyId!" })
        }

        if (currencyId != "INR") {
            return res.status(400).send({status: false, message: "Currency must be in INR only"})
        }

        if (!isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "Please enter currency format!" })
        }

        if (currencyFormat != "₹") {
            return res.status(400).send({status: false, message: "Currency must be in ₹ only"})
        }

        if (!isValid(isFreeShipping)) {
            return res.status(400).send({ status: false, message: "Please enter isFreeShipping!" })
        }

        let files = req.files
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.profileImage = uploadedFileURL
        }

        if (!isValid(style)) {
        return res.status(400).send({ status: false, message: "Please enter style!" })
        }

        // if (!isValid(availableSizes)) {
        //     return res.status(400).send({ status: false, message: "Please enter atleast 1 Size!" })
        // }
       
        let availableSizes = req.body.availableSizes.split(",").map(x => x.trim())
        //console.log(getSize)
        //console.log(availableSizes, data.availableSizes)

        for (let i = 0; i < availableSizes.length; i++) {

            if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes[i]))) {
                console.log(availableSizes[i])
                return res.status(400).send({ status: false, message: "Size should be among ['S','XS','M','X','L','XXL','XL'] only!" })
            }

            if (availableSizes.indexOf(availableSizes[i]) != i) {
                return res.status(400).send({ status: false, message: "Size not present!" })
            }
        }
        data.availableSizes = availableSizes

        // const validPresentInstallment = function (value) {
        //     if (value <=0) return false
        //     if (value % 1 == 0) return true;
        //     }

            const isValidInstallment = function (value) {
                if (value <0) return false
                if (value % 1 == 0) return true;
                }

                const isValidEntry=function(value, data){
                    return Object.keys(data).includes(value)
                } 

        if (!isValid(installments)) {
            return res.status(400).send({ status: false, message: "Please enter installments!" })
        }

        if (!validPresentInstallment){
             return res.status(400).send({ status: false, message: "Installment required!" })
         }

         if (!isValidInstallment) {
            return res.status(400).send({ status: false, message: "Installment must be a number!" })
         }

        let saveData = await productModel.create(data)

        return res.status(201).send({status: true, message: "Product created successfully", data: saveData})

    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

//////////////////////////////////  Get products using query params  /////////////////////////////////////////////
 
const getProductByQuery = async function(req,res) {
 
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
//////////////////////////////////  getProducts By Path  /////////////////////////////////////////////

const getProductsByPath = async function (req, res) {
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

const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        //if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        let checkproduct = await productModel.findById({ _id: productId })
        if (!checkproduct) { return res.status(404).send({ status: false, message: "product not found" })}

        let productdata = req.body

        let { title, description, price, currencyId, currencyFormat, isFreeShipping,style,availableSizes,installments,isDeleted } = productdata
        
       // if (Object.keys(productdata).length < 1) { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }

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
        if (req.files) {
            let files = req.files
           // console.log("something")
            if (files && files.length > 0) {
             //   console.log("something")
                let uploadedFileURL = await uploadFile(files[0])
              //  console.log(uploadedFileURL)
              productdata.productImage = uploadedFileURL
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
//module.exports.updateProduct=updateProduct
module.exports = { createProduct, deleteProduct,getProductsByPath,getProductByQuery,updateProduct }