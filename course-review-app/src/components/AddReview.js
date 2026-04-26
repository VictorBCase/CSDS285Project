import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function AddReview({ courseId, refresh }) {
  const [r, setR] = useState({
    difficulty: "",
    hours: "",
    rating: "",
    comment: "",
  });

  const submit = async () => {
    // Validation
    if (!r.difficulty || !r.hours || !r.rating) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${API}/reviews`, {
        courseId,
        difficulty: parseInt(r.difficulty),
        hoursPerWeek: parseInt(r.hours), // ✅ fixed key
        rating: parseInt(r.rating),
        comment: r.comment,
      });

      setR({ difficulty: "", hours: "", rating: "", comment: "" });
      refresh();
      alert("Review added!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add review");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add Review</h3>

      <input
        type="number"
        placeholder="Difficulty (1-5)"
        value={r.difficulty}
        onChange={(e) => setR({ ...r, difficulty: e.target.value })}
      />

      <input
        type="number"
        placeholder="Hours per Week"
        value={r.hours}
        onChange={(e) => setR({ ...r, hours: e.target.value })}
      />

      <input
        type="number"
        placeholder="Rating (1-5)"
        value={r.rating}
        onChange={(e) => setR({ ...r, rating: e.target.value })}
      />

      <input
        placeholder="Comment (optional)"
        value={r.comment}
        onChange={(e) => setR({ ...r, comment: e.target.value })}
      />

      <button onClick={submit}>Submit Review</button>
    </div>
  );
}