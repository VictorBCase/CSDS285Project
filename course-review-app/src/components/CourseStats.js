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
      const res = await axios.get(`${API}/courses/${courseId}/stats`);
      setS(res.data);
    };

    if (courseId) fetchStats();
  }, [courseId]);

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Stats</h3>

      <div className="flex gap-3">
        <div className="bg-yellow-100 p-2 rounded">
          ⭐ {Number(s.avgRating).toFixed(1)}
        </div>
        <div className="bg-blue-100 p-2 rounded">
          📘 {Number(s.avgDifficulty).toFixed(1)}
        </div>
        <div className="bg-green-100 p-2 rounded">
          ⏱ {Number(s.avgHours).toFixed(1)}
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {s.reviewCount} reviews
      </p>
    </div>
  );
}