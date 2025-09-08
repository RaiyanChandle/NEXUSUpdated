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
import AdminProfile from './pages/admin/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/admin-signin" element={<AdminAuthPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
