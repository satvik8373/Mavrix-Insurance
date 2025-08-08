import React, { useState } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, Check, X } from 'lucide-react';
import * as ExcelJS from 'exceljs';
import { useData } from '../context/DataContext';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const Upload = () => {
  const { bulkAddInsuranceData } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data.buffer);
        
        const worksheet = workbook.getWorksheet(1); // Get the first worksheet
        if (!worksheet) {
          toast.error('No worksheet found in the Excel file');
          return;
        }

        const jsonData = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            const headerCell = worksheet.getRow(1).getCell(colNumber);
            const header = headerCell.value ? headerCell.value.toString().trim() : `Column${colNumber}`;
            rowData[header] = cell.value;
          });
          
          if (Object.keys(rowData).length > 0) {
            jsonData.push(rowData);
          }
        });
        
        // Validate and transform data
        const validatedData = validateAndTransformData(jsonData);
        if (validatedData.length > 0) {
          setPreviewData(validatedData);
          setShowPreview(true);
        }
      } catch (error) {
        toast.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const validateAndTransformData = (data) => {
    const validEntries = [];
    const errors = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // Excel row number (accounting for header)
      
      // Check for required fields (case-insensitive)
      const vehicleNo = row.VehicleNo || row.vehicleNo || row['Vehicle No'] || row.VEHICLENO;
      const vehicleType = row.VehicleType || row.vehicleType || row['Vehicle Type'] || row.VEHICLETYPE;
      const name = row.Name || row.name || row.NAME;
      const mobileNo = row.MobileNo || row.mobileNo || row['Mobile No'] || row.MOBILENO || row.Mobile || row.mobile;
      const email = row.Email || row.email || row.EMAIL;
      const expiryDate = row.ExpiryDate || row.expiryDate || row['Expiry Date'] || row.EXPIRYDATE;

      if (!vehicleNo || !vehicleType || !name || !mobileNo || !email || !expiryDate) {
        errors.push(`Row ${rowNum}: Missing required fields (VehicleNo, VehicleType, Name, MobileNo, Email, ExpiryDate)`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        return;
      }

      // Parse and validate date
      let parsedDate;
      try {
        if (expiryDate instanceof Date) {
          // ExcelJS Date object
          parsedDate = format(expiryDate, 'yyyy-MM-dd');
        } else if (typeof expiryDate === 'number') {
          // Excel date serial number
          const excelDate = new Date((expiryDate - 25569) * 86400 * 1000);
          parsedDate = format(excelDate, 'yyyy-MM-dd');
        } else if (typeof expiryDate === 'string') {
          // Try to parse string date
          const date = new Date(expiryDate);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          parsedDate = format(date, 'yyyy-MM-dd');
        } else {
          throw new Error('Invalid date format');
        }
      } catch (error) {
        errors.push(`Row ${rowNum}: Invalid date format`);
        return;
      }

      validEntries.push({
        vehicleNo: vehicleNo.toString().trim().toUpperCase(),
        vehicleType: vehicleType.toString().trim(),
        name: name.toString().trim(),
        mobileNo: mobileNo.toString().trim(),
        email: email.toString().trim().toLowerCase(),
        expiryDate: parsedDate
      });
    });

    if (errors.length > 0) {
      toast.error(`Found ${errors.length} error(s) in the Excel file`);
      console.error('Validation errors:', errors);
    }

    if (validEntries.length === 0) {
      toast.error('No valid entries found in the Excel file');
    } else {
      toast.success(`Found ${validEntries.length} valid entries`);
    }

    return validEntries;
  };

  const handleConfirmUpload = async () => {
    try {
      await bulkAddInsuranceData(previewData);
      toast.success(`Successfully imported ${previewData.length} entries`);
      setShowPreview(false);
      setPreviewData([]);
      setFileName('');
    } catch (error) {
      toast.error('Failed to import data');
      console.error('Error importing data:', error);
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setPreviewData([]);
    setFileName('');
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Preview Import Data</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancelUpload}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleConfirmUpload}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Confirm Import</span>
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">File: {fileName}</span>
            <span className="text-blue-700">({previewData.length} entries found)</span>
          </div>
        </div>

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
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.vehicleNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        entry.vehicleType === 'Two Wheeler' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {entry.vehicleType}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.mobileNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(entry.expiryDate), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Upload Insurance Data</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Excel File Requirements</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Your Excel file should contain the following columns:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>VehicleNo</strong> - Vehicle registration number</li>
              <li>• <strong>VehicleType</strong> - Type of vehicle (Two Wheeler, Four Wheeler, etc.)</li>
              <li>• <strong>Name</strong> - Full name of the customer</li>
              <li>• <strong>MobileNo</strong> - Mobile phone number</li>
              <li>• <strong>Email</strong> - Valid email address</li>
              <li>• <strong>ExpiryDate</strong> - Insurance expiry date (YYYY-MM-DD or MM/DD/YYYY)</li>
            </ul>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your Excel file here
          </h3>
          <p className="text-gray-500 mb-4">
            or click to browse and select a file
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Select Excel File
          </label>
        </div>
      </div>
    </div>
  );
};

export default Upload;