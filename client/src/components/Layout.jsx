import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">Agnitia</Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">{user.name} ({user.role})</span>
              <button 
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded transition-colors">
              Login
            </Link>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {user && (
          <aside className="w-64 bg-white border-r p-4 hidden md:block h-full">
            <nav className="flex flex-col gap-2">
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/issuers" className="hover:bg-gray-50 p-2 rounded block">Issuers</Link>
                  <Link to="/admin/audit" className="hover:bg-gray-50 p-2 rounded block">Audit Log</Link>
                </>
              )}
              {user.role === 'issuer' && (
                <>
                  <Link to="/issuer/dashboard" className="hover:bg-gray-50 p-2 rounded block">Dashboard</Link>
                  <Link to="/issuer/issue" className="hover:bg-gray-50 p-2 rounded block">Issue Document</Link>
                  <Link to="/issuer/documents" className="hover:bg-gray-50 p-2 rounded block">My Documents</Link>
                  <Link to="/issuer/profile" className="hover:bg-gray-50 p-2 rounded block">Profile</Link>
                </>
              )}
              {user.role === 'verifier' && (
                <>
                  <Link to="/verify" className="hover:bg-gray-50 p-2 rounded block">Verify Document</Link>
                  <Link to="/verify/history" className="hover:bg-gray-50 p-2 rounded block">History</Link>
                </>
              )}
            </nav>
          </aside>
        )}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
