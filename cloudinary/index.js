const cloudinary = require('cloudinary').v2;
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const storage = new multerStorageCloudinary.CloudinaryStorage({
    cloudinary,
    params:{
        folder:'yelp-camp',
        allowedFormats:['jpg','png','jpeg']
    }
})

module.exports = {storage,cloudinary,multerStorageCloudinary};