const Camp = require('../models/camp');
const {cloudinary} = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
// const maptilersdk = require('@maptiler/sdk');
// import * as maptilersdk from '../@maptiler/sdk';


maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
// maptilersdk.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index= async (req,res)=>{
    const campgrounds =await Camp.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.showCampground = async(req,res)=>{
    const campground =await Camp.findById(req.params.id)
    .populate({path:'reviews', populate:{path:'author'}})
    .populate('owner', 'username');
    if(!campground){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditForm = async(req,res)=>{
    const campground =await Camp.findById(req.params.id);
    if(!campground){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.createCampground = async(req,res)=>{
    // console.log(req.user);
    const campground = new Camp(req.body.campground);
    const {features} = await maptilerClient.geocoding.forward(campground.location,{limit:1});
    campground.geometry = features[0].geometry;
    console.log(campground.geometry);
    campground.images = req.files.map(f => {return {url:f.path, filename:f.filename}});
    campground.owner = req.user;
    await campground.save();
    req.flash('success','Successfully created new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    
    const {campground, deletes} = req.body;
    const campToUpdate = await Camp.findById(id);
    campToUpdate.images.push(...req.files.map(f => {return {url:f.path, filename:f.filename}}));   
    const updatedCampground = await Camp.findByIdAndUpdate(id,{...campground, images:campToUpdate.images},{new:true});
    // console.log(updatedCampground.images[0].thumbnail);
    if(deletes){
        await Camp.updateOne({_id:id},{$pull:{images:{filename:{$in:deletes}}}});
        for(let file of deletes){
            await cloudinary.uploader.destroy(file);
        }
    }
    req.flash('success','Successfully updated the campground');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
    // res.send("updating!!");
}

module.exports.deleteCampground = async(req,res)=>{
    const campground = await Camp.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the campground');
    res.redirect('/campgrounds');
}