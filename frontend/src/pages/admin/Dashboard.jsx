import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, subjects: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <StatCard label="Students" value={counts.students} />
          <StatCard label="Teachers" value={counts.teachers} />
          <StatCard label="Subjects" value={counts.subjects} />
          <StatCard label="Classes" value={counts.classes} />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-violet-900/80 rounded-lg shadow p-8 flex flex-col items-center">
    <div className="text-4xl font-bold text-violet-300 mb-2">{value}</div>
    <div className="text-lg text-violet-200">{label}</div>
  </div>
);

export default AdminDashboard;
