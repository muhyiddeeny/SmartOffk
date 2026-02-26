
// // // // // backend/controllers/userController.js

// const User = require("../models/user");
// const generateToken = require("../utils/generateToken");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, regNumber, password, role } = req.body;
//     const userData = { name, password, role: role || "student" };

//     if (role === 'student') {
//       userData.regNumber = regNumber;
//       userData.email = undefined; // CRITICAL: Must be undefined for sparse index
//     } else {
//       userData.email = email;
//       userData.regNumber = undefined;
//     }

//     const user = await User.create(userData);
//     res.status(201).json({ 
//       user: { _id: user._id, name: user.name, role: user.role, regNumber: user.regNumber }, 
//       token: generateToken(user) 
//     });
//   } catch (err) {
//     if (err.code === 11000) return res.status(400).json({ message: "User already exists" });
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;
//     const user = await User.findOne({ $or: [{ email: identifier }, { regNumber: identifier }] });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     res.json({ user: { _id: user._id, name: user.name, role: user.role, regNumber: user.regNumber }, token: generateToken(user) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.profile = async (req, res) => {
//   res.json(req.user);
// };

const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, regNumber, password, role } = req.body;
    const userData = { name, password, role: role || "student" };
    if (role === 'student') {
      userData.regNumber = regNumber;
      userData.email = undefined;
    } else {
      userData.email = email;
      userData.regNumber = undefined;
    }
    const user = await User.create(userData);
    res.status(201).json({ 
      user: { _id: user._id, name: user.name, role: user.role, regNumber: user.regNumber }, 
      token: generateToken(user) 
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "User already exists" });
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { regNumber: identifier }] });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user: { _id: user._id, name: user.name, role: user.role, regNumber: user.regNumber }, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { regNumber: identifier }] });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real app, send resetToken via email. For now, we return it or check console.
    console.log(`🔗 Reset Link: http://localhost:5173/reset-password/${resetToken}`);
    res.json({ message: "Reset link generated. Check server console." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.profile = async (req, res) => {
  res.json(req.user);
};
