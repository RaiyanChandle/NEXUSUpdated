import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, subjects: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Stat cards config for navigation
  const statConfigs = [
    { label: "Students", value: counts.students, route: "/admin/students" },
    { label: "Teachers", value: counts.teachers, route: "/admin/teachers" },
    { label: "Subjects", value: counts.subjects, route: "/admin/subjects" },
    { label: "Classes", value: counts.classes, route: "/admin/classes" },
    { label: "Announcements", value: counts.announcements, route: "/admin/announcements" },
    { label: "Books in Library", value: counts.books, route: "/admin/library" },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("nexus_admin_jwt");
        const res = await axios.get(`${API_URL}/admin/dashboard-counts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounts(res.data);
      } catch (e) {
        setError("Failed to fetch dashboard stats");
      }
      setLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-3xl text-violet-400 font-bold mb-6">Admin Dashboard</h2>
      {loading ? (
        <div className="text-xl text-violet-300">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
          {statConfigs.map(stat => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              onClick={() => navigate(stat.route)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, onClick }) => (
  <div
    className="bg-violet-900/80 rounded-lg shadow p-8 flex flex-col items-center cursor-pointer hover:bg-violet-800 transition-colors duration-150"
    onClick={onClick}
    tabIndex={0}
    role="button"
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    title={`Go to ${label}`}
  >
    <div className="text-4xl font-bold text-violet-300 mb-2">{value}</div>
    <div className="text-lg text-violet-200">{label}</div>
  </div>
);

export default AdminDashboard;
