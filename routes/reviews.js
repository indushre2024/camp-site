const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review');
const {isLoggedIn, validateReview, isReviewAuthorized} = require('../middleware');
const reviewController = require('../controllers/review');



router.post('/',isLoggedIn,validateReview, wrapAsync(reviewController.createReview))

router.delete('/:reviewId',isLoggedIn,wrapAsync(isReviewAuthorized), wrapAsync(reviewController.deleteReview))


module.exports = router;