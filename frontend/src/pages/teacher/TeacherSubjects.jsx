import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherSubjects = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data.subjects);
      } catch (err) {
        setError("Failed to fetch subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [API_URL]);

  const handleRowClick = (subjectId) => {
    // You can navigate or open details here
    alert("Clicked subject row: " + subjectId);
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Subjects</h2>
      {loading ? (
        <div className="text-violet-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <table className="min-w-full bg-violet-900/80 text-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Student Count</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr
                key={item.id || `${item.subjectId || ''}_${item.classId || ''}` || index}
                className="cursor-pointer hover:bg-violet-700 transition"
                onClick={() => handleRowClick(item.id)}
              >
                <td className="px-4 py-3">{item.subject?.name || item.subjectName || '-'}</td>
                <td className="px-4 py-3">{item.class?.name || item.className || '-'}</td>
                <td className="px-4 py-3">{item.studentCount}</td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-violet-300">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherSubjects;
