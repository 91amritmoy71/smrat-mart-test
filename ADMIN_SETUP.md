# Smart Mart Admin Panel

## Overview

A comprehensive admin panel for managing the Smart Mart e-commerce platform. This admin panel provides full control over users, products, orders, and system analytics.

## Features

### 🎯 Dashboard
- Real-time statistics and analytics
- Quick action buttons
- System overview
- Recent activity monitoring

### 👥 User Management
- View all users with pagination and search
- Filter users by role (Admin/User) and status (Active/Inactive)
- Edit user details including role management
- Activate/Deactivate user accounts
- User registration analytics

### 📦 Product Management
- Complete product CRUD operations
- Multi-image upload support
- Advanced filtering and search
- Category and brand management
- Stock level monitoring
- Product specifications management
- Bulk operations support

### 🔐 Security Features
- Role-based access control
- JWT token authentication
- Admin-only route protection
- Secure password handling
- Session management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Environment Configuration**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smartmart
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5600
   FRONTEND_URL=http://localhost:5173
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   
   This will create an admin user with:
   - Email: `admin@smartmart.com`
   - Password: `admin123`
   - Role: `ADMIN`

4. **Start Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage

### Accessing Admin Panel

1. **Login as Admin**
   - Go to `http://localhost:5173/login`
   - Use admin credentials:
     - Email: `admin@smartmart.com`
     - Password: `admin123`
   - You'll be automatically redirected to the admin dashboard

2. **Alternative Access**
   - If already logged in as admin, look for the "Admin Panel" button in the top navigation
   - Direct URL: `http://localhost:5173/admin/dashboard`

### Admin Panel Features

#### Dashboard (`/admin/dashboard`)
- View system statistics
- Quick access to user and product management
- Recent activity overview

#### User Management (`/admin/users`)
- **View Users**: Paginated table with search and filters
- **Edit User**: Change user details, role, and status
- **User Roles**: 
  - `GENERAL`: Regular customer
  - `ADMIN`: Administrator with full access
- **User Status**: Active/Inactive toggle

#### Product Management (`/admin/products`)
- **Add Product** (`/admin/products/create`):
  - Basic information (name, description, SKU)
  - Pricing and inventory
  - Category and brand details
  - Multiple image upload
  - Product specifications
  - Settings (featured, active status)

- **Edit Product** (`/admin/products/edit/:id`):
  - Update all product details
  - Manage product images
  - Update specifications

- **Product Features**:
  - Categories: Mobile, Laptop, Tablet, Accessories, Audio, Camera, Gaming, Smart Home, Wearables, Other
  - Stock management with low stock alerts
  - Featured product designation
  - Active/Inactive status control

## API Endpoints

### Authentication
- `POST /api/signin` - User login
- `GET /api/userlogout` - User logout
- `GET /api/profile` - Get user profile (protected)

### Admin Routes (All require admin authentication)
Base URL: `/api/admin`

#### Products
- `GET /api/admin/products` - Get all products (with pagination, search, filters)
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/:id` - Get single product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products/stats/overview` - Product statistics

#### Users
- `GET /api/admin/users` - Get all users (with pagination, search, filters)
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user (including role management)
- `DELETE /api/admin/users/:id` - Deactivate user
- `GET /api/admin/users/stats/overview` - User statistics

#### Dashboard
- `GET /api/admin/dashboard/overview` - Dashboard statistics

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['GENERAL', 'ADMIN'], default: 'GENERAL'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  originalPrice: Number,
  category: String (required, enum: categories),
  subcategory: String,
  brand: String (required),
  model: String,
  sku: String (required, unique),
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  specifications: Map,
  stock: Number (required, default: 0),
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  rating: { average: Number, count: Number },
  tags: [String],
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number },
  warranty: { duration: Number, type: String },
  createdBy: ObjectId (ref: 'user'),
  updatedBy: ObjectId (ref: 'user'),
  timestamps: true
}
```

## Security Considerations

1. **Authentication**: JWT-based authentication with secure token handling
2. **Authorization**: Role-based access control (RBAC)
3. **Password Security**: bcrypt hashing with salt rounds
4. **Route Protection**: Admin middleware for sensitive operations
5. **Input Validation**: Server-side validation for all inputs
6. **File Upload Security**: Secure image upload with file type validation

## Troubleshooting

### Common Issues

1. **Admin Panel Not Accessible**
   - Ensure you're logged in with an admin account
   - Check if the user role is set to 'ADMIN'
   - Verify JWT token in localStorage

2. **Database Connection Issues**
   - Check MongoDB connection string in .env
   - Ensure MongoDB service is running
   - Verify database permissions

3. **Image Upload Issues**
   - Check if uploads directory exists: `backend/uploads/products`
   - Verify file permissions
   - Ensure file size limits are configured

4. **Authentication Errors**
   - Verify JWT_SECRET in environment variables
   - Check token expiration (24h default)
   - Clear localStorage and login again

### Development Tips

1. **Adding New Features**
   - Follow the existing pattern for new routes
   - Add appropriate middleware for authentication/authorization
   - Update the frontend components accordingly

2. **Database Seeding**
   - Use the provided admin creation script
   - Create additional test data as needed
   - Backup production data before major changes

3. **Frontend Development**
   - Components are organized in `frontend/src/pages/admin/`
   - Shared admin components in `frontend/src/components/admin/`
   - Use Bootstrap components for consistent styling

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Verify environment configuration
4. Check database connectivity

---

**Note**: This admin panel is designed for development and testing. For production use, implement additional security measures such as:
- Rate limiting
- CSRF protection
- Enhanced input validation
- Audit logging
- Backup procedures