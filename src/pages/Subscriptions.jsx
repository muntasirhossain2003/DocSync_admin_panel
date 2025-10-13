import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, users(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      alert('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { label: 'User', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Plan Name', key: 'plan_name' },
    { label: 'Start Date', key: 'start_date', render: (val) => new Date(val).toLocaleDateString() },
    { label: 'End Date', key: 'end_date', render: (val) => new Date(val).toLocaleDateString() },
    { label: 'Auto Renew', key: 'auto_renew', render: (val) => val ? 'Yes' : 'No' },
    { 
      label: 'Status', 
      key: 'status',
      render: (val) => (
        <span style={{
          ...styles.badge,
          backgroundColor: val === 'active' ? colors.green : val === 'expired' ? colors.red : colors.grey
        }}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Subscriptions Management</h1>
      </div>

      <DataTable
        data={subscriptions}
        columns={columns}
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
