import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherNotes = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ subjectId: "", topic: "", pdf: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Correct mapping for your API response
        const subjectsData = (res.data.subjects || []).map((s) => ({
          id: s.subjectId,
          name: s.subjectName,
          className: s.className,
          studentCount: s.studentCount,
        }));

        setSubjects(subjectsData);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      }
    };

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
      }
    };

    fetchSubjects();
    fetchNotes();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const data = new FormData();
      data.append("subjectId", form.subjectId);
      data.append("topic", form.topic);
      data.append("pdf", form.pdf);

      await axios.post(`${API_URL}/teacher/notes/upload`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ subjectId: "", topic: "", pdf: null });

      // Refresh notes after upload
      const res = await axios.get(`${API_URL}/teacher/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes || []);
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Upload Notes</h2>

      <form
        className="flex flex-col gap-4 mb-10 bg-violet-900/60 p-6 rounded-lg shadow"
        onSubmit={handleSubmit}
      >
        {/* Subject dropdown */}
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.className})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          placeholder="Topic Name"
          className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
          required
        />

        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleChange}
          className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
          required
        />

        <button
          type="submit"
          className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Note"}
        </button>

        {error && <div className="text-red-400 text-center">{error}</div>}
      </form>

      <h2 className="text-xl font-bold mb-4 text-violet-300">My Uploaded Notes</h2>
      <div className="bg-violet-900/60 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Topic</th>
              <th className="px-4 py-2 text-left">PDF</th>
              <th className="px-4 py-2 text-left">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-b border-violet-700 last:border-0">
                <td className="px-4 py-2">{note.subject?.name || "Unknown"}</td>
                <td className="px-4 py-2">{note.topic}</td>
                <td className="px-4 py-2">
                  <a
                    href={note.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="px-4 py-2">
                  {new Date(note.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-violet-300">
                  No notes uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherNotes;
