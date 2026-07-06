import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public Layout & Pages
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Passport from './pages/Passport';
import TourViewer from './pages/TourViewer';
import AboutUs from './pages/AboutUs';

// Admin Layout, Guard & Pages
import AdminLayout from './components/admin/AdminLayout';
import RequireAuth from './components/admin/RequireAuth';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ToursManager from './pages/admin/ToursManager';
import UsersManager from './pages/admin/UsersManager';
import Settings from './pages/admin/Settings';
import AuditLog from './pages/admin/AuditLog';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Area */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/tour/:id" element={<TourViewer />} />
          <Route path="/sobre-nos" element={<AboutUs />} />
        </Route>

        {/* Admin Login (public, no layout) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Area — RequireAuth blocks unauthenticated access */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tours" element={<ToursManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
