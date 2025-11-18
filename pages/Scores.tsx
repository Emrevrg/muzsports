import React, { useEffect, useState } from 'react';
import { Score } from '../types';
import { RSS_FEEDS } from '../constants';
import { fetchRSSData, analyzeMatchWithAI } from '../services/geminiService';
import { Activity, X, Share2, BarChart2, Rss } from 'lucide-react';
import Loader from '../components/Loader';

interface ExtendedScore extends Score {
  rawDescription?: string;
  aiAnalysis?: string;
}

const Scores: React.FC = () => {
  const [scores, setScores] = useState<ExtendedScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<ExtendedScore | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      try {
        // Filter feeds relevant for scores (can be improved with specific Score RSS)
        const scoreFeeds = RSS_FEEDS.filter(f => f.name.includes('Sport') || f.name.includes('Score')).map(f => f.url);
        // Add specific score/result feeds if available in constants, otherwise reuse main feeds and filter by pattern
        const realData = await fetchRSSData(scoreFeeds, 'SCORES');
        setScores(realData);
      } catch (e) {
        console.error("Score fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    loadScores();
  }, []);

  const handleMatchClick = async (score: ExtendedScore) => {
    setSelectedMatch(score);
    setAnalyzing(true);
    // Generate Analysis on the fly
    const analysis = await analyzeMatchWithAI(score);
    setSelectedMatch(prev => prev ? { ...prev, aiAnalysis: analysis } : null);
    setAnalyzing(false);
  };

  if (loading) return <Loader fullScreen text="Canlı Skorlar Güncelleniyor..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Canlı Skorlar & Sonuçlar
        </h2>
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 px-3 py-1.5 rounded-full">
           <Rss size={14} className="text-red-400 animate-pulse"/>
           <span className="text-xs font-bold text-red-200 tracking-wide">CANLI RSS AKIŞI</span>
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400 flex flex-col items-center">
          <Activity size={48} className="mb-4 opacity-50" />
          <p>Şu an aktif maç verisi RSS kaynaklarından çekilemedi.</p>
          <p className="text-xs mt-2 opacity-60">Maç saatlerinde tekrar kontrol ediniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => (
            <div 
              key={score.id} 
              onClick={() => handleMatchClick(score)}
              className="glass-panel p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between hover:bg-white/5 transition-all border-l-4 border-l-transparent hover:border-l-blue-500 cursor-pointer group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
               
               <div className="flex-1 flex items-center justify-end space-x-4 w-full sm:w-auto mb-2 sm:mb-0">
                 <span className="font-bold text-lg sm:text-xl">{score.homeTeam}</span>
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-blue-400/30">
                   {score.homeTeam.charAt(0)}
                 </div>
               </div>

               <div className="mx-4 sm:mx-8 flex flex-col items-center w-full sm:w-auto">
                  <div className="text-3xl font-black tracking-widest bg-black/40 px-6 py-2 rounded-lg border border-white/10 font-mono shadow-inner min-w-[100px] text-center">
                    {score.status === 'UPCOMING' ? 'VS' : `${score.homeScore}-${score.awayScore}`}
                  </div>
                  <div className={`text-[10px] font-bold mt-2 px-3 py-0.5 rounded-full uppercase tracking-wider ${
                    score.status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' : 
                    score.status === 'FINISHED' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {score.time} • {score.league}
                  </div>
               </div>

               <div className="flex-1 flex items-center justify-start space-x-4 w-full sm:w-auto mt-2 sm:mt-0 flex-row-reverse sm:flex-row">
                 <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-red-400/30">
                    {score.awayTeam.charAt(0)}
                 </div>
                 <span className="font-bold text-lg sm:text-xl">{score.awayTeam}</span>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden animate-float border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f172a] to-blue-900/20 p-6 border-b border-white/10 flex justify-between items-start">
               <div className="flex items-center gap-2 text-blue-400">
                 <Activity size={20} />
                 <span className="font-bold tracking-widest text-sm">MAÇ ANALİZİ</span>
               </div>
               <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-white">
                 <X size={24} />
               </button>
            </div>

            {/* Score Board */}
            <div className="p-8 flex justify-between items-center bg-black/20">
              <div className="text-center flex-1">
                <div className="text-3xl font-bold mb-2">{selectedMatch.homeTeam}</div>
                <div className="text-4xl font-black text-blue-400">{selectedMatch.homeScore}</div>
              </div>
              <div className="text-xl font-bold text-gray-500">VS</div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold mb-2">{selectedMatch.awayTeam}</div>
                <div className="text-4xl font-black text-red-400">{selectedMatch.awayScore}</div>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-purple-300">
                  <BarChart2 size={20}/> Gemini AI Yorumu
                </h3>
                <span className="text-[10px] text-gray-500 uppercase border border-white/10 px-2 py-1 rounded">RSS Veri Kaynağı</span>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 min-h-[100px] flex items-center justify-center">
                {analyzing ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                    Analiz hazırlanıyor...
                  </div>
                ) : (
                  <p className="text-gray-200 leading-relaxed italic text-center">
                    "{selectedMatch.aiAnalysis}"
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                 <button className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-300">
                   <Share2 size={16}/> Paylaş
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scores;