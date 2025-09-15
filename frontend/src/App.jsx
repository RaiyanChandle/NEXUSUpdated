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
import TeacherAssignment from "./pages/teacher/TeacherAssignment";
import TeacherMeeting from "./pages/teacher/TeacherMeeting";
import TeacherNotes from "./pages/teacher/TeacherNotes";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import TeacherProfile from "./pages/teacher/TeacherProfile";

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
          <Route path="assignment" element={<TeacherAssignment />} />
          <Route path="notes" element={<TeacherNotes />} />
          <Route path="meeting" element={<TeacherMeeting />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route index element={<TeacherDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
