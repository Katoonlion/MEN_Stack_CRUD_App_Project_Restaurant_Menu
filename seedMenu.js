require('dotenv').config();
const mongoose = require('mongoose');

const MenuItem = require('./models/menuItem');
const menuData = require('./data/MenuData');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
   
    await MenuItem.deleteMany({});

    await MenuItem.insertMany(menuData);

    console.log(`Seeded ${menuData.length} menu items`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
