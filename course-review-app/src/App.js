import { useState } from "react";
import CourseList from "./components/CourseList";

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6 transition-colors duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📚 Course Reviews</h1>

          <button
            onClick={() => setDark(!dark)}
            className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <CourseList />
      </div>
    </div>
  );
}