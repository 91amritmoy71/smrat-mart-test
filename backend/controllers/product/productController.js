const Product = require('../../models/productModel');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  }
});

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice, category, subcategory,
      brand, model, sku, stock, isFeatured, tags, weight,
      specifications, warranty
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product with this SKU already exists',
        success: false,
        error: true
      });
    }

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${name} image ${index + 1}`,
        isPrimary: index === 0
      }));
    }

    // Parse specifications if it's a string
    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string' ? 
          JSON.parse(specifications) : specifications;
      } catch (e) {
        return res.status(400).json({
          message: 'Invalid specifications format',
          success: false,
          error: true
        });
      }
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      subcategory,
      brand,
      model,
      sku,
      images,
      specifications: parsedSpecifications,
      stock: Number(stock),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      weight: weight ? Number(weight) : undefined,
      warranty: warranty ? JSON.parse(warranty) : undefined,
      createdBy: req.user.id
    });

    await product.save();

    res.status(201).json({
      data: product,
      message: 'Product created successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error creating product',
      success: false,
      error: true
    });
  }
};

// Get All Products (with pagination and filters)
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      isActive,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      },
      message: 'Products fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching products',
      success: false,
      error: true
    });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true
      });
    }

    res.json({
      data: product,
      message: 'Product fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching product',
      success: false,
      error: true
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = { ...req.body };
    
    // Add updatedBy field
    updates.updatedBy = req.user.id;

    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${updates.name || 'Product'} image ${index + 1}`,
        isPrimary: index === 0
      }));
      updates.images = newImages;
    }

    // Parse specifications if it's a string
    if (updates.specifications && typeof updates.specifications === 'string') {
      try {
        updates.specifications = JSON.parse(updates.specifications);
      } catch (e) {
        return res.status(400).json({
          message: 'Invalid specifications format',
          success: false,
          error: true
        });
      }
    }

    // Parse tags if it's a string
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true
      });
    }

    res.json({
      data: product,
      message: 'Product updated successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error updating product',
      success: false,
      error: true
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true
      });
    }

    res.json({
      message: 'Product deleted successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error deleting product',
      success: false,
      error: true
    });
  }
};

// Get Product Statistics (for dashboard)
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $lte: 10, $gt: 0 } });

    // Category wise count
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price category createdAt');

    res.json({
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        outOfStock,
        lowStock,
        categoryStats,
        recentProducts
      },
      message: 'Product statistics fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching product statistics',
      success: false,
      error: true
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats,
  upload
};