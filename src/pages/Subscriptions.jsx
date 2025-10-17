import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          auto_renew,
          status,
          start_at,
          end_at,
          users ( full_name, email ),
          subscription_plans ( name )
        `)
        .order('start_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      alert('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId, status) => {
    if (status === 'cancelled') return; // Already cancelled

    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    setUpdatingId(subscriptionId);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;

      await loadSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { label: 'User', key: 'users', render: (user) => user?.full_name || 'N/A' },
    { label: 'Email', key: 'users', render: (user) => user?.email || 'N/A' },
    { label: 'Plan Name', key: 'subscription_plans', render: (plan) => plan?.name || 'N/A' },
    { label: 'Start Date', key: 'start_at', render: (val) => new Date(val).toLocaleDateString() },
    { label: 'End Date', key: 'end_at', render: (val) => new Date(val).toLocaleDateString() },
    { label: 'Auto Renew', key: 'auto_renew', render: (val) => (val ? 'Yes' : 'No') },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <span
          style={{
            ...styles.badge,
            backgroundColor:
              val === 'active'
                ? colors.green
                : val === 'expired'
                ? colors.red
                : val === 'cancelled'
                ? colors.grey
                : colors.grey,
          }}
        >
          {val}
        </span>
      ),
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
        onDelete={(row) => handleCancel(row.id, row.status)}
        deleteLabel="Cancel"
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
