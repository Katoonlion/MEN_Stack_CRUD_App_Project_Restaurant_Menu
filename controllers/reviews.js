const express = require('express');
const router = express.Router();

const Review = require('../models/review');
const MenuItem = require('../models/menuItem');

const isSignedIn = require('../middleware/is-signed-in');

const isReviewOwner = require('../middleware/is-review-owner');

const isReviewOwnerOrAdmin = require('../middleware/is-review-owner-or-admin');

// CREATE review only user (POST /reviews/menu/:menuId)
router.post('/menu/:menuId', isSignedIn, async (req, res) => {
  try {
    if (req.session.user.role !== 'user') {
      return res.status(403).send('Admin cannot write reviews');
    }

    const item = await MenuItem.findById(req.params.menuId);
    if (!item) return res.status(404).send('Menu item not found');

    const rating = Number(req.body.rating);
    const comment = (req.body.comment || '').trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).send('Rating must be 1-5');
    }
    if (!comment) {
      return res.status(400).send('Comment is required');
    }

  await Review.create({
    menuItem: item._id,
    author: req.session.user._id,
    rating,
    comment,
  });

  res.redirect(`/menu/items/${item._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/menu');
  }
});

// EDIT: Only user who create review(GET /reviews/:reviewId/edit)
router.get('/:reviewId/edit', isSignedIn, isReviewOwner, async (req, res) => {

  res.render('reviews/edit', { review: res.locals.review });
});

// UPDATE: Only user who create review (PUT /reviews/:reviewId)
router.put('/:reviewId', isSignedIn, isReviewOwner, async (req, res) => {
  try {  
    const rating = Number(req.body.rating);
    const comment = (req.body.comment || '').trim();

  // const review = await Review.findById(req.params.reviewId);
  // if (!review) return res.status(404).send('Review not found');

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) { 
      return res.status(400).send('Rating must be 1-5'); 
    }   
    if (!comment) { 
      return res.status(400).send('Comment is required'); 
    }

    const review = res.locals.review;
    // review.rating = Number(req.body.rating);
    // review.comment = (req.body.comment || '').trim();
    review.rating = rating; 
    review.comment = comment;

    await review.save();

  res.redirect(`/menu/items/${review.menuItem}`);
  } catch (err) {
    console.log(err);
    res.redirect('/menu');
  }
});


// DELETE (DELETE /reviews/:reviewId)
router.delete('/:reviewId', isSignedIn, isReviewOwnerOrAdmin, async (req, res) => {
  try {
    const review = res.locals.review;

    await Review.findByIdAndDelete(review._id);
  res.redirect(`/menu/items/${review.menuItem}`);
  } catch (err) {
    console.log(err);
    res.redirect('/menu');
  }
});

module.exports = router;

