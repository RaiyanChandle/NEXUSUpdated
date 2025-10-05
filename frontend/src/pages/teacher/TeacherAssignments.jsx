import React, { useEffect, useState } from "react";
import axios from "axios";
import AssignmentSubmissionsModal from "../../components/teacher/AssignmentSubmissionsModal.jsx";

const TeacherAssignments = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // { subjectId, subjectName, classId, className }
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [marks, setMarks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [submissionsModal, setSubmissionsModal] = useState({ open: false, assignmentId: null });
  const [creatingAssignment, setCreatingAssignment] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/subjects`, {
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
    setShowCreate(false);
    setSuccess("");
    setModalOpen(true);
    setLoadingAssignments(true);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/assignments`, {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      setCreatingAssignment(true);
      const token = localStorage.getItem("nexus_teacher_jwt");
      const formData = new FormData();
      formData.append("subjectId", selected.subjectId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("marks", marks);
      formData.append("deadline", deadline);
      if (pdf) formData.append("pdf", pdf);
      await axios.post(`${API_URL}/teacher/assignments/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle(""); setDescription(""); setMarks(""); setDeadline(""); setPdf(null);
      setSuccess("Assignment created!");
      setShowCreate(false);
      // Refresh assignment list
      handleViewAssignments(selected);
    } catch {
      setSuccess("Failed to create assignment");
    } finally {
      setCreatingAssignment(false);
    }
  };


  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Subjects & Classes</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {subjects.map(s => (
          <div key={s.subjectId} className="bg-violet-900/60 rounded-lg shadow p-6 flex flex-col gap-2">
            <div className="text-xl font-semibold text-violet-200">{s.subjectName}</div>
            <div className="text-violet-400 text-base">Class: {s.className}</div>
            <button
              className="mt-4 px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold w-fit self-end"
              onClick={() => handleViewAssignments(s)}
            >
              View Assignments
            </button>
          </div>
        ))}
      </div>
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-violet-950 rounded-xl shadow-2xl p-10 w-full max-w-5xl min-h-[70vh] relative overflow-y-auto">
            <button className="absolute top-6 right-8 text-white text-3xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-violet-200 mb-6">Assignments for {selected.subjectName} ({selected.className})</h3>
            <button
              className="mb-6 px-5 py-3 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg"
              onClick={() => setShowCreate(true)}
            >
              Create Assignment
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-violet-900 rounded-lg text-white text-base">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Deadline</th>
                    <th className="px-4 py-3 text-left">Marks</th>
                    <th className="px-4 py-3 text-left">PDF</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAssignments ? (
                    <tr><td colSpan={6} className="text-center py-6 text-violet-300">Loading...</td></tr>
                  ) : assignments.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-6 text-violet-400">No assignments found.</td></tr>
                  ) : (
                    assignments.map(a => (
                      <tr key={a.id} className="border-b border-violet-800 last:border-0">
                        <td className="px-4 py-2 font-semibold text-violet-200">{a.title}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={a.description}>{a.description}</td>
                        <td className="px-4 py-2">{new Date(a.deadline).toLocaleString()}</td>
                        <td className="px-4 py-2">{a.marks}</td>
                        <td className="px-4 py-2">
                          {a.pdfUrl ? <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">View PDF</a> : '-'}
                        </td>
                        <td className="px-4 py-2">
                          <button className="px-3 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold" onClick={() => { setSubmissionsModal({ open: true, assignmentId: a.id }); }}>View Submissions</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {showCreate && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-violet-900 rounded-xl shadow-2xl p-10 w-full max-w-lg relative">
                  <button className="absolute top-4 right-6 text-white text-2xl" onClick={() => setShowCreate(false)}>&times;</button>
                  <h4 className="text-xl font-bold text-violet-200 mb-4">Create Assignment</h4>
                  <form className="flex flex-col gap-4" onSubmit={handleCreate}>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Title"
                      required
                      className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
                    />
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Description"
                      required
                      className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
                    />
                    <input
                      type="number"
                      value={marks}
                      onChange={e => setMarks(e.target.value)}
                      placeholder="Marks"
                      required
                      className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
                    />
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      required
                      className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={e => setPdf(e.target.files[0])}
                      className="rounded px-3 py-2 bg-violet-950 border border-violet-700 text-white"
                    />
                    <button type="submit" className="rounded bg-violet-700 hover:bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-60" disabled={creatingAssignment}>{creatingAssignment ? 'Saving...' : 'Save Assignment'}</button>
                  </form>
                  {success && <div className="text-green-400 mt-2">{success}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <AssignmentSubmissionsModal
        assignmentId={submissionsModal.assignmentId}
        open={submissionsModal.open}
        onClose={() => setSubmissionsModal({ open: false, assignmentId: null })}
      />
    </div>
  );
};

export default TeacherAssignments;
