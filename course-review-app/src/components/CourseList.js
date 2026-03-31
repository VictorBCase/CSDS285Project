import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseStats from "./CourseStats";
import AddReview from "./AddReview";

const API_URL = "http://localhost:3000";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: "", name: "" });
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courses");
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.name) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await axios.post(`${API_URL}/courses`, newCourse);
      setNewCourse({ code: "", name: "" });
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add course");
    }
  };

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.code}</strong>: {course.name}{" "}
            <button onClick={() => setSelectedCourseId(course.id)}>
              View Stats / Add Review
            </button>
          </li>
        ))}
      </ul>

      <h3>Add a New Course</h3>
      <input
        placeholder="Code"
        value={newCourse.code}
        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
      />
      <input
        placeholder="Name"
        value={newCourse.name}
        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
      />
      <button onClick={handleAddCourse}>Add Course</button>

      {selectedCourseId && (
        <div style={{ marginTop: "20px" }}>
          <CourseStats courseId={selectedCourseId} />
          <AddReview
            courseId={selectedCourseId}
            onReviewAdded={() => fetchCourses()}
          />
        </div>
      )}
    </div>
  );
}

export default CourseList;