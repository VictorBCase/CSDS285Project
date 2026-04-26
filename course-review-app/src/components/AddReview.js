import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function AddReview({ courseId, refresh }) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ difficulty: "", hours: "", comment: "" });

  const submit = async () => {
    await axios.post(`${API}/reviews`, {
      courseId,
      rating,
      difficulty: form.difficulty,
      hoursPerWeek: form.hours,
      comment: form.comment
    });

    refresh();
  };

  return (
    <div className="mb-4">

      {/* STARS */}
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <span
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}
            className={`text-2xl cursor-pointer ${
              i <= (hover || rating) ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <input
        className="p-1 mt-2 dark:bg-gray-700"
        placeholder="Difficulty"
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
      />

      <input
        className="p-1 mt-2 dark:bg-gray-700"
        placeholder="Hours"
        onChange={(e) => setForm({ ...form, hours: e.target.value })}
      />

      <textarea
        className="p-1 mt-2 w-full dark:bg-gray-700"
        placeholder="Comment"
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
      />

      <button
        className="bg-green-500 px-3 py-1 mt-2 rounded"
        onClick={submit}
      >
        Submit
      </button>

    </div>
  );
}