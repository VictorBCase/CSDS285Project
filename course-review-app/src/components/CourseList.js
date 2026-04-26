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
  const [newCourse, setNewCourse] = useState({ code: "", name: "" });

  const fetchCourses = async () => {
    const res = await axios.get(`${API}/courses`);
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filtered.map((c) => (
          <li key={c.id}>
            {c.code} - {c.name}
            <button onClick={() => setSelected(c.id)}>Open</button>
          </li>
        ))}
      </ul>

      <h3>Add Course</h3>
      <input
        placeholder="Code"
        onChange={(e) =>
          setNewCourse({ ...newCourse, code: e.target.value })
        }
      />
      <input
        placeholder="Name"
        onChange={(e) =>
          setNewCourse({ ...newCourse, name: e.target.value })
        }
      />
      <button
        onClick={async () => {
          await axios.post(`${API}/courses`, newCourse);
          fetchCourses();
        }}
      >
        Add
      </button>

      {selected && (
        <div>
          <CourseStats courseId={selected} />
          <AddReview courseId={selected} refresh={fetchCourses} />
          <ReviewList courseId={selected} />
        </div>
      )}
    </div>
  );
}