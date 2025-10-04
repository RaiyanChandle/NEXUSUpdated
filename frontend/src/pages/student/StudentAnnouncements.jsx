
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentAnnouncements = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data.announcements);
      } catch {
        setError("Failed to fetch announcements");
      }
    };
    fetchAnnouncements();
  }, [API_URL]);

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Announcements</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="bg-violet-900/60 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-[500px] w-full text-white text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left min-w-[80px]">Type</th>
              <th className="px-4 py-2 text-left min-w-[120px]">Title</th>
              <th className="px-4 py-2 text-left min-w-[180px]">Message</th>
              <th className="px-4 py-2 text-left min-w-[80px]">Date</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id} className="border-b border-violet-700 last:border-0">
                <td className="px-4 py-2">{a.type}</td>
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2">{a.message}</td>
                <td className="px-4 py-2">{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-violet-300">
                  No announcements.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAnnouncements;
