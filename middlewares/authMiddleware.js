const jwt = require('jsonwebtoken');
const JWT_SECRET = 'noura_super_secret_key'; // هذا هو السر الذي تستخدمه لتوقيع التوكن

// هذا الـ middleware يتحقق من صحة التوكن
const verifyToken = (req, res, next) => {
  // التوكن يجب أن يكون في الـ Header مع الكلمة "Bearer"
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // التحقق من صحة التوكن باستخدام JWT
    const decoded = jwt.verify(token, JWT_SECRET); // فك التوكن والتحقق منه
    req.user = decoded; // تخزين بيانات التوكن في `req.user`
    next(); // المتابعة للمسار التالي
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
