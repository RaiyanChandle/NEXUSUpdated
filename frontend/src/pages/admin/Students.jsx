import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";

const AdminStudents = () => {
  const emptyEditState = {
    open: false,
    student: null,
    name: "",
    email: "",
    rollno: "",
    classId: "",
    subjectIds: [],
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [editModal, setEditModal] = useState(emptyEditState);
  const [deleteModal, setDeleteModal] = useState({ open: false, studentId: null });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // Update subjects when class changes
  useEffect(() => {
    if (!classId) {
      setSubjects([]);
      setSelectedSubjects([]);
      return;
    }
    const cls = classes.find((c) => c.id === classId);
    setSubjects(cls ? cls.subjects : []);
    setSelectedSubjects([]);
  }, [classId, classes]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.post(
        `${API_URL}/admin/students`,
        { name, email, password, classId, subjectIds: selectedSubjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setMessage("Student created successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setClassId("");
        setSelectedSubjects([]);
        fetchStudents();
      } else {
        setMessage(res.data.message || "Error creating student");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteStudent = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.delete(`${API_URL}/admin/students/${deleteModal.studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModal({ open: false, studentId: null });
      fetchStudents();
    } catch {
      alert("Failed to delete student");
      setDeleteModal({ open: false, studentId: null });
    }
  };

  // Handle Edit Save
  const handleEditSave = async () => {
    if (!editModal.student) return;
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      await axios.put(
        `${API_URL}/admin/students/${editModal.student.id}`,
        {
          name: editModal.name,
          email: editModal.email,
          rollno: editModal.rollno,
          classId: editModal.classId,
          subjectIds: editModal.subjectIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditModal(emptyEditState);
      fetchStudents();
    } catch {
      alert("Failed to update student");
    }
  };

  // Filter + Pagination
  const filteredStudents = students
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesClass =
        !filterClass ||
        (s.enrollments &&
          s.enrollments.length > 0 &&
          s.enrollments[0].classId === filterClass);
      return matchesSearch && matchesClass;
    })
    .sort((a, b) => {
      if (!a.rollno && !b.rollno) return 0;
      if (!a.rollno) return 1;
      if (!b.rollno) return -1;
      const aNum = Number(a.rollno),
        bNum = Number(b.rollno);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return String(a.rollno).localeCompare(String(b.rollno));
    });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, filterClass]);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-10">
      {/* CREATE STUDENT FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 w-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:ring-2 focus:ring-violet-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:ring-2 focus:ring-violet-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-violet-300 font-semibold">Assign Class</label>
          <select
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:ring-2 focus:ring-violet-500"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {subjects.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-violet-300 font-semibold">Assign Subjects</label>
            <button
              type="button"
              className="mb-2 self-end px-3 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white text-xs font-semibold"
              onClick={() => setSelectedSubjects(subjects.map((s) => s.id))}
              disabled={subjects.length === 0}
            >
              Select All
            </button>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subj) => (
                <label
                  key={subj.id}
                  className="flex items-center gap-2 bg-violet-900 px-3 py-1 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subj.id)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedSubjects([...selectedSubjects, subj.id]);
                      else
                        setSelectedSubjects(
                          selectedSubjects.filter((id) => id !== subj.id)
                        );
                    }}
                  />
                  <span>{subj.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white placeholder-violet-400 focus:ring-2 focus:ring-violet-500 w-full"
        />
        <select
          className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:ring-2 focus:ring-violet-500 w-64"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* STUDENT TABLE */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Class</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((s) => {
              let className = "N/A";
              if (s.enrollments && s.enrollments.length > 0) {
                const classObj = classes.find(
                  (c) => c.id === s.enrollments[0].classId
                );
                if (classObj) className = classObj.name;
              }
              return (
                <tr key={s.id}>
                  <td className="px-4 py-2">{s.rollno}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{className}</td>
                  <td className="px-4 py-2">
                    <button
                      className="p-2 rounded hover:bg-red-800 text-red-400 hover:text-red-200 transition-colors"
                      onClick={() =>
                        setDeleteModal({ open: true, studentId: s.id })
                      }
                      title="Delete Student"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-violet-800 text-violet-400 hover:text-violet-200 transition-colors ml-2"
                      onClick={() =>
                        setEditModal({
                          open: true,
                          student: s,
                          name: s.name,
                          email: s.email,
                          rollno: s.rollno || "",
                          classId:
                            (s.enrollments && s.enrollments[0]?.classId) || "",
                          subjectIds: (s.enrollments || [])
                            .map((e) => e.subjectId)
                            .filter(Boolean),
                        })
                      }
                      title="Edit Student"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-violet-300"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-violet-500"
                : "bg-violet-700 hover:bg-violet-600"
            } text-white font-semibold`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* EDIT MODAL */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-violet-950 rounded-lg shadow-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-semibold text-violet-200 mb-4">
              Edit Student
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={editModal.name}
                onChange={(e) =>
                  setEditModal((m) => ({ ...m, name: e.target.value }))
                }
                placeholder="Name"
                className="rounded-lg px-4 py-2 bg-violet-900 border border-violet-700 text-white placeholder-violet-400"
              />
              <input
                type="email"
                value={editModal.email}
                onChange={(e) =>
                  setEditModal((m) => ({ ...m, email: e.target.value }))
                }
                placeholder="Email"
                className="rounded-lg px-4 py-2 bg-violet-900 border border-violet-700 text-white placeholder-violet-400"
              />
              <input
                type="text"
                value={editModal.rollno}
                onChange={(e) =>
                  setEditModal((m) => ({ ...m, rollno: e.target.value }))
                }
                placeholder="Roll No"
                className="rounded-lg px-4 py-2 bg-violet-900 border border-violet-700 text-white placeholder-violet-400"
              />
              <select
                value={editModal.classId}
                onChange={(e) =>
                  setEditModal((m) => ({
                    ...m,
                    classId: e.target.value,
                    subjectIds: [],
                  }))
                }
                className="rounded-lg px-4 py-2 bg-violet-900 border border-violet-700 text-white"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              {/* Subjects */}
              {editModal.classId && (
                <div className="flex flex-col gap-2">
                  <label className="text-violet-300 font-semibold">
                    Subjects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(classes.find((c) => c.id === editModal.classId)?.subjects ||
                      []
                    ).map((subj) => (
                      <label
                        key={subj.id}
                        className="flex items-center gap-2 bg-violet-900 px-3 py-1 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editModal.subjectIds.includes(subj.id)}
                          onChange={(e) => {
                            setEditModal((m) => ({
                              ...m,
                              subjectIds: e.target.checked
                                ? [...m.subjectIds, subj.id]
                                : m.subjectIds.filter((id) => id !== subj.id),
                            }));
                          }}
                        />
                        <span>{subj.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
                  onClick={() => setEditModal(emptyEditState)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-6 rounded-lg shadow-xl text-center">
            <p className="text-white mb-4">
              Are you sure you want to delete this student?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold"
                onClick={() => setDeleteModal({ open: false, studentId: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 text-white font-semibold"
                onClick={handleDeleteStudent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-violet-300 mt-4 font-medium">{message}</p>
      )}
    </div>
  );
};

export default AdminStudents;
