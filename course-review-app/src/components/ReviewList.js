import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function ReviewList({ courseId, adminMode }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/reviews/course/${courseId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${API}/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const updateReview = async (id) => {
    try {
      await axios.put(`${API}/reviews/${id}`, editData);
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-400">No reviews yet</p>
      )}

      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-gray-200 dark:bg-gray-700 p-3 rounded mb-2"
        >

          {/* =========================
              EDIT MODE
          ========================= */}
          {editingId === r.id ? (
            <>
              <textarea
                className="w-full p-2 rounded"
                value={editData.comment || ""}
                onChange={(e) =>
                  setEditData({ ...editData, comment: e.target.value })
                }
              />

              <input
                className="p-1 mt-1 mr-2"
                value={editData.grade || ""}
                onChange={(e) =>
                  setEditData({ ...editData, grade: e.target.value })
                }
                placeholder="Grade"
              />

              <button
                onClick={() => updateReview(r.id)}
                className="bg-green-500 px-2 py-1 mt-1 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              {/* =========================
                  HEADER ROW
              ========================= */}
              <div className="flex justify-between items-start">

                <div>
                  <div className="text-yellow-500">
                    {"⭐".repeat(r.rating)}
                  </div>

                  {/* FIXED GRADE DISPLAY */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Grade Received:{" "}
                    <span className="font-semibold">
                      {r.grade || "Not provided"}
                    </span>
                  </p>
                </div>

                {adminMode && (
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => {
                        setEditingId(r.id);
                        setEditData(r);
                      }}
                      className="text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteReview(r.id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* COMMENT */}
              <p className="mt-2">{r.comment}</p>

              {/* =========================
                  META INFO
              ========================= */}
              <div className="text-xs text-gray-500 mt-2">
                📘 Difficulty: {r.difficulty} | ⏱ {r.hours_per_week} hrs
              </div>

              {/* =========================
                  TAGS (FIXED)
              ========================= */}
              <div className="mt-2 flex flex-wrap gap-1">
                {Array.isArray(r.tags) && r.tags.length > 0 ? (
                  r.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">
                    No tags
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}