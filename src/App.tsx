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
    // Check initial route from hash and path, and cleanly remove any `#`
    const determineRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      let targetRoute: AppRoute = 'public';
      let cleanPath = '/';

      if (hash === '#admin' || path === '/admin') {
        targetRoute = 'admin';
        cleanPath = '/admin';
      } else if (hash === '#initiative' || path === '/initiative') {
        targetRoute = 'initiative';
        cleanPath = '/initiative';
      }

      setCurrentRoute(targetRoute);

      // Clean the address bar automatically: strips #admin or #anything to pure clean path
      if (window.location.hash || window.location.pathname !== cleanPath) {
        window.history.replaceState(null, '', cleanPath);
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
    const targetPath = route === 'admin' ? '/admin' : route === 'initiative' ? '/initiative' : '/';
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    if (window.location.pathname !== '/admin' || window.location.hash) {
      window.history.replaceState(null, '', '/admin');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('sp_admin_session');
    localStorage.removeItem('sp_admin_email');
    setIsAdminAuthenticated(false);
    navigateTo('admin');
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
