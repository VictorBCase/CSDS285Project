const pool = require("../db");

// ----------------------------
// Create a new review
// ----------------------------
exports.createReview = async (req, res) => {
  try {
    const { courseId, difficulty, hoursPerWeek } = req.body;

    // Basic validation
    if (!courseId || !difficulty || !hoursPerWeek) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (difficulty < 1 || difficulty > 5) {
      return res.status(400).json({ error: "Difficulty must be 1–5" });
    }

    // Check if course exists
    const courseCheck = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseCheck.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Insert review
    const result = await pool.query(
      `INSERT INTO reviews (course_id, difficulty, hours_per_week)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [courseId, difficulty, hoursPerWeek]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};