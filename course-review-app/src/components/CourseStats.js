import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function CourseStats({ courseId }) {
  const [stats, setStats] = useState({});
  const [hist, setHist] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    axios.get(`${API}/courses/${courseId}/stats`).then(r => setStats(r.data));
    axios.get(`${API}/courses/${courseId}/histogram`).then(r => setHist(r.data));
  }, [courseId]);

  const maxCount = Math.max(...hist.map(h => h.count), 1);

  // 🧠 Insight logic
  const getInsight = () => {
    if (hist.length === 0) return "No reviews yet.";

    let total = hist.reduce((sum, h) => sum + h.count, 0);
    let weighted =
      hist.reduce((sum, h) => sum + h.difficulty * h.count, 0) / total;

    if (weighted >= 4) return "Most students find this course difficult.";
    if (weighted >= 3) return "This course has a moderate difficulty level.";
    return "Students generally find this course easier.";
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow">

      {/* HEADER */}
      <h3 className="text-xl font-bold mb-3">📊 Course Analytics</h3>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-3 text-sm mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
          <div className="text-lg font-semibold">
            {stats.avgRating?.toFixed(1) || 0}
          </div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
          <div className="text-lg font-semibold">
            {stats.avgDifficulty?.toFixed(1) || 0}
          </div>
          <div className="text-xs text-gray-400">Difficulty</div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
          <div className="text-lg font-semibold">
            {stats.avgHours?.toFixed(1) || 0}
          </div>
          <div className="text-xs text-gray-400">Hours</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Last review:{" "}
        {stats.lastReview
          ? new Date(stats.lastReview).toLocaleDateString()
          : "N/A"}
      </p>

      {/* HISTOGRAM */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Difficulty Distribution</h4>

        {hist.length === 0 ? (
          <p className="text-xs text-gray-400">No data yet</p>
        ) : (
          <div className="space-y-3">

            {hist.map((h, i) => {
              const percent = (h.count / maxCount) * 100;

              return (
                <div
                  key={h.difficulty}
                  className="flex items-center gap-3 relative"
                  onMouseEnter={() => setHovered(h.difficulty)}
                  onMouseLeave={() => setHovered(null)}
                >

                  {/* LABEL */}
                  <div className="w-6 text-sm font-medium">
                    {h.difficulty}
                  </div>

                  {/* BAR TRACK */}
                  <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-600 rounded overflow-hidden">

                    {/* BAR */}
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded transition-all duration-700 ease-out"
                      style={{
                        width: `${percent}%`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />

                  </div>

                  {/* COUNT */}
                  <div className="w-6 text-sm text-gray-400">
                    {h.count}
                  </div>

                  {/* TOOLTIP */}
                  {hovered === h.difficulty && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                      {h.count} reviews
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* INSIGHT BOX */}
      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded text-sm">
        💡 {getInsight()}
      </div>

    </div>
  );
}