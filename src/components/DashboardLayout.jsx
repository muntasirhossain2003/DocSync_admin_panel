import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '👥', label: 'Users', path: '/dashboard/users' },
    { icon: '👨‍⚕️', label: 'Doctors', path: '/dashboard/doctors' },
    { icon: '🩺', label: 'Consultations', path: '/dashboard/consultations' },
    { icon: '📋', label: 'Health Records', path: '/dashboard/health-records' },
    { icon: '💊', label: 'Prescriptions', path: '/dashboard/prescriptions' },
    { icon: '💳', label: 'Subscriptions', path: '/dashboard/subscriptions' },
    { icon: '💰', label: 'Payments', path: '/dashboard/payments' },
    { icon: '⭐', label: 'Ratings', path: '/dashboard/ratings' },
    { icon: '🔔', label: 'Notifications', path: '/dashboard/notifications' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? '250px' : '70px' }}>
        <div style={styles.sidebarHeader}>
          <h2 style={{ ...styles.logo, display: sidebarOpen ? 'block' : 'none' }}>
            DocSync Admin
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleBtn}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                backgroundColor: location.pathname === item.path ? colors.lightBlue : 'transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {sidebarOpen && <span style={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Admin Panel</h1>
          <div style={styles.userSection}>
            <span style={styles.userEmail}>{user?.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: colors.lightGrey,
  },
  sidebar: {
    backgroundColor: colors.white,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    transition: 'width 0.3s',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: `2px solid ${colors.lightBlue}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.blue,
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    transition: 'background-color 0.2s',
    margin: '4px 10px',
    borderRadius: '8px',
  },
  icon: {
    fontSize: '20px',
  },
  navLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.white,
    padding: '20px 30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.blue,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userEmail: {
    fontSize: '14px',
    color: colors.grey,
  },
  logoutBtn: {
    backgroundColor: colors.red,
    color: colors.white,
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
  },
};
