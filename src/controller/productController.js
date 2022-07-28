 const productModel = require('../model/productModel');
 const { isValidName, isValidString, isValidEmail, isValidMobile, isValidPassword, isValidProfile, isValidObjectId, isValid, isValidDate, isValidAddress } = require('../validation/valid')
// const userModel = require('../model/userModel');
// const orderModel = require('../model/orderModel');
// const cartModel = require('../model/cartModel');

const createProduct = async function (req, res) {
    try {
        const isValidSize = (sizes) => {
            return ["S", "XS","M","X", "L","XXL", "XL"].includes(sizes);
          }
        
        const createProduct = async function (req, res) {
            try {
                let data = req.body
                let file = req.files
        
                // if (!isValidObjectId(data))
                //     return res.status(400).send({ status: false, message: "Please enter user datails!" });
        
                    let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments} = data
        
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
        
                if (!isValid(availableSizes)) {
                    return res.status(400).send({ status: false, message: "Please enter atleast 1 Size!" })
                }
        
                let availableSize = ['S','XS','M','X','L','XXL','XL']
               // console.log(availableSize.split(","))
                let getSize = availableSize.map(x => x.trim())
                
        
                for (let i = 0; i < getSize.length; i++) {
        
                    if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(getSize[i]))) 
                    {
                        console.log(getSize[i])
                        return res.status(400).send({ status: false, message: "Size should be among ['S','XS','M','X','L','XXL','XL'] only!" })
                    }
        
                    if (getSize.indexOf(getSize[i]) != i) {
                        return res.status(400).send({ status: false, message: "Size not present!" })
                    }
                }
        
                data['availableSize'] = [...getSize]
        
                const validPresentInstallment = function (value) {
                    if (value <=0) return false
                    if (value % 1 == 0) return true;
                    }
        
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

    } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
}

module.exports.createProduct=createProduct

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
                    return res.status(400).send({ status: false, message: "title is missing"})
                }
            }
    
            if (!description) {
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "description is missing" })
                }
            }
    
            if (!price) {
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "price is missing" })
                }
            }
    
            if (!currencyId) {
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "currencyId is missing" })
                }
            }
    
            if (!currencyFormat) {
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "currencyFormat is missing ! " })
                } 
            }
    
            if (!isFreeShipping) {
                    return res.status(400).send({ status: false, message: "isFreeShipping is missing" })
                }
            
            if (productImage) {
                if (!isValidProfile(productImage)) {   
                    return res.status(400).send({ status: false, message: "productImage is missing" })
                }
            }
            if (!style) {
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "style is missing" })
                }
            }
            
            if (availableSizes) {   
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "availableSizes is missing" })
                }
            }
            
            if (!installments) {   
                if (!isValidString(description)) {
                    return res.status(400).send({ status: false, message: "installments is missing" })
                }
            }
    
            let UpdateProductData = await productModel.findOneAndUpdate({ _id: productId }, productdata, { new: true })
            return res.status(201).send({ status: true, message: "product Updated", productdata: UpdateProductData })
    
        }
        catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
    }
    module.exports.updateProduct=updateProduct

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

// module.exports = {createProduct,getProduct,getProductByParam,updateProduct,deleteProduct }