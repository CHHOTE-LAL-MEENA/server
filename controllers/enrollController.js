const mongoose = require("mongoose");
const Course = require("../models/course");
const User = require("../models/user");

// 📌 Student enrolls in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    // 🔎 Ensure ObjectId string comparison
    const already = course.studentsEnrolled
      .map((sid) => sid.toString())
      .includes(req.user.id.toString());

    if (already) {
      return res
        .status(400)
        .json({ msg: "You are already enrolled in this course" });
    }

    // 1️⃣ Add student in course (avoid duplicates using addToSet)
    course.studentsEnrolled.addToSet(req.user.id);
    await course.save();

    // 2️⃣ Add course in user.enrolledCourses (also with addToSet)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { enrolledCourses: course._id } },
      { new: true }
    ).populate("enrolledCourses");

    res.json({
      msg: "Enrolled successfully!",
      enrolledCourses: updatedUser.enrolledCourses, // ✅ directly send list
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 📌 Teacher can see enrolled students
exports.getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "studentsEnrolled",
      "name email"
    );

    if (!course) return res.status(404).json({ msg: "Course not found" });

    // Only teacher/admin can view
    if (
      req.user.role !== "admin" &&
      course.teacher.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    res.json(course.studentsEnrolled);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
