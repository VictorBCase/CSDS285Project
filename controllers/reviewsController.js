const pool = require("../db");

// CREATE
exports.createReview = async (req, res) => {
  try {
    const { courseId, difficulty, hoursPerWeek, rating, comment } = req.body;

    if (!courseId || !difficulty || !hoursPerWeek || !rating) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (difficulty < 1 || difficulty > 5 || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Values must be 1–5" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (course_id, difficulty, hours_per_week, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [courseId, difficulty, hoursPerWeek, rating, comment]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET REVIEWS
exports.getReviewsByCourse = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM reviews WHERE course_id = $1 ORDER BY id DESC",
    [req.params.id]
  );
  res.json(result.rows);
};

// DELETE
exports.deleteReview = async (req, res) => {
  await pool.query("DELETE FROM reviews WHERE id=$1", [req.params.id]);
  res.json({ success: true });
};

// UPDATE
exports.updateReview = async (req, res) => {
  const { difficulty, hoursPerWeek, rating, comment } = req.body;

  const result = await pool.query(
    `UPDATE reviews 
     SET difficulty=$1, hours_per_week=$2, rating=$3, comment=$4
     WHERE id=$5 RETURNING *`,
    [difficulty, hoursPerWeek, rating, comment, req.params.id]
  );

  res.json(result.rows[0]);
};