import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function ReviewList({ courseId }) {
  const [reviews, setReviews] = useState([]);

  const fetch = () => {
    axios.get(`${API}/reviews/course/${courseId}`).then((r) => setReviews(r.data));
  };

  useEffect(fetch, [courseId]);

  const del = async (id) => {
    await axios.delete(`${API}/reviews/${id}`);
    fetch();
  };

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
          ⭐ {r.rating} | 📘 {r.difficulty} | ⏱ {r.hours_per_week}
          <p>{r.comment}</p>
          <button onClick={() => del(r.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}