const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  // console.log('SIGN UP BODY:', req.body);
  // console.log('CONFIRM:', req.body.password, req.body.confirmPassword);

  try {
    // Admin role have just only one
    const reserved = ['admin'];
    if (reserved.includes(req.body.username.toLowerCase())) {
      return res.send('This username is reserved.');
    }

    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.send('Username already taken. Please try again.');
    }
  
    // Username is not taken already!
    // Check if the password and confirm password match

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }
  
    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  
    // All ready to create the new user!
    await User.create({
      username: req.body.username,
      password: hashedPassword,
      role: 'user',
    });

    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
req.session.user = {
  username: userInDatabase.username,
  _id: userInDatabase._id,
  role: userInDatabase.role,
};

  
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
