const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.route('/:reviewId')
    .get(isLoggedIn, isReviewAuthor, reviews.renderReviewForm)
    .put(isLoggedIn, isReviewAuthor, catchAsync(reviews.updateReview))
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;