const userModel = require('../model/userModel');
const { isValidName, isValidString, isValidEmail, isValidMobile, isValidPassword, isValidProfile, isValidObjectId, isValid, isValidDate, } = require('../validation/valid')


const createUser = async function (req, res) {
    try {
        let data = req.body
    
        let savedata = await userModel.create(data)
        return res.status(201).send({status: true, message: 'User created successfully', data: savedata })

    } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
}
module.exports = { createUser }