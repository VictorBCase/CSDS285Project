const pool = require("../db");

// -----------------------------
// CREATE COURSE (SAFE + NO CRASH)
// -----------------------------
exports.createCourse = async (req, res) => {
  try {
    const { code, name } = req.body;

    // ✅ validation (prevents bad inserts)
    if (!code || !name) {
      return res.status(400).json({
        error: "Course code and name are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO courses (code, name)
       VALUES ($1, $2)
       RETURNING *`,
      [code, name]
    );

    res.json(result.rows[0]);

  } catch (err) {
    // 🔥 prevents full server crash + gives real error info
    console.error("❌ createCourse error:", err);

    res.status(500).json({
      error: "Failed to create course",
      details: err.message
    });
  }
};

// -----------------------------
// COURSE STATS (SAFE)
// -----------------------------
exports.getCourseStats = async (req, res) => {
  try {
    const courseId = req.params.id;

    const result = await pool.query(
      `SELECT 
        AVG(difficulty) AS avgdifficulty,
        AVG(rating) AS avgrating,
        COUNT(*) AS reviewcount,
        MAX(created_at) AS lastreview,

        AVG(
          CASE 
            WHEN hours_per_week = '1-3' THEN 2
            WHEN hours_per_week = '4-6' THEN 5
            WHEN hours_per_week = '7-10' THEN 8.5
            WHEN hours_per_week = '11-15' THEN 13
            WHEN hours_per_week = '16+' THEN 16
            ELSE NULL
          END
        ) AS avghours

       FROM reviews
       WHERE course_id = $1`,
      [courseId]
    );

    res.json({
      avgDifficulty: parseFloat(result.rows[0].avgdifficulty || 0),
      avgRating: parseFloat(result.rows[0].avgrating || 0),
      reviewCount: parseInt(result.rows[0].reviewcount || 0),
      lastReview: result.rows[0].lastreview,
      avgHours: parseFloat(result.rows[0].avghours || 0)
    });

  } catch (err) {
    console.error("❌ getCourseStats error:", err);

    res.status(500).json({
      error: "Failed to fetch course stats",
      details: err.message
    });
  }
};

// -----------------------------
// HISTOGRAM (SAFE)
// -----------------------------
exports.getDifficultyHistogram = async (req, res) => {
  try {
    const courseId = req.params.id;

    const result = await pool.query(
      `SELECT difficulty, COUNT(*) AS count
       FROM reviews
       WHERE course_id = $1
       GROUP BY difficulty
       ORDER BY difficulty`,
      [courseId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("❌ histogram error:", err);

    res.status(500).json({
      error: "Failed to fetch histogram",
      details: err.message
    });
  }
};