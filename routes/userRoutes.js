const express = require('express');
const router = express.Router();
const { registerUser, loginUser,deleteUser } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware'); 


router.post('/register', registerUser);


router.post('/login', loginUser);


router.get('/users', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Authorized to view users.' });
});

router.put('/update', verifyToken, (req, res) => {
  res.status(200).json({ message: 'User data updated successfully.' });
});
router.delete('/delete', verifyToken, deleteUser); 

module.exports = router;
