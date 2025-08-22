const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      default: 0,
    },
    content: [
      {
        title: String,
        type: {
          type: String,
          enum: ["video", "pdf", "text"],
          default: "video",
        },
        url: String, // for video links, PDFs, etc.
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
