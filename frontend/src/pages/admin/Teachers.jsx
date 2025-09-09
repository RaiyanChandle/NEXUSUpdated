import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminTeachers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subjectIds, setSubjectIds] = useState([]);
  const [expandedClassIds, setExpandedClassIds] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [modalOpen]);
  const [modalTeacher, setModalTeacher] = useState(null);
  const [editFields, setEditFields] = useState({ name: "", email: "", password: "", subjectIds: [] });

  useEffect(() => {
    fetchClassesAndSubjects();
    fetchTeachers();
  }, []);

  const fetchClassesAndSubjects = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get("http://localhost:3000/api/v1/admin/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
      // Collect all subjects for backward compatibility
      let allSubjects = [];
      (res.data.classes || []).forEach(cls => {
        if (Array.isArray(cls.subjects)) allSubjects = allSubjects.concat(cls.subjects);
      });
      setSubjects(allSubjects);
    } catch (err) {
      setError("Failed to fetch classes/subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get("http://localhost:3000/api/v1/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.teachers || []);
    } catch (err) {
      setError("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || subjectIds.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.post(
        "http://localhost:3000/api/v1/admin/teachers",
        { name, email, password, subjectIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(""); setEmail(""); setPassword(""); setSubjectIds([]);
      fetchTeachers();
    } catch (err) {
      setError("Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (teacher) => {
    setModalTeacher(teacher);
    setEditFields({
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
      subjectIds: teacher.subjectsTaught.map(st => st.subjectId)
    });
    setModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateTeacher = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.put(
        `http://localhost:3000/api/v1/admin/teachers/${modalTeacher.id}`,
        { ...editFields },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError("Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto mt-10">
      <form onSubmit={handleCreateTeacher} className="flex flex-col gap-4 mb-8 w-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-violet-300 font-semibold">Assign Subjects</label>
          <div className="bg-violet-950 rounded border border-violet-700 p-2 max-h-60 overflow-y-auto">
            {classes.map(cls => (
              <div key={cls.id}>
                <div
                  className="flex items-center justify-between cursor-pointer py-2 px-2 hover:bg-violet-900 rounded"
                  onClick={() => setExpandedClassIds(
                    expandedClassIds.includes(cls.id)
                      ? expandedClassIds.filter(id => id !== cls.id)
                      : [...expandedClassIds, cls.id]
                  )}
                >
                  <span className="font-semibold text-white">{cls.name}</span>
                  <span className="text-violet-400">{expandedClassIds.includes(cls.id) ? "▲" : "▼"}</span>
                </div>
                {expandedClassIds.includes(cls.id) && (
                  <div className="pl-4 flex flex-col gap-1 mt-1 mb-2">
                    {(cls.subjects || []).length === 0 && <span className="text-violet-300">No subjects</span>}
                    {(cls.subjects || []).map(subj => {
                      const selected = subjectIds.includes(subj.id);
                      return (
                        <div
                          key={subj.id}
                          onClick={() => {
                            if (selected) setSubjectIds(subjectIds.filter(id => id !== subj.id));
                            else setSubjectIds([...subjectIds, subj.id]);
                          }}
                          className={`px-4 py-2 rounded cursor-pointer transition-colors duration-150 mb-1 ${selected ? 'bg-green-600 text-white' : 'bg-violet-900 text-white hover:bg-violet-800'}`}
                        >
                          {subj.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          Create Teacher
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Subjects</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="px-4 sm:px-6 py-3 cursor-pointer" onClick={() => handleOpenModal(teacher)}>{teacher.name}</td>
                <td className="px-4 sm:px-6 py-3 cursor-pointer" onClick={() => handleOpenModal(teacher)}>{teacher.email}</td>
                <td className="px-4 sm:px-6 py-3 cursor-pointer" onClick={() => handleOpenModal(teacher)}>
                  {teacher.subjectsTaught.map(st => st.subject.name).join(", ")}
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <button
                    className="px-4 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors duration-200"
                    onClick={() => handleOpenModal(teacher)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No teachers created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing/editing teacher details */}
      {modalOpen && modalTeacher && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-violet-300 text-center">
              Edit Teacher
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={editFields.name}
                onChange={e => handleEditChange("name", e.target.value)}
                className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={editFields.email}
                onChange={e => handleEditChange("email", e.target.value)}
                className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={editFields.password}
                onChange={e => handleEditChange("password", e.target.value)}
                className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <label className="text-violet-300 font-semibold">Assign Subjects</label>
              <div className="bg-violet-950 rounded border border-violet-700 p-2 max-h-60 overflow-y-auto">
                {classes.map(cls => (
                  <div key={cls.id}>
                    <div
                      className="flex items-center justify-between cursor-pointer py-2 px-2 hover:bg-violet-900 rounded"
                      onClick={() => setExpandedClassIds(
                        expandedClassIds.includes(cls.id)
                          ? expandedClassIds.filter(id => id !== cls.id)
                          : [...expandedClassIds, cls.id]
                      )}
                    >
                      <span className="font-semibold text-white">{cls.name}</span>
                      <span className="text-violet-400">{expandedClassIds.includes(cls.id) ? "▲" : "▼"}</span>
                    </div>
                    {expandedClassIds.includes(cls.id) && (
                      <div className="pl-4 flex flex-col gap-1 mt-1 mb-2">
                        {(cls.subjects || []).length === 0 && <span className="text-violet-300">No subjects</span>}
                        {(cls.subjects || []).map(subj => {
                          const selected = editFields.subjectIds.includes(subj.id);
                          return (
                            <div
                              key={subj.id}
                              onClick={() => {
                                if (selected) handleEditChange("subjectIds", editFields.subjectIds.filter(id => id !== subj.id));
                                else handleEditChange("subjectIds", [...editFields.subjectIds, subj.id]);
                              }}
                              className={`px-4 py-2 rounded cursor-pointer transition-colors duration-150 mb-1 ${selected ? 'bg-green-600 text-white' : 'bg-violet-900 text-white hover:bg-violet-800'}`}
                            >
                              {subj.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200"
                onClick={handleUpdateTeacher}
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
