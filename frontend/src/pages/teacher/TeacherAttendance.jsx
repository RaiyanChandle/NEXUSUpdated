
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherAttendance = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionForm, setSessionForm] = useState({ date: '', startTime: '', endTime: '', topic: '' });
  const [creating, setCreating] = useState(false);
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceSessionId, setAttendanceSessionId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceStep, setAttendanceStep] = useState(false);
  const [attendanceViewMode, setAttendanceViewMode] = useState(false);

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

  const openCreateSessionModal = (course) => {
    setSelectedCourse(course);
    setSessionForm({ date: '', startTime: '', endTime: '', topic: '' });
    setAttendanceStep(false);
    setAttendance([]);
    setAttendanceStudents([]);
    setAttendanceSessionId(null);
    setCreateModal(true);
  };
  const closeCreateSessionModal = () => {
    setCreateModal(false);
    setSelectedCourse(null);
    setAttendanceStep(false);
    setAttendance([]);
    setAttendanceStudents([]);
    setAttendanceSessionId(null);
  };
  const openViewSessionsModal = async (course) => {
    setSelectedCourse(course);
    setViewModal(true);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/attendance-sessions`, {
        params: { subjectId: course.subjectId, classId: course.classId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.sessions);
    } catch (err) {
      setError("Failed to fetch sessions");
    }
  };
  const closeViewSessionsModal = () => {
    setViewModal(false);
    setSelectedCourse(null);
    setSessions([]);
  };
  const handleEditSession = async (session) => {
    setViewModal(false);
    setCreateModal(true);
    setAttendanceStep(true);
    setAttendanceViewMode(false);
    setAttendanceSessionId(session.id);
    setSessionForm({ date: session.date.slice(0,10), startTime: session.startTime, endTime: session.endTime, topic: session.topic });
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/attendance-records`, {
        params: { sessionId: session.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data.records.map(r => ({ studentId: r.studentId, present: r.present, name: r.student.name, email: r.student.email })));
    } catch (err) {
      setError("Failed to fetch attendance records");
    }
  };

  const handleViewAttendance = async (session) => {
    setViewModal(false);
    setCreateModal(true);
    setAttendanceStep(true);
    setAttendanceViewMode(true);
    setAttendanceSessionId(session.id);
    setSessionForm({ date: session.date.slice(0,10), startTime: session.startTime, endTime: session.endTime, topic: session.topic });
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/attendance-records`, {
        params: { sessionId: session.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data.records.map(r => ({ studentId: r.studentId, present: r.present, name: r.student.name, email: r.student.email })));
    } catch (err) {
      setError("Failed to fetch attendance records");
    }
  };


  const handleSessionFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };
  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.post(`${API_URL}/teacher/attendance-session`, {
        subjectId: selectedCourse.subjectId,
        classId: selectedCourse.classId,
        date: sessionForm.date,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        topic: sessionForm.topic,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceSessionId(res.data.session.id);
      // Fetch students for this course/class
      const stuRes = await axios.get(`${API_URL}/teacher/course-students`, {
        params: { subjectId: selectedCourse.subjectId, classId: selectedCourse.classId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(
        stuRes.data.students
          .map(s => ({ studentId: s.id, present: true, name: s.name, email: s.email, rollno: s.rollno }))
      );
      setAttendanceStep(true);
    } catch (err) {
      setError("Failed to create session or fetch students");
    } finally {
      setCreating(false);
    }
  };
  const handleAttendanceChange = (studentId, present) => {
    setAttendance(attendance.map(a => a.studentId === studentId ? { ...a, present } : a));
  };
  const handleSubmitAttendance = async () => {
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      await axios.post(`${API_URL}/teacher/attendance-records`, {
        sessionId: attendanceSessionId,
        records: attendance.map(({ studentId, present }) => ({ studentId, present })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeCreateSessionModal();
    } catch (err) {
      setError("Failed to mark attendance");
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Attendance Sessions</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="flex flex-wrap gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="rounded-lg px-6 py-4 bg-violet-800 text-white shadow border-2 border-violet-700 flex flex-col gap-2 min-w-[220px]"
          >
            <div className="font-semibold text-lg">{c.subject.name}</div>
            <div className="text-violet-300 mb-2">Class: {c.class.name}</div>
            <button
              className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 mb-2 font-semibold transition-colors"
              onClick={() => openCreateSessionModal(c)}
            >
              Create Session
            </button>
            <button
              className="rounded bg-violet-700 hover:bg-violet-600 px-4 py-2 font-semibold transition-colors"
              onClick={() => openViewSessionsModal(c)}
            >
              View Sessions
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-violet-300">No courses/classes found.</div>
        )}
      </div>
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeViewSessionsModal}>&times;</button>
            <div className="mb-4 text-lg text-violet-200 font-semibold text-center">
              Sessions for {selectedCourse.subject.name} ({selectedCourse.class.name})
            </div>
            <table className="min-w-full text-white mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Start</th>
                  <th className="px-4 py-2 text-left">End</th>
                  <th className="px-4 py-2 text-left">Topic</th>
                  <th className="px-4 py-2 text-left">View</th>
                  <th className="px-4 py-2 text-left">Edit</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-b border-violet-700 last:border-0">
                    <td className="px-4 py-2">{s.date.slice(0,10)}</td>
                    <td className="px-4 py-2">{s.startTime}</td>
                    <td className="px-4 py-2">{s.endTime}</td>
                    <td className="px-4 py-2">{s.topic}</td>
                    <td className="px-4 py-2">
                      <button className="rounded bg-violet-400 hover:bg-violet-300 px-3 py-1 font-semibold text-white" onClick={() => handleViewAttendance(s)}>
                        View
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button className="rounded bg-violet-600 hover:bg-violet-500 px-3 py-1 font-semibold text-white" onClick={() => handleEditSession(s)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-violet-300">
                      No sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {viewModal && attendanceViewMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeViewSessionsModal}>&times;</button>
            <div className="mb-4 text-lg text-violet-200 font-semibold text-center">
              Attendance for {selectedCourse.subject.name} ({selectedCourse.class.name})<br/>
              Session: {sessionForm.topic} ({sessionForm.date})
            </div>
            <table className="min-w-full text-white mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Present</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.studentId} className="border-b border-violet-700 last:border-0">
                    <td className="px-4 py-2">{a.rollno ?? '-'}</td>
                    <td className="px-4 py-2">{a.name}</td>
                    <td className="px-4 py-2">{a.email}</td>
                    <td className="px-4 py-2">
                      <span className={`w-20 inline-block px-2 py-1 rounded font-semibold text-center ${a.present ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {a.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {createModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-violet-950 p-8 rounded-lg shadow-xl w-full max-w-3xl relative">
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeCreateSessionModal}>&times;</button>
            {!attendanceStep ? (
              <>
                <div className="mb-4 text-lg text-violet-200 font-semibold text-center">
                  Create Attendance Session for {selectedCourse.subject.name} ({selectedCourse.class.name})
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleCreateSession}>
                  <input type="date" name="date" value={sessionForm.date} onChange={handleSessionFormChange} className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
                  <input type="time" name="startTime" value={sessionForm.startTime} onChange={handleSessionFormChange} className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
                  <input type="time" name="endTime" value={sessionForm.endTime} onChange={handleSessionFormChange} className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
                  <input type="text" name="topic" value={sessionForm.topic} onChange={handleSessionFormChange} placeholder="Topic Name" className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
                  <button type="submit" className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white" disabled={creating}>
                    {creating ? "Creating..." : "Create & Mark Attendance"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-4 text-lg text-violet-200 font-semibold text-center">
                  Mark Attendance
                </div>
                <table className="min-w-full text-white mb-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Roll No</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.studentId} className="border-b border-violet-700 last:border-0">
                        <td className="px-4 py-2">{a.rollno ?? '-'}</td>
                        <td className="px-4 py-2">{a.name}</td>
                        <td className="px-4 py-2">{a.email}</td>
                        <td className="px-4 py-2">
                          {attendanceViewMode ? (
                            <span className={`w-20 inline-block px-2 py-1 rounded font-semibold text-center ${a.present ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                              {a.present ? 'Present' : 'Absent'}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(a.studentId, !a.present)}
                              className={`w-20 px-2 py-1 rounded font-semibold transition-colors duration-150 ${a.present ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                            >
                              {a.present ? 'Present' : 'Absent'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold text-white" onClick={handleSubmitAttendance}>
                  Submit Attendance
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
