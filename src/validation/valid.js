const mongoose = require("mongoose")

//Value Validation
const  isValidObjectId =function(id){
    var ObjectId = mongoose.Types.ObjectId;
    return ObjectId.isValid(id)
}
const isValid = function(value){
    if(typeof value ==='undefined' || value ===null)  return false
    if(typeof value ==='string' && value.trim().length ===0)return false
    return true
}
    // const isValidSize = (size) => {
    //     if (!Array.isArray(size)) {
    //         return size.replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((size) => {
    //             return size !== ""
    //         })
    //     }
    //     return size
    // }
//String Validation
// const isValidString = function(value){
//     if(typeof value ==='string' && value.trim().length ===0)return false
//     return true
// }

//Name Validation for Fname and Lname
const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z ]{2,30}$/
    return nameRegex.test(name)
}

// Name Validation for Fname and Lname
// const isBoolean =function(boolean){
//     const  booleanRegex =/^(True|False|TRUE|FALSE)$/
//     return booleanRegex.test(boolean)
// }

//Email Validation
const isValidEmail = function(email){
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email)
}

//Mobile Validation
const isValidMobile = function (mobile) {
    var re = /^((\+91)?|91)?[6789][0-9]{9}$/;
    return re.test(mobile);
}

//Number Validation
const isValidNumber = function (number) {
    var re =/^\d{0,8}[.]?\d{1,4}$/;
    return re.test(number);
}

//installments Validation
// const isValidInstallment = function (installment) {
//     var re =/^([1-9]|1[012])$/;
//     return re.test(installment);
// }

//Password Validation
const isValidPassword = function(password){
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passRegex.test(password)
}

// Profile Validation
const isValidProfile = function(profile){
    const profileRegex = /[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    return profileRegex.test(profile)
}

//ObjectId Validation

//  Address Validation
// const isValidAddress = function (address) {
//     if (typeof address === 'undefined' || address === null) return false
//     if (Object.keys(address).length === 0) return false
//     return true;
// }

//Date Validation
// const isValidSize =function(size){
//     const  sizeRegex = //;
//     return sizeRegex.test(size)
// }


// const isValidSize = (size) => {
//     if (!Array.isArray(size)) {
//         return size.replace("[", "").replace("]", "").replace("{", "").replace("}", "").trim().split(",").filter((size) => {
//             return size !== ""
//         })
//     }
//     return size
// }
// const checkValue = function (value) {
//     let arrValue = [];
//     value.map((x) => { 
//       x= x.trim();
//       if (x.length) arrValue.push(x);
//     });
//     return arrValue.length ? arrValue : false;
//   };
  
//   //function for converting string into array
//   const convertToArray = function (value) {      
//     if (typeof value == "string") {
//       if(value.trim()){
//       let newValue = value.trim()
//       return [newValue];
//       }
//     } else if (value?.length > 0) return checkValue(value);
//     return false;
//   };


module.exports = {isValidName,isValidEmail,isValidMobile,isValidPassword,isValidProfile,isValidObjectId,isValid,isValidNumber}
    // isValidDate,
    // isValidAddress,
    // isValidString, 
// }