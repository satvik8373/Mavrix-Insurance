import React, { useState, useEffect } from 'react';
import { X, Mail, User, Car, Send, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const SendEmailModal = ({ isOpen, onClose, entry }) => {
  const { sendEmail } = useData();
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadEmailTemplates();
    }
  }, [isOpen]);

  const loadEmailTemplates = () => {
    const savedTemplates = localStorage.getItem('insuretrack-templates');
    if (savedTemplates) {
      setEmailTemplates(JSON.parse(savedTemplates));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = emailTemplates.find(t => t.id === parseInt(templateId));
      if (template) {
        const processedSubject = processTemplate(template.subject, entry);
        const processedBody = processTemplate(template.body, entry);
        
        setEmailData({
          subject: processedSubject,
          message: processedBody
        });
      }
    }
  };

  const processTemplate = (template, entry) => {
    const expiryDate = new Date(entry.expiryDate).toLocaleDateString();
    const daysUntilExpiry = Math.ceil((new Date(entry.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    return template
      .replace(/\{name\}/g, entry.name || 'Customer')
      .replace(/\{email\}/g, entry.email || '')
      .replace(/\{policyNumber\}/g, entry.policyNumber || 'N/A')
      .replace(/\{policyType\}/g, entry.policyType || 'Insurance')
      .replace(/\{expiryDate\}/g, expiryDate)
      .replace(/\{daysUntilExpiry\}/g, daysUntilExpiry);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setLoading(true);
    
    try {
      await sendEmail(entry.email, emailData.subject, emailData.message);
      toast.success('Email sent successfully!');
      setEmailData({ subject: '', message: '' });
      setSelectedTemplate('');
      onClose();
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const generateReminderEmail = () => {
    const expiryDate = new Date(entry.expiryDate).toLocaleDateString();
    const daysUntilExpiry = Math.ceil((new Date(entry.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    setEmailData({
      subject: `Insurance Expiry Reminder - ${entry.policyNumber || entry.name}`,
      message: `Dear ${entry.name},

This is a reminder that your ${entry.policyType} insurance for ${entry.policyNumber} is expiring on ${expiryDate}.

You have ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining to renew your policy.

Please contact your insurance provider to renew your policy before it expires to avoid any penalties.

Best regards,
InsureTrack Team`
    });
  };

  if (!isOpen || !entry) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        animation: 'slideIn 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0
          }}>
            Send Email
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '1.5rem',
              padding: '0.25rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#dc2626'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Recipient Info */}
        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Recipient Information
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#64748b" />
              <span style={{ color: '#374151', fontWeight: '500' }}>{entry.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={16} color="#64748b" />
              <span style={{ color: '#374151' }}>{entry.policyNumber} ({entry.policyType})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#64748b" />
              <span style={{ color: '#374151' }}>{entry.email}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Template Selector */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <FileText size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email Template
              </label>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a template or write custom message</option>
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.isDefault && '(Default)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                Subject <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={emailData.subject}
                onChange={handleInputChange}
                placeholder="Enter email subject"
                required
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

            {/* Message */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                Message <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                name="message"
                value={emailData.message}
                onChange={handleInputChange}
                placeholder="Enter your message here..."
                required
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

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={generateReminderEmail}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
              Generate Reminder
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: '#16a34a',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#15803d';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#16a34a';
              }}
            >
              <Send size={16} />
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SendEmailModal;
