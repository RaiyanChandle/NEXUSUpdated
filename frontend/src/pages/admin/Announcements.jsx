import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAnnouncements = () => {
  const [modalAnnouncement, setModalAnnouncement] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [type, setType] = useState("GLOBAL");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchAnnouncements();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch {}
  };
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.teachers || []);
    } catch {}
  };
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data.announcements || []);
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.post(
        `${API_URL}/admin/announcements`,
        {
          title,
          message,
          type,
          classId: type === "CLASS" ? classId : undefined,
          teacherId: type === "TEACHER" ? teacherId : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Announcement posted!");
      setMessage("");
      setTitle("");
      setClassId("");
      setTeacherId("");
      fetchAnnouncements();
    } catch (err) {
      setError("Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-10">
      <form onSubmit={handlePost} className="flex flex-col gap-4 mb-8 w-full">
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-l bg-${type === "GLOBAL" ? "violet-600" : "violet-900"} text-white font-semibold border border-violet-700`}
            onClick={() => setType("GLOBAL")}
          >
            Global
          </button>
          <button
            type="button"
            className={`px-4 py-2 bg-${type === "CLASS" ? "violet-600" : "violet-900"} text-white font-semibold border-t border-b border-violet-700`}
            onClick={() => setType("CLASS")}
          >
            Class
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r bg-${type === "TEACHER" ? "violet-600" : "violet-900"} text-white font-semibold border border-violet-700`}
            onClick={() => setType("TEACHER")}
          >
            Teacher
          </button>
        </div>
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          placeholder="Announcement message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        {type === "CLASS" && (
          <select
            value={classId}
            onChange={e => setClassId(e.target.value)}
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option value={cls.id} key={cls.id}>{cls.name}</option>
            ))}
          </select>
        )}
        {type === "TEACHER" && (
          <select
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          >
            <option value="ALL">All Teachers</option>
            {teachers.map(teacher => (
              <option value={teacher.id} key={teacher.id}>{teacher.name} ({teacher.email})</option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Announcement"}
        </button>
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        {success && <div className="text-green-400 text-center mt-2">{success}</div>}
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Title</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Type</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Target</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Created By</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id} className="cursor-pointer hover:bg-violet-800 transition" onClick={() => setModalAnnouncement(a)}>
                <td className="px-4 sm:px-6 py-3">{a.title || '-'}</td>
                <td className="px-4 sm:px-6 py-3">{a.type}</td>
                <td className="px-4 sm:px-6 py-3">
                  {a.type === 'GLOBAL' && 'All'}
                  {a.type === 'CLASS' && (classes.find(cls => cls.id === a.classId)?.name || a.classId)}
                  {a.type === 'TEACHER' && (a.teacherId === 'ALL' ? 'All Teachers' : (teachers.find(t => t.id === a.teacherId)?.name || a.teacherId))}
                </td>
                <td className="px-4 sm:px-6 py-3">{a.createdBy?.email || '-'}</td>
                <td className="px-4 sm:px-6 py-3">{new Date(a.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No announcements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalAnnouncement && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setModalAnnouncement(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-violet-300 text-center">
              {modalAnnouncement.title || 'Announcement'}
            </h2>
            <div className="text-white whitespace-pre-line mb-4">
              {modalAnnouncement.message}
            </div>
            <div className="text-violet-400 text-sm text-center">
              {modalAnnouncement.type} &bull; {modalAnnouncement.createdBy?.email || '-'} &bull; {new Date(modalAnnouncement.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
