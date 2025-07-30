const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userSignUp");
const userSignIN = require("../controllers/user/userSignIN");
const userLogout = require("../controllers/user/userLogOut");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", userController.createUser);
router.get("/users", userController.getAllUsers);
router.put("/update/users/:id", userController.updateUser);
router.delete("/delete/users/:id", userController.deleteUser);

//User sign in 
router.post("/signin",userSignIN);
//User Log Out
router.get("/userlogout",userLogout);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: "Welcome to protected route", user: req.user });
});

module.exports = router;
