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
    
        // Return error if user id is not valid
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) {return res.status(400).send({ status: false, msg: `${userId} is not valid` })}
        let user = await userModel.findById(userId)
    
        const newuserId = user.toString();
        let userLoggedIn = decodedtoken.userId;
    
        if (newuserId != userLoggedIn) {
          return res.status(401).send({status: false,msg: "User logged in is not allowed to modified another users data"})}
        if (!user) {return res.status(401).send({ status: false, msg: "No such user exists" })}
        
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports= {authentication,authorization}