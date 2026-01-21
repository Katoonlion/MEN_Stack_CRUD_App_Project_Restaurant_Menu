const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true }
  }, 

{ timestamps: true }
);

// Create the model based on the schema
const Review = mongoose.model('Review', reviewSchema);

// Export it to the world
module.exports = Review;