// // // backend/routes/userRoutes.js

// const express = require("express");
// const router = express.Router();
// const { register, login, profile } = require("../controllers/userController");
// const { protect } = require("../middleware/auth");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/profile", protect, profile);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, profile, forgotPassword, resetPassword } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, profile);

module.exports = router;
