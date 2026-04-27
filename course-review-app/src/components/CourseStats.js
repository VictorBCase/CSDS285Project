import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function CourseStats({ courseId }) {
  const [stats, setStats] = useState({});
  const [hist, setHist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [s, h] = await Promise.all([
        axios.get(`${API}/courses/${courseId}/stats`),
        axios.get(`${API}/courses/${courseId}/histogram`)
      ]);

      setStats(s.data);
      setHist(h.data);
    };

    fetchData();
  }, [courseId]);

  // -----------------------------
  // INSIGHT HELPERS
  // -----------------------------

  const getDifficultyLabel = (d) => {
    if (!d) return "Unknown";
    if (d <= 2) return "Easy";
    if (d <= 3.5) return "Moderate";
    return "Hard";
  };

  const getWorkloadLabel = (h) => {
    if (!h) return "Unknown";
    if (h <= 4) return "Light";
    if (h <= 9) return "Moderate";
    return "Heavy";
  };

  const getInsightText = () => {
    const d = stats.avgDifficulty;
    const h = stats.avgHours;

    if (!d && !h) return "Not enough data yet.";

    if (d <= 2 && h <= 5) {
      return "Students find this course easy with a light workload.";
    }

    if (d <= 3.5 && h <= 10) {
      return "Students find this course moderately challenging with a manageable workload.";
    }

    if (d > 3.5 || h > 10) {
      return "Students report a difficult course with a heavy workload.";
    }

    return "Mixed student feedback across difficulty and workload.";
  };

  const getColor = (val) => {
    if (!val) return "bg-gray-400";
    if (val <= 2) return "bg-green-500";
    if (val <= 3.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <h2 className="text-xl font-bold">Course Overview</h2>

      {/* -----------------------------
          TOP METRICS
      ----------------------------- */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-400">Rating</p>
          <p className="text-lg font-bold">
            ⭐ {stats.avgRating?.toFixed(1) || "—"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-400">Workload</p>
          <p className="text-lg font-bold">
            ⏱ {stats.avgHours?.toFixed(1) || "—"} hrs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center">
          <p className="text-xs text-gray-400">Reviews</p>
          <p className="text-lg font-bold">
            🧾 {stats.reviewCount || 0}
          </p>
        </div>
      </div>

      {/* -----------------------------
          INSIGHT PANEL (NEW)
      ----------------------------- */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Insight</h3>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {getInsightText()}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">

          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            Difficulty: {getDifficultyLabel(stats.avgDifficulty)}
          </span>

          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            Workload: {getWorkloadLabel(stats.avgHours)}
          </span>

        </div>
      </div>

      {/* -----------------------------
          LAYOUT
      ----------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* HISTOGRAM */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Difficulty Distribution</h3>

          {hist.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet</p>
          ) : (
            hist.map((h) => (
              <div key={h.difficulty} className="flex items-center gap-2 mb-2">
                <span className="w-4 text-sm">{h.difficulty}</span>

                <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${h.count * 25}px` }}
                  />
                </div>

                <span className="text-xs text-gray-500">
                  {h.count}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}