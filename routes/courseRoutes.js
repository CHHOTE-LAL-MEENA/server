const express = require("express");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const {
  getAllCourses,
  getCourseById,
} = require("../controllers/courseController");
const {
  enrollInCourse,
  getEnrolledStudents,
} = require("../controllers/enrollController");
const { getMyCourses } = require("../controllers/userController");
const {
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseContentController");
const router = express.Router();

// Public routes
router.get("/", getAllCourses); // all courses
router.get("/:courseId", getCourseById); // course details

// Only teacher/admin can add course
router.post("/", authMiddleware, authorizeRoles("teacher", "admin"), addCourse);
router.put(
  "/:courseId",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  updateCourse
);
router.delete(
  "/:courseId",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  deleteCourse
);

// Protected routes
router.post(
  "/:courseId/enroll",
  authMiddleware,
  authorizeRoles("student"),
  enrollInCourse
);

// Teacher/Admin only
router.get("/:courseId/students", authMiddleware, getEnrolledStudents);

// Student only
router.get(
  "/me/courses",
  authMiddleware,
  authorizeRoles("student"),
  getMyCourses
);

module.exports = router;
