
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.student);
      } catch {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [API_URL]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem("nexus_student_jwt");
      await axios.post(`${API_URL}/student/profile/password`, { password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      setPassword('');
      setSuccess('Password updated successfully');
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="p-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Profile</h2>
      <div className="bg-violet-900/60 rounded-lg shadow p-6">
        <div className="mb-4">
          <div className="font-semibold text-violet-200">Name:</div>
          <div className="text-white text-lg">{profile.name}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-violet-200">Email:</div>
          <div className="text-white text-lg">{profile.email}</div>
        </div>
        {!editing ? (
          <button className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white" onClick={() => setEditing(true)}>
            Change Password
          </button>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
              placeholder="New Password"
              required
            />
            <div className="flex gap-4">
              <button type="submit" className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white">
                Save
              </button>
              <button type="button" className="rounded bg-gray-600 hover:bg-gray-500 px-4 py-2 font-semibold text-white" onClick={() => { setEditing(false); setPassword(''); }}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {success && <div className="text-green-400 mt-4">{success}</div>}
        {error && <div className="text-red-400 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default StudentProfile;
