import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function CourseStats({ courseId }) {
  const [s, setS] = useState({
    avgDifficulty: 0,
    avgHours: 0,
    avgRating: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/courses/${courseId}/stats`);
        setS(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch stats");
      }
    };

    if (courseId) fetchStats();
  }, [courseId]);

  return (
    <div>
      <h3>Stats</h3>
      <p>
        ⭐ {Number(s?.avgRating ?? 0).toFixed(1)} | 📘{" "}
        {Number(s?.avgDifficulty ?? 0).toFixed(1)} | ⏱{" "}
        {Number(s?.avgHours ?? 0).toFixed(1)}
      </p>
      <p>{s?.reviewCount ?? 0} reviews</p>
    </div>
  );
}