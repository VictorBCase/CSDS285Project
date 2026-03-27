const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseStats,
} = require("../controllers/coursesController");

// POST /courses
router.post("/", createCourse);

// GET /courses/:id/stats
router.get("/:id/stats", getCourseStats);

module.exports = router;