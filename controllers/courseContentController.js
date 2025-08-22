const Course = require("../models/course");

// =======================
// Get course content
// Only for enrolled students, teacher, or admin
// =======================
exports.getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "teacher",
      "name"
    );

    if (!course) return res.status(404).json({ msg: "Course not found" });

    // Teacher or Admin can always view
    if (
      course.teacher._id.toString() === req.user.id ||
      req.user.role === "admin"
    ) {
      return res.json(course.content);
    }

    // Check if student is enrolled
    const isEnrolled = course.studentsEnrolled.some(
      (sid) => sid.toString() === req.user.id
    );
    if (!isEnrolled) {
      return res
        .status(403)
        .json({ msg: "You are not enrolled in this course" });
    }

    res.json(course.content);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =======================
// Create a new course
// Only teacher/admin
// =======================
exports.addCourse = async (req, res) => {
  try {
    const { title, description, price, content } = req.body; // include content

    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required" });
    }

    const course = new Course({
      title,
      description,
      price: price || 0,
      teacher: req.user.id,
      content: Array.isArray(content) ? content : [], // accept array if provided
    });

    await course.save();

    res.status(201).json({ msg: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update an existing course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, price, content } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    // Only teacher who created it or admin can update
    if (
      course.teacher.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to update this course" });
    }

    // Update fields if provided
    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (Array.isArray(content)) course.content = content;

    await course.save();

    res.status(200).json({ msg: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =======================
// Delete a course
// Only teacher/admin
// =======================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    // Only teacher or admin can delete
    if (
      course.teacher.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =======================
// Add content to existing course
// Only teacher/admin
// =======================
exports.addContentToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, url } = req.body;

    if (!title)
      return res.status(400).json({ msg: "Content title is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    // Only teacher or admin can add content
    if (
      course.teacher.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    course.content.push({ title, type: type || "video", url });
    await course.save();

    res.json({ msg: "Content added successfully", course });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
