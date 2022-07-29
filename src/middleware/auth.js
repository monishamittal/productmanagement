const jwt = require("jsonwebtoken");
const  {isValidObjectId}  = require('../validation/valid');
const userModel = require('../model/userModel');


const authentication = (req, res, next) => {
    try {
      let bearerHeader = req.headers.authorization;
      if(typeof bearerHeader == "undefined") return res.status(400).send({ status: false, message: "Token is missing" });
      
      let bearerToken = bearerHeader.split(' ')
      let token = bearerToken[1];
      jwt.verify(token, "Project5", function (err,data) {
        if(err) {
          return res.status(400).send({ status: false, message: err.message })
        }else {
          req.decodedToken = data;
          next()
        }
      });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }
  
  const authorization = async (req, res, next) => {
    try {
      let loggedInUser = req.decodedToken.userId;
      let loginUser;
      
      if(req.params?.userId){
         if(!isValidObjectId(req.params.userId)) return res.status(400).send({ status: false, message: "Enter a valid user Id" })
        let checkUserId = await userModel.findById(req.params.userId);
        if(!checkUserId) return res.status(404).send({ status: false, message: "User not found" });
        loginUser = checkUserId._id.toString();
      }
  
      if(!loginUser) return res.status(400).send({ status: false, message: "User-id is required" })
  
      if(loggedInUser !== loginUser) return res.status(403).send({ status: false, message: "Error!! authorization failed" });
      next();
    } catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }

// const authorization=async function (req, res, next) {
//     try {
//         // let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
//         let token =req.headers.authorization
//         const decodedtoken = jwt.verify(token, "Project5");
    
//         let userId = req.params.userId;
//         let userLoggedIn =decodedtoken.userId;
    
//         if (userId != userLoggedIn) {
//           return res.status(401).send({status: false,msg: "User logged in is not allowed to modified another users data"})}
        
//         next()

//     } catch (err) {
//         return res.status(500).send({ status: false, message: err.message })
//     }
// }



module.exports= {authentication,authorization}