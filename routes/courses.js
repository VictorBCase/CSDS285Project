const router = require("express").Router();
const {
  createCourse,
  getAllCourses,
  getCourseStats,
} = require("../controllers/coursesController");

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id/stats", getCourseStats);

module.exports = router;