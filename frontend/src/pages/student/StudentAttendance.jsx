
import React, { useEffect, useState } from "react";
import axios from "axios";



const StudentAttendance = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [average, setAverage] = useState(null);
  const [viewAttendance, setViewAttendance] = useState(null); // { subjectId, subjectName }
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(res.data.subjects);
      } catch {
        setError("Failed to load subjects");
      }
    };
    const fetchAverage = async () => {
      try {
        const token = localStorage.getItem("nexus_student_jwt");
        const res = await axios.get(`${API_URL}/student/attendance-average`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAverage(res.data.average);
      } catch {
        setAverage(null);
      }
    };
    fetchSubjects();
    fetchAverage();
  }, [API_URL]);

  const handleViewAttendance = async (subjectId, subjectName) => {
    setViewAttendance({ subjectId, subjectName });
    setLoadingRecords(true);
    try {
      const token = localStorage.getItem("nexus_student_jwt");
      const res = await axios.get(`${API_URL}/student/attendance-records?subjectId=${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.records);
    } catch {
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  if (viewAttendance) {
    // Calculate average attendance for this subject
    const total = records.length;
    const present = records.filter(r => r.present).length;
    const subjectAvg = total === 0 ? 0 : Math.round((present / total) * 100);
    return (
      <div className="p-8 w-full max-w-3xl mx-auto">
        <button onClick={() => setViewAttendance(null)} className="mb-4 px-4 py-2 rounded bg-violet-700 hover:bg-violet-600 text-white">Back</button>
        <h2 className="text-2xl font-bold mb-6 text-violet-300">Attendance for {viewAttendance.subjectName}</h2>
        <div className="mb-4 text-lg font-semibold text-violet-200">
          Average Attendance for this Subject: <span className="text-violet-400">{subjectAvg}%</span>
        </div>
        {loadingRecords ? (
          <div className="text-violet-300">Loading...</div>
        ) : (
          <div className="bg-violet-900/60 rounded-lg shadow p-4 overflow-x-auto">
            <table className="min-w-[600px] w-full text-white text-sm md:text-base">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left min-w-[90px]">Date</th>
                  <th className="px-4 py-2 text-left min-w-[60px]">Start</th>
                  <th className="px-4 py-2 text-left min-w-[60px]">End</th>
                  <th className="px-4 py-2 text-left min-w-[120px]">Topic</th>
                  <th className="px-4 py-2 text-left min-w-[80px]">Present</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec.id} className="border-b border-violet-700 last:border-0">
                    <td className="px-4 py-2">{rec.session ? new Date(rec.session.date).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{rec.session?.startTime ? rec.session.startTime.slice(0,5) : "-"}</td>
                    <td className="px-4 py-2">{rec.session?.endTime ? rec.session.endTime.slice(0,5) : "-"}</td>
                    <td className="px-4 py-2">{rec.session?.topic || "-"}</td>
                    <td className="px-4 py-2">{rec.present ? <span className="text-green-400 font-bold">Present</span> : <span className="text-red-400 font-bold">Absent</span>}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-violet-300">
                      No attendance records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Subjects (Attendance)</h2>
      {average !== null && (
        <div className="mb-6 text-lg font-semibold text-violet-200">
          Total Attendance Average: <span className="text-violet-400">{average}%</span>
        </div>
      )}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((s) => (
          <div
            key={s.subjectId}
            className="bg-violet-900/60 rounded-lg shadow p-6 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl relative min-h-[170px] pb-16"
          >
            <div className="text-xl font-semibold text-violet-200">{s.subjectName}</div>
            {s.teacher ? (
              <div className="text-violet-400 text-base">
                Teacher: {s.teacher.name} <span className="text-violet-300 text-sm">({s.teacher.email})</span>
              </div>
            ) : (
              <div className="text-violet-400 text-base">No teacher assigned</div>
            )}
            <button
              className="absolute right-4 bottom-4 px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold w-fit transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400"
              onClick={() => handleViewAttendance(s.subjectId, s.subjectName)}
            >
              View Attendance
            </button>
          </div>
        ))}
        {subjects.length === 0 && !error && (
          <div className="col-span-2 text-center text-violet-300 py-10">No subjects found.</div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
