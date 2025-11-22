import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BetaMessage from './components/BetaMessage';
import Loader from './components/Loader';
import Home from './pages/Home';
import News from './pages/News';
import Scores from './pages/Scores';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Removed the artificial 2000ms delay. 
    // Now purely checks if the DOM is ready, providing a snappy experience.
    const handleLoad = () => setIsLoading(false);
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback in case load event already fired
      const fallbackTimer = setTimeout(handleLoad, 500); 
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  const handleNavigation = (page: string) => {
    // Reduced transition delay significantly for perceived speed
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300); 
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    handleNavigation('admin-panel');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'news':
        return <News />;
      case 'scores':
        return <Scores />;
      case 'admin':
        return isAdminAuthenticated ? (
           <AdminPanel /> 
        ) : (
           <AdminLogin onLogin={handleAdminLogin} />
        );
      case 'admin-panel':
        return isAdminAuthenticated ? <AdminPanel /> : <AdminLogin onLogin={handleAdminLogin} />;
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <>
      {isLoading && <Loader fullScreen text="MuzSports Yükleniyor..." />}
      <Layout currentPage={currentPage} onNavigate={handleNavigation}>
        {renderPage()}
      </Layout>
      <BetaMessage />
    </>
  );
};

export default App;