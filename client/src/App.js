import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Login from './components/Login';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './App.css';
import './styles/ios-pwa.css'; // iOS PWA specific styles

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Toaster position="top-right" />
            <PWAInstallPrompt />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } />
              <Route path="/upload" element={
                <>
                  <Navbar />
                  <Upload />
                </>
              } />
              <Route path="/logs" element={
                <>
                  <Navbar />
                  <Logs />
                </>
              } />
              <Route path="/settings" element={
                <>
                  <Navbar />
                  <Settings />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
