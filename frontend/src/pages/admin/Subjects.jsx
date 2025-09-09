import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSubjects = () => {
  const [subjectName, setSubjectName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClass, setModalClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get("http://localhost:3000/api/v1/admin/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      setError("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectName.trim() || !selectedClass) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.post(
        "http://localhost:3000/api/v1/admin/subjects",
        { name: subjectName, classId: selectedClass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjectName("");
      setSelectedClass("");
      // If modal is open, refresh subjects for that class
      if (modalOpen && modalClass) fetchSubjectsForClass(modalClass.id);
    } catch (err) {
      setError("Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubjects = (cls) => {
    setModalClass(cls);
    setModalOpen(true);
    fetchSubjectsForClass(cls.id);
  };

  const fetchSubjectsForClass = async (classId) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`http://localhost:3000/api/v1/admin/subjects/${classId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      setError("Failed to fetch subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto mt-10">
      <form onSubmit={handleCreateSubject} className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option value={cls.id} key={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          Create
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Class Name</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-4 sm:px-6 py-3">{cls.name}</td>
                <td className="px-4 sm:px-6 py-3">
                  <button
                    className="px-4 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors duration-200"
                    onClick={() => handleViewSubjects(cls)}
                  >
                    View Subjects
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No classes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing subjects of a class */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-violet-300 text-center">
              Subjects for {modalClass?.name}
            </h2>
            <table className="min-w-full bg-violet-900/80 text-white text-sm mb-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Subject Name</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj) => (
                  <tr
                    key={subj.id}
                    className="cursor-pointer hover:bg-violet-800 transition"
                    onClick={() => alert(`Subject: ${subj.name}`)}
                  >
                    <td className="px-4 py-2">{subj.name}</td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-center text-violet-300">
                      No subjects for this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;
