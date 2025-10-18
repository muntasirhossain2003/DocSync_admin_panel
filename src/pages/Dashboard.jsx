import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { colors, isDark } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalConsultations: 0,
    totalPayments: 0,
    recentConsultations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch counts and payments
      const [
        usersResult, 
        doctorsResult, 
        consultationsResult, 
        consultationPaymentsResult,
        subscriptionPaymentsResult,
        recentConsults
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'patient'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'doctor'),
        supabase.from('consultations').select('*', { count: 'exact', head: true }),
        supabase.from('consultation_payments').select('amount').eq('payment_status', 'completed'),
        supabase.from('subscription_payments').select('amount').eq('payment_status', 'completed'),
        supabase.from('consultations')
          .select('*, users!consultations_patient_id_fkey(full_name), doctors!consultations_doctor_id_fkey(users!doctors_user_id_fkey(full_name))')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      // Calculate total revenue from both payment tables
      const consultationRevenue = consultationPaymentsResult.data?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
      const subscriptionRevenue = subscriptionPaymentsResult.data?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
      const totalRevenue = consultationRevenue + subscriptionRevenue;

      setStats({
        totalUsers: usersResult.count || 0,
        totalDoctors: doctorsResult.count || 0,
        totalConsultations: consultationsResult.count || 0,
        totalPayments: totalRevenue,
        recentConsultations: recentConsults.data || [],
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1400px',
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: colors.text,
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: '30px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: colors.surface,
      padding: '25px',
      borderRadius: '12px',
      boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    statIcon: {
      fontSize: '40px',
    },
    statContent: {
      flex: 1,
    },
    statLabel: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '5px',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 0,
    },
    card: {
      backgroundColor: colors.surface,
      padding: '25px',
      borderRadius: '12px',
      boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: '20px',
    },
    table: {
      overflowX: 'auto',
    },
    tableHeader: {
      backgroundColor: colors.background,
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      color: colors.text,
    },
    tr: {
      borderBottom: `1px solid ${colors.border}`,
    },
    td: {
      padding: '12px',
      fontSize: '14px',
      color: colors.textSecondary,
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      color: colors.white,
      fontSize: '12px',
      fontWeight: '500',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalUsers,
      icon: '👥',
      color: '#2196F3',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: '👨‍⚕️',
      color: '#4CAF50',
    },
    {
      title: 'Total Consultations',
      value: stats.totalConsultations,
      icon: '📋',
      color: '#FF9800',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalPayments.toFixed(2)}`,
      icon: '💰',
      color: '#9C27B0',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statIcon} >{stat.icon}</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{stat.title}</p>
              <h2 style={{ ...styles.statValue, color: stat.color }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Consultations */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Recent Consultations</h2>
        <div style={styles.table}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Scheduled Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentConsultations.map((consult) => (
                <tr key={consult.id} style={styles.tr}>
                  <td style={styles.td}>{consult.users?.full_name || 'N/A'}</td>
                  <td style={styles.td}>{consult.doctors?.users?.full_name || 'N/A'}</td>
                  <td style={styles.td}>{consult.consultation_type}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: consult.consultation_status === 'completed' ? colors.success :
                                     consult.consultation_status === 'scheduled' ? colors.primary : colors.error
                    }}>
                      {consult.consultation_status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(consult.scheduled_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
