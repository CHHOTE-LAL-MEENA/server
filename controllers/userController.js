// controllers/userController.js
const Course = require("../models/course");

exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      studentsEnrolled: req.user.id,
    }).populate("teacher", "name");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
