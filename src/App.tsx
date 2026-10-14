import { useState, useEffect } from 'react';
import { PublicPortal } from './pages/PublicPortal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check hash for direct #admin navigation
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminRoute(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Check existing session
    const session = localStorage.getItem('sp_admin_session');
    if (session === 'active') {
      setIsAdminAuthenticated(true);
    }

    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminRoute(true);
  };

  const handleBackToPublic = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('sp_admin_session');
    localStorage.removeItem('sp_admin_email');
    setIsAdminAuthenticated(false);
    handleBackToPublic();
  };

  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onBackToPublic={handleBackToPublic}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onViewPublic={handleBackToPublic}
      />
    );
  }

  return <PublicPortal onOpenAdmin={handleOpenAdmin} />;
}

export default App;
