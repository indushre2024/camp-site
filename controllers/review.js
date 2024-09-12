const Review = require('../models/review');
const Camp = require('../models/camp');

module.exports.createReview = async (req,res,next)=>{
    // console.log(req.body.review);
    const review = new Review(req.body.review);
    review.author = req.user;
    const campground =await Camp.findById(req.params.id);
    await review.save();
    if(campground){
        campground.reviews.push(review);
    }
    else{
        throw new AppError('Campground not found', 400);
    }
    await campground.save()
    req.flash('success','Successfully created the review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req,res,next)=>{
    const {id, reviewId} = req.params;
    const campground = await Camp.findById(id)
    await Review.findByIdAndDelete(reviewId);
    if(campground){
        await Camp.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    }
    res.redirect(`/campgrounds/${id}`);

}
