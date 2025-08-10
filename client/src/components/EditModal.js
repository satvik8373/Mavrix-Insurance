import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const EditModal = ({ entry, onClose }) => {
  const { addInsuranceEntry, updateInsuranceEntry } = useData();
  const [formData, setFormData] = useState({
    vehicleNo: '',
    vehicleType: '',
    name: '',
    mobileNo: '',
    email: '',
    expiryDate: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        vehicleNo: entry.vehicleNo || '',
        vehicleType: entry.vehicleType || '',
        name: entry.name || '',
        mobileNo: entry.mobileNo || '',
        email: entry.email || '',
        expiryDate: entry.expiryDate || ''
      });
    }
  }, [entry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleNo || !formData.vehicleType || !formData.name || !formData.mobileNo || !formData.email || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^[+]?[0-9\s\-()]{10,15}$/;
    if (!mobileRegex.test(formData.mobileNo)) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      if (entry) {
        await updateInsuranceEntry(entry.id, formData);
        toast.success('Entry updated successfully');
      } else {
        await addInsuranceEntry(formData);
        toast.success('Entry added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(entry ? 'Failed to update entry' : 'Failed to add entry');
      console.error('Error saving entry:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {entry ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number *
              </label>
              <input
                type="text"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., GJ01AB1234"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Four Wheeler">Four Wheeler</option>
                <option value="Commercial Vehicle">Commercial Vehicle</option>
                <option value="Heavy Vehicle">Heavy Vehicle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {entry ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;