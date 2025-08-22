const express = require("express");
const {
  enrollInCourse,
  getEnrolledStudents,
} = require("../controllers/enrollController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student: enroll in course
router.post(
  "/:courseId/enroll",
  authMiddleware,
  authorizeRoles("student"),
  enrollInCourse
);

// Teacher: view enrolled students
router.get(
  "/:courseId/students",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getEnrolledStudents
);

module.exports = router;
