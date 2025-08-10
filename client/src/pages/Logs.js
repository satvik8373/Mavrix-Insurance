import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FileText, Calendar, Mail } from 'lucide-react';

const Logs = () => {
  const { emailLogs } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>
        <FileText size={32} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Email Logs
      </h1>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Email Activity Logs</h3>
        
        {emailLogs.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No email logs found. Email activity will appear here.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                    <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                    Timestamp
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                    <Mail size={16} style={{ marginRight: '0.5rem' }} />
                    Email
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{log.email || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{log.subject || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        background: log.status === 'sent' ? '#28a745' : '#ffc107',
                        color: 'white'
                      }}>
                        {log.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
