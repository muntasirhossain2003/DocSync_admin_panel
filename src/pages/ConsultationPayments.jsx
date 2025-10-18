import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function ConsultationPayments() {
  const { colors } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_payments')
        .select(`
          id,
          amount,
          payment_method,
          payment_status,
          transaction_id,
          discount_applied,
          original_amount,
          created_at,
          consultation_id,
          users!consultation_payments_user_id_fkey ( full_name, email )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading consultation payments:', error);
      alert('Failed to load consultation payments');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    header: { marginBottom: '20px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: colors.text },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      color: colors.white,
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
  };

  const columns = [
    { label: 'User', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Email', key: 'users', render: (user) => user?.email || 'N/A' },
    { 
      label: 'Amount', 
      key: 'amount', 
      render: (val, row) => {
        const amount = parseFloat(val).toFixed(2);
        const discount = parseFloat(row.discount_applied || 0).toFixed(2);
        const original = parseFloat(row.original_amount || val).toFixed(2);
        
        if (discount > 0) {
          return (
            <div>
              <div>৳{amount}</div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, textDecoration: 'line-through' }}>
                ৳{original}
              </div>
            </div>
          );
        }
        return `৳${amount}`;
      }
    },
    { 
      label: 'Method', 
      key: 'payment_method',
      render: (val) => (
        <span style={{ ...styles.badge, backgroundColor: colors.info }}>
          {val}
        </span>
      )
    },
    { 
      label: 'Status', 
      key: 'payment_status',
      render: (val) => (
        <span
          style={{
            ...styles.badge,
            backgroundColor:
              val === 'completed'
                ? colors.success
                : val === 'pending'
                ? colors.warning
                : val === 'refunded'
                ? colors.info
                : colors.error,
          }}
        >
          {val}
        </span>
      ),
    },
    { label: 'Transaction ID', key: 'transaction_id', render: (val) => val || 'N/A' },
    { label: 'Date', key: 'created_at', render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Consultation Payments</h1>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        loading={loading}
      />
    </div>
  );
}
