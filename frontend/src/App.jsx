import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminHomeScreen from './pages/admin/AdminHomeScreen';
import AdminDashboard from './pages/admin/Dashboard';
import AdminClasses from './pages/admin/Classes';
import AdminSubjects from './pages/admin/Subjects';
import AdminTeachers from './pages/admin/Teachers';
import AdminStudents from './pages/admin/Students';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminLibrary from './pages/admin/Library';
import AdminProfile from "./pages/admin/Profile";
import { GoogleOAuthProvider } from '@react-oauth/google';
import TeacherSignIn from "./pages/teacher/TeacherSignIn";
import TeacherHomeScreen from "./pages/teacher/TeacherHomeScreen";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherMeeting from "./pages/teacher/TeacherMeeting";
import TeacherNotes from "./pages/teacher/TeacherNotes";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import StudentHomeScreen from "./pages/student/StudentHomeScreen";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSignIn from "./pages/student/StudentSignIn";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentLibrary from "./pages/student/StudentLibrary";
import StudentProfile from "./pages/student/StudentProfile";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import TeacherAssignments from './pages/teacher/TeacherAssignments';

function App() {
  const AdminGoogleOAuthWrapper=()=>{
    return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AdminAuthPage></AdminAuthPage>
    </GoogleOAuthProvider>)
  };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/admin-signin" element={<AdminGoogleOAuthWrapper/>} />
        <Route path="/teacher-signin" element={<TeacherSignIn />} />
        <Route path="/student-signin" element={<StudentSignIn />} />
        <Route path="/admin" element={<AdminHomeScreen />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/teacher" element={<TeacherHomeScreen />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="subjects" element={<TeacherSubjects />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="assignment" element={<TeacherAssignments />} />
          <Route path="notes" element={<TeacherNotes />} />
          <Route path="meeting" element={<TeacherMeeting />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route index element={<TeacherDashboard />} />
        </Route>
        <Route path="/student" element={<StudentHomeScreen />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="subjects" element={<StudentSubjects />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="library" element={<StudentLibrary />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route index element={<StudentDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
