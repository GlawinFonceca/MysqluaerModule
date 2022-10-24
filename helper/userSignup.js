async function signup(Name,Email,Password,Phone) {
    if(Name === true && Email ===true && Password === true && Phone === true) {
        return {status:true}
    }
    else if(Name !==true){
        return {status:false,message:"please enter alphabets"}
    }
    else if(Email !==true){
        return {status:false,message:"please enter valid email"}
    }
    else if(Password !==true){
        return {status:false,message:"Password should contain one symbol,one uppercase letter, one number and minimum 6 characters"}
    }
    else if(Phone !==true){
        return {status:false,message:"Please enter valid number"}
    }
    
}
module.exports=signup;