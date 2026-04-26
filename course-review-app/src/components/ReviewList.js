import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function ReviewList({ courseId, adminMode }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = () => {
    axios
      .get(`${API}/reviews/course/${courseId}`)
      .then((r) => setReviews(r.data));
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const deleteReview = async (id) => {
    await axios.delete(`${API}/reviews/${id}`);
    fetchReviews();
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-400">No reviews yet</p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-lg shadow bg-gray-100 dark:bg-gray-700"
          >
            <div className="flex justify-between">

              <div className="text-yellow-400">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>

              {adminMode && (
                <button
                  className="text-red-500 text-sm"
                  onClick={() => deleteReview(r.id)}
                >
                  Delete
                </button>
              )}
            </div>

            <p className="text-sm mt-1">{r.comment}</p>

            <div className="text-xs text-gray-500 mt-2 flex gap-3">
              <span>📘 {r.difficulty}</span>
              <span>⏱ {r.hours_per_week}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}