// Imorting stuff

const mongoose = require('mongoose');

// Create the schema
const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5 },
    category: { type: String, required: true },
    details: { type: String },
  }, 
  { timestamps: true }
);
// Create the model based on the schema
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Export it to the world
module.exports = MenuItem;