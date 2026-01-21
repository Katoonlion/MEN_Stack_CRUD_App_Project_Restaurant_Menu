const Review = require('../models/review');

module.exports = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).send('Review not found');

    const isOwner = String(review.author) === String(req.session.user._id);
    const isAdmin = req.session.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).send('Forbidden');

    res.locals.review = review; 
    next();
  } catch (err) {
    console.log(err);
    res.redirect('/menu');
  }
};
