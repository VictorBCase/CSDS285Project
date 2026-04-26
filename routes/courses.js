const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseStats,
  getDifficultyHistogram
} = require("../controllers/coursesController");

const pool = require("../db");

router.post("/", createCourse);

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
  res.json(result.rows);
});

router.get("/:id/stats", getCourseStats);
router.get("/:id/histogram", getDifficultyHistogram);

// ✅ DELETE COURSE
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM courses WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;