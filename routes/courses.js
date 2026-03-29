const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseStats,
} = require("../controllers/coursesController");

// POST /courses - create a new course
router.post("/", createCourse);

// GET /courses - get all courses
router.get("/", getAllCourses);

// GET /courses/:id/stats - get stats for a specific course
router.get("/:id/stats", getCourseStats);

module.exports = router;