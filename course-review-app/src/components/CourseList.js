import { useEffect, useState } from "react";
import axios from "axios";
import CourseStats from "./CourseStats";
import AddReview from "./AddReview";
import ReviewList from "./ReviewList";

const API = "http://localhost:3000";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState("none");

  const fetchCourses = async () => {
    const res = await axios.get(`${API}/courses`);
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  let filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting (basic placeholder – real sorting uses stats)
  if (sort === "code") {
    filtered.sort((a, b) => a.code.localeCompare(b.code));
  }

  return (
    <div>
      {/* Search + Sort */}
      <div className="flex gap-2 mb-4">
        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          placeholder="🔍 Search courses..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 rounded dark:bg-gray-800"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="none">Sort</option>
          <option value="code">By Code</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 transition"
          >
            <h2 className="font-bold">{c.code}</h2>
            <p className="text-gray-500">{c.name}</p>

            <button
              className="mt-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
              onClick={() => setSelected(c.id)}
            >
              Open
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-lg animate-scaleIn">
            <button
              className="float-right text-red-500"
              onClick={() => setSelected(null)}
            >
              ✖
            </button>

            <CourseStats courseId={selected} />
            <AddReview courseId={selected} refresh={fetchCourses} />
            <ReviewList courseId={selected} />
          </div>
        </div>
      )}
    </div>
  );
}