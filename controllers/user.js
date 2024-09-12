const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('register');
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('login');
}

module.exports.logout = (req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err);}
        else{
            req.flash('success','Successfully logged out');
            res.redirect('/');
        }
    });
}

module.exports.register = async(req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const newUser = new User({username, email });
        const authUser = await User.register(newUser,password);
        req.flash('success','Successfully registered');
        return next();
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/users/register');
    }   
}

module.exports.loginReRoute = async(req,res,next)=>{
    req.flash('success', 'Welcome back!!');
    const redirectTo = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectTo);
}