import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme, colors, isDark } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoRefresh: true,
    compactView: false,
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const styles = {
    container: {
      maxWidth: '900px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: '30px',
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '20px',
      boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: `2px solid ${colors.primary}`,
    },
    settingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: `1px solid ${colors.border}`,
    },
    settingInfo: {
      flex: 1,
    },
    settingLabel: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px',
    },
    settingDesc: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    themeToggle: {
      display: 'flex',
      gap: '10px',
      backgroundColor: colors.lightGrey,
      padding: '4px',
      borderRadius: '8px',
    },
    themeBtn: {
      padding: '8px 20px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    themeBtnActive: {
      backgroundColor: colors.primary,
      color: colors.white,
    },
    themeBtnInactive: {
      backgroundColor: 'transparent',
      color: colors.textSecondary,
    },
    switch: {
      position: 'relative',
      width: '50px',
      height: '26px',
      backgroundColor: colors.border,
      borderRadius: '13px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    switchActive: {
      backgroundColor: colors.primary,
    },
    switchKnob: {
      position: 'absolute',
      top: '3px',
      left: '3px',
      width: '20px',
      height: '20px',
      backgroundColor: colors.white,
      borderRadius: '50%',
      transition: 'transform 0.3s',
    },
    switchKnobActive: {
      transform: 'translateX(24px)',
    },
    infoCard: {
      backgroundColor: isDark ? colors.surfaceHover : colors.primaryLight,
      padding: '15px',
      borderRadius: '8px',
      marginTop: '10px',
    },
    infoText: {
      fontSize: '14px',
      color: colors.text,
      lineHeight: '1.6',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      backgroundColor: colors.primary,
      color: colors.white,
      fontSize: '12px',
      fontWeight: '500',
      marginLeft: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>

      {/* User Info Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>👤 Account Information</h2>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Email Address</div>
            <div style={styles.settingDesc}>{user?.email || 'Not available'}</div>
          </div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>User ID</div>
            <div style={styles.settingDesc}>{user?.id || 'Not available'}</div>
          </div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>
              Role
              <span style={styles.badge}>ADMIN</span>
            </div>
            <div style={styles.settingDesc}>Full access to all admin features</div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎨 Appearance</h2>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Theme Mode</div>
            <div style={styles.settingDesc}>Choose your preferred color scheme</div>
          </div>
          <div style={styles.themeToggle}>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              style={{
                ...styles.themeBtn,
                ...(theme === 'light' ? styles.themeBtnActive : styles.themeBtnInactive),
              }}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              style={{
                ...styles.themeBtn,
                ...(theme === 'dark' ? styles.themeBtnActive : styles.themeBtnInactive),
              }}
            >
              🌙 Dark
            </button>
          </div>
        </div>
        <div style={styles.infoCard}>
          <p style={styles.infoText}>
            💡 <strong>Current Theme:</strong> {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            <br />
            Your theme preference is saved automatically and will persist across sessions.
          </p>
        </div>
      </div>

      {/* Notifications Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔔 Notifications</h2>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Email Notifications</div>
            <div style={styles.settingDesc}>Receive updates via email</div>
          </div>
          <div
            onClick={() => handleSettingChange('emailNotifications')}
            style={{
              ...styles.switch,
              ...(settings.emailNotifications ? styles.switchActive : {}),
            }}
          >
            <div
              style={{
                ...styles.switchKnob,
                ...(settings.emailNotifications ? styles.switchKnobActive : {}),
              }}
            />
          </div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Push Notifications</div>
            <div style={styles.settingDesc}>Get browser notifications</div>
          </div>
          <div
            onClick={() => handleSettingChange('pushNotifications')}
            style={{
              ...styles.switch,
              ...(settings.pushNotifications ? styles.switchActive : {}),
            }}
          >
            <div
              style={{
                ...styles.switchKnob,
                ...(settings.pushNotifications ? styles.switchKnobActive : {}),
              }}
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>⚙️ Preferences</h2>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Auto Refresh Dashboard</div>
            <div style={styles.settingDesc}>Automatically update statistics every 30 seconds</div>
          </div>
          <div
            onClick={() => handleSettingChange('autoRefresh')}
            style={{
              ...styles.switch,
              ...(settings.autoRefresh ? styles.switchActive : {}),
            }}
          >
            <div
              style={{
                ...styles.switchKnob,
                ...(settings.autoRefresh ? styles.switchKnobActive : {}),
              }}
            />
          </div>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Compact View</div>
            <div style={styles.settingDesc}>Use smaller spacing in tables and lists</div>
          </div>
          <div
            onClick={() => handleSettingChange('compactView')}
            style={{
              ...styles.switch,
              ...(settings.compactView ? styles.switchActive : {}),
            }}
          >
            <div
              style={{
                ...styles.switchKnob,
                ...(settings.compactView ? styles.switchKnobActive : {}),
              }}
            />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>ℹ️ System Information</h2>
        <div style={styles.infoCard}>
          <p style={styles.infoText}>
            <strong>Application:</strong> DocSync Admin Panel<br />
            <strong>Version:</strong> 1.0.0<br />
            <strong>Environment:</strong> {import.meta.env.MODE || 'development'}<br />
            <strong>Last Updated:</strong> October 2025
          </p>
        </div>
      </div>
    </div>
  );
}
