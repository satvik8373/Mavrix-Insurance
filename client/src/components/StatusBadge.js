import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800'
        };
      case 'expiring':
        return {
          label: 'Expiring Soon',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'expired':
        return {
          label: 'Expired',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { label, className } = getStatusConfig(status);

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;