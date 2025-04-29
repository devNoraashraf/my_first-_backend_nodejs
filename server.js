
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// استيراد المسارات الخاصة بالمستخدمين
const userRoutes = require('./routes/userRoutes');

// نخلي السيرفر يفهم JSON
app.use(express.json());

// رابط الاتصال بـ MongoDB Atlas
const mongoURI = 'mongodb+srv://noraa4033:zOTGDxmXyO9FMnUQ@cluster0.xasarf2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// ربط قاعدة البيانات بمشروعك
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

// استخدام المسارات الخاصة بالمستخدمين
app.use('/', userRoutes);

// نشغل السيرفر
app.listen(PORT, () => {
  console.log(` http://localhost:${PORT}`);
});
