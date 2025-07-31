const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const productController = require('../controllers/product/productController');
const userController = require('../controllers/user/userSignUp');
const userModel = require('../models/userModel');

// Apply authentication and admin middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ===== PRODUCT MANAGEMENT ROUTES =====

// Create product (with multiple image upload)
router.post('/products', productController.upload.array('images', 5), productController.createProduct);

// Get all products with filters and pagination
router.get('/products', productController.getAllProducts);

// Get single product
router.get('/products/:id', productController.getProductById);

// Update product
router.put('/products/:id', productController.upload.array('images', 5), productController.updateProduct);

// Delete product
router.delete('/products/:id', productController.deleteProduct);

// Get product statistics for dashboard
router.get('/products/stats/overview', productController.getProductStats);

// ===== USER MANAGEMENT ROUTES =====

// Get all users
router.get('/users', userController.getAllUsers);

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        error: true
      });
    }
    res.json({
      data: user,
      message: 'User fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching user',
      success: false,
      error: true
    });
  }
});

// Update user (including role management)
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive, ...otherUpdates } = req.body;
    const updates = { ...otherUpdates };
    
    // Only allow role and isActive updates by admin
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        error: true
      });
    }

    res.json({
      data: user,
      message: 'User updated successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error updating user',
      success: false,
      error: true
    });
  }
});

// Delete user (soft delete by setting isActive to false)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        error: true
      });
    }

    res.json({
      data: user,
      message: 'User deactivated successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error deactivating user',
      success: false,
      error: true
    });
  }
});

// Get user statistics for dashboard
router.get('/users/stats/overview', async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const activeUsers = await userModel.countDocuments({ isActive: true });
    const adminUsers = await userModel.countDocuments({ role: 'ADMIN' });
    const inactiveUsers = await userModel.countDocuments({ isActive: false });

    // Recent users
    const recentUsers = await userModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt isActive');

    // Users by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers,
        recentUsers,
        usersByMonth
      },
      message: 'User statistics fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching user statistics',
      success: false,
      error: true
    });
  }
});

// ===== DASHBOARD OVERVIEW =====

router.get('/dashboard/overview', async (req, res) => {
  try {
    // Get all stats in parallel
    const [userStats, productStats] = await Promise.all([
      // User stats
      Promise.all([
        userModel.countDocuments(),
        userModel.countDocuments({ isActive: true }),
        userModel.countDocuments({ role: 'ADMIN' })
      ]),
      // Product stats
      Promise.all([
        userModel.findOne({ _id: { $exists: true } }).countDocuments() > 0 ? 
          require('../models/productModel').countDocuments() : 0,
        userModel.findOne({ _id: { $exists: true } }).countDocuments() > 0 ? 
          require('../models/productModel').countDocuments({ isActive: true }) : 0,
        userModel.findOne({ _id: { $exists: true } }).countDocuments() > 0 ? 
          require('../models/productModel').countDocuments({ stock: 0 }) : 0
      ])
    ]);

    res.json({
      data: {
        users: {
          total: userStats[0],
          active: userStats[1],
          admins: userStats[2]
        },
        products: {
          total: productStats[0],
          active: productStats[1],
          outOfStock: productStats[2]
        }
      },
      message: 'Dashboard overview fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching dashboard overview',
      success: false,
      error: true
    });
  }
});

module.exports = router;