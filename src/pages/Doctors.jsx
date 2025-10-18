import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Doctors() {
  const { colors, isDark } = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      // 1) fetch all users with role = 'doctor'
      const { data: doctorUsers, error: usersErr } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .order('created_at', { ascending: false });

      if (usersErr) throw usersErr;

      // 2) fetch all doctor profiles from doctors table
      const { data: doctorProfiles, error: profilesErr } = await supabase
        .from('doctors')
        .select('*');

      if (profilesErr) throw profilesErr;

      // 3) merge: for each doctor user, attach profile if exists
      const merged = (doctorUsers || []).map((u) => {
        const profile = (doctorProfiles || []).find((p) => p.user_id === u.id) || null;
        return {
          id: profile?.id || null,
          user: u,
          profile: profile,
          // flatten some fields for table compatibility
          bmcd_registration_number: profile?.bmcd_registration_number || '',
          specialization: profile?.specialization || '',
          qualification: profile?.qualification || '',
          consultation_fee: profile?.consultation_fee || 0,
          created_at: profile?.created_at || u.created_at,
        };
      });

      setDoctors(merged);
    } catch (error) {
      console.error('Error loading doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctor) => {
    const name = doctor.user?.full_name || doctor.users?.full_name || 'this doctor';
    if (!confirm(`Are you sure you want to delete doctor profile for: ${name}?`)) return;

    try {
      if (!doctor.id) {
        alert('No doctor profile exists to delete for this user.');
        return;
      }

      const { error } = await supabase.from('doctors').delete().eq('id', doctor.id);
      if (error) throw error;
      alert('Doctor profile deleted successfully');
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor profile:', error);
      alert('Failed to delete doctor profile');
    }
  };

  const handleView = (doctor) => {
    // normalize selectedDoctor to include user and profile fields
    setSelectedDoctor({ ...doctor, users: doctor.user || doctor.users, bmcd_registration_number: doctor.bmcd_registration_number, specialization: doctor.specialization, qualification: doctor.qualification, consultation_fee: doctor.consultation_fee, bio: doctor.profile?.bio });
    setShowModal(true);
  };

  const handleCreateProfile = async (doctorUser) => {
    // doctorUser is an item from merged list with user and possibly profile
    if (!doctorUser || !doctorUser.user) return;
    const userId = doctorUser.user.id;

    const defaultProfile = {
      user_id: userId,
      bmcd_registration_number: 'BMDC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      specialization: 'General',
      qualification: '',
      consultation_fee: 0,
      bio: '',
    };

    try {
      const { data, error } = await supabase.from('doctors').insert([defaultProfile]);
      if (error) throw error;
      alert('Doctor profile created successfully');
      loadDoctors();
    } catch (err) {
      console.error('Error creating doctor profile:', err);
      alert('Failed to create doctor profile');
    }
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
    { label: 'Name', key: 'user', render: (userObj) => (userObj?.full_name || 'N/A') },
    { label: 'Email', key: 'user', render: (userObj) => (userObj?.email || 'N/A') },
    { label: 'BMDC Registration', key: 'bmcd_registration_number' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Consultation Fee', key: 'consultation_fee', render: (val) => `৳${parseFloat(val || 0).toFixed(2)}` },
    { label: 'Created At', key: 'created_at', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Doctors Management</h1>
      </div>

      <DataTable
        data={doctors}
        columns={columns}
        onView={handleView}
        onDelete={handleDelete}
        loading={loading}
        // show create profile button via onEdit prop
        onEdit={(row) => {
          // if profile missing, create it
          if (!row.id) {
            if (confirm(`No doctor profile exists for ${row.user.full_name}. Create one?`)) {
              handleCreateProfile(row);
            }
          } else {
            // For now, view profile
            handleView(row);
          }
        }}
      />

      {/* View Modal */}
      {showModal && selectedDoctor && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Doctor Details</h2>
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <strong>Name:</strong> {selectedDoctor.users?.full_name}
              </div>
              <div style={styles.detailRow}>
                <strong>Email:</strong> {selectedDoctor.users?.email}
              </div>
              <div style={styles.detailRow}>
                <strong>Phone:</strong> {selectedDoctor.users?.phone || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>BMDC Registration:</strong> {selectedDoctor.bmcd_registration_number}
              </div>
              <div style={styles.detailRow}>
                <strong>Specialization:</strong> {selectedDoctor.specialization}
              </div>
              <div style={styles.detailRow}>
                <strong>Qualification:</strong> {selectedDoctor.qualification || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>Consultation Fee:</strong> ৳{parseFloat(selectedDoctor.consultation_fee).toFixed(2)}
              </div>
              <div style={styles.detailRow}>
                <strong>Bio:</strong> {selectedDoctor.bio || 'N/A'}
              </div>
              <div style={styles.detailRow}>
                <strong>Created At:</strong> {new Date(selectedDoctor.created_at).toLocaleString()}
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
