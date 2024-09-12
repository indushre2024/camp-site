const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String,
})


imageSchema.virtual('thumbnail').get(function(){
    return `https://res.cloudinary.com/dwfqvxw3u/image/upload/w_150/v1720910419/${this.filename}`;
})

const citySchema = new mongoose.Schema({
    type:{
        type: String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true
    },
    _id:false
})

const campSchema = new mongoose.Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    geometry:citySchema,
    images:[imageSchema],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
        
    ]
},{toJSON: { virtuals: true }})

campSchema.virtual('properties.mag').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

campSchema.post('findOneAndDelete',async(campground)=>{
    console.log("Hitting mongoose delete MW");
    if(campground){
        await Review.deleteMany({_id:{$in:campground.reviews}});
    }
})

const Camp = mongoose.model('Camp',campSchema);

module.exports = Camp;