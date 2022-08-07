//----------------------------------requiring modules-------------------------
const userModel = require('../model/userModel');
const { uploadFile } = require('./aws')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidProfile } = require('../validation/valid')

//----------------------------------Create User  Api-------------------
const createUser = async function (req, res) {
    try {
        let data = req.body
        let { fname, lname, email, phone, password } = data

        //------------------validation for request body------------------
        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Data is required to create a user" }) }

        //-------------------validation for first name-----------------------
        if (!isValid(fname)) { return res.status(400).send({ status: false, message: "Enter First Name" }) }
        if (!isValidName(fname)) { return res.status(400).send({ status: false, message: "Enter valid First name" }) }

        //------------------------validation for last name----------------
        if (!isValid(lname)) { return res.status(400).send({ status: false, message: "Enter last Name" }) }
        if (!isValidName(lname)) { return res.status(400).send({ status: false, message: "Enter valid last name" }) }

        //------------------------validation for email--------------------
        if (!isValid(email)) { return res.status(400).send({ status: false, message: "Enter Email" }) }
        if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Enter valid email" }) }

        //-------------------------validation for phone--------------------
        if (!isValid(phone)) { return res.status(400).send({ status: false, message: "Enter Phone Number" }) }
        if (!isValidMobile(phone)) { return res.status(400).send({ status: false, message: "Enter valid indian phone number" }) }

        //-----------------validation for password and converting in encrypted form---------
        if (!isValid(password)) { return res.status(400).send({ status: false, message: " Enter Password" }) }
        if (!isValidPassword(password)) { return res.status(400).send({ status: false, message: "Enter Valid Password having 1 capital and small letter , 1 special character and 1 number and length should be between 8 to 15" }) }

        //--------------------------validation for address-----------------------
        data.address = JSON.parse(data.address)
        if (!isValid(data.address)) { return res.status(400).send({ status: false, message: "Please enter address!" }) }

        if (!isValid(data.address.shipping)) { return res.status(400).send({ status: false, message: "Please enter shipping address!" }) }
        if (!isValid(data.address.shipping.city)) { return res.status(400).send({ status: false, message: "Please enter city in shipping address!" }) }
        if (!isValid(data.address.shipping.street)) { return res.status(400).send({ status: false, message: "Please enter street in shipping address!" }) }
        if (!isValid(data.address.shipping.pincode)) { return res.status(400).send({ status: false, message: "Please enter pincode in shipping address!" }) }

        if (!isValid(data.address.billing)) { return res.status(400).send({ status: false, message: "Please enter billing address!" }) }
        if (!isValid(data.address.billing.city)) { return res.status(400).send({ status: false, message: "Please enter city in billing address!" }) }
        if (!isValid(data.address.billing.street)) { return res.status(400).send({ status: false, message: "Please enter street in billing address!" }) }
        if (!isValid(data.address.billing.pincode)) { return res.status(400).send({ status: false, message: "Please enter pincode in billing address!" }) }

        //---------------db calls for email and phone to make them unique----------
        let checkPhone = await userModel.findOne({ phone: data.phone })
        if (checkPhone) return res.status(400).send({ status: false, message: "Phone already exists" })

        let checkEmail = await userModel.findOne({ email: data.email })
        if (checkEmail) return res.status(400).send({ status: false, message: " Email is already exists" })

        //---------------------Profile Images check for aws------------------
        let profileImage = req.files
        if (!(profileImage && profileImage.length)) { return res.status(400).send({ status: false, message: " Please Provide The Profile Image" }) }
        const uploadedProfileImage = await uploadFile(profileImage[0])
        data.profileImage = uploadedProfileImage

        //-----------------------hashing the password with bcrypt------------------
        data.password = await bcrypt.hash(data.password, 10);

        let savedata = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'User created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({ status: false, message: err })
    }
}

