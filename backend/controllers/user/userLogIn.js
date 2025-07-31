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

    const token = jwt.sign({ _id: user._id, email }, process.env.JWT, { expiresIn: '3h' });

    res.cookie("token", token, { httpOnly: true}).status(200).json({
      message: "Login successful",
      data: token,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({ message: err.message || err, success: false, error: true });
  }
};
