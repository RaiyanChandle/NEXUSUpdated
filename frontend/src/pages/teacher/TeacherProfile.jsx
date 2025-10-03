
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.teacher);
        setForm({ name: res.data.teacher.name, email: res.data.teacher.email, password: '' });
      } catch {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [API_URL]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await axios.post(`${API_URL}/teacher/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.teacher);
      setEditing(false);
      setSuccess('Profile updated successfully');
      setForm(f => ({ ...f, password: '' }));
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="p-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Profile</h2>
      <div className="bg-violet-900/60 rounded-lg shadow p-6">
        {!editing ? (
          <>
            <div className="mb-4">
              <div className="font-semibold text-violet-200">Name:</div>
              <div className="text-white text-lg">{profile.name}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-violet-200">Email:</div>
              <div className="text-white text-lg">{profile.email}</div>
            </div>
            <button className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
              placeholder="New Password (leave blank to keep)"
            />
            <div className="flex gap-4">
              <button type="submit" className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white">
                Save
              </button>
              <button type="button" className="rounded bg-gray-600 hover:bg-gray-500 px-4 py-2 font-semibold text-white" onClick={() => { setEditing(false); setForm({ ...form, password: '' }); }}>
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

export default TeacherProfile;