//--------------------------login User Api----------------------
const loginUser = async function (req, res) {
    try {
        const data = req.body
        if (!data) { return res.status(400).send({ status: false, message: "Please enter email and password" }) }
        const email = req.body.email;
        const password = req.body.password;

        //------------------email checking----------------------
        const user = await userModel.findOne({ email });
        if (!user) { return res.status(404).send({ status: false, msg: "Incorrect Email" }) }

        //--------------------password checking-------------------
        let actualPassWord = await bcrypt.compare(password, user.password);
        if (!actualPassWord) return res.status(400).send({ status: false, message: "Incorrect password" })

        let userId = user._id

        //---------------------token-------------------------------
        let token = jwt.sign({ userId: userId }, "Project5", { expiresIn: "2d" })
        res.status(200).send({ status: true, message: "User login successfull", data: { userId, token: token } });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

//---------------------------get User Api------------------------------
const getUser = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter UserId" })

        //------------------db call to find userId-----------------
        const userData = await userModel.findOne({ _id: userId })
        if (!userData) return res.status(404).send({ status: false, message: "User's ID not found " })
        return res.status(200).send({ status: true, message: "user profile details", data: userData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//------------------------------update User Api------------------
const updateUser = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        //--------------------db call to verify userId--------------------
        let checkUser = await userModel.findById({ _id: userId })
        if (!checkUser) { return res.status(404).send({ status: false, message: "user not found" }) }

        let data = req.body
        let { fname, lname, email, profileImage, phone, password } = data

        if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }

        //--------------------if we want to update first name-------------------
        if (fname || fname == "") {
            if (!isValid(fname.trim())) { return res.status(400).send({ status: false, message: "first name is missing !" }) }
            if (!isValidName(fname.trim())) { return res.status(400).send({ status: false, message: "first name is missing ! " }) }
        }

        //--------------------if we want to update last name-------------------
        if (lname || lname == "") {
            if (!isValid(lname.trim())) { return res.status(400).send({ status: false, message: "last name is missing ! " }) }
            if (!isValidName(lname.trim())) { return res.status(400).send({ status: false, message: "last name is missing ! " }) }
        }

        //--------------------if we want to update emailId-------------------
        if (email || email == "") {
            if (!isValid(lname.trim())) { return res.status(400).send({ status: false, message: "email is missing ! " }) }
            if (!isValidEmail(email.trim())) { return res.status(400).send({ status: false, message: "email is missing ! " }) }
            let checkEmail = await userModel.findOne({ email: email })
            if (checkEmail) return res.status(400).send({ status: false, message: "Email already exists" })
        }

        //--------------------if we want to update profile image-------------------
        if (profileImage || profileImage == "") {
            if (!isValidProfile(profileImage)) { return res.status(400).send({ status: false, message: "ProfileImage is missing ! " }) }
        }

        //--------------------if we want to update phone number-------------------
        if (phone || phone == "") {
            if (!isValid(phone.trim())) { return res.status(400).send({ status: false, message: "phone number is missing ! " }) }
            if (!isValidMobile(phone.trim())) { return res.status(400).send({ status: false, message: "phone number is missing ! " }) }
            let checkPhone = await userModel.findOne({ phone: phone })
            if (checkPhone) return res.status(400).send({ status: false, message: "Phone Number already exists" })
        }

        //--------------------if we want to update password-------------------
        if (password) {
            if (!isValid(password.trim())) { return res.status(400).send({ status: false, message: "Minimum eight characters, at least 1 capital and small letter, 1 special character and 1 number in Password : Min 8 and Max 15" }) }
            if (!isValidPassword(password.trim())) { return res.status(400).send({ status: false, message: "Minimum eight characters, at least 1 capital and small letter, 1 special character and 1 number in Password : Min 8 and Max 15" }) }
            const hash = bcrypt.hashSync(password, 10);
            data.password = hash
        }

        //--------------------if we want to update address-------------------
        if (data.address) {
            data.address = JSON.parse(data.address)
            if (!isValid(data.address)) { return res.status(400).send({ status: false, message: "Please enter address!" }) }
        }
        let Updatedata = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
        return res.status(201).send({ status: true, message: "User profile Updated", data: Updatedata })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//--------------------making apis public-------------------
module.exports = { createUser, loginUser, getUser, updateUser }