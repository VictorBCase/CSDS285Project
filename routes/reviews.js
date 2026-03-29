const express = require("express");
const router = express.Router();

const { createReview } = require("../controllers/reviewsController");

// POST /reviews - create a new review
router.post("/", createReview);

module.exports = router;