import { useState } from "react";
import CourseList from "./components/CourseList";

export default function App() {
  const [dark, setDark] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">📚 Course Dashboard</h1>

          <div className="flex gap-2">
            {/* DARK MODE */}
            <button
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
              onClick={() => setDark(!dark)}
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>

            {/* ADMIN MODE */}
            <button
              className={`px-3 py-1 rounded ${
                adminMode
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setAdminMode(!adminMode)}
            >
              {adminMode ? "Admin ON" : "Admin Mode"}
            </button>
          </div>
        </div>

        <CourseList adminMode={adminMode} />
      </div>
    </div>
  );
}