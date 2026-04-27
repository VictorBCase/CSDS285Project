const pool = require("../db");

exports.createReview = async (req, res) => {
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

        // 🔥 CRITICAL FIX: ensure array format
        Array.isArray(tags) ? tags : []
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};