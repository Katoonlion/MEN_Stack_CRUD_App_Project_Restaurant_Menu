const Review = require('../models/review');

module.exports = async (req, res, next) => {
  try {
    // login first
    if (!req.session.user) return res.redirect('/auth/sign-in');

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).send('Review not found');

    const isOwner = String(review.author) === String(req.session.user._id);
    if (!isOwner) return res.status(403).send('Not allowed');

    res.locals.review = review;
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};
