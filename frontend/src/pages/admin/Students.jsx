import React, { useEffect, useState } from "react";
import axios from "axios";


const AdminStudents = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
    } catch {}
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
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

  useEffect(() => {
    // Update subjects when classId changes
    if (!classId) {
      setSubjects([]);
      setSelectedSubjects([]);
      return;
    }
    const cls = classes.find(c => c.id === classId);
    setSubjects(cls ? cls.subjects : []);
    setSelectedSubjects([]);
  }, [classId, classes]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("nexus_admin_jwt");
      const res = await axios.post(`${API_URL}/admin/students`, { name, email, password, classId, subjectIds: selectedSubjects }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        setMessage("Student created successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setClassId("");
        setSelectedSubjects([]);
        fetchStudents(); // Refresh list
      } else {
        setMessage(res.data.message || "Error creating student");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 w-full">
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
          <label className="text-violet-300 font-semibold">Assign Class</label>
          <select
            className="px-4 py-2 rounded bg-violet-950 border border-violet-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={classId}
            onChange={e => setClassId(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-violet-300 font-semibold">Assign Subjects</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(subj => (
                <label key={subj.id} className="flex items-center gap-2 bg-violet-900 px-3 py-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subj.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedSubjects([...selectedSubjects, subj.id]);
                      else setSelectedSubjects(selectedSubjects.filter(id => id !== subj.id));
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
          className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-violet-900/80 text-white text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold">Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              // Find class name by classId (from enrollments or student object)
              let className = "N/A";
              if (s.enrollments && s.enrollments.length > 0) {
                const classObj = classes.find(c => c.id === s.enrollments[0].classId);
                if (classObj) className = classObj.name;
              }
              return (
                <tr key={s.id}>
                  <td className="px-4 py-2">{s.rollno}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 sm:px-6 py-3">{className}</td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-6 text-center text-violet-300">
                  No students created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;
