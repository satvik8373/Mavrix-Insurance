import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, Edit, Trash2, Plus, Filter, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/StatusBadge';
import EditModal from '../components/EditModal';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const { insuranceData, getStatus, deleteInsuranceEntry, addEmailLog, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);

  const filteredData = insuranceData.filter(entry => {
    const matchesSearch = entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mobileNo?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || getStatus(entry.expiryDate) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s insurance record?`)) {
      try {
        console.log('Attempting to delete entry with ID:', id);
        await deleteInsuranceEntry(id);
        toast.success(`${name}'s insurance record deleted successfully`);
      } catch (error) {
        console.error('Error deleting entry:', error);
        if (error.message.includes('Entry not found')) {
          toast.error('Entry not found. It may have already been deleted.');
        } else if (error.message.includes('Database not connected')) {
          toast.error('Database connection error. Please try again.');
        } else {
          toast.error('Failed to delete entry. Please try again.');
        }
      }
    }
  };



  const handleSendEmail = async (entry) => {
    setSendingEmail(entry.id);

    try {
      const response = await fetch(API_ENDPOINTS.SEND_SINGLE_REMINDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: entry.name,
          email: entry.email,
          expiryDate: entry.expiryDate
        })
      });

      if (response.ok) {
        const result = await response.json();

        // Add to email logs
        addEmailLog({
          recipient: entry.email,
          status: result.success ? 'success' : 'failed',
          message: result.message,
          error: result.error
        });

        if (result.success) {
          toast.success(`Email sent successfully to ${entry.name}`);
        } else {
          toast.error(`Failed to send email: ${result.message}`);
        }
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');

      // Log the error
      addEmailLog({
        recipient: entry.email,
        status: 'failed',
        message: 'Failed to send email',
        error: error.message
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusCounts = () => {
    const counts = { active: 0, expiring: 0, expired: 0 };
    insuranceData.forEach(entry => {
      const status = getStatus(entry.expiryDate);
      counts[status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Insurance Dashboard</h1>
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowEditModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Entry</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
          <p className="text-2xl font-bold text-gray-900">{insuranceData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
          <p className="text-2xl font-bold text-yellow-600">{statusCounts.expiring}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Expired</h3>
          <p className="text-2xl font-bold text-red-600">{statusCounts.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, vehicle number, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance Exp Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    {insuranceData.length === 0 ? 'No insurance data found. Upload an Excel file to get started.' : 'No entries match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.vehicleNo || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.vehicleType === 'Two Wheeler'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {entry.vehicleType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.mobileNo || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.expiryDate ? format(parseISO(entry.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.email || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={getStatus(entry.expiryDate)} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendEmail(entry)}
                          disabled={sendingEmail === entry.id}
                          className={`relative ${sendingEmail === entry.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-green-600 hover:text-green-900'
                            } transition-colors`}
                          title={sendingEmail === entry.id ? 'Sending email...' : 'Send reminder email'}
                        >
                          <Mail className={`h-4 w-4 ${sendingEmail === entry.id ? 'animate-pulse' : ''}`} />
                          {sendingEmail === entry.id && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full animate-ping"></span>
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit entry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id, entry.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <EditModal
          entry={editingEntry}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;