import React, { useState } from 'react';
import { Save, Mail, Clock, Send, Eye, EyeOff, Lock, Key } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const Settings = () => {
  const { settings, setSettings } = useData();
  const { changePassword, getCurrentPassword } = useAuth();
  const [formData, setFormData] = useState(settings);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  
  // Password change state
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.reminderDays < 1 || formData.reminderDays > 30) {
      toast.error('Reminder days must be between 1 and 30');
      return;
    }

    try {
      // Save settings locally
      setSettings(formData);
      
      // Update email configuration on server if provided
      if (formData.emailConfig.user && formData.emailConfig.password) {
        const response = await fetch(API_ENDPOINTS.UPDATE_EMAIL_CONFIG, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.emailConfig)
        });

        if (response.ok) {
          toast.success('Settings and email configuration saved successfully');
        } else {
          toast.success('Settings saved, but email configuration update failed');
        }
      } else {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.success('Settings saved locally');
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const sendTestEmail = async () => {
    if (!formData.emailConfig.user || !formData.emailConfig.password) {
      toast.error('Please configure email settings first');
      return;
    }

    setSendingTestEmail(true);
    
    try {
      const testEntry = {
        vehicleNo: 'GJ01AB1234',
        vehicleType: 'Four Wheeler',
        name: 'Test User',
        mobileNo: '+91 9876543210',
        email: formData.emailConfig.user, // Send to configured email
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const response = await fetch(API_ENDPOINTS.SEND_SINGLE_REMINDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testEntry)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success('Test email sent successfully! Check your inbox.');
        } else {
          toast.error(`Failed to send test email: ${result.message}`);
        }
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Please check your configuration.');
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.currentPassword !== getCurrentPassword()) {
      toast.error('Current password is incorrect');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    changePassword(passwordData.newPassword);
    toast.success('Password changed successfully');
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reminder Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Reminder Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send reminders (days before expiry)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.reminderDays}
                onChange={(e) => setFormData(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Customers will receive email reminders this many days before their insurance expires
              </p>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
            </div>
            <button
              type="button"
              onClick={sendTestEmail}
              disabled={sendingTestEmail || !formData.emailConfig.user || !formData.emailConfig.password}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className={`h-4 w-4 ${sendingTestEmail ? 'animate-pulse' : ''}`} />
              <span>{sendingTestEmail ? 'Sending...' : 'Send Test Email'}</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                value={formData.emailConfig.host}
                onChange={(e) => handleInputChange('emailConfig', 'host', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={formData.emailConfig.port}
                onChange={(e) => handleInputChange('emailConfig', 'port', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="587"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emailConfig.user}
                onChange={(e) => handleInputChange('emailConfig', 'user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-email@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Password
              </label>
              <input
                type="password"
                value={formData.emailConfig.password}
                onChange={(e) => handleInputChange('emailConfig', 'password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Gmail App Password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a Gmail App Password, not your regular password. 
                <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Learn how to create one
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter new password"
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Confirm new password"
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">
                <p>💡 <strong>Tip:</strong> Use a strong password with at least 6 characters.</p>
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* Email Template Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Template Preview</h2>
            <span className="text-sm text-gray-500">Live Preview</span>
          </div>
          
          {/* Email Preview Container */}
          <div className="border rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="bg-gray-100 px-4 py-2 border-b">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>From: {formData.emailConfig.user || 'your-email@gmail.com'}</span>
              </div>
            </div>
            
            {/* Email Subject */}
            <div className="bg-blue-50 px-4 py-2 border-b">
              <div className="text-sm font-medium text-blue-900">
                🚗 Insurance Expiry Reminder - GJ01AB1234
              </div>
            </div>
            
            {/* Email Body */}
            <div className="p-6 bg-white">
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-blue-600 mb-4">🚗 Insurance Expiry Reminder</h2>
                
                <p className="text-gray-700 mb-4">
                  Hi <strong>John Doe</strong>,
                </p>
                
                <p className="text-gray-700 mb-4">
                  Your <strong>Four Wheeler</strong> insurance for <strong>GJ01AB1234 (Four Wheeler)</strong> is expiring on <strong>August 15, 2025</strong>. Please renew it before the due date to avoid penalties.
                </p>
                
                {/* Vehicle Details Card */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Vehicle Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Number:</span>
                      <span className="font-medium">GJ01AB1234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Type:</span>
                      <span className="font-medium">Four Wheeler</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-medium">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">+91 9876543210</span>
                    </div>
                  </div>
                </div>
                
                {/* Warning Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                    <div>
                      <p className="font-semibold text-yellow-800">Important:</p>
                      <p className="text-yellow-700 text-sm">Don't let your insurance lapse. Renew today to stay protected!</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">Thanks,</p>
                <p className="font-semibold text-gray-800">InsureTrack Team</p>
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    This is an automated reminder. Please do not reply to this email.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Template Variables Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Template Variables:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
              <div><code>[Customer Name]</code> - Owner name</div>
              <div><code>[Vehicle Number]</code> - Registration number</div>
              <div><code>[Vehicle Type]</code> - Type of vehicle</div>
              <div><code>[Mobile Number]</code> - Contact number</div>
              <div><code>[Expiry Date]</code> - Insurance expiry date</div>
              <div><code>[Days Until Expiry]</code> - Remaining days</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            <p>💡 <strong>Tip:</strong> Save your settings first, then use "Send Test Email" to verify your configuration.</p>
          </div>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;