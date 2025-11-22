import React, { useEffect, useState, useRef } from 'react';
import { fetchRSSData, rewriteNewsWithAI, manageNewsStorage, updateStoredNewsItem, getStoredNews } from '../services/geminiService';
import { NewsItem, PlayerCard } from '../types';
import { ExternalLink, Newspaper, RotateCw, BookOpen, X, Calendar, Rss } from 'lucide-react';
import Loader from '../components/Loader';
import PlayerCard3D from '../components/PlayerCard3D';
import { RSS_FEEDS } from '../constants';

// Extended interface for internal use
interface ExtendedNewsItem extends NewsItem {
  snippet?: string;
  fullArticle?: string;
  isProcessed: boolean;
  timestamp: number;
}

const cardsDB: Record<string, PlayerCard> = {
  "@Icardi": { id: "p1", name: "Mauro Icardi", team: "Galatasaray", stats: { matches: 25, goals: 20, assists: 6 }, imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=500", description: "Arjantinli süperstar, ceza sahası içindeki bitiriciliği ile tanınır." },
  "@Mbappe": { id: "p2", name: "Kylian Mbappé", team: "Real Madrid", stats: { matches: 30, goals: 28, assists: 10 }, imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6de134d478?auto=format&fit=crop&q=80&w=500", description: "Dünyanın en hızlı ve teknik oyuncularından biri." },
  "@Messi": { id: "p4", name: "Lionel Messi", team: "Inter Miami", stats: { matches: 900, goals: 800, assists: 350 }, imageUrl: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&q=80&w=500", description: "Futbol tarihinin en iyi oyuncusu olarak kabul edilir." },
  "@Ronaldo": { id: "p5", name: "Cristiano Ronaldo", team: "Al Nassr", stats: { matches: 950, goals: 850, assists: 200 }, imageUrl: "https://images.unsplash.com/photo-1530234621133-3b8227197f97?auto=format&fit=crop&q=80&w=500", description: "Azmi ve çalışkanlığı ile tanınan gol makinesi." },
};

const injectTags = (text: string): string => {
  const keywords: Record<string, string> = {
    'messi': '@Messi', 'ronaldo': '@Ronaldo', 'mbappe': '@Mbappe', 'icardi': '@Icardi',
  };
  let lower = text.toLowerCase();
  let tagged = text;
  Object.keys(keywords).forEach(k => {
    if(lower.includes(k)) tagged += ` ${keywords[k]}`;
  });
  return tagged;
};

const News: React.FC = () => {
  // Initialize with stored news immediately to prevent layout shift and wait time
  const [news, setNews] = useState<ExtendedNewsItem[]>(() => getStoredNews());
  const [loading, setLoading] = useState(news.length === 0); // Only show loader if cache is empty
  const [selectedCard, setSelectedCard] = useState<PlayerCard | null>(null);
  const [readingNews, setReadingNews] = useState<ExtendedNewsItem | null>(null);
  const processingRef = useRef(false);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const initNews = async () => {
      if (news.length === 0) setLoading(true);
      try {
        // 1. Fetch Real Data in Background
        const feeds = RSS_FEEDS.map(f => f.url);
        const freshData = await fetchRSSData(feeds, 'NEWS');
        
        // 2. Manage Storage (Merge & Cleanup)
        // This logic is fast enough to happen without blocking UI
        const managedList = manageNewsStorage(freshData);
        setNews(managedList);
        setLoading(false);

        // 3. Trigger AI Processing for unprocessed items
        processUnprocessedNews(managedList);
      } catch (e) {
        console.error("News Init Error", e);
        setLoading(false);
      }
    };
    initNews();
  }, []); // Run once

  const processUnprocessedNews = async (items: ExtendedNewsItem[]) => {
    if (processingRef.current) return;
    processingRef.current = true;

    // Reduced batch size to 3 for better performance
    const queue = items.filter(i => !i.isProcessed).slice(0, 3);

    for (const item of queue) {
      const aiResult = await rewriteNewsWithAI(item.title, item.originalContent);
      const taggedContent = injectTags(aiResult.content);

      const updatedItem: ExtendedNewsItem = {
        ...item,
        title: aiResult.title,
        aiContent: taggedContent,
        fullArticle: aiResult.fullArticle,
        isProcessed: true
      };

      // Update State
      setNews(prev => prev.map(n => n.id === item.id ? updatedItem : n));
      updateStoredNewsItem(updatedItem);
      
      // Short delay to yield to main thread
      await new Promise(r => setTimeout(r, 500)); 
    }
    processingRef.current = false;
  };

  const renderContentWithCards = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(@[a-zA-Z0-9çğıöşüÇĞİÖŞÜ]+)/g);
    return parts.map((part, index) => {
      const tagKey = part.trim();
      if (part.startsWith('@')) {
         const key = Object.keys(cardsDB).find(k => k.toLowerCase() === tagKey.toLowerCase());
         if(key) {
            const card = cardsDB[key];
            return (
              <span 
                key={index} 
                className="inline-block mx-1 px-2 py-0.5 bg-blue-600/20 text-blue-300 rounded-md cursor-pointer hover:bg-blue-600/40 hover:scale-105 transition-all font-bold border border-blue-500/30"
                onClick={(e) => { e.stopPropagation(); setSelectedCard(card); }}
              >
                {part}
              </span>
            );
         }
      }
      return part;
    });
  };

  if (loading) return <Loader fullScreen text="Haberler Yükleniyor..." />;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-3 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
            <Newspaper className="text-blue-400" size={36} />
            Spor Manşetleri
          </h2>
          <div className="flex items-center gap-2 mt-3 bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 w-fit">
             <Rss size={14} className="text-blue-400 animate-pulse"/>
             <p className="text-blue-200 text-xs font-medium">
               Bu sayfadaki veriler global RSS kaynaklarından anlık olarak çekilmektedir.
             </p>
          </div>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <article 
            key={item.id} 
            className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 group cursor-pointer border-t border-white/10 hover:border-blue-500/50 hover:-translate-y-2 will-change-transform"
            onClick={() => setReadingNews(item)}
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-[#0f172a]">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                loading="lazy" // Performance optimization
                decoding="async" // Performance optimization
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-80"></div>
              
              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-white border border-white/10 uppercase flex items-center gap-1">
                  <Rss size={10} className="text-orange-400"/> {item.source}
                </span>
              </div>

              {!item.isProcessed && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  <RotateCw className="animate-spin text-blue-400" size={14} />
                  <span className="text-[10px] text-gray-300">AI Özgünleştiriyor...</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 flex-grow flex flex-col relative">
              <div className="text-[10px] text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider font-semibold">
                <Calendar size={12}/>
                <span>{new Date(item.timestamp).toLocaleDateString('tr-TR')}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              <div className="text-gray-400 text-sm leading-relaxed flex-grow mb-6 line-clamp-3">
                {item.isProcessed ? renderContentWithCards(item.aiContent || "") : "İçerik yükleniyor..."}
              </div>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                 <span className="flex items-center gap-2 text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                    Haberi Oku <BookOpen size={16} className="text-blue-500"/>
                 </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Modal - Kept same logic */}
      {readingNews && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 sm:p-4">
           <div className="glass-panel w-full max-w-4xl h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden relative border border-white/10 flex flex-col">
              
              <div className="relative h-64 sm:h-80 flex-shrink-0">
                <img src={readingNews.imageUrl} className="w-full h-full object-cover" alt={readingNews.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>
                
                <button onClick={() => setReadingNews(null)} className="absolute top-4 right-4 z-20 bg-black/40 p-2 rounded-full hover:bg-red-500/80 text-white transition-colors">
                  <X size={24} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600/80 backdrop-blur text-white text-xs px-2 py-1 rounded uppercase font-bold tracking-widest flex items-center gap-1">
                       <Rss size={10} /> {readingNews.source}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                    {readingNews.title}
                  </h2>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar bg-[#0f172a] p-6 sm:p-10">
                <div className="prose prose-lg prose-invert max-w-none prose-headings:text-blue-300">
                   {readingNews.isProcessed ? (
                     <div dangerouslySetInnerHTML={{ __html: readingNews.fullArticle || "" }} />
                   ) : (
                     <p className="text-gray-400 italic">Bu haber şu anda yapay zeka editörü tarafından işleniyor. Lütfen kısa süre sonra tekrar deneyin.</p>
                   )}
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                   <a href={readingNews.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
                     Kaynak Habere Git <ExternalLink size={16} />
                   </a>
                </div>
              </div>

           </div>
        </div>
      )}

      {selectedCard && (
        <PlayerCard3D card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
};

export default News;