const Review = require('../models/review');

module.exports = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).send('Review not found');

  const user = req.session.user;
  const isOwner = review.author.toString() === user._id;
  const isAdmin = user.role === 'admin';

  //  EDIT: Only user who is create the review (admin can not access)
  if (req.method === 'PUT' && !isOwner) {
    return res.status(403).send('Only the review owner can edit');
  }

  //  DELETE: Admin or user who is create the review
  if (req.method === 'DELETE' && !(isOwner || isAdmin)) {
    return res.status(403).send('Not allowed to delete this review');
  }

  res.locals.review = review;
  next();
};
