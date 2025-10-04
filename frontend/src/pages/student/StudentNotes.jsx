import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentNotes = ({ subjectId, subjectName, onBack }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/notes?subjectId=${subjectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes);
      } catch {
        setError("Failed to load notes");
      }
    };
    fetchNotes();
  }, [API_URL, subjectId]);

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-4 px-4 py-2 rounded bg-violet-700 hover:bg-violet-600 text-white">Back</button>
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Notes for {subjectName}</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="bg-violet-900/60 rounded-lg shadow p-4">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Topic</th>
              <th className="px-4 py-2 text-left">PDF</th>
              <th className="px-4 py-2 text-left">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note.id} className="border-b border-violet-700 last:border-0">
                <td className="px-4 py-2">{note.topic}</td>
                <td className="px-4 py-2">
                  <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">View PDF</a>
                </td>
                <td className="px-4 py-2">{new Date(note.createdAt).toLocaleString()}</td>
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

export default StudentNotes;
