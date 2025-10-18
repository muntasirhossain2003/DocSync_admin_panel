import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Users() {
  const { colors, isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete user: ${user.full_name}?`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      alert('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const styles = {
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.text,
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      color: colors.white,
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: colors.primary,
    },
    modalContent: {
      marginBottom: '20px',
    },
    detailRow: {
      padding: '10px 0',
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '14px',
      color: colors.text,
    },
    closeBtn: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      width: '100%',
    },
  };

  const columns = [
    { label: 'Full Name', key: 'full_name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Role', key: 'role', render: (val) => (
      <span style={{
        ...styles.badge,
        backgroundColor: val === 'admin' ? colors.purple : val === 'doctor' ? colors.blue : colors.green
      }}>
        {val}
      </span>
    )},
    { label: 'Gender', key: 'gender' },
    { label: 'Created At', key: 'created_at', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Users Management</h1>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onView={handleView}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* View Modal */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>User Details</h2>
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <strong>Full Name:</strong> {selectedUser.full_name}
              </div>
              <div style={styles.detailRow}>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div style={styles.detailRow}>
                <strong>Phone:</strong> {selectedUser.phone || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>Role:</strong> {selectedUser.role}
              </div>
              <div style={styles.detailRow}>
                <strong>Gender:</strong> {selectedUser.gender || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>Date of Birth:</strong> {selectedUser.date_of_birth || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}
              </div>
            </div>
            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
