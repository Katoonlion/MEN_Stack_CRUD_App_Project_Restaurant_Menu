const isSignedIn = require('./middleware/is-signed-in');
const isAdmin = require('./middleware/is-admin');
const MenuItem = require('./models/menuItem');

// Create form
app.get('/admin/menu/new', isSignedIn, isAdmin, (req, res) => {
  res.render('admin/new-menu-item');
});

// Create
app.post('/admin/menu', isSignedIn, isAdmin, async (req, res) => {
  await MenuItem.create(req.body);
  res.redirect('/menu');
});

// Edit form
app.get('/admin/menu/:id/edit', isSignedIn, isAdmin, async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  res.render('admin/edit-menu-item', { item });
});

// Update
app.put('/admin/menu/:id', isSignedIn, isAdmin, async (req, res) => {
  await MenuItem.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/menu');
});

// Delete
app.delete('/admin/menu/:id', isSignedIn, isAdmin, async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.redirect('/menu');
});
