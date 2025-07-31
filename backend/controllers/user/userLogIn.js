const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required");

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new Error("Invalid email or password");

    if (!user.isActive) {
      throw new Error("Account is disabled. Please contact support.");
    }

    // Update last login
    await userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Remove password from user data
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.cookie("token", token, { httpOnly: true}).status(200).json({
      message: "Login successful",
      token: token,
      user: userWithoutPassword,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({ 
      message: err.message || err, 
      success: false, 
      error: true 
    });
  }
};
