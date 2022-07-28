const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, message: "token is not present" })

        jwt.verify(token, "Project5",(err, decoded) => {
            if (err) {
                res.status(401).send({ status: false, Error: err.message })
            }
            req.token = decoded
        })

        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.authentication=authentication


const authorise = async function (req, res, next) {
//     try {
//         // let token = req.headers["x-api-key"];
//         //  if (!token) {

//         //     token = req.headers["X-Api-Key"]; 
//         // }
//         // let decodedToken = jwt.verify(token, "project5");
//         // //console.log(decodedToken)
//         // let userId= req.params.userid;
//         // if (!userId) 
//         //    return res.status(400).send({ status: false, msg: `userId is not present` });
           
//         let  UserId= await userModel.findById(ObjectId._id)
//         let newUserId = UserId;
//         //console.log(newUserId)
//         if(!newUserId.toString()){
//             return res.status(400).send({msg:"id not match"})
//         }
//         res.status(203).send({status:true,msg:"autherization succesfull"})
          
//         }catch (err) {res.status(500).send({status:false, msg: err.message })}
//         next();
// }


    try {
        let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
        const decodedtoken = jwt.verify(token, "Project5");
    
        // Return error if user id is not valid
        let userId = req.params.userId;
        //if (!isValidObjectId(userId)) {return res.status(400).send({ status: false, msg: `${userId} is not valid` })}
         //let user = await userModel.findById(userId)
    
         //const newuserId = user;
         let userLoggedIn = decodedtoken.userId;
         console.log(userLoggedIn);
    
        if (userId != userLoggedIn) {
          return res.status(401).send({status: false,msg: "User logged in is not allowed to modified another users data"})}
        //if (!user) {return res.status(401).send({ status: false, msg: "No such user exists" })}
        
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
 module.exports.authorise = authorise;