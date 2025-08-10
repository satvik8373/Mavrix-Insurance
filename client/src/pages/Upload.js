import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const Upload = () => {
  const { addInsuranceEntry } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setPreview(jsonData.slice(0, 5)); // Show first 5 rows
        toast.success(`File loaded: ${jsonData.length} rows found`);
      } catch (error) {
        toast.error('Error reading file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process each row
        jsonData.forEach(row => {
          if (row.name || row.policyType || row.expiryDate) {
            addInsuranceEntry({
              name: row.name || '',
              policyType: row.policyType || '',
              expiryDate: row.expiryDate || '',
              email: row.email || '',
              phone: row.phone || '',
              notes: row.notes || ''
            });
          }
        });

        toast.success(`Successfully uploaded ${jsonData.length} entries!`);
        setFile(null);
        setPreview([]);
        navigate('/');
      } catch (error) {
        toast.error('Error processing file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>
        <UploadIcon size={32} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Upload Insurance Data
      </h1>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Upload Excel File</h3>
        
        <div className="form-group">
          <label htmlFor="file">
            <FileSpreadsheet size={16} style={{ marginRight: '0.5rem' }} />
            Select Excel File (.xlsx, .xls)
          </label>
          <input
            type="file"
            id="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ padding: '0.5rem' }}
          />
        </div>

        {file && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Selected file:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {preview.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Preview (First 5 rows):</h4>
            <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    {Object.keys(preview[0] || {}).map(key => (
                      <th key={key} style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                          {String(value || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button 
          onClick={handleUpload} 
          className="btn" 
          style={{ marginTop: '1rem' }}
          disabled={!file}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Upload Data
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Expected Excel Format</h3>
        <p>Your Excel file should have the following columns:</p>
        <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
          <li><strong>name</strong> - Client's full name</li>
          <li><strong>policyType</strong> - Type of insurance policy</li>
          <li><strong>expiryDate</strong> - Policy expiry date</li>
          <li><strong>email</strong> - Client's email address</li>
          <li><strong>phone</strong> - Client's phone number</li>
          <li><strong>notes</strong> - Additional notes (optional)</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
