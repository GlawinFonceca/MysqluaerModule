const con = require('../database/Connection')
const validate = require('validator');

async function update(user, Name, Phone) {
    //updating user name and phone nuumber
    if (user) {
        if (!Name && !Phone) {
            return { status: false, message: 'please enter name or phone number' }
        }
        else if (!Phone) {
            const userName = validate.isAlpha(Name);
            if (userName === true) {
                await con.query(`UPDATE user SET name='${Name}' WHERE email = '${user.email}'`)
                return { status: true, message: 'Successfully updated' }
            }
            else {
                return { status: false, message: 'please enter alphabets only' }
            }
        }
        else if (!Name) {
            const userPhone = validate.isLength(Phone, { min: 10, max: 10 }) && validate.isNumeric(Phone)
            if (userPhone === true) {
                await con.query(`UPDATE user SET phone='${Phone}' WHERE email = '${user.email}'`)
                return { status: true, message: 'Successfully updated' }
            }
            else {
                return { status: false, message: 'please valid phone number' }
            }
        }
        else {
            const userName = validate.isAlpha(Name);
            const userPhone = validate.isLength(Phone, { min: 10, max: 10 }) && validate.isNumeric(Phone)
            if (userName === true && userPhone === true) {
                await con.query(`UPDATE user SET name = '${Name}',phone='${Phone}' WHERE email = '${user.email}'`)
                return { status: true, message: 'Successfully updated' }
            }
            else {
                return { status: false, message: 'Please enter name and phone number' }
            }
        }
    }
    else {
        console.log('User not found')
    }
}
module.exports = update;
