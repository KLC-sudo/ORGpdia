import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ApproachSection from './components/ApproachSection';
import PartnersSection from './components/PartnersSection';
import TeamSection from './components/TeamSection';
import GallerySection from './components/GallerySection';
import ContactFooter from './components/ContactFooter';
import { ContentProvider, useContent } from './ContentContext';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/LoginPage';

const AppContent: React.FC = () => {
  const { isAdmin, setIsAdmin, content } = useContent();
  const [clickCount, setClickCount] = React.useState(0);
  const [lastClickTime, setLastClickTime] = React.useState(0);
  const [showLogin, setShowLogin] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();

    // Add keyboard shortcut: Ctrl/Cmd + Shift + A for admin access
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAuthenticated) {
          setShowLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleAdminToggle = () => {
    const now = Date.now();

    // Reset count if more than 1 second has passed since last click
    if (now - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }

    setLastClickTime(now);

    // Show login on triple click
    if (clickCount >= 2) {
      setShowLogin(true);
      setClickCount(0);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setIsAdmin(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setShowLogin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show login page if triggered
  if (showLogin && !isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show admin dashboard if authenticated and admin mode is on
  if (isAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ApproachSection />
      {content.galleryVisible && <GallerySection />}
      {content.partnersVisible && <PartnersSection />}
      {content.teamVisible && <TeamSection />}
      <ContactFooter />

      {/* Invisible Admin Toggle - Triple Click (BBox) */}
      <button
        onClick={handleAdminToggle}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-transparent hover:bg-gray-100/10 transition-all duration-300 opacity-0 hover:opacity-20 cursor-default z-50"
        aria-label="Admin Access"
        title=""
      />
    </div>
  );
};

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
