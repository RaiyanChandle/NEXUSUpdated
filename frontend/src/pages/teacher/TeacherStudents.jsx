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

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/courses-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses || []);
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
    setPage(1);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/course-students-attendance`, {
        params: { subjectId: course.subjectId, classId: course.classId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
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
    setPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(students.length / pageSize) || 1;
  const paginatedStudents = students.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-8 w-full max-w-6xl mx-auto overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">
        My Courses & Students
      </h2>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="flex flex-wrap gap-4 mb-8">
        {courses.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg px-6 py-4 bg-violet-800 text-white shadow cursor-pointer border-2 transition-all ${
              selected && selected.id === c.id
                ? "border-violet-400"
                : "border-transparent"
            }`}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-violet-950 rounded-lg shadow-2xl w-[95%] max-w-5xl h-[85vh] flex flex-col relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-3 text-white text-2xl hover:text-violet-300 transition"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="p-4 border-b border-violet-800 text-center text-lg font-semibold text-violet-200">
              Students for {selected.subject.name} ({selected.class.name})
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="text-violet-400 text-center py-8">
                  Loading students...
                </div>
              ) : error ? (
                <div className="text-red-400 text-center py-8">{error}</div>
              ) : (
                <table className="min-w-full text-white whitespace-nowrap border-collapse">
                  <thead className="sticky top-0 bg-violet-900 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left">Roll No</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Avg Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-violet-800 last:border-0 hover:bg-violet-900/40"
                      >
                        <td className="px-4 py-2">{s.rollno || "-"}</td>
                        <td className="px-4 py-2">{s.name}</td>
                        <td className="px-4 py-2 break-all">{s.email}</td>
                        <td className="px-4 py-2">
                          {typeof s.avgAttendance === "number"
                            ? `${s.avgAttendance.toFixed(1)}%`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-violet-300"
                        >
                          No students found for this course/class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination controls */}
            {students.length > pageSize && (
              <div className="flex justify-center items-center gap-4 p-3 border-t border-violet-800">
                <button
                  className="px-3 py-1 bg-violet-800 hover:bg-violet-700 text-white rounded disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-violet-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 bg-violet-800 hover:bg-violet-700 text-white rounded disabled:opacity-50"
                  onClick={handleNext}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
