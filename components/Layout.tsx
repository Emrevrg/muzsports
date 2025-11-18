import React, { useState } from 'react';
import { Menu, X, Shield, Activity, Newspaper, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Anasayfa', icon: Home },
    { id: 'news', label: 'Haberler', icon: Newspaper },
    { id: 'scores', label: 'Canlı Skorlar', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-4 z-40 mx-4 lg:mx-12 rounded-2xl glass-panel mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                MuzSports
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-white/10 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Admin Button */}
            <div className="hidden md:flex">
              <button
                onClick={() => onNavigate(currentPage === 'admin' ? 'home' : 'admin')}
                className="glass-button p-2 rounded-full text-gray-300 hover:text-red-400 hover:border-red-500/30"
                title="Admin Panel"
              >
                <Shield size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 absolute w-full left-0 rounded-b-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                 onClick={() => {
                    onNavigate('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                <Shield size={16} />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-panel mt-auto border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MuzSports. All rights reserved. 
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Gemini AI • Data simulated for demo purposes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
