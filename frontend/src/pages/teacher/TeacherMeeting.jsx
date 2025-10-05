import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherMeeting = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, course: null });
  const [meetingForm, setMeetingForm] = useState({ date: '', time: '' });
  const [meetings, setMeetings] = useState({});
  const [creating, setCreating] = useState(false);
  const [jitsiModal, setJitsiModal] = useState({ open: false, meeting: null });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const token = localStorage.getItem("nexus_teacher_jwt");
        const res = await axios.get(`${API_URL}/teacher/courses-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses);
        // Fetch meetings for each course
        for (const c of res.data.courses) {
          fetchMeetings(c.subject.id, c.class.id);
        }
      } catch (err) {
        setError("Failed to fetch courses/classes");
      }
    };
    fetchCourses();
    // eslint-disable-next-line
  }, [API_URL]);

  const fetchMeetings = async (subjectId, classId) => {
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const res = await axios.get(`${API_URL}/teacher/meetings`, {
        params: { subjectId, classId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(prev => ({ ...prev, [`${subjectId}_${classId}`]: res.data.meetings }));
    } catch {}
  };

  const openModal = (course) => {
    setModal({ open: true, course });
    setMeetingForm({ date: '', time: '' });
  };
  const closeModal = () => setModal({ open: false, course: null });

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("nexus_teacher_jwt");
      const { subject, class: cls } = modal.course;
      await axios.post(`${API_URL}/teacher/meetings`, {
        subjectId: subject.id,
        classId: cls.id,
        date: meetingForm.date,
        time: meetingForm.time,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
      fetchMeetings(subject.id, cls.id);
    } catch {
      alert("Failed to create meeting");
    }
    setCreating(false);
  };


  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-violet-300">Meetings</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="flex flex-wrap gap-4 mb-10">
        {courses.map((c) => (
          <div
            key={c.id}
            className="rounded-lg px-6 py-4 bg-violet-800 text-white shadow border-2 border-violet-700 flex flex-col gap-2 min-w-[220px]"
          >
            <div className="font-semibold text-lg">{c.subject.name}</div>
            <div className="text-violet-300 mb-2">Class: {c.class.name}</div>
            <button
              className="rounded bg-violet-600 hover:bg-violet-500 px-4 py-2 font-semibold transition-colors"
              onClick={() => openModal(c)}
            >
              Create Meet
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-violet-300">No courses/classes found.</div>
        )}
      </div>
      {/* All Meetings Table */}
      {Object.values(meetings).flat().length > 0 && (
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
              {Object.values(meetings).flat().sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).map(m => (
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

      {/* Meeting Creation Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-violet-950 rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-violet-200 mb-4">Create Meeting</h3>
            <form className="flex flex-col gap-4" onSubmit={handleCreateMeeting}>
              <input type="date" value={meetingForm.date} onChange={e => setMeetingForm(f => ({ ...f, date: e.target.value }))} className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
              <input type="time" value={meetingForm.time} onChange={e => setMeetingForm(f => ({ ...f, time: e.target.value }))} className="rounded px-3 py-2 bg-violet-900 border border-violet-700 text-white" required />
              <div className="flex justify-end gap-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-violet-700 hover:bg-violet-600 text-white font-semibold" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
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
                src={`https://meet.jit.si/${jitsiModal.meeting.roomName}#userInfo.displayName=Teacher`}
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

export default TeacherMeeting;
