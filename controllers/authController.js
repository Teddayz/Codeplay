//user_signup_post, user_login_post, user_signup_get, user_login_get, user_logout_get
const passport = require('passport');
const User = require('../models/user');

const user_signup_post = async (req, res) => {
    const { username, password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/signup');
    }
    
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.redirect('/auth/login');
    } catch(e) {
        req.flash('error_msg', 'Username already exists.')
        res.redirect('/auth/signup');
    }
};

//can change quizzes to homepage in the future
const user_login_post = passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/auth/login',
    failureFlash: true
});

const user_signup_get = (req, res) => {
    res.render('auth/signup', { title: 'Sign Up'});
};

const user_login_get = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};

const user_logout_get = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });
};

module.exports = {
    user_signup_get,
    user_signup_post,
    user_login_get,
    user_login_post,
    user_logout_get
};