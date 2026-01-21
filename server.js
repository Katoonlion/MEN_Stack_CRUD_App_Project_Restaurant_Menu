// 1. Import Modules Package
const dotenv = require('dotenv').config();
const express = require('express');

const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const morgan = require('morgan');
const session = require('express-session');

// require our new middleware!
// const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');

// server.js
// const applicationsController = require('./controllers/applications.js');

const port = process.env.PORT ? process.env.PORT : '3000';
// Let's connect to MongoDB using the
// connection string from the .env file
mongoose.connect(process.env.MONGODB_URI);

// Let's keep an eye open to see we get 
// connected to MongoDB

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import full menu from menu data
const MenuItem = require('./models/menuItem');

// Require admin controller
const menuAdminController = require('./controllers/menuAdmin');

// Require user review
const Review = require('./models/review');
const reviewsController = require('./controllers/reviews');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passUserToView);

// Controllers
app.use('/auth', authController);
app.use('/reviews', reviewsController);

// Admin controller
app.use('/admin/menu', menuAdminController);

// Home css
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => { 
  // res.send('Restaurant Menu');
  res.render('home');
});

// app.get('/sign-up', (req, res) => {
//   res.render('auth/sign-up');
// });

// app.get('/sign-in', (req, res) => {
//   res.render('auth/sign-in');
// });

app.get('/menu', async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });

  const groupedMenu = {};
  items.forEach(item => {
    if (!groupedMenu[item.category]) {
      groupedMenu[item.category] = [];
    }
    groupedMenu[item.category].push(item);
  });
  const categoryMenu = ['starter', 'soup', 'grill', 'main', 'desserts', 'drink'];
    // res.locals.groupedMenu = groupedMenu;
    // res.render('menu');
    res.render('menu', { groupedMenu, categoryMenu });
});

// Menu items by ID
app.get('/menu/items/:id', async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) return res.status(404).send('This menu item not found');

  const reviews = await Review.find({ menuItem: item._id })
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  // res.locals.item = item;
  // res.render('menu/show');

  res.render('menu/show', { item, reviews });
});

// Menu category
app.get('/menu/:category', async (req, res) => {
    const categoryParam = req.params.category.toLowerCase();

  const menuItems = await MenuItem.find({ category: categoryParam }).sort({ name: 1 });

  const categoryName =
    categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
  // "mains" → "M+ains" → "Mains" 
  // Send data to views
    // res.locals.menuItems = menuItems;
    // res.locals.categoryName = categoryName;   
    // res.render('category');
    res.render('category', { menuItems, categoryName });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});