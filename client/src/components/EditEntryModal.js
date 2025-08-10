import React, { useState, useEffect } from 'react';
import { X, Car, User, Phone, Mail, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const EditEntryModal = ({ isOpen, onClose, entry }) => {
  const { updateInsuranceEntry } = useData();
  const [formData, setFormData] = useState({
    policyNumber: '',
    policyType: '',
    name: '',
    phone: '',
    email: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
    'Two Wheeler',
    'Four Wheeler',
    'Car',
    'Bike',
    'Scooter',
    'Truck',
    'Bus',
    'Other'
  ];

  useEffect(() => {
    if (entry) {
      setFormData({
        policyNumber: entry.policyNumber || '',
        policyType: entry.policyType || '',
        name: entry.name || '',
        phone: entry.phone || '',
        email: entry.email || '',
        expiryDate: entry.expiryDate ? new Date(entry.expiryDate).toISOString().split('T')[0] : ''
      });
    }
  }, [entry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.policyNumber || !formData.policyType || !formData.name || 
        !formData.phone || !formData.email || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Date validation
    const selectedDate = new Date(formData.expiryDate);
    if (isNaN(selectedDate.getTime())) {
      toast.error('Please enter a valid expiry date');
      return;
    }

    setLoading(true);
    
    try {
      // Convert date to ISO8601 format for server validation
      const updateData = {
        ...formData,
        expiryDate: new Date(formData.expiryDate).toISOString()
      };
      
      await updateInsuranceEntry(entry._id, updateData);
      toast.success('Insurance entry updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update insurance entry');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '500px',
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
            Edit Entry
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Vehicle Number */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Car size={16} />
                Vehicle Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                placeholder="e.g., GJ01AB1234"
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

            {/* Vehicle Type */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Car size={16} />
                Vehicle Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="policyType"
                value={formData.policyType}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Select Vehicle Type</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <User size={16} />
                Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
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

            {/* Mobile Number */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Phone size={16} />
                Mobile Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
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

            {/* Email */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Mail size={16} />
                Email <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
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

            {/* Insurance Expiry Date */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                <Calendar size={16} />
                Insurance Expiry Date <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
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
                background: '#2563eb',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#2563eb';
              }}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>

              <style>{`
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

export default EditEntryModal;
