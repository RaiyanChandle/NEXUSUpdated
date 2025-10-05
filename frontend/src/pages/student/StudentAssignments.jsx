
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentAssignments = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null); // { subjectId, subjectName, className }
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [uploading, setUploading] = useState("");
  const [pdf, setPdf] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data.subjects);
      } catch {
        setError("Failed to load subjects/classes");
      }
    };
    fetchSubjects();
  }, [API_URL]);

  const handleViewAssignments = async (subject) => {
    setSelected(subject);
    setModalOpen(true);
    setLoadingAssignments(true);
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_student_jwt");
      const res = await axios.get(`${API_URL}/student/assignments`, {
        params: { subjectId: subject.subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data.assignments);
    } catch {
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleUpload = async (assignmentId) => {
    if (!pdf[assignmentId]) return;
    setUploading(assignmentId);
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_student_jwt");
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("pdf", pdf[assignmentId]);
      await axios.post(`${API_URL}/student/assignments/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Assignment submitted!");
      handleViewAssignments(selected);
    } catch {
      setSuccess("Failed to submit assignment");
    } finally {
      setUploading("");
    }
  };

  const handleDelete = async (assignmentId) => {
    setUploading(assignmentId);
    setSuccess("");
    try {
      const token = localStorage.getItem("nexus_student_jwt");
      await axios.post(`${API_URL}/student/assignments/delete`, { assignmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Submission deleted!");
      handleViewAssignments(selected);
    } catch {
      setSuccess("Failed to delete submission");
    } finally {
      setUploading("");
    }
  };


  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Subjects (Assignments)</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((s) => (
          <div
            key={s.subjectId}
            className="bg-violet-900/60 rounded-lg shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl relative min-h-[170px] pb-16"
          >
            <div className="text-xl font-semibold text-violet-200">{s.subjectName}</div>
            <div className="text-violet-400 text-base">Class: {s.className || '-'}</div>
            <button
              className="absolute right-4 bottom-4 px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold w-fit transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400"
              onClick={() => handleViewAssignments(s)}
            >
              View Assignments
            </button>
          </div>
        ))}
        {subjects.length === 0 && !error && (
          <div className="col-span-2 text-center text-violet-300 py-10">No subjects found.</div>
        )}
      </div>
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-violet-950 rounded-xl shadow-2xl p-10 w-full max-w-6xl min-h-[60vh] relative overflow-y-auto">
            <button className="absolute top-6 right-8 text-white text-3xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-violet-200 mb-6">Assignments for {selected.subjectName} ({selected.className})</h3>
            {success && <div className="text-green-400 mb-4">{success}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-violet-900 rounded-lg text-white text-base">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Deadline</th>
                    <th className="px-4 py-3 text-left">Marks</th>
                    <th className="px-4 py-3 text-left">PDF</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAssignments ? (
                    <tr><td colSpan={6} className="text-center py-6 text-violet-300">Loading...</td></tr>
                  ) : assignments.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-6 text-violet-400">No assignments found.</td></tr>
                  ) : (
                    assignments.map(a => {
                      const submission = a.submissions && a.submissions[0];
                      return (
                        <tr key={a.id} className="border-b border-violet-800 last:border-0">
                          <td className="px-4 py-2 font-semibold text-violet-200">{a.title}</td>
                          <td className="px-4 py-2">{new Date(a.deadline).toLocaleString()}</td>
                          <td className="px-4 py-2">{a.marks}</td>
                          <td className="px-4 py-2">{a.pdfUrl ? <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">View PDF</a> : '-'}</td>
                          <td className="px-4 py-2">{submission ? submission.status : 'Not Submitted'}{submission && submission.status === 'ACCEPTED' && submission.marksAwarded !== undefined ? ` (Marks: ${submission.marksAwarded})` : ''}</td>
                          <td className="px-4 py-2">
                            {!submission || submission.status === 'UPLOAD' ? (
                              <div className="flex gap-2 items-center">
                                <input type="file" accept="application/pdf" onChange={e => setPdf({ ...pdf, [a.id]: e.target.files[0] })} />
                                <button
                                  className="px-3 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold"
                                  disabled={uploading === a.id}
                                  onClick={() => handleUpload(a.id)}
                                >
                                  {uploading === a.id ? 'Uploading...' : 'Upload'}
                                </button>
                              </div>
                            ) : (
                              <button
                                className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-semibold"
                                onClick={() => handleDelete(a.id)}
                                disabled={submission.status === 'ACCEPTED'}
                                title={submission.status === 'ACCEPTED' ? 'Cannot delete accepted submission' : ''}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
