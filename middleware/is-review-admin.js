const Review = require('../models/review');

module.exports = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).send('Review not found');

    const isOwner = review.author.toString() === req.session.user?._id;
    const isAdmin = req.session.user?.role === 'admin';

    if (isOwner || isAdmin) {
      res.locals.review = review;
      return next();
    }

    return res.status(403).send('Forbidden');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
};