const express = require('express');
const router = express.Router();
const {savePath} = require('../middleware');

const wrapAsync = require('../utils/wrapAsync');
const passport= require('passport');
const userRoute = require('../controllers/user')


router.route('/register')
    .get(userRoute.renderRegisterForm)
    .post(wrapAsync(userRoute.register),passport.authenticate('local',{failureFlash:true, failureRedirect:'/users/login'}),(req,res,next)=>{
        res.redirect('/campgrounds');
    })

router.route('/login')
    .get(userRoute.renderLoginForm)
    .post(savePath,
        passport.authenticate('local',{failureFlash:true, failureRedirect:'/users/login'}),
        wrapAsync(userRoute.loginReRoute))


router.get('/logout',userRoute.logout)



module.exports = router;