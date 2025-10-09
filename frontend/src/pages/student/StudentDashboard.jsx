import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const StudentDashboard = () => {
  const [stats, setStats] = useState({ subjectCount: 0, teacherCount: 0, assignmentCount: 0, avgAttendance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Stat blocks config for navigation
  const statConfigs = [
    { label: "Subjects", value: stats.subjectCount, route: "/student/subjects" },
    { label: "Teachers", value: stats.teacherCount, route:"/student/dashboard" },
    { label: "Assignments", value: stats.assignmentCount, route: "/student/assignments" },
    { label: "Avg. Attendance", value: stats.avgAttendance + "%", route: "/student/attendance" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (e) {
        setError("Failed to fetch dashboard stats");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-3xl text-violet-400 font-bold mb-6">Student Dashboard</h2>
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

export default StudentDashboard;
