import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ studentCount: 0, courseCount: 0, classCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch {
        setError("Failed to fetch dashboard stats");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statConfigs = [
    { label: "Students", value: stats.studentCount, route: "/teacher/students" },
    { label: "Courses", value: stats.courseCount, route: "/teacher/subjects" },
    { label: "Classes", value: stats.classCount, route: "/teacher/students" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-3xl text-violet-400 font-bold mb-6">Teacher Dashboard</h2>
      {loading ? (
        <div className="text-xl text-violet-300">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
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

export default TeacherDashboard;
