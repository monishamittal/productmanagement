const userModel = require('../model/userModel');
const aws = require('aws-sdk')
const { isValidName, isValidString, isValidEmail, isValidMobile, isValidPassword, isValidProfile, isValidObjectId, isValid, isValidDate, isValidAddress } = require('../validation/valid')



//================================================[Upload File Function -AWS]=======================================================================


aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    let s3= new aws.S3({apiVersion: '2006-03-01'}); 

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  
        Key: "abc/" + file.originalname,  
        Body: file.buffer
    }

    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        return resolve(data.Location)
    })
})
}


//================================================[Create User  Api]=======================================================================


const createUser = async function (req, res) {
    try {
        let data = req.body
        let {fname, lname, email, profileImage, phone, password, address, street, city, pincode} = data
        if(Object.keys(data).length < 1){
            return res.status(400).send({ status: false, message: "Data is required to create a user" })
        }
        // -------------Validation first Name

        if(!isValid(fname)){
            return res.status(400).send({status: false, message: "Enter First Name"});
        }
        if(!isValidName(fname)){
            return res.status(400).send({status: false, message: "Enter valid First name"});

        }

        // -------------Validation Last Name

        if(!isValid(lname)){
            return res.status(400).send({status: false, message: "Enter last Name"});
        }
        if(!isValidName(lname)){
            return res.status(400).send({status: false, message: "Enter valid last name"});
        }

        // -------------Validation Email

        if(!isValid(email)){
            return res.status(400).send({status: false, message: "Enter Email"});
        }
        if(!isValidEmail(email)){
            return res.status(400).send({status: false, message: "Enter valid email"});
        }
        // -------------Validation Profile Image

        if(!isValid(profileImage)){
            return res.status(400).send({status: false, message: "Enter Profile Image"});
        }
        if(!isValidProfile(profileImage)){
            return res.status(400).send({status: false, message: "Enter Valid Profile Image"});
        }


        //------------- Validation Phone

        if(!isValid(phone)){
            return res.status(400).send({status: false, message: "Enter Phone Number"});
        }
        if(!isValidMobile(phone)){
            return res.status(400).send({status: false, message: "Enter valid phone number of 10 digits"});
        }

         // -------------Validation password

         if(!isValid(password)){
            return res.status(400).send({status: false, message: " Enater Password"});
         }
         if(!isValidPassword(password)){
            return res.status(400).send({status: false, message: "Enter Valid Password"});
         }


         // -------------Validation Address

         if (!isValidAddress(address)) return res.status(400).send({ status: false, message: "Address cannot be empty if it is mentioned." })
         if(address){
            if (typeof(address) != 'object')  return res.status(400).send({ status: false, message: "address must be in object." })
         if(!isValid(address.street)){
            return res.status(400).send({status: false, message: " Enater Street"});
         }

         if(!isValid(address.city)){
            return res.status(400).send({status: false, message: " Enater City"});
         }

         if(!isValid(address.pincode)){
            return res.status(400).send({status: false, message: " Enater Pincode"});
         }
         if (!/^[0-9]{6}$/.test(address.pincode))return res.status(400).send({ status: false, message: "Invalid pincode." })
        }

        
         //********************************DB call email and phone ************/

        let checkPhone=await userModel.findOne({phone: data.phone})
        if(checkPhone) return res.status(400).send({status: false, message :"Phone already exists"})

        let checkEmail = await userModel.findOne({email: data.email})
        if(checkEmail) return res.status(400).send({status: false, message:" Email is already exists"})

        


        //==================================== Profile Images check for aws ===================================================

        let files=req.files
        if (!(files&&files.length)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedBookImage = await uploadFile(files[0])
        data.bookImage=uploadedBookImage

        //=======================================================================================


        let savedata = await userModel.create(data)
        return res.status(201).send({status: true, message: 'User created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
}

// const loginUser = async function (req, res) {
//     try {
        

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

// const getUser = async function (req, res) {
//     try {
        

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

// const updateUser = async function (req, res) {
//     try {
        

//     } catch (err) {
//         res.status(500).send({status: false,  message: err });
//       }
// }

module.exports = { createUser }