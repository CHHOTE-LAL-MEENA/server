const express = require("express");
const {
  createTeacher,
  getAllUsers,
  deleteUser,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  updateTeacher,
  deleteTeacher
} = require("../controllers/adminController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Only admin can access
router.get(
  "/teachers",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const teachers = await User.find({ role: "teacher" });
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Only admin can create teacher
router.post(
  "/create-teacher",
  authMiddleware,
  authorizeRoles("admin"),
  createTeacher
);

// ✅ Update teacher
router.put(
  "/teachers/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateTeacher
);

// ✅ Delete teacher
router.delete(
  "/teachers/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteTeacher
);

// User management
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.delete(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);

// Course management
router.post("/courses", authMiddleware, authorizeRoles("admin"), createCourse);
router.put(
  "/courses/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateCourse
);
router.delete(
  "/courses/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteCourse
);
router.get("/courses", authMiddleware, authorizeRoles("admin"), getAllCourses);

module.exports = router;
