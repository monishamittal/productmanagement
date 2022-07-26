const userModel = require('../model/userModel');
const aws= require("aws-sdk")
const jwt =require('jsonwebtoken')

const { isValidName, isValidString, isValidEmail, isValidMobile, isValidPassword, isValidProfile, isValidObjectId, isValid, isValidDate, isValidAddress } = require('../validation/valid')


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
        let {fname, lname, email,  phone, password, address, street, city, pincode} = data
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

    //     if(!isValid(profileImage)){
    //         return res.status(400).send({status: false, message: "Enter Profile Image"});
    //    }
    //     if(!isValidProfile(profileImage)){
    //        return res.status(400).send({status: false, message: "Enter Valid Profile Image"});
    //     }


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


         if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please enter address!" })
        }


        if (!isValid(address.shipping)) {
            return res.status(400).send({ status: false, message: "Please enter shipping address!" })
        }

        if (!isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, message: "Please enter city in shiping address!" })
        }

        if (!isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, message: "Please enter street in shiping address!" })
        }

        if (!isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, message: "Please enter pincode in shiping address!" })
        }


        if (!isValid(address.billing)) {
            return res.status(400).send({ status: false, message: "Please enter billing address!" })
        }

        if (!isValid(address.billing.city)) {
            return res.status(400).send({ status: false, message: "Please enter city in billing address!" })
        }

        if (!isValid(address.billing.street)) {
            return res.status(400).send({ status: false, message: "Please enter street in billing address!" })
        }

        if (!isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, message: "Please enter pincode in billing address!" })
        }
        
         //***********DB call email and phone *****/

        let checkPhone=await userModel.findOne({phone: data.phone})
        if(checkPhone) return res.status(400).send({status: false, message :"Phone already exists"})

        let checkEmail = await userModel.findOne({email: data.email})
        if(checkEmail) return res.status(400).send({status: false, message:" Email is already exists"})

        


        //==================================== Profile Images check for aws ===================================================

        let files=req.files
        
         //let profileImgUrl = await uploadFile(files[0]);
        // data.profileImage = profileImgUrl;

         if (!(files&&files.length)) {
           return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedBookImage = await uploadFile(files[0])
        data.profileImage=uploadedBookImage

        //=======================================================================================


        let savedata = await userModel.create(data)
        return res.status(201).send({status: true, message: 'User created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
}




const loginUser = async function (req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const user = await userModel.findOne({email: email,password: password});
      if (!user) {
        return res.status(400).send({status: false,msg: "Provided Email address or Password are incorrect"})}
     
  let userId = user._id
  let token = jwt.sign({

      userId: userId,                                     //unique Id
      at: Math.floor(Date.now() / 1000),                  //issued date
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60   //expires in 24 hr 

  }, "Project5")
    
      res.status(200).send({ status: true, message: "User login successfull", data: {userId, token: token } });
  
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
    }
  };


  const getUser= async function (req, res) {
    try {

        const userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        const userData = await userModel.findOne({ _id: userId })
            .select({ address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1 })

        if (!userData) return res.status(404).send({ status: false, message: "User not found " })

        return res.status(200).send({ status: true, message: "user profile details", data: userData })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}

   const updateUser = async function (req, res) {
    try {

        let userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        let checkUser = await userModel.findById({ _id: userId })
        if (!checkUser) { return res.status(404).send({ status: false, message: "user not found" })}

        let data = req.body

        let { fname, lname, email, profileImage, phone, password, address } = data
        
        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }

        if (fname) {
            if (!isValidName(fname)) {
                return res.status(400).send({ status: false, message: "first name is missing ! " })
            }
        }

        if (lname) {
            if (!isValidName(lname)) {
                return res.status(400).send({ status: false, message: "last name is missing ! " })
            }
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "email is missing ! " })
            }
            let checkEmail = await userModel.findOne({ email: email })
            if (checkEmail) return res.status(400).send({ status: false, message: "Email already exists" })
        }

        if (profileImage) {
            if (!isValidName(profileImage)) {
                return res.status(400).send({ status: false, message: "ProfileImage is missing ! " })
            }
        }

        if (phone) {
            if (!isValidMobile(phone)) {
                return res.status(400).send({ status: false, message: "phone number is missing ! " })

            } let checkPhone = await userModel.findOne({ phone: phone })
            if (checkPhone) return res.status(400).send({ status: false, message: "Phone Number already exists" })
        }

        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Minimum eight characters, at least 1 letter and 1 number in Password : Min 8 and Max 15" })
            }
        }

        let Updatedata = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
        res.status(201).send({ status: true, message: "User profile Updated", data: Updatedata })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser,loginUser ,getUser,updateUser}