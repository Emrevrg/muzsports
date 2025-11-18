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
    // Simulate initial site load assets/connections
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (page: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 500); // Small transition delay for effect
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
           // If already logged in, go straight to panel, else login
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