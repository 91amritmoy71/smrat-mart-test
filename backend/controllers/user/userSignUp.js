const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// Create User
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new Error("All fields are required");

    if (await userModel.findOne({ email })) throw new Error("User already exists");

    const user = await new userModel({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: "GENERAL",
    }).save();

    res.status(201).json({ data: user, success: true, error: false, message: "User created" });
  } catch (err) {
    res.json({ message: err.message || err, error: true, success: false });
  }
};

// View All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong", success: false, error: true });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = bcrypt.hashSync(password, 10);

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedUser) throw new Error("User not found");

    res.json({ data: updatedUser, success: true, error: false, message: "User updated" });
  } catch (err) {
    res.status(400).json({ message: err.message || err, success: false, error: true });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("User not found");

    res.json({ data: deleted, success: true, error: false, message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message || err, success: false, error: true });
  }
};


// Export All Controllers
module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
