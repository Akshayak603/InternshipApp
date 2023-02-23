const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users=require('../controllers/users');
const {alreadyLoggedIn}=require('../middleware');//authentication middleware


router.route('/register')
        .get(users.renderRegister)
        .post(catchAsync(users.register));

router.route('/login')
    .get(alreadyLoggedIn,users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

//forgot
router.route('/forgot')
    .get(users.renderforgot)
    .post(users.forgot)

//reset
router.route('/reset/:token')
    .get(users.renderReset)
    .post(users.reset)

module.exports = router;