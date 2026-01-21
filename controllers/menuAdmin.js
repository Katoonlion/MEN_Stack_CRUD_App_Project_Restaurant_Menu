const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');
const isAdmin = require('../middleware/is-admin');

// const menuAdminController = require('./controllers/menuAdmin');
// app.use('/admin/menu', menuAdminController);


// List menu
router.get('/', isAdmin, async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  res.render('admin/index', { items });
});

// form Add menu
router.get('/new', isAdmin, (req, res) => {
  res.render('admin/new', { });
});


// Create new menu
router.post('/', isAdmin, async (req, res) => {
  await MenuItem.create({
    name: req.body.name,
    price: Number(req.body.price),
    rating: Number(req.body.rating),
    category: req.body.category,
    details: req.body.details,
  });
  res.redirect('/admin/menu');
});

// form edit
router.get('/:id/edit', isAdmin, async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).send('Menu item not found');
  res.render('admin/edit', { item });
});

// Update menu
router.put('/:id', isAdmin, async (req, res) => {
  await MenuItem.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: Number(req.body.price),
    rating: Number(req.body.rating),
    category: req.body.category,
    details: req.body.details,
  });
  res.redirect('/admin/menu');
});

// delete menu
router.delete('/:id', isAdmin, async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.redirect('/admin/menu');
});

module.exports = router;
