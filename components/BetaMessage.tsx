import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const BetaMessage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-float">
      <div className="glass-panel p-6 rounded-xl border-l-4 border-yellow-500 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-yellow-100 mb-1">Sistem Durumu</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Domain ve hosting altyapısındaki güncellemeler nedeniyle özellikler kademeli olarak eklenmektedir. 
              Sitemiz <span className="text-yellow-400 font-bold">2-3 hafta içerisinde</span> tam kapasite ile yayına girecektir.
              Anlayışınız için teşekkürler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaMessage;