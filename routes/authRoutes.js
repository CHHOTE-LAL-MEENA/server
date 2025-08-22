  const express = require("express");
  const { registerUser, loginUser } = require("../controllers/authController");
  const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

  const router = express.Router();

  // Register route
  router.post("/register", registerUser);

  // Login route
  router.post("/login", loginUser);

  // Protected test route
  router.get("/me", authMiddleware, (req, res) => {
    res.json({ msg: "Welcome!", user: req.user });
  });

  // Admin-only test route
  router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
    res.json({ msg: "Hello Admin, you have access!" });
  });

  module.exports = router;
