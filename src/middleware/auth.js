const jwt = require("jsonwebtoken");
const { isValidObjectId } = require('../validation/valid')
const userModel = require('../model/userModel');


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, message: "token is not present" })

        jwt.verify(token, "Project5", (err, decoded) => {
            if (err) { res.status(401).send({ status: false, Error: err.message }) }
            req.token = decoded
        })
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorization=async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
        const decodedtoken = jwt.verify(token, "Project5");
    
        let userId = req.params.userId;
        let userLoggedIn = decodedtoken.userId;
    
        if (userId != userLoggedIn) {
          return res.status(401).send({status: false,msg: "User logged in is not allowed to modified another users data"})}
        
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports= {authentication,authorization}