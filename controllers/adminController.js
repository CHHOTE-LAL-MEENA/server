const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcryptjs");

// ✅ Already done: createTeacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      specialization,
      role: "teacher",
    });

    await teacher.save();

    res.status(201).json({ msg: "Teacher created successfully", teacher });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, specialization } = req.body;

    const teacher = await User.findOneAndUpdate(
      { _id: id, role: "teacher" },
      { name, email, specialization },
      { new: true }
    );

    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await User.findOneAndDelete({ _id: id, role: "teacher" });

    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

    res.json({ msg: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Create course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
    });

    await course.save();
    res.status(201).json({ msg: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json({ msg: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json({ msg: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
