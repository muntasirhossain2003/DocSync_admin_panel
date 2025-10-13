import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*, users(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      alert('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { label: 'User', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Amount', key: 'amount', render: (val) => `৳${parseFloat(val).toFixed(2)}` },
    { 
      label: 'Method', 
      key: 'payment_method',
      render: (val) => (
        <span style={{
          ...styles.badge,
          backgroundColor: colors.blue
        }}>
          {val}
        </span>
      )
    },
    { 
      label: 'Status', 
      key: 'payment_status',
      render: (val) => (
        <span style={{
          ...styles.badge,
          backgroundColor: val === 'completed' ? colors.green : val === 'pending' ? colors.orange : colors.red
        }}>
          {val}
        </span>
      )
    },
    { label: 'Transaction ID', key: 'transaction_id' },
    { label: 'Date', key: 'created_at', render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Payments Management</h1>
      </div>

      <DataTable
        data={payments}
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
