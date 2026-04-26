const router = require("express").Router();
const {
  createReview,
  getReviewsByCourse,
  deleteReview,
  updateReview,
} = require("../controllers/reviewsController");

router.post("/", createReview);
router.get("/course/:id", getReviewsByCourse);
router.delete("/:id", deleteReview);
router.put("/:id", updateReview);

module.exports = router;