import React from 'react';
import { ArrowRight, Trophy, TrendingUp, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-16 text-center md:text-left">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent hidden md:block"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Sporun Geleceği
            </span>
            <span className="block text-white mt-2">Burada Başlıyor.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Yapay zeka destekli analizler, anlık skorlar ve şeffaf habercilik anlayışıyla MuzSports, sporu takip etme şeklinizi değiştiriyor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => onNavigate('news')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Haberleri Oku <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('scores')}
              className="px-8 py-4 rounded-full glass-button text-white font-bold flex items-center justify-center gap-2"
            >
              Canlı Skorlar
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Trophy, title: "Canlı Sonuçlar", desc: "Dünyanın her yerinden anlık maç sonuçları ve detaylı istatistikler." },
          { icon: TrendingUp, title: "AI Analiz", desc: "Gemini AI destekli maç önü analizleri ve özgün haber içerikleri." },
          { icon: Users, title: "Oyuncu Kartları", desc: "Favori oyuncularınızın detaylı istatistiklerine anında ulaşın." }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-2xl card-3d group hover:bg-white/10 cursor-default">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feature.icon size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Teaser */}
      <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">MuzSports İstatistikleri</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">100+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Lig</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Canlı</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">AI</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Destekli</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-48 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl flex items-center justify-center border border-white/5">
           <p className="text-gray-400 text-sm italic">Detaylı analiz grafikleri yakında...</p>
        </div>
      </div>
    </div>
  );
};

export default Home;