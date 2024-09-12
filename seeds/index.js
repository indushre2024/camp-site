const mongoose = require('mongoose');
const Camp = require('../models/camp');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const maptilerClient = require('@maptiler/client');

maptilerClient.config.apiKey = 'nybDUgV3dsZQPCRRqL1M';

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(s=>{
    console.log("Successfully Connected to Mongo");
})
.catch(e=>{
    console.log("Error connecting to MongoDB");
})

const randomPick = arr => arr[Math.floor(Math.random()*arr.length)];

const seedDb = async function(){
    await Camp.deleteMany({});
    for(let i=0;i<250;i++){
        const randomCity = cities[Math.floor(Math.random() * cities.length)]
        const camp = new Camp({
            owner:'668edfc00f6fe91d68060501',
            location: `${randomCity.city}, ${randomCity.state}`,
            title: `${randomPick(descriptors)} ${randomPick(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/dwfqvxw3u/image/upload/v1720910419/yelp-camp/w2hcnmxjaap1hnoutvol.jpg',
                filename: 'yelp-camp/w2hcnmxjaap1hnoutvol',
                _id:'66930255cf26033317e4b970'
              },
              {
                url: 'https://res.cloudinary.com/dwfqvxw3u/image/upload/v1720910419/yelp-camp/dczegqupiv3svbzlkliz.jpg',
                filename: 'yelp-camp/dczegqupiv3svbzlkliz',
                _id:'66930255cf26033317e4b971'
              }
          ],
            price: Math.floor(Math.random()*40) + 19,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum adipisci quasi ratione eveniet eaque, quia facere quae porro voluptatum, veniam reiciendis aliquam quibusdam quis illum minima totam id iure eos."
        })
        const {features} = await maptilerClient.geocoding.forward(camp.location,{limit:1});
        camp.geometry = features[0].geometry;
        await camp.save();
    }
    
}

seedDb().then(s=>{
    console.log("All the data seeded");
    mongoose.connection.close();
})
.catch(e=>{
    console.log("Seeding the data failed!!!");
    console.log(e.message);
    mongoose.connection.close();
})

