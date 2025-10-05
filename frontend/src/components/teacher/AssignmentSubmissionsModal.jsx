import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentSubmissionsModal = ({ assignmentId, open, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/assignment-submissions`, {
        params: { assignmentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data.submissions);
    } catch {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchSubmissions();
  }, [assignmentId, open, API_URL]);

  const handleAccept = async (submissionId, marks) => {
    setActionLoading(submissionId + "-accept");
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      await axios.post(`${API_URL}/teacher/assignments/accept`, { submissionId, marksAwarded: marks }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubmissions();
    } catch {
      alert("Failed to accept submission");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (submissionId) => {
    setActionLoading(submissionId + "-reject");
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      await axios.post(`${API_URL}/teacher/assignments/reject`, { submissionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubmissions();
    } catch {
      alert("Failed to reject submission");
    } finally {
      setActionLoading("");
    }
  };

    if (!open) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-violet-950 rounded-xl shadow-2xl p-12 w-full max-w-6xl min-h-[60vh] relative overflow-y-auto">
        <button className="absolute top-6 right-8 text-white text-3xl" onClick={onClose}>&times;</button>
        <h3 className="text-2xl font-bold text-violet-200 mb-6">Assignment Submissions</h3>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-violet-900 rounded-lg text-white text-base">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted At</th>
                <th className="px-4 py-3 text-left">PDF</th>
                <th className="px-4 py-3 text-left">Marks</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-6 text-violet-300">Loading...</td></tr>
              ) : submissions.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-violet-400">No submissions found.</td></tr>
              ) : (
                submissions.map(sub => (
                  <tr key={sub.id} className="border-b border-violet-800 last:border-0">
                    <td className="px-4 py-2">{sub.student?.name || '-'}</td>
                    <td className="px-4 py-2">{sub.student?.email || '-'}</td>
                    <td className="px-4 py-2">{sub.status}</td>
                    <td className="px-4 py-2">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">{sub.fileUrl ? <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">View PDF</a> : '-'}</td>
                    <td className="px-4 py-2">{sub.marksAwarded ?? '-'}</td>
                    <td className="px-4 py-2">
                      {sub.status !== 'ACCEPTED' && (
                        <div className="flex gap-2">
                          <button className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-semibold" onClick={() => {
                            const marks = prompt('Enter marks to accept:');
                            if (marks !== null && marks !== '' && !isNaN(Number(marks))) {
                              handleAccept(sub.id, Number(marks));
                            }
                          }}>Accept</button>
                          <button className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 text-white font-semibold" onClick={() => handleReject(sub.id)}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionsModal;
