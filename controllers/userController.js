
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // استدعاء الـ Model الخاص بالمستخدمين

const JWT_SECRET = 'noura_super_secret_key';

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'مطلوب تكتبي الاسم والإيميل وكلمة السر' });
  }

  // نتحقق لو الإيميل موجود بالفعل
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'الإيميل ده مسجل قبل كده' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10); // تشفير الباسورد

  // إنشاء مستخدم جديد في MongoDB
  const user = new User({ name, email, password: hashedPassword });

  try {
    await user.save(); // حفظ المستخدم في MongoDB
    res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'فشل في تسجيل المستخدم' });
  }
};

// تسجيل الدخول
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'مطلوب تكتبي الإيميل وكلمة السر' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'الإيميل أو كلمة السر غلط' });
  }

  // نتحقق من كلمة السر المشفرة
  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'الإيميل أو كلمة السر غلط' });
  }

  // نصنع توكن للمستخدم
  const token = jwt.sign(
    { email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'تسجيل الدخول ناجح، أهلا بيك!',
    token: token
  });
};

module.exports = {
  registerUser,
  loginUser
};
