import React, { useState, MouseEvent } from 'react';
import { PlayerCard } from '../types';
import { Trophy, Activity, Target, X, Star, BarChart2 } from 'lucide-react';

interface PlayerCard3DProps {
  card: PlayerCard;
  onClose: () => void;
}

const PlayerCard3D: React.FC<PlayerCard3DProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 perspective-2000" onClick={onClose}>
      
      {/* Close Button (Mobile Friendly) */}
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white z-[110]">
        <X size={32} />
      </button>

      <div 
        className="relative w-80 h-[480px] sm:w-96 sm:h-[550px] transition-transform duration-200 ease-out transform-style-3d cursor-pointer"
        style={{ 
          transform: isFlipped 
            ? 'rotateY(180deg)' 
            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` 
        }}
        onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden border border-white/10 bg-[#0f172a] shadow-[0_0_50px_rgba(59,130,246,0.3)] group">
            
            {/* Parallax Background Image */}
            <div className="absolute inset-0 transform-style-3d">
              <div className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${card.imageUrl})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            </div>
            
            {/* Holographic Sheen */}
            <div className="absolute inset-0 holo-sheen z-20 opacity-40 pointer-events-none"></div>

            {/* Floating Elements (Translate Z) */}
            <div className="absolute top-6 left-6 z-30 translate-z-30">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 z-30 translate-z-20 flex flex-col items-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 drop-shadow-2xl translate-z-30 text-center leading-none mb-2">
                {card.name}
              </h2>
              
              <div className="px-4 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg mb-8 translate-z-20 border border-blue-400/30">
                {card.team}
              </div>

              <div className="w-full grid grid-cols-3 gap-2 text-center bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 translate-z-10">
                 <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{card.stats.goals}</span>
                    <span className="text-[9px] text-blue-300 uppercase font-bold tracking-wider">GOL</span>
                 </div>
                 <div className="flex flex-col items-center border-l border-white/10">
                    <span className="text-2xl font-bold text-white">{card.stats.assists}</span>
                    <span className="text-[9px] text-blue-300 uppercase font-bold tracking-wider">ASİST</span>
                 </div>
                 <div className="flex flex-col items-center border-l border-white/10">
                    <span className="text-2xl font-bold text-white">{card.stats.matches}</span>
                    <span className="text-[9px] text-blue-300 uppercase font-bold tracking-wider">MAÇ</span>
                 </div>
              </div>
              
              <div className="mt-6 text-[10px] text-gray-400 flex items-center gap-2 translate-z-10 opacity-60">
                <Activity size={12} /> DETAYLAR İÇİN KARTI ÇEVİR
              </div>
            </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-black p-8 flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.3)]">
             {/* Decorative Background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute top-4 right-4 opacity-10">
               <Trophy size={120} />
             </div>
             
             <div className="relative z-10">
               <h3 className="text-2xl font-bold text-purple-300 mb-1 flex items-center gap-2">
                 <BarChart2 size={24}/> Analiz
               </h3>
               <div className="h-1 w-12 bg-purple-500 rounded-full mb-8"></div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-300 font-medium">Genel Form</span>
                       <span className="text-green-400 font-bold text-lg">9.2</span>
                     </div>
                     <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                       <div className="bg-gradient-to-r from-green-600 to-green-400 h-full w-[92%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-300 font-medium">Şut Gücü</span>
                       <span className="text-blue-400 font-bold text-lg">8.8</span>
                     </div>
                     <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                       <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full w-[88%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-300 font-medium">Hız & Teknik</span>
                       <span className="text-purple-400 font-bold text-lg">9.5</span>
                     </div>
                     <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                       <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[95%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                     </div>
                  </div>
               </div>

               <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                 <p className="text-sm text-gray-300 leading-relaxed italic relative z-10">
                   "{card.description}"
                 </p>
               </div>
             </div>
             
             <div className="mt-auto pt-4 flex justify-center opacity-50">
                <div className="flex items-center gap-2 text-[10px] text-purple-300 tracking-widest uppercase">
                  <Target size={12} /> Powered by Gemini AI
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerCard3D;