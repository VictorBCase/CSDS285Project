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

// STATS
router.get("/:id/stats", getCourseStats);

// HISTOGRAM
router.get("/:id/histogram", getDifficultyHistogram);

// DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM reviews WHERE course_id=$1", [id]);
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;