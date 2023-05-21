if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors, images, campgroundDescriptions } = require('./seedHelpers')
const Campground = require('../models/campground')
const authors = ['64633682aff9401df0358f8d', '64633358d16b169f58104a08', '6460b430e35035f44e755d4b', '6460b236d1efbed3fd6abef1', '645ffda55f1cc4d2e6157394', '645fec8da7f61588d71ffe77']

mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const start = Date.now();
const sample = (array) => { return array[Math.floor(Math.random() * array.length)] };

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 301; i++) {
        // define variables to parse into the campground
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const amountOfImages = Math.floor(Math.random() * 5);
        const randomDescription = campgroundDescriptions[Math.floor(Math.random() * campgroundDescriptions.length)];
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        const imageArray = [];

        // define a random amount of images, then pick a random image from images array
        for (let int = 0; int <= amountOfImages; int++) {
            const randomImage = await Math.floor(Math.random() * images.length);
            await imageArray.push(images[randomImage]);
        }

        // create a new campground with the variables parsedin
        const camp = new Campground({
            author: randomAuthor,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: randomDescription,
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: imageArray
        });

        // save the campground
        console.log(`${i}: ${camp.title}, ${camp.location}`);
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
    const now = new Date().getTime();
    const elapsedTime = (now - start) / 1000; // convert to seconds
    console.log(`Elapsed time: ${elapsedTime} seconds`);
})