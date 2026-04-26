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
      <h3 className="font-bold mb-2">Reviews</h3>

      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-gray-200 dark:bg-gray-700 p-3 mb-2 rounded shadow hover:scale-[1.02] transition"
        >
          <div className="flex justify-between">
            <div>{"⭐".repeat(r.rating)}</div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => del(r.id)}
            >
              Delete
            </button>
          </div>

          <p>{r.comment}</p>
          <small className="text-gray-500">
            {r.hours_per_week} hrs/week | Difficulty {r.difficulty}
          </small>
        </div>
      ))}
    </div>
  );
}