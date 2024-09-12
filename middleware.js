const {campgroundValidationSchema,reviewValidationSchema} = require('./campgroundValidate');
const Camp = require('./models/camp');
const AppError = require('./utils/AppError');
const Review = require('./models/review');

module.exports.isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.requestedUrl = req.originalUrl;
        req.flash('error', 'Sorry! You need to login to proceed');
        return res.redirect('/users/login');
    }
    next()
}

module.exports.savePath = (req,res,next)=>{
    if(req.session.requestedUrl){
        res.locals.returnTo = req.session.requestedUrl;
    }else res.locals.returnTo = '/campgrounds'
    next();
}

module.exports.validateCampground = function(req,res,next){
    const {error} = campgroundValidationSchema.validate(req.body);
    if(error){
        const message = error.details.map(el=>el.message).join(',');
        throw new AppError(message,400);
    }
    next()
}

module.exports.validateReview = function(req,res,next){
    const {error} = reviewValidationSchema.validate(req.body);
    if(error){
        const message = error.details.map(el=>el.message).join(',');
        throw new AppError(message,400);
    }
    next()
}

module.exports.isAuthorized = async function(req,res,next){
    const {id} = req.params;
    const campground = await Camp.findById(id).populate('owner');
    if(!campground){
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds')
    }
    if(!campground.owner._id.equals(req.user._id)){
        req.flash('error','Sorry! You are not authorized for this action');
        return res.redirect(`/campgrounds/${id}`);
    }
    else
        next();
}

module.exports.isReviewAuthorized =async function(req,res,next){
    const {id,reviewId} = req.params;
    const review =await Review.findById(reviewId).populate('author');
    if(!review){
        req.flash('error', 'You are requesting for a review that does not exist');
        res.redirect(`/campgrounds/${id}`);
    }
    if(!review.author._id.equals(req.user._id)){
        req.flash('error', 'You are not authorized for this action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}