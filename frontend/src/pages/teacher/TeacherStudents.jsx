
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherStudents = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/courses-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses);
      } catch (err) {
        setError("Failed to fetch courses/classes");
      }
    };
    fetchCourses();
  }, [API_URL]);

  const handleSelect = async (course) => {
    setSelected(course);
    setStudents([]);
    setLoading(true);
    setModalOpen(true);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/course-students`, {
        params: { subjectId: course.subjectId, classId: course.classId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students);
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setStudents([]);
    setError("");
  };


  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Courses & Students</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="flex flex-wrap gap-4 mb-8">
        {courses.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg px-6 py-4 bg-violet-800 text-white shadow cursor-pointer border-2 transition-all ${selected && selected.id === c.id ? "border-violet-400" : "border-transparent"}`}
            onClick={() => handleSelect(c)}
          >
            <div className="font-semibold text-lg">{c.subject.name}</div>
            <div className="text-violet-300">Class: {c.class.name}</div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-violet-300">No courses/classes found.</div>
        )}
      </div>
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="mb-4 text-lg text-violet-200 font-semibold text-center">
              Students for {selected.subject.name} ({selected.class.name})
            </div>
            {loading ? (
              <div className="text-violet-400">Loading students...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : (
              <table className="min-w-full text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-violet-700 last:border-0">
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.email}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-violet-300">
                        No students found for this course/class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
