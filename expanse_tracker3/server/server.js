// require('dotenv').config(); // <-- ADD THIS LINE FIRST
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const expenseRoutes = require('./routes/expenses');
// const { connectDB } = require('./config/db');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/expenses', expenseRoutes);

// // Initialize demo users
// const User = require('./models/User');
// app.get('/api/init', async (req, res) => {
//   try {
//     await User.deleteMany({});
//     await User.create([
//       { name: 'Demo User 1', email: 'demo1@example.com', password: 'password123' },
//       { name: 'Demo User 2', email: 'demo2@example.com', password: 'password123' },
//     ]);
//     res.json({ message: 'Demo users initialized' });
//   } catch (error) {
//     res.status(500).json({ error: 'Initialization failed' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require('dotenv').config(); // <-- Make sure to load environment variables first
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const { connectDB } = require('./config/db');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Initialize demo users with hashed passwords
const User = require('./models/User');
app.get('/api/init', async (req, res) => {
  try {
    await User.deleteMany({});

    // Demo user passwords should be hashed
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);

    await User.create([
      { name: 'Demo User 1', email: 'demo1@example.com', password: hashedPassword1 },
      { name: 'Demo User 2', email: 'demo2@example.com', password: hashedPassword2 },
    ]);
    
    res.json({ message: 'Demo users initialized' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Initialization failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
