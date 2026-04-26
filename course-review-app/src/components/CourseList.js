import { useEffect, useState } from "react";
import axios from "axios";
import CourseStats from "./CourseStats";
import AddReview from "./AddReview";
import ReviewList from "./ReviewList";

const API = "http://localhost:3000";

export default function CourseList({ adminMode }) {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [newCourse, setNewCourse] = useState({});
  const [statsMap, setStatsMap] = useState({});

  const fetchCourses = async () => {
    const res = await axios.get(`${API}/courses`);
    setCourses(res.data);

    const map = {};
    for (let c of res.data) {
      const s = await axios.get(`${API}/courses/${c.id}/stats`);
      map[c.id] = s.data;
    }
    setStatsMap(map);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    await axios.delete(`${API}/courses/${id}`);
    fetchCourses();
  };

  const filtered = courses.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* SEARCH */}
      <input
        className="w-full p-2 mb-4 dark:bg-gray-800 rounded"
        placeholder="Search courses..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD COURSE */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">Add Course</h3>

        <input
          className="p-2 mr-2 dark:bg-gray-700"
          placeholder="Code"
          onChange={(e) =>
            setNewCourse({ ...newCourse, code: e.target.value })
          }
        />

        <input
          className="p-2 mr-2 dark:bg-gray-700"
          placeholder="Name"
          onChange={(e) =>
            setNewCourse({ ...newCourse, name: e.target.value })
          }
        />

        <button
          className="bg-green-500 px-3 py-2 rounded"
          onClick={async () => {
            await axios.post(`${API}/courses`, newCourse);
            setNewCourse({});
            fetchCourses();
          }}
        >
          Add
        </button>
      </div>

      {/* COURSE GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 transition"
          >
            <h2 className="font-bold">{c.code}</h2>
            <p className="text-gray-500">{c.name}</p>

            <div className="text-xs mt-2 text-gray-400">
              ⭐ {statsMap[c.id]?.avgRating?.toFixed(1) || 0}
              {" | "}
              {statsMap[c.id]?.reviewCount || 0} reviews
            </div>

            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 px-3 py-1 rounded"
                onClick={() => setSelected(c.id)}
              >
                Open
              </button>

              {adminMode && (
                <button
                  className="bg-red-500 px-3 py-1 rounded"
                  onClick={() => deleteCourse(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white dark:bg-gray-800 rounded w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-lg">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="font-bold text-lg">Course Details</h2>

              <button
                onClick={() => setSelected(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            {/* SCROLLABLE */}
            <div className="p-4 overflow-y-auto max-h-[75vh]">

              <CourseStats courseId={selected} />
              <AddReview courseId={selected} refresh={fetchCourses} />
              <ReviewList courseId={selected} adminMode={adminMode} />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}