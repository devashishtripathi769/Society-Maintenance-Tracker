// backend/utils/seedAdmin.js
const User = require('../models/User');

async function seedAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) return;
  await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin'
  });
  console.log('Seeded admin account:', process.env.ADMIN_EMAIL);
}

module.exports = seedAdmin;