import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentMeetings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jitsiModal, setJitsiModal] = useState({ open: false, meeting: null });

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setError("");
        setLoading(true);
        const token = localStorage.getItem("nexus_student_jwt");
        // Fetch student's enrollments to get class/subject
        const enrollRes = await axios.get(`${API_URL}/student/enrollments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const enrollments = enrollRes.data.enrollments || [];
        // Fetch meetings for all enrolled class/subject
        let allMeetings = [];
        for (const e of enrollments) {
          const meetRes = await axios.get(`${API_URL}/teacher/meetings`, {
            params: { subjectId: e.subjectId, classId: e.classId },
            headers: { Authorization: `Bearer ${token}` },
          });
          allMeetings = allMeetings.concat(meetRes.data.meetings || []);
        }
        // Remove duplicates by meeting id
        const uniqueMeetings = Object.values(Object.fromEntries(allMeetings.map(m => [m.id, m])));
        setMeetings(uniqueMeetings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
      } catch {
        setError("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [API_URL]);

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Live Meetings</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {loading ? (
        <div className="text-violet-300">Loading...</div>
      ) : meetings.length === 0 ? (
        <div className="text-violet-300">No meetings available.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow mt-6">
          <table className="min-w-full bg-violet-900/80 text-white text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(m => (
                <tr key={m.id} className="border-b border-violet-800 last:border-0">
                  <td className="px-3 py-2">{m.subject?.name || '-'}</td>
                  <td className="px-3 py-2">{m.class?.name || '-'}</td>
                  <td className="px-3 py-2">{new Date(m.startTime).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-3 py-2">
                    <button
                      className="rounded bg-green-600 hover:bg-green-700 px-3 py-1 font-semibold text-white"
                      onClick={() => setJitsiModal({ open: true, meeting: m })}
                    >
                      Join Meeting
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Jitsi Meet Modal */}
      {jitsiModal.open && jitsiModal.meeting && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-violet-950 rounded-xl shadow-2xl p-2 w-[90vw] h-[90vh] relative flex flex-col items-center">
            <button className="absolute top-4 right-8 text-white text-3xl z-10" onClick={() => setJitsiModal({ open: false, meeting: null })}>&times;</button>
            <h3 className="text-xl font-semibold text-violet-200 mb-2 mt-2">Meeting: {jitsiModal.meeting.subject?.name} - {jitsiModal.meeting.class?.name}</h3>
            <div className="w-full h-full flex-1">
              <iframe
                title="Jitsi Meet"
                src={`https://meet.jit.si/${jitsiModal.meeting.roomName}#userInfo.displayName=Student`}
                allow="camera; microphone; fullscreen; display-capture"
                style={{ width: '100%', height: '95%', border: 0, borderRadius: '0.75rem' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMeetings;
