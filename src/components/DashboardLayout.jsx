import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { colors, isDark } = useTheme();

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
    { icon: '💰', label: 'Subscription Payments', path: '/dashboard/payments' },
    { icon: '💵', label: 'Consultation Payments', path: '/dashboard/consultation-payments' },
    { icon: '⭐', label: 'Ratings', path: '/dashboard/ratings' },
    { icon: '🔔', label: 'Notifications', path: '/dashboard/notifications' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
  ];

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: colors.background,
    },
    sidebar: {
      backgroundColor: colors.surface,
      boxShadow: `2px 0 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${colors.border}`,
    },
    sidebarHeader: {
      padding: '20px',
      borderBottom: `2px solid ${colors.primary}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    toggleBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '5px',
      color: colors.text,
    },
    nav: {
      flex: 1,
      padding: '20px 0',
      overflowY: 'auto',
    },
    navItem: (isActive, sidebarOpen) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      textDecoration: 'none',
      color: isActive ? (isDark ? colors.white : colors.primary) : colors.text,
      backgroundColor: isActive ? (isDark ? colors.primary : colors.primaryLight) : 'transparent',
      transition: 'background-color 0.2s',
      margin: '4px 10px',
      borderRadius: '8px',
      justifyContent: sidebarOpen ? 'flex-start' : 'center',
    }),
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
      backgroundColor: colors.surface,
      padding: '20px 30px',
      boxShadow: `0 2px 4px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.border}`,
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    userEmail: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    logoutBtn: {
      backgroundColor: colors.error,
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
      backgroundColor: colors.background,
    },
  };

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
                ...styles.navItem(location.pathname === item.path, sidebarOpen),
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
