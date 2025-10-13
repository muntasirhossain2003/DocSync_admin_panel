import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*, users(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctor) => {
    if (!confirm(`Are you sure you want to delete doctor: ${doctor.users?.full_name}?`)) return;

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctor.id);

      if (error) throw error;
      alert('Doctor deleted successfully');
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const columns = [
    { label: 'Name', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Email', key: 'users', render: (user) => user?.email || 'N/A' },
    { label: 'BMDC Registration', key: 'bmcd_registration_number' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Consultation Fee', key: 'consultation_fee', render: (val) => `৳${parseFloat(val).toFixed(2)}` },
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

const styles = {
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.white,
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
    color: colors.blue,
  },
  modalContent: {
    marginBottom: '20px',
  },
  detailRow: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  },
  closeBtn: {
    backgroundColor: colors.blue,
    color: colors.white,
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
  },
};
