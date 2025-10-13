import { useState } from 'react';
import { colors } from '../styles/colors';

export default function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onView,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              {columns.map((col, idx) => (
                <th key={idx} style={styles.th}>{col.label}</th>
              ))}
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={styles.noData}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIdx) => (
                <tr key={rowIdx} style={styles.tr}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={styles.td}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          style={{ ...styles.actionBtn, backgroundColor: colors.blue }}
                        >
                          View
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          style={{ ...styles.actionBtn, backgroundColor: colors.green }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          style={{ ...styles.actionBtn, backgroundColor: colors.red }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
  },
  searchBar: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: colors.lightGrey,
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
    borderBottom: `2px solid ${colors.blue}`,
  },
  tr: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    padding: '30px',
    color: colors.grey,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    color: colors.white,
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};
