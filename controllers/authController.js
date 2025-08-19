const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { registerValidation } = require('../validators/userValidation');

exports.register = asyncHandler(async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, phone, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: '📛 User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    address
  });

  await user.save();

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );

  res.status(201).json({
    message: '✅ User registered successfully',
    token
  });
});

