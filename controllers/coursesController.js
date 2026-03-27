const pool = require("../db");

// Create a new course
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get course statistics
exports.getCourseStats = async (req, res) => {
  try {
    const courseId = req.params.id;

    const result = await pool.query(
      `SELECT 
        AVG(difficulty) as avgDifficulty,
        AVG(hours_per_week) as avgHours,
        COUNT(*) as reviewCount
       FROM reviews
       WHERE course_id = $1`,
      [courseId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};