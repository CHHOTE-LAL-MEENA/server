const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const { getMyCourses } = require("../controllers/userController");
const router = express.Router();

router.get("/me/enrolled-courses", authMiddleware, authorizeRoles("student"), getMyCourses);

module.exports = router;    
