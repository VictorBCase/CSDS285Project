import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function AddReview({ courseId, refresh }) {
  const [hover, setHover] = useState(0);
  const [r, setR] = useState({
    difficulty: "",
    hours: "",
    rating: 0,
    comment: "",
  });

  const submit = async () => {
    if (!r.difficulty || !r.hours || !r.rating) {
      alert("Fill all fields");
      return;
    }

    await axios.post(`${API}/reviews`, {
      courseId,
      difficulty: +r.difficulty,
      hoursPerWeek: +r.hours,
      rating: r.rating,
      comment: r.comment,
    });

    setR({ difficulty: "", hours: "", rating: 0, comment: "" });
    refresh();
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Add Review</h3>

      {/* Stars */}
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setR({ ...r, rating: i })}
            className={`text-2xl cursor-pointer transition ${
              i <= (hover || r.rating)
                ? "text-yellow-400 scale-110"
                : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <input
        className="border dark:bg-gray-700 p-1 mr-2"
        placeholder="Difficulty"
        onChange={(e) => setR({ ...r, difficulty: e.target.value })}
      />

      <input
        className="border dark:bg-gray-700 p-1"
        placeholder="Hours"
        onChange={(e) => setR({ ...r, hours: e.target.value })}
      />

      <textarea
        className="border dark:bg-gray-700 w-full mt-2 p-1"
        placeholder="Comment..."
        onChange={(e) => setR({ ...r, comment: e.target.value })}
      />

      <button
        className="mt-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  );
}