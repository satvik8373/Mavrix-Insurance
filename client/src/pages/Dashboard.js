import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FileText, Users, Calendar, AlertTriangle, Search, Filter, Plus, Car, Edit, Trash2, Mail } from 'lucide-react';
import AddEntryModal from '../components/AddEntryModal';
import EditEntryModal from '../components/EditEntryModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { insuranceData, emailLogs, deleteInsuranceEntry, updateInsuranceEntry, sendEmail, loading, error, loadData } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Ensure insuranceData is always an array
  const safeInsuranceData = Array.isArray(insuranceData) ? insuranceData : [];

  // Calculate statistics
  const totalEntries = safeInsuranceData.length;
  const activePolicies = safeInsuranceData.filter(entry => {
    const expiryDate = new Date(entry.expiryDate);
    return expiryDate > new Date();
  }).length;

  const expiringSoon = safeInsuranceData.filter(entry => {
    const expiryDate = new Date(entry.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
  }).length;

  const expiredPolicies = safeInsuranceData.filter(entry => {
    const expiryDate = new Date(entry.expiryDate);
    return expiryDate <= new Date();
  }).length;

  // Filter data based on search and status
  const filteredData = safeInsuranceData.filter(entry => {
    const matchesSearch =
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'Active') {
      matchesStatus = new Date(entry.expiryDate) > new Date();
    } else if (statusFilter === 'Expiring Soon') {
      const expiryDate = new Date(entry.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      matchesStatus = expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
    } else if (statusFilter === 'Expired') {
      matchesStatus = new Date(entry.expiryDate) <= new Date();
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (expiryDate) => {
    const date = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (date <= today) {
      return { text: 'Expired', color: '#dc2626', bg: '#fef2f2' };
    } else if (date <= thirtyDaysFromNow) {
      return { text: 'Expiring Soon', color: '#ea580c', bg: '#fff7ed' };
    } else {
      return { text: 'Active', color: '#16a34a', bg: '#f0fdf4' };
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleSendEmail = async (entry) => {
    try {
      // Load email template from settings
      const savedTemplate = localStorage.getItem('insuretrack-email-template');
      let emailTemplate = {
        subject: 'Insurance Expiry Reminder - {policyNumber}',
        body: `Hi {name},

Your **{policyType}** insurance for **{policyNumber} ({policyType})** is expiring on **{expiryDate}**. Please renew it before the due date to avoid penalties.

**Vehicle Details:**
- Vehicle Number: {policyNumber}
- Vehicle Type: {policyType}
- Owner: {name}
- Mobile: {phone}

**Important:** Don't let your insurance lapse. Renew today to stay protected!

Thanks,
InsureTrack Team

This is an automated reminder. Please do not reply to this email.`
      };

      if (savedTemplate) {
        emailTemplate = JSON.parse(savedTemplate);
      }

      // Process template with entry data
      const processTemplate = (template) => {
        const expiryDate = new Date(entry.expiryDate).toLocaleDateString();
        const daysUntilExpiry = Math.ceil((new Date(entry.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

        return template
          .replace(/\{name\}/g, entry.name || 'Customer')
          .replace(/\{policyNumber\}/g, entry.policyNumber || 'N/A')
          .replace(/\{policyType\}/g, entry.policyType || 'Insurance')
          .replace(/\{expiryDate\}/g, expiryDate)
          .replace(/\{phone\}/g, entry.phone || 'N/A')
          .replace(/\{daysUntilExpiry\}/g, daysUntilExpiry);
      };

      const subject = processTemplate(emailTemplate.subject);
      const message = processTemplate(emailTemplate.body);

      // Create HTML version of the email
      const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Expiry Reminder</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }
        .header {
            text-align: center;
            margin-bottom: 35px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 25px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .car-icon {
            font-size: 24px;
            color: #dc2626;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #374151;
        }
        .main-message {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 5px solid #2563eb;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }
        .main-message p {
            margin: 0;
            font-size: 16px;
            line-height: 1.7;
        }
        .vehicle-details {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .vehicle-details h3 {
            margin: 0 0 20px 0;
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 10px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
        }
        .detail-value {
            font-weight: 700;
            color: #1e293b;
            font-size: 14px;
        }
        .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        }
        .warning-icon {
            color: #d97706;
            font-size: 24px;
            flex-shrink: 0;
        }
        .warning-text {
            color: #92400e;
            font-weight: 700;
            margin: 0;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
        }
        .team-name {
            font-weight: 700;
            color: #2563eb;
            font-size: 18px;
        }
        .footer-note {
            font-size: 12px;
            color: #64748b;
            margin-top: 20px;
            font-style: italic;
        }
        .highlight {
            color: #2563eb;
            font-weight: 700;
        }
        .days-remaining {
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>
                <span class="car-icon">🚗</span>
                Insurance Expiry Reminder
            </h1>
        </div>
        
        <div class="greeting">
            Hi <span class="highlight">${entry.name || 'Customer'}</span>,
        </div>
        
        <div class="main-message">
            <p>
                Your <span class="highlight">${entry.policyType || 'Insurance'}</span> insurance for 
                <span class="highlight">${entry.policyNumber || 'N/A'}</span> 
                is expiring on <span class="highlight">${new Date(entry.expiryDate).toLocaleDateString()}</span>
                <span class="days-remaining">${Math.ceil((new Date(entry.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining</span>.
            </p>
            <p style="margin-top: 15px;">
                Please renew it before the due date to avoid penalties and ensure continuous coverage.
            </p>
        </div>
        
        <div class="vehicle-details">
            <h3>Vehicle Details:</h3>
            <div class="detail-row">
                <span class="detail-label">Vehicle Number:</span>
                <span class="detail-value">${entry.policyNumber || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">${entry.policyType || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">${entry.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Mobile:</span>
                <span class="detail-value">${entry.phone || 'N/A'}</span>
            </div>
        </div>
        
        <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <p class="warning-text">Important: Don't let your insurance lapse. Renew today to stay protected!</p>
        </div>
        
        <div class="footer">
            <p>Thanks,</p>
            <p class="team-name">InsureTrack Team</p>
            <p class="footer-note">This is an automated reminder. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

      // Send email using the existing sendEmail function with HTML
      await sendEmail(entry.email, subject, message, htmlMessage);
      toast.success(`Email sent successfully to ${entry.name}!`);
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleDelete = async (entry) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteInsuranceEntry(entry._id);
        toast.success('Entry deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  // Debug logging
  console.log('🎯 Dashboard render - insuranceData:', insuranceData);
  console.log('🎯 Dashboard render - loading:', loading);
  console.log('🎯 Dashboard render - error:', error);
  console.log('🎯 Dashboard render - safeInsuranceData length:', safeInsuranceData.length);

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace'
        }}>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          <div>Insurance Data Type: {Array.isArray(insuranceData) ? 'Array' : typeof insuranceData}</div>
          <div>Insurance Data Length: {safeInsuranceData.length}</div>
          <div>API URL: {process.env.REACT_APP_API_URL || 'Not Set'}</div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: 0
        }}>
          Insurance Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => loadData()}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#16a34a',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.background = '#2563eb'}
          >
            <Plus size={16} />
            Add New Entry
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#eff6ff',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              <FileText size={24} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
                {totalEntries}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Total Entries
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#f0fdf4',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              <Users size={24} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                {activePolicies}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Active
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#fff7ed',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              <AlertTriangle size={24} color="#ea580c" />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ea580c' }}>
                {expiringSoon}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Expiring Soon
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#fef2f2',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              <Calendar size={24} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                {expiredPolicies}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Expired
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} color="#64748b" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              placeholder="Search by name, email, vehicle number, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={20} color="#64748b" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Expiring Soon</option>
              <option>Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {filteredData.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <Car size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No insurance data found
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Upload an Excel file to get started
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>VEHICLE NO</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>VEHICLE TYPE</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>NAME</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>MOBILE NO</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>INSURANCE EXP DATE</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>EMAIL</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>STATUS</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => {
                  const status = getStatusBadge(entry.expiryDate);
                  return (
                    <tr
                      key={entry._id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        animation: `fadeInUp 0.3s ease ${index * 0.05}s both`
                      }}
                    >
                      <td style={{ padding: '1rem', color: '#374151' }}>{entry.policyNumber || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#374151' }}>{entry.policyType || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#374151', fontWeight: '500' }}>{entry.name || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#374151' }}>{entry.phone || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#374151' }}>
                        {entry.expiryDate ? new Date(entry.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', color: '#374151' }}>{entry.email || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          background: status.bg,
                          color: status.color
                        }}>
                          {status.text}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEdit(entry)}
                            style={{
                              background: '#eff6ff',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#2563eb',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#dbeafe';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#eff6ff';
                              e.target.style.transform = 'scale(1)';
                            }}
                            title="Edit Entry"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleSendEmail(entry)}
                            style={{
                              background: '#f0fdf4',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#16a34a',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#dcfce7';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#f0fdf4';
                              e.target.style.transform = 'scale(1)';
                            }}
                            title="Send Email Automatically"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry)}
                            style={{
                              background: '#fef2f2',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#dc2626',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#fecaca';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#fef2f2';
                              e.target.style.transform = 'scale(1)';
                            }}
                            title="Delete Entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Entry Modal */}
      <EditEntryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        entry={selectedEntry}
      />

      <style>{`
         @keyframes fadeInUp {
           from { 
             opacity: 0;
             transform: translateY(20px);
           }
           to { 
             opacity: 1;
             transform: translateY(0);
           }
         }
       `}</style>
    </div>
  );
};

export default Dashboard;
