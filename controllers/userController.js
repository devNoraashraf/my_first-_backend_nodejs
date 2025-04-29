const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // استدعاء الـ Model الخاص بالمستخدمين

const JWT_SECRET = 'noura_super_secret_key'; // السر المستخدم لتوقيع التوكن

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // التأكد من أن كل البيانات موجودة
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'مطلوب تكتبي الاسم والإيميل وكلمة السر' });
  }

  // التحقق إذا كان الإيميل موجودًا بالفعل في قاعدة البيانات
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'الإيميل ده مسجل قبل كده' });
  }

  // تشفير كلمة السر
  const hashedPassword = bcrypt.hashSync(password, 10);

  // إنشاء مستخدم جديد في MongoDB
  const user = new User({ name, email, password: hashedPassword });

  try {
    // حفظ المستخدم في MongoDB
    await user.save();
    res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'فشل في تسجيل المستخدم' });
  }
};

// تسجيل الدخول
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // التأكد من إدخال الإيميل وكلمة السر
  if (!email || !password) {
    return res.status(400).json({ message: 'مطلوب تكتبي الإيميل وكلمة السر' });
  }

  // البحث عن المستخدم في قاعدة البيانات
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'الإيميل أو كلمة السر غلط' });
  }

  // التحقق من كلمة السر باستخدام bcrypt
  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'الإيميل أو كلمة السر غلط' });
  }

  // إنشاء توكن JWT للمستخدم
  const token = jwt.sign(
    { email: user.email, name: user.name, id: user._id }, // بيانات التوكن
    JWT_SECRET, // السر الذي يستخدم لتوقيع التوكن
    { expiresIn: '1h' } // صلاحية التوكن لمدة ساعة
  );

  // إرجاع التوكن للمستخدم
  res.status(200).json({
    message: 'تسجيل الدخول ناجح، أهلا بيك!',
    token: token
  });
};

// تحديث بيانات المستخدم
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id; // نأخذ ID المستخدم من التوكن الذي تحققنا منه في الـ Middleware

  try {
    // تحديث بيانات المستخدم
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true } // نطلب إرجاع البيانات بعد التحديث
    );
    res.status(200).json(updatedUser); // إرجاع بيانات المستخدم المحدثة
  } catch (error) {
    res.status(500).json({ message: 'Error updating user.' });
  }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id; // نأخذ ID المستخدم من التوكن الذي تم التحقق منه في الـ Middleware
  
    try {
      // حذف المستخدم من قاعدة البيانات باستخدام ID
      await User.findByIdAndDelete(userId);
  
      // إرجاع رسالة النجاح بعد الحذف
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      // إذا حدث خطأ أثناء الحذف
      res.status(500).json({ message: 'Error deleting user.' });
    }
  };
  

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser
};
