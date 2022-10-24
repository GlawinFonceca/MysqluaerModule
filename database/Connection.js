const mysql = require('mysql');
require('dotenv').config();
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.user,
    password: process.env.password,
    database: 'users'
})
con.connect(function (err) {
    if (err) return new Error(err.message);
    console.log('database created');
    // con.query('CREATE TABLE user(name VARCHAR(30), email VARCHAR(20),password VARCHAR(70),phone VARCHAR(10))')

})
module.exports = con