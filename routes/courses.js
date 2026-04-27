const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseStats,
  getDifficultyHistogram
} = require("../controllers/coursesController");

const pool = require("../db");

// CREATE COURSE
router.post("/", createCourse);

// GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM courses ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COURSE STATS
router.get("/:id/stats", getCourseStats);

// HISTOGRAM
router.get("/:id/histogram", getDifficultyHistogram);

// ✅ DELETE COURSE (manual cascade)
router.delete("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    // delete dependent reviews first
    await pool.query(
      "DELETE FROM reviews WHERE course_id = $1",
      [courseId]
    );

    // then delete the course
    await pool.query(
      "DELETE FROM courses WHERE id = $1",
      [courseId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;