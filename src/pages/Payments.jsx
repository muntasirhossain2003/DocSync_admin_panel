import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_payments')
        .select(`
          id,
          amount,
          payment_method,
          payment_status,
          payment_number,
          created_at,
          subscription_id,
          users!payments_user_id_fkey ( full_name, email )
        `)
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

  const handleAction = async (paymentId, subscriptionId, actionType) => {
    const confirmMsg =
      actionType === 'verify'
        ? 'Verify this payment and activate subscription?'
        : 'Cancel this payment and deactivate subscription?';

    if (!window.confirm(confirmMsg)) return;
    setUpdatingId(paymentId);

    try {
      if (actionType === 'verify') {
        const { error: payError } = await supabase
          .from('subscription_payments')
          .update({ payment_status: 'completed' })
          .eq('id', paymentId);
        if (payError) throw payError;

        const { error: subError } = await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', subscriptionId);
        if (subError) throw subError;
      } else {
        const { error: payError } = await supabase
          .from('subscription_payments')
          .update({ payment_status: 'failed' })
          .eq('id', paymentId);
        if (payError) throw payError;

        const { error: subError } = await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscriptionId);
        if (subError) throw subError;
      }

      await loadPayments();
    } catch (error) {
      console.error('Error updating payment/subscription:', error);
      alert('Failed to update payment or subscription');
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { label: 'User', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Email', key: 'users', render: (user) => user?.email || 'N/A' },
    { label: 'Amount', key: 'amount', render: (val) => `৳${parseFloat(val).toFixed(2)}` },
    { 
      label: 'Method', 
      key: 'payment_method',
      render: (val) => (
        <span style={{ ...styles.badge, backgroundColor: colors.blue }}>
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
                ? colors.green
                : val === 'pending'
                ? colors.orange
                : colors.red,
          }}
        >
          {val}
        </span>
      ),
    },
    { label: 'Payment Number', key: 'payment_number' },
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
        onEdit={(row) => handleAction(row.id, row.subscription_id, 'verify')}
        onDelete={(row) => handleAction(row.id, row.subscription_id, 'cancel')}
        editLabel='Verify'
        deleteLabel='Cancel'
      />
    </div>
  );
}

const styles = {
  header: { marginBottom: '20px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
};
