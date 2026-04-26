const pool = require("../db");

exports.createCourse = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      "INSERT INTO courses (code,name) VALUES ($1,$2) RETURNING *",
      [code, name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        AVG(difficulty) avgdifficulty,
        AVG(hours_per_week) avghours,
        AVG(rating) avgrating,
        COUNT(*) reviewcount
       FROM reviews WHERE course_id=$1`,
      [req.params.id]
    );

    const s = result.rows[0];

    res.json({
      avgDifficulty: parseFloat(s.avgdifficulty) || 0,
      avgHours: parseFloat(s.avghours) || 0,
      avgRating: parseFloat(s.avgrating) || 0,
      reviewCount: parseInt(s.reviewcount) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};