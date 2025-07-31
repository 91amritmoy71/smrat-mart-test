const userModel = require('../models/userModel');

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated (should come after authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        success: false,
        error: true
      });
    }

    // Get user details from database
    const user = await userModel.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        success: false,
        error: true
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account is disabled',
        success: false,
        error: true
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Admin access required',
        success: false,
        error: true
      });
    }

    // Add full user object to request
    req.admin = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying admin privileges',
      success: false,
      error: true
    });
  }
};

module.exports = adminMiddleware;