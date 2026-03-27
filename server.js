require("dotenv").config();
const express = require("express");
const cors = require("cors");

const coursesRoutes = require("./routes/courses");
const reviewsRoutes = require("./routes/reviews");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/courses", coursesRoutes);
app.use("/reviews", reviewsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});