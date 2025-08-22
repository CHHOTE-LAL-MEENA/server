const express = require("express");
const {
  getCourseContent,
  addContentToCourse,
} = require("../controllers/courseContentController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get content (only enrolled students, teacher, admin)
router.get("/:courseId/content", authMiddleware, getCourseContent);

// Add content to existing course
router.post(
  "/:courseId/content",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  addContentToCourse
);

module.exports = router;
