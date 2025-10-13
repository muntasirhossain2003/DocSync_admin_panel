import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patient:users!consultations_patient_id_fkey(full_name, email),
          doctor:doctors!consultations_doctor_id_fkey(users(full_name, email))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
      alert('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (consultation) => {
    if (!confirm('Are you sure you want to delete this consultation?')) return;

    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', consultation.id);

      if (error) throw error;
      alert('Consultation deleted successfully');
      loadConsultations();
    } catch (error) {
      console.error('Error deleting consultation:', error);
      alert('Failed to delete consultation');
    }
  };

  const columns = [
    { label: 'Patient', key: 'patient', render: (patient) => patient?.full_name || 'N/A' },
    { label: 'Doctor', key: 'doctor', render: (doctor) => doctor?.users?.full_name || 'N/A' },
    { 
      label: 'Type', 
      key: 'consultation_type',
      render: (val) => (
        <span style={{
          ...styles.badge,
          backgroundColor: val === 'video' ? colors.blue : val === 'audio' ? colors.green : colors.orange
        }}>
          {val}
        </span>
      )
    },
    { 
      label: 'Status', 
      key: 'consultation_status',
      render: (val) => (
        <span style={{
          ...styles.badge,
          backgroundColor: val === 'completed' ? colors.green : val === 'scheduled' ? colors.blue : colors.red
        }}>
          {val}
        </span>
      )
    },
    { label: 'Scheduled Time', key: 'scheduled_time', render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Consultations Management</h1>
      </div>

      <DataTable
        data={consultations}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
      />
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
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
};
