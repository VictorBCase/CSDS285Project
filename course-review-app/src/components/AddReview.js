import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function AddReview({ courseId, onReviewAdded }) {
  const [review, setReview] = useState({ difficulty: "", hoursPerWeek: "" });

  const handleSubmit = async () => {
    if (!review.difficulty || !review.hoursPerWeek) {
      alert("Fill in all fields");
      return;
    }

    try {
      await axios.post(`${API_URL}/reviews`, {
        courseId,
        difficulty: parseInt(review.difficulty),
        hoursPerWeek: parseInt(review.hoursPerWeek),
      });
      setReview({ difficulty: "", hoursPerWeek: "" });
      onReviewAdded();
      alert("Review added!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add review");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add a Review</h3>
      <input
        placeholder="Difficulty (1-5)"
        type="number"
        min="1"
        max="5"
        value={review.difficulty}
        onChange={(e) => setReview({ ...review, difficulty: e.target.value })}
      />
      <input
        placeholder="Hours per Week"
        type="number"
        value={review.hoursPerWeek}
        onChange={(e) => setReview({ ...review, hoursPerWeek: e.target.value })}
      />
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  );
}

export default AddReview;