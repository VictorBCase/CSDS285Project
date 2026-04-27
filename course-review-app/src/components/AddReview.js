import { useState } from "react";
import axios from "axios";
import { TAG_OPTIONS } from "../tagOptions";

const API = "http://localhost:3000";

export default function AddReview({ courseId, refresh }) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);

  const [difficulty, setDifficulty] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const submit = async () => {
    try {
      await axios.post(`${API}/reviews`, {
        courseId,
        rating,
        difficulty: parseInt(difficulty),
        hoursPerWeek,
        grade,
        comment,
        tags
      });

      setRating(0);
      setDifficulty("");
      setHoursPerWeek("");
      setGrade("");
      setComment("");
      setTags([]);

      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    }
  };

  // shared input styling (NEW)
  const inputStyle =
    "w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="mt-3 space-y-3">

      {/* STAR RATING */}
      <div className="flex text-2xl">
        {[1,2,3,4,5].map(i => (
          <span
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}
            className={`cursor-pointer ${
              i <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* DIFFICULTY */}
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className={inputStyle}
      >
        <option value="">Select Difficulty</option>
        <option value="1">1 - Very Easy</option>
        <option value="2">2 - Easy</option>
        <option value="3">3 - Moderate</option>
        <option value="4">4 - Hard</option>
        <option value="5">5 - Very Hard</option>
      </select>

      {/* HOURS */}
      <select
        value={hoursPerWeek}
        onChange={(e) => setHoursPerWeek(e.target.value)}
        className={inputStyle}
      >
        <option value="">Select Hours per Week</option>
        <option value="1-3">1–3 hours</option>
        <option value="4-6">4–6 hours</option>
        <option value="7-10">7–10 hours</option>
        <option value="11-15">11–15 hours</option>
        <option value="16+">16+ hours</option>
      </select>

      {/* GRADE */}
      <select
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        className={inputStyle}
      >
        <option value="">Select Grade Received</option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D">D</option>
        <option value="F">F</option>
      </select>

      {/* COMMENT */}
      <textarea
        className={inputStyle}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* TAGS */}
      <div>
        <p className="text-sm font-semibold text-gray-300">Tags</p>

        <div className="flex flex-wrap gap-1 mt-1">
          {TAG_OPTIONS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-2 py-1 rounded border ${
                tags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-200 border-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <button
        onClick={submit}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Submit Review
      </button>

    </div>
  );
}