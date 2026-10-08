import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

const Placeholder = ({ name }) => <div className="p-4 bg-white shadow rounded"><h3 className="text-lg font-semibold mb-2">{name} placeholder</h3><p className="text-gray-600">Page under construction.</p></div>;

const Issuers = () => <Placeholder name="Admin Issuers" />;
const AuditLog = () => <Placeholder name="Admin Audit Log" />;
const Dashboard = () => <Placeholder name="Issuer Dashboard" />;
const IssueDocument = () => <Placeholder name="Issue Document" />;
const MyDocuments = () => <Placeholder name="My Documents" />;
const Profile = () => <Placeholder name="Issuer Profile" />;
const Verify = () => <Placeholder name="Verify Document" />;
const History = () => <Placeholder name="Verification History" />;
const PublicVerify = () => <Placeholder name="Public Verify" />;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading session...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-center">
          <h2 className="font-bold text-lg mb-2">403 Forbidden</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/public/verify/:docId" element={<PublicVerify />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        
        {/* Admin Routes */}
        <Route path="admin/issuers" element={
          <ProtectedRoute allowedRoles={['admin']}><Issuers /></ProtectedRoute>
        } />
        <Route path="admin/audit" element={
          <ProtectedRoute allowedRoles={['admin']}><AuditLog /></ProtectedRoute>
        } />

        {/* Issuer Routes */}
        <Route path="issuer/dashboard" element={
          <ProtectedRoute allowedRoles={['issuer']}><Dashboard /></ProtectedRoute>
        } />
        <Route path="issuer/issue" element={
          <ProtectedRoute allowedRoles={['issuer']}><IssueDocument /></ProtectedRoute>
        } />
        <Route path="issuer/documents" element={
          <ProtectedRoute allowedRoles={['issuer']}><MyDocuments /></ProtectedRoute>
        } />
        <Route path="issuer/profile" element={
          <ProtectedRoute allowedRoles={['issuer']}><Profile /></ProtectedRoute>
        } />

        {/* Verifier Routes */}
        <Route path="verify" element={
          <ProtectedRoute allowedRoles={['verifier']}><Verify /></ProtectedRoute>
        } />
        <Route path="verify/history" element={
          <ProtectedRoute allowedRoles={['verifier']}><History /></ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<div className="p-8 text-center text-gray-500 font-medium">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
