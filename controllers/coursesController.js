const pool = require("../db");

// ----------------------------
// Create a new course
// ----------------------------
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

// ----------------------------
// Get all courses
// ----------------------------
exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------
// Get course statistics
// ----------------------------
exports.getCourseStats = async (req, res) => {
  try {
    const courseId = req.params.id;

    const result = await pool.query(
      `SELECT 
        AVG(difficulty) AS avgDifficulty,
        AVG(hours_per_week) AS avgHours,
        COUNT(*) AS reviewCount
       FROM reviews
       WHERE course_id = $1`,
      [courseId]
    );

    const stats = result.rows[0];

    res.json({
      avgDifficulty: stats.avgdifficulty ? parseFloat(stats.avgdifficulty) : 0,
      avgHours: stats.avghours ? parseFloat(stats.avghours) : 0,
      reviewCount: parseInt(stats.reviewcount || 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};