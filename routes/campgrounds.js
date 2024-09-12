const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn,validateCampground,isAuthorized} = require('../middleware');
const campgroundController = require('../controllers/campground')
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});



router.route('/')
    .get(wrapAsync(campgroundController.index))
    .post(isLoggedIn,upload.array('campground[images]'),validateCampground, wrapAsync(campgroundController.createCampground))
    

router.get('/new',isLoggedIn,campgroundController.renderNewForm)

router.route('/:id')
    .get(wrapAsync(campgroundController.showCampground))
    .put(isLoggedIn,wrapAsync(isAuthorized),upload.array('campground[images]'),validateCampground,wrapAsync(campgroundController.updateCampground))
    .delete(isLoggedIn,wrapAsync(isAuthorized),wrapAsync(campgroundController.deleteCampground))

router.get('/:id/edit',isLoggedIn,wrapAsync(isAuthorized),wrapAsync(campgroundController.renderEditForm))

module.exports = router;