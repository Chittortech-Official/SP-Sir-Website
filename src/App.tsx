import { useState, useEffect } from 'react';
import { PublicPortal } from './pages/PublicPortal';
import { InitiativePage } from './pages/InitiativePage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

type AppRoute = 'public' | 'admin' | 'initiative';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial route from hash and path
    const determineRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === '#admin' || path === '/admin') {
        setCurrentRoute('admin');
      } else if (hash === '#initiative' || path === '/initiative') {
        setCurrentRoute('initiative');
      } else {
        setCurrentRoute('public');
      }
    };

    determineRoute();
    window.addEventListener('hashchange', determineRoute);
    window.addEventListener('popstate', determineRoute);

    // Check existing admin session
    const session = localStorage.getItem('sp_admin_session');
    if (session === 'active') {
      setIsAdminAuthenticated(true);
    }

    return () => {
      window.removeEventListener('hashchange', determineRoute);
      window.removeEventListener('popstate', determineRoute);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.location.hash = 'admin';
    } else if (route === 'initiative') {
      window.location.hash = 'initiative';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('sp_admin_session');
    localStorage.removeItem('sp_admin_email');
    setIsAdminAuthenticated(false);
    // Stay on the admin login page
    setCurrentRoute('admin');
    window.location.hash = 'admin';
  };

  // 1. Admin Route (Login or Dashboard)
  if (currentRoute === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onBackToPublic={() => navigateTo('public')}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onViewPublic={() => navigateTo('public')}
      />
    );
  }

  // 2. Initiative Dedicated Full Page
  if (currentRoute === 'initiative') {
    return (
      <InitiativePage
        onBack={() => navigateTo('public')}
        onOpenAdmin={() => navigateTo('admin')}
      />
    );
  }

  // 3. Default: Citizen Public Portal
  return (
    <PublicPortal
      onOpenAdmin={() => navigateTo('admin')}
      onOpenInitiative={() => navigateTo('initiative')}
    />
  );
}

export default App;
