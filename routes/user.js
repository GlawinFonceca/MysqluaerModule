const express = require('express');
const { isBuffer } = require('util');
const router = express.Router();
const updateValidation = require('../helper/userUpdate')
const signupValidation = require('../helper/userSignup')
const bcrypt = require('bcrypt');
const validate = require('validator');
const con = require('../database/Connection')

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
        //user's crendial validation
        const userName = validate.isAlpha(req.body.name);
        const userEmail = validate.isEmail(req.body.email);
        const userPassword = validate.isStrongPassword(req.body.password,
            { minLength: 6, minUppercase: 1, minSymbols: 1, returnScore: false, minNumbers: 1 });
        const userPhone = validate.isLength(req.body.phone, { min: 10, max: 10 });
        //passing name,email,password and phone number to userSignup function for validation
        const isValid = await signupValidation(userName, userEmail, userPassword, userPhone);
        if (isValid.status === true) {
            con.query("SELECT * FROM user ", async (err, result) => {
                if (err) return new Error(err.message);
                const user = JSON.parse(JSON.stringify(result));//convert array object to JSON and to javascript Object 
                //checking whether email is already present in databse or not
                const isUser = user.find((user) => { return user.email === req.body.email });
                if (!isUser) {
                    const saltRounds = 10;
                    //encrypting password 
                    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                    await con.query(`INSERT INTO user(name,email,password,phone) VALUES('${req.body.name}','${req.body.email}','${req.body.password}','${req.body.phone}')`)
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
        const userEmail = req.body.email;
        const User = "SELECT * FROM user ";
        con.query(User, async (err, result) => {
            if (err) return new Error(err.message);
            const user = JSON.parse(JSON.stringify(result));//convert array object to JSON and to javascript Object
            //checking whether email is already present in databse
            const isUser = user.find((user) => { return user.email === userEmail });
            if (isUser) {
                const validPassword = await bcrypt.compare(req.body.password, isUser.password);
                if (validPassword) {
                    res.cookie('UserLogin', userEmail, { maxAge: 900000, httpOnly: true })
                    res.render('viewProfile', {
                        message: `Hello ${isUser.name}`
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
        const User = "SELECT * FROM user ";
        con.query(User, (err, result) => {
            if (err) return new Error(err.message);
            const user = JSON.parse(JSON.stringify(result));//convert array object to JSON and to javascript Object
            //fetching user email id in database  
            const isUser = user.find((user) => { return user.email === userEmail });
            if (isUser) {
                res.render('profile', {
                    title: 'User Profile',
                    message1: isUser.name,
                    message2: isUser.email,
                    message3: isUser.phone
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
        const User = "SELECT * FROM user ";
        con.query(User, async (err, result) => {
            if (err) return new Error(err.message);
            const user = JSON.parse(JSON.stringify(result));
            const userEmail = req.cookies['UserLogin'];
            //fetching user email id in database  
            const isUser = await user.find((user) => { return user.email === userEmail });
            //sending user, name and phone number to userUpdate function
            const data = await updateValidation(isUser, req.body.name, req.body.phone);
            console.log(data);
            if (data === true) {
                res.render('home', {
                    message: 'Successfully updated',
                })
            }
            else {
                res.render('editProfile', {
                    message: 'please enter name or phone number'
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