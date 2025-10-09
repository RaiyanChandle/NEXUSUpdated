import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("nexus_admin_jwt");
        const res = await axios.get(`${API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.admin.email || "");
      } catch (err) {
        setError("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [API_URL]);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.put(`${API_URL}/admin/profile`, { email, password: password || undefined }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated successfully");
      setPassword("");
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-3xl text-violet-400 font-bold mb-6">Admin Profile</h2>
      <div className="bg-violet-900/80 rounded-lg shadow p-8 w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-violet-300 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!editing}
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-violet-300 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Leave blank to keep unchanged"
            disabled={!editing}
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        {editing ? (
          <div className="flex gap-4 mt-2">
            <button
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold"
              onClick={() => { setEditing(false); setPassword(""); setSuccess(""); setError(""); }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold mt-2"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}
        {success && <div className="text-green-400 text-center mt-2">{success}</div>}
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default AdminProfile;
