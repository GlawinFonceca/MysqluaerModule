const validate = require('validator');
//user's crendial validation
async function isValidSignup(name,email,password,phone) {
    const Name = validate.isAlpha(name);
    const Email = validate.isEmail(email);
    const Password = validate.isStrongPassword(password,
        { minLength: 6, minUppercase: 1, minSymbols: 1, returnScore: false, minNumbers: 1 });
    const Phone =validate.isLength(phone, { min: 10, max: 10 }) && validate.isNumeric(phone)
    
    if (Name === true && Email === true && Password === true && Phone === true) {
        return { status: true }
    }
    else if (Name !== true) {
        return { status: false, message: "please enter alphabets" }
    }
    else if (Email !== true) {
        return { status: false, message: "please enter valid email" }
    }
    else if (Password !== true) {
        return { status: false, message: "Password should contain one symbol,one uppercase letter, one number and minimum 6 characters" }
    }
    else if (Phone !== true) {
        return { status: false, message: "Please enter valid number" }
    }

}
module.exports = isValidSignup;