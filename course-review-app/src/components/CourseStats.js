import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function CourseStats({ courseId }) {
  const [stats, setStats] = useState({
    avgDifficulty: 0,
    avgHours: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [courseId]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses/${courseId}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stats");
    }
  };

  return (
    <div>
      <h3>Course Stats</h3>
      <p>Average Difficulty: {stats.avgDifficulty.toFixed(1)}</p>
      <p>Average Hours: {stats.avgHours.toFixed(1)}</p>
      <p>Review Count: {stats.reviewCount}</p>
    </div>
  );
}

export default CourseStats;