const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// Create User
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required", success: false, error: true });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false, error: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      role: "GENERAL",
    }).save();

    const { password: _, ...userWithoutPassword } = user.toObject(); // remove password from response

    res.status(201).json({
      data: userWithoutPassword,
      success: true,
      error: false,
      message: "User created",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

// View All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.status(200).json({
      data: users,
      message: "Users fetched successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    if (email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          message: "Email already in use",
          success: false,
          error: true,
        });
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json({
      data: userWithoutPassword,
      message: "User updated",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const { password: _, ...userWithoutPassword } = deleted.toObject();

    res.status(200).json({
      data: userWithoutPassword,
      message: "User deleted",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
