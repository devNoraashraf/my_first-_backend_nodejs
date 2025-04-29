const mongoose = require('mongoose');

// إنشاء Schema للمستخدمين
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// إنشاء Model بناءً على الـ Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
