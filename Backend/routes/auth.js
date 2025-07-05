// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const User = require('../models/User');
// require('dotenv').config();

// // Register Route

// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: 'Please fill all fields' });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     }); 

//     await newUser.save();
//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     console.error('Registration Error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// })

// // Login Route

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: 'Email and password are required.' });

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: 'Invalid email or password.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Invalid email or password.' });

//     const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

//     res.status(200).json({
//       message: 'Login successful!',
//       token,
//       user: { id: user._id, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const user = new User({ email, password, isAdmin });
    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
