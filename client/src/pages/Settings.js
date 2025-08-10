import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Save, RefreshCw, Mail, Key, Eye, EyeOff, Car, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailReminders: true,
    reminderDays: 30,
    notifications: true
  });
  
  const [emailTemplate, setEmailTemplate] = useState({
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
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    loadSettings();
  }, [isAuthenticated, navigate]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('insuretrack-settings');
    const savedTemplate = localStorage.getItem('insuretrack-email-template');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedTemplate) {
      setEmailTemplate(JSON.parse(savedTemplate));
    }
  };

  if (!isAuthenticated) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTemplateChange = (field, value) => {
    setEmailTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('insuretrack-settings', JSON.stringify(settings));
    localStorage.setItem('insuretrack-email-template', JSON.stringify(emailTemplate));
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings = {
      emailReminders: true,
      reminderDays: 30,
      notifications: true
    };
    const defaultTemplate = {
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
    
    setSettings(defaultSettings);
    setEmailTemplate(defaultTemplate);
    toast.success('Settings reset to defaults!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    // Here you would typically make an API call to change the password
    // For now, we'll just show a success message
    toast.success('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const processTemplate = (template) => {
    const sampleData = {
      name: 'John Doe',
      policyNumber: 'GJ01AB1234',
      policyType: 'Four Wheeler',
      expiryDate: 'August 15, 2025',
      phone: '+91 9876543210'
    };
    
    return template
      .replace(/\{name\}/g, sampleData.name)
      .replace(/\{policyNumber\}/g, sampleData.policyNumber)
      .replace(/\{policyType\}/g, sampleData.policyType)
      .replace(/\{expiryDate\}/g, sampleData.expiryDate)
      .replace(/\{phone\}/g, sampleData.phone);
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
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
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <SettingsIcon size={32} />
        Settings
      </h1>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '1200px' }}>
        {/* Change Password */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Key size={24} />
            Change Password
          </h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                Current Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '0.25rem'
                  }}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                New Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '0.25rem'
                  }}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                Confirm New Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '0.25rem'
                  }}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p style={{ 
              fontSize: '0.85rem', 
              color: '#64748b',
              marginTop: '-0.5rem'
            }}>
              Tip: Use a strong password with at least 6 characters.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleChangePassword}
                style={{
                  background: '#16a34a',
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
                onMouseEnter={(e) => e.target.style.background = '#15803d'}
                onMouseLeave={(e) => e.target.style.background = '#16a34a'}
              >
                <Key size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Email Template Preview */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Mail size={24} />
              Email Template Preview
            </h3>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#64748b',
              fontWeight: '500'
            }}>
              Live Preview
            </span>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Template Editor */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailTemplate.subject}
                  onChange={(e) => handleTemplateChange('subject', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Email Body
                </label>
                <textarea
                  value={emailTemplate.body}
                  onChange={(e) => handleTemplateChange('body', e.target.value)}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Live Preview */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
              background: '#f8fafc'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {/* Email Header */}
                                 <div style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '0.5rem',
                   marginBottom: '1rem',
                   paddingBottom: '1rem',
                   borderBottom: '1px solid #e2e8f0'
                 }}>
                   <Mail size={16} color="#64748b" />
                   <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                     From: your-email@gmail.com
                   </span>
                 </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <Car size={16} color="#64748b" />
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    {processTemplate(emailTemplate.subject)}
                  </span>
                </div>

                {/* Email Body */}
                <div style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: '1.6',
                  color: '#374151'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    <Car size={20} color="#2563eb" />
                    Insurance Expiry Reminder
                  </div>
                  
                  <div style={{ 
                    whiteSpace: 'pre-line',
                    marginBottom: '1rem'
                  }}>
                    {processTemplate(emailTemplate.body)}
                  </div>

                  {/* Warning Box */}
                  <div style={{
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: '#ea580c',
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{ color: '#ea580c', fontWeight: '500' }}>
                      Important: Don't let your insurance lapse. Renew today to stay protected!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Variables */}
            <div style={{ 
              padding: '1rem', 
              background: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Available Variables
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Use these variables in your template:
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <code style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{name}'}</code>
                <code style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{policyNumber}'}</code>
                <code style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{policyType}'}</code>
                <code style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{expiryDate}'}</code>
                <code style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{phone}'}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '1.5rem'
          }}>
            Application Settings
          </h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="emailReminders"
              checked={settings.emailReminders}
              onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
            />
              <label style={{ color: '#374151', fontWeight: '500' }}>
            Enable Email Reminders
          </label>
        </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#374151', 
                fontWeight: '500' 
              }}>
                Days before expiry to send reminder
              </label>
          <select
            name="reminderDays"
            value={settings.reminderDays}
            onChange={handleChange}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer'
                }}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
            />
              <label style={{ color: '#374151', fontWeight: '500' }}>
            Enable Browser Notifications
          </label>
            </div>
        </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={handleSave}
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
              <Save size={16} />
            Save Settings
          </button>
            <button 
              onClick={handleReset}
              style={{
                background: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
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
              onMouseEnter={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              <RefreshCw size={16} />
            Reset to Defaults
          </button>
        </div>
      </div>

        {/* About Section */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            About InsureTrack
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem', color: '#64748b' }}>
            <p><strong style={{ color: '#374151' }}>Version:</strong> 1.0.0</p>
            <p><strong style={{ color: '#374151' }}>Description:</strong> Insurance Management System</p>
            <p><strong style={{ color: '#374151' }}>Features:</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Excel file upload and processing</li>
          <li>Insurance data management</li>
              <li>Email reminder system with templates</li>
          <li>Responsive web interface</li>
              <li>Customizable email templates</li>
        </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
