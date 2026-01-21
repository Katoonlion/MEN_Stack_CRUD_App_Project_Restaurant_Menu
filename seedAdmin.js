const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/user');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    const existing = await User.findOne({ username });
    if (existing) {
      console.log('Admin already exists:', existing.username);
      process.exit(0);
    }

        const username = 'admin';          // can change later
    const plainPassword = 'admin1234'; // can change later

    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    const adminUser = await User.create({
      username,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Created admin:', adminUser.username);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
