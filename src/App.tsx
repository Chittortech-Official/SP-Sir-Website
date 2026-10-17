import { useState, useEffect } from 'react';
import { PublicPortal } from './pages/PublicPortal';
import { DirectoryPage } from './pages/DirectoryPage';
import { InitiativePage } from './pages/InitiativePage';
import { SafetyHubPage } from './pages/SafetyHubPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import type { PublicTab } from './components/BottomNav';

type AppRoute = 'admin' | PublicTab;

export function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('jansunwai');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check initial route from hash and path, and cleanly remove any `#`
    const determineRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      let targetRoute: AppRoute = 'jansunwai';
      let cleanPath = '/';

      if (hash === '#admin' || path === '/admin') {
        targetRoute = 'admin';
        cleanPath = '/admin';
      } else if (hash === '#safety' || path === '/safety' || hash === '#cyber' || path === '/cyber') {
        targetRoute = 'safety';
        cleanPath = '/safety';
      } else if (hash === '#directory' || path === '/directory' || hash === '#contact' || path === '/contact') {
        targetRoute = 'directory';
        cleanPath = '/directory';
      } else if (hash === '#initiative' || path === '/initiative' || hash === '#about' || path === '/about') {
        targetRoute = 'initiative';
        cleanPath = '/initiative';
      } else {
        targetRoute = 'jansunwai';
        cleanPath = '/';
      }

      setCurrentRoute(targetRoute);

      // Clean the address bar automatically: strips #hash or dirty path to pure clean path
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
    let targetPath = '/';
    if (route === 'admin') targetPath = '/admin';
    else if (route === 'safety') targetPath = '/safety';
    else if (route === 'directory') targetPath = '/directory';
    else if (route === 'initiative') targetPath = '/initiative';

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
          onBackToPublic={() => navigateTo('jansunwai')}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onViewPublic={() => navigateTo('jansunwai')}
      />
    );
  }

  // 2. Citizen Views with Persistent Fixed Bottom Navigation
  const publicTab: PublicTab =
    currentRoute === 'safety' || currentRoute === 'directory' || currentRoute === 'initiative'
      ? currentRoute
      : 'jansunwai';

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      {/* ── Royal Rajasthan Police Splash Screen on Initial Visit/Refresh ── */}
      {showSplash && (
        <SplashScreen
          minDisplayTimeMs={1500}
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* Active Tab View */}
      <div className="flex-1 pb-16">
        {publicTab === 'jansunwai' && (
          <PublicPortal
            onOpenAdmin={() => navigateTo('admin')}
            onOpenInitiative={() => navigateTo('initiative')}
            onOpenDirectory={() => navigateTo('directory')}
          />
        )}

        {publicTab === 'safety' && (
          <SafetyHubPage
            onOpenAdmin={() => navigateTo('admin')}
            onOpenInitiative={() => navigateTo('initiative')}
          />
        )}

        {publicTab === 'directory' && (
          <DirectoryPage
            onOpenAdmin={() => navigateTo('admin')}
            onOpenInitiative={() => navigateTo('initiative')}
          />
        )}

        {publicTab === 'initiative' && (
          <InitiativePage
            onBack={() => navigateTo('jansunwai')}
            onOpenAdmin={() => navigateTo('admin')}
          />
        )}
      </div>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={publicTab}
        onTabChange={(tab) => navigateTo(tab)}
      />
    </div>
  );
}

export default App;
