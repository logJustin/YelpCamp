require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { nouns, adjectives } = require('./seedHelpers');
const Review = require('../models/review');
const Campground = require('../models/campground');
const start = Date.now();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.error(error));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    try {
        // delete all reviews
        const reviews = await Review.deleteMany({});
        console.log(`Deleted ${reviews.deletedCount} reviews`);

        // define array of authors IDs
        const authors = ['64633682aff9401df0358f8d', '64633358d16b169f58104a08', '6460b430e35035f44e755d4b', '6460b236d1efbed3fd6abef1', '645ffda55f1cc4d2e6157394', '645fec8da7f61588d71ffe77'];

        // for each of campgrounds
        const campgrounds = await Campground.find({});
        for (let campground of campgrounds) {
            // define amount of reviews to create
            const reviewsAmount = Math.floor(Math.random() * 5) + 1;

            // create a specificed value of reviews to push into reviewPromises
            const createReview = async (amount) => {
                const reviewPromises = [];
                for (let i = 0; i < amount; i++) {
                    // randomize values for rating, adjectives, nouns, and author
                    const randomRating = Math.floor(Math.random() * 5) + 1;
                    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
                    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
                    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
                    // create a single review & pass in the values
                    const review = new Review({
                        // select a descriptor & noun
                        body: `${campground.title} was a ${randomAdjective.toLowerCase()} ${randomNoun.toLowerCase()}.`,
                        // pick random value of stars
                        rating: randomRating,
                        // access the authors & randomly pick one
                        author: randomAuthor
                    });
                    // push the review into the reviewPromises array
                    console.log(i, campground.location, review.rating, ': ', review.body);
                    reviewPromises.push(review.save());
                }
                // await and save all the reviewPromises to savedReviews
                const savedReviews = await Promise.all(reviewPromises);
                // map the Ids of each review to reviewIds
                const reviewIds = savedReviews.map(review => review._id);

                // save the Reviews' IDs to the campground reviews key 
                campground.reviews = reviewIds;
                // save the campground
                await campground.save();
            };
            await createReview(reviewsAmount);
        }
    } catch (error) {
        console.error(error);
    }
};

seedDB().then(() => {
    mongoose.connection.close();
    const now = new Date().getTime();
    const elapsedTime = (now - start) / 1000; // convert to seconds
    console.log(`Elapsed time: ${elapsedTime} seconds`);
});