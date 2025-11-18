import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { ADMIN_PASS_HASH } from '../constants';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Encode input to Base64 and compare with stored hash
    const inputHash = btoa(password);
    if (inputHash === ADMIN_PASS_HASH) {
      onLogin();
    } else {
      setError('Erişim Reddedildi: Geçersiz Şifre');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-panel p-8 sm:p-12 rounded-2xl w-full max-w-md relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-white/5 rounded-full mb-4 shadow-inner">
            <Lock size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">Admin Panel Girişi</h2>
          <p className="text-gray-400 text-sm mt-2">Yetkili personel girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
            {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-bold text-white shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            Giriş Yap <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;