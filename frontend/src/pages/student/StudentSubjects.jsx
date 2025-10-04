
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentNotes from "./StudentNotes";

const StudentSubjects = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [viewNotes, setViewNotes] = useState(null); // { subjectId, subjectName }

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
    fetchSubjects();
  }, [API_URL]);

  if (viewNotes) {
    return (
      <StudentNotes
        subjectId={viewNotes.subjectId}
        subjectName={viewNotes.subjectName}
        onBack={() => setViewNotes(null)}
      />
    );
  }

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">My Subjects</h2>
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
              onClick={() => setViewNotes({ subjectId: s.subjectId, subjectName: s.subjectName })}
            >
              View Notes
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

export default StudentSubjects;
