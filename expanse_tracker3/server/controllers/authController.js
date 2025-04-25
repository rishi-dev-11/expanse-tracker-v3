// const User = require('../models/User');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: 'User already exists' });

//     user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(400).json({ error: 'Registration failed' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }
//     res.json({ user: { _id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(400).json({ error: 'Login failed' });
//   }
// };

// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.headers['x-user-id']);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json({ user: { _id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to fetch user' });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const update = { name, email };
//     if (password) update.password = password;
//     const user = await User.findByIdAndUpdate(req.headers['x-user-id'], update, { new: true });
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json({ user: { _id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to update profile' });
//   }
// };



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User is your model

// Register endpoint
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET, // Secret key for JWT (use a secure key in production)
      { expiresIn: '1h' }
    );

    // Send token and user info back
    res.json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login endpoint
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get logged-in user data
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error during profile update' });
  }
};
