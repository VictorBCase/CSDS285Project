const pool = require("../db");

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      "INSERT INTO courses (code, name) VALUES ($1, $2) RETURNING *",
      [code, name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// COURSE STATS
exports.getCourseStats = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `SELECT 
        AVG(difficulty) AS avgdifficulty,
        AVG(hours_per_week) AS avghours,
        AVG(rating) AS avgrating,
        COUNT(*) AS reviewcount,
        MAX(created_at) AS lastreview
       FROM reviews
       WHERE course_id = $1`,
      [id]
    );

    const r = result.rows[0];

    res.json({
      avgDifficulty: parseFloat(r.avgdifficulty || 0),
      avgHours: parseFloat(r.avghours || 0),
      avgRating: parseFloat(r.avgrating || 0),
      reviewCount: parseInt(r.reviewcount || 0),
      lastReview: r.lastreview,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// HISTOGRAM
exports.getDifficultyHistogram = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      `SELECT difficulty, COUNT(*) as count
       FROM reviews
       WHERE course_id = $1
       GROUP BY difficulty
       ORDER BY difficulty`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};