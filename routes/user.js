const router = require('express').Router();
const bcrypt = require('bcrypt');

const con = require('../database/Connection')
const updateValidation = require('../helper/userUpdate')
const isValidSignup = require('../helper/userSignup')

router.get('', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    })
})

router.get('/pageHome', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    })
})

router.get('/pageSignup', (req, res) => {
    res.render('signup', {
        title: 'Signup Page'
    })
})

router.get('/pageLogin', (req, res) => {
    res.render('login', {
        title: 'Login Page'
    })
})

router.get('/editProfile', (req, res) => {
    res.render('editProfile', {
        title: 'Edit Page'
    })
})

router.post('/userSignup', async (req, res) => {
    try {
        const isValid = await isValidSignup(req.body.name, req.body.email, req.body.password, req.body.phone);
        if (isValid.status === true) {
            con.query(`SELECT * FROM user WHERE email='${req.body.email}'`, async(err, result) => {
                if (err) return new Error(err.message);
                //result is array so checking length of the array
                if (!result.length) {
                    const saltRounds = 10;
                    //encrypting password 
                    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                    con.query(`INSERT INTO user(name,email,password,phone) VALUES('${req.body.name}','${req.body.email}','${req.body.password}','${req.body.phone}')`)
                    res.render('login', {
                        title: 'Login Page'
                    })
                }
                else {
                    res.render('signup', {
                        message: 'email is already saved'
                    })
                }
            })
        }
        else {
            res.render('signup', {
                message: isValid.message
            })
        }
    }
    catch (e) {
        console.log("userSignup:", e.message);
        res.send({
            message: 'failed',
            data: e.message
        })
    }
})

router.post('/userLogin', async (req, res) => {
    try {
        con.query(`SELECT * FROM user WHERE email='${req.body.email}'`, async (err, result) => {
            if (err) return new Error(err.message);
            if (result.length) {
                const validPassword = await bcrypt.compare(req.body.password, result[0].password);
                if (validPassword) {
                    res.cookie('UserLogin', req.body.email, { maxAge: 900000, httpOnly: true })
                    res.render('viewProfile', {
                        message: `Hello ${result[0].name}`
                    })
                }
                else {
                    res.render('login', {
                        title: 'Login Page',
                        message: 'invalid Password'
                    })
                }
            }
            else {
                res.render('login', {
                    title: 'Login Page',
                    message: 'invalid Email'
                })
            }
        })
    }
    catch (e) {
        console.log('userLogin', e.message);
        res.status(404).send({
            message: 'failed',
            data: e.message
        })
    }
})

router.get('/userProfile', async (req, res) => {
    try {
        const userEmail = req.cookies['UserLogin'];
        con.query(`SELECT * FROM user WHERE email='${userEmail}'`, async (err, result) => {
            if (err) return new Error(err.message);
            if (result.length) {
                res.render('profile', {
                    title: 'User Profile',
                    message1: result[0].name,
                    message2: result[0].email,
                    message3: result[0].phone
                })
            }
            else {
                res.render('login', {
                    message: 'User not found please login'
                })
            }
        })
    }
    catch (e) {
        console.log('userProfile', e.message);
        res.status(404).send({
            message: 'failed',
            data: e.message
        })
    }
})

router.post('/editProfile', async (req, res) => {
    try {
        const userEmail = req.cookies['UserLogin'];
        con.query(`SELECT * FROM user WHERE email='${userEmail}'`, async (err, result) => {
            if (err) return new Error(err.message);
            //sending user, name and phone number to userUpdate function
            const data = await updateValidation(result[0], req.body.name, req.body.phone);
            if (data.status === true) {
                res.render('home', {
                    message: data.message,
                })
            }
            else {
                res.render('editProfile', {
                    message: data.message
                })
            }
        })
    }
    catch (e) {
        console.log('editProfile', e.message);
        res.render('profile', {
            message: e.message
        })
    }
})

module.exports = router;