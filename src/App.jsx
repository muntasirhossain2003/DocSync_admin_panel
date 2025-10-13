import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Consultations from './pages/Consultations';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import HealthRecords from './pages/HealthRecords';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Payments from './pages/Payments';
import Prescriptions from './pages/Prescriptions';
import Ratings from './pages/Ratings';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="consultations" element={<Consultations />} />
            <Route path="health-records" element={<HealthRecords />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="payments" element={<Payments />} />
            <Route path="ratings" element={<Ratings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
