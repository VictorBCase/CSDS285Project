const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE REVIEW
router.post("/", async (req, res) => {
  try {
    const { courseId, difficulty, hoursPerWeek, rating, comment } = req.body;

    const result = await pool.query(
      `INSERT INTO reviews
       (course_id, difficulty, hours_per_week, rating, comment)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [courseId, difficulty, hoursPerWeek, rating, comment]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET REVIEWS
router.get("/course/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM reviews WHERE course_id=$1 ORDER BY created_at DESC",
    [req.params.id]
  );

  res.json(result.rows);
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM reviews WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

// SEARCH REVIEWS
router.get("/search/:q", async (req, res) => {
  const q = `%${req.params.q}%`;

  const result = await pool.query(
    "SELECT * FROM reviews WHERE comment ILIKE $1",
    [q]
  );

  res.json(result.rows);
});

module.exports = router;