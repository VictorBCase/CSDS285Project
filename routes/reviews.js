const express = require("express");
const router = express.Router();
const pool = require("../db");

// -----------------------------
// CREATE REVIEW
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const {
      courseId,
      difficulty,
      hoursPerWeek,
      rating,
      comment,
      grade,
      tags
    } = req.body;

    const result = await pool.query(
      `INSERT INTO reviews
      (course_id, difficulty, hours_per_week, rating, comment, grade, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        courseId,
        difficulty,
        hoursPerWeek,
        rating,
        comment,
        grade || null,
        Array.isArray(tags) ? tags : []
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// GET REVIEWS
// -----------------------------
router.get("/course/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews WHERE course_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    const cleaned = result.rows.map(r => ({
      ...r,
      tags: Array.isArray(r.tags)
        ? r.tags
        : (r.tags ? r.tags.replace(/[{}]/g, "").split(",") : [])
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// DELETE REVIEW
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM reviews WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// UPDATE REVIEW (FIXED)
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const {
      difficulty,
      hoursPerWeek,
      rating,
      comment,
      grade,
      tags
    } = req.body;

    const result = await pool.query(
      `UPDATE reviews
       SET difficulty=$1,
           hours_per_week=$2,
           rating=$3,
           comment=$4,
           grade=$5,
           tags=$6
       WHERE id=$7
       RETURNING *`,
      [
        difficulty,
        hoursPerWeek,
        rating,
        comment,
        grade,
        Array.isArray(tags) ? tags : [],
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;