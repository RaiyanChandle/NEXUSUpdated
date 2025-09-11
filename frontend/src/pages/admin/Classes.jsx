import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminClasses = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      setError("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.post(
        `${API_URL}/admin/classes`,
        { name: className },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassName("");
      fetchClasses();
    } catch (err) {
      setError("Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (cls) => {
    // Placeholder: You can navigate or show details here
    alert(`Class: ${cls.name}`);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto mt-10">
      <form onSubmit={handleCreateClass} className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
        >
          Create
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr
                key={cls.id}
                className="cursor-pointer hover:bg-violet-800 transition"
                onClick={() => handleRowClick(cls)}
              >
                <td className="px-4 sm:px-6 py-3">{cls.name}</td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No classes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClasses;
