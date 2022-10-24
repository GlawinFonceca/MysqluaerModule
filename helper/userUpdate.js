const con = require('../database/Connection')
async function update(user, Name, Phone) {
    //updating user name and phone nuumber
    if (user) {
        if (!Name && !Phone) {
            return false
        }
        else if (!Phone) {
            await con.query(`UPDATE user SET name='${Name}' WHERE email = '${user.email}'`)
            return true;
        }
        else if (!Name) {
            await con.query(`UPDATE user SET phone='${Phone}' WHERE email = '${user.email}'`)
            return true;
        }
        else {
            await con.query(`UPDATE user SET name = '${Name}',phone='${Phone}' WHERE email = '${user.email}'`)
            return true
        }
    }
    else {
        console.log('User not found')
    }
}
module.exports = update;
