const Course = require("../models/course");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate("teacher", "name email");
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
