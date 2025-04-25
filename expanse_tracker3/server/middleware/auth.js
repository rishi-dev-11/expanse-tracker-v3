// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   const userId = req.headers['x-user-id'];
//   if (!userId || userId === 'guest') {
//     req.user = null;
//     return next();
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(401).json({ error: 'Unauthorized' });
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// module.exports = auth;


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;  // Attach user to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
