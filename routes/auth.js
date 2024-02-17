const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User') // rectreve users form database 'use model'
const initializePassport = require('./passport') // require the passport


//initialize passport 
initializePassport(passport, async (username) => {
    return await User.findOne({ username: username })
});

//middleware
router.use(express.urlencoded({ extended: true }))
router.use(express.json());
router.use(require('express-flash')())

//user sign up
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        if(res.status(200)){
            res.render('signin', { title: 'Sign In'});
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})


// User signin
router.post('/signin', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        if (!user) {
            //if the user is not dound
            const errorMessage = info && info.message ? info.message : 'Invalid username or password';
            return res.render('signin', { title: 'Sign In', messages: { error: errorMessage } });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).send('Internal server error');
            }
            //go to profile
            return res.render('profile', { title: 'Profile', user: req.user });
        });
    })(req, res);
});

// User logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router

