import React, { useState } from 'react';
import { 
  BarChart as BarChartIcon, 
  Settings, 
  Database, 
  Bot, 
  FileText, 
  RefreshCw,
  Trash2,
  Plus
} from 'lucide-react';
import { generateBotReport } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockStats = [
  { name: 'Pzt', visit: 4000 },
  { name: 'Sal', visit: 3000 },
  { name: 'Çar', visit: 2000 },
  { name: 'Per', visit: 2780 },
  { name: 'Cum', visit: 1890 },
  { name: 'Cmt', visit: 2390 },
  { name: 'Paz', visit: 3490 },
];

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bots' | 'hashtags' | 'settings'>('dashboard');
  const [botStatus, setBotStatus] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Mock Card Management State
  const [cards, setCards] = useState([
    { tag: '@Icardi', name: 'Mauro Icardi' },
    { tag: '@Mbappe', name: 'Kylian Mbappé' }
  ]);
  const [newTag, setNewTag] = useState('');

  const downloadReport = async () => {
    setGeneratingReport(true);
    const aiSummary = await generateBotReport(mockStats);
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("MuzSports - 2 Aylik Durum Raporu", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Tarih: ${new Date().toLocaleDateString()}`, 20, 30);
    
    doc.setFontSize(14);
    doc.text("1. Yapay Zeka Ozet Analizi", 20, 45);
    doc.setFontSize(10);
    
    // Split text to fit page
    const splitText = doc.splitTextToSize(aiSummary, 170);
    doc.text(splitText, 20, 55);
    
    doc.save("muzsports-rapor.pdf");
    setGeneratingReport(false);
  };

  const addCard = () => {
    if(newTag) {
      setCards([...cards, { tag: newTag, name: 'Yeni Kart' }]);
      setNewTag('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Sidebar */}
      <div className="w-full md:w-64 glass-panel rounded-xl p-4 flex flex-col gap-2 h-fit">
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}>
          <BarChartIcon size={20} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('bots')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bots' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}>
          <Bot size={20} /> Botlar & Otomasyon
        </button>
        <button onClick={() => setActiveTab('hashtags')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hashtags' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}>
          <Database size={20} /> Kartlar / Hashtags
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}>
          <Settings size={20} /> Ayarlar
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 glass-panel rounded-xl p-6 min-h-[500px]">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Site İstatistikleri & Analiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Toplam Ziyaret</div>
                <div className="text-2xl font-bold text-blue-400">124,592</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">AI İşlenen Haber</div>
                <div className="text-2xl font-bold text-purple-400">1,204</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Bot Durumu</div>
                <div className={`text-xl font-bold ${botStatus ? 'text-green-400' : 'text-red-400'}`}>
                  {botStatus ? 'Aktif' : 'Pasif'}
                </div>
              </div>
            </div>

            <div className="h-64 w-full bg-white/5 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#374151', color: '#fff' }}
                  />
                  <Bar dataKey="visit" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={downloadReport}
                disabled={generatingReport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingReport ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
                {generatingReport ? "PDF Hazırlanıyor..." : "Durum Raporu İndir (PDF)"}
              </button>
              <p className="text-xs text-gray-500 mt-2">* Her iki ayda bir otomatik rapor oluşturulur.</p>
            </div>
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Bot Yönetimi</h2>
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
               <div>
                 <h3 className="font-bold">RSS Haber Botu</h3>
                 <p className="text-sm text-gray-400">Otomatik veri çekme ve AI işleme</p>
               </div>
               <button 
                onClick={() => setBotStatus(!botStatus)}
                className={`px-4 py-2 rounded-lg font-bold ${botStatus ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
               >
                 {botStatus ? 'Çalışıyor' : 'Durduruldu'}
               </button>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg font-mono text-xs text-green-400 h-64 overflow-y-auto">
              <p>{`[${new Date().toLocaleTimeString()}] Bot initialized.`}</p>
              <p>{`[${new Date().toLocaleTimeString()}] Connected to Gemini API.`}</p>
              <p>{`[${new Date().toLocaleTimeString()}] Fetching RSS from FOX Sports... Success.`}</p>
              <p>{`[${new Date().toLocaleTimeString()}] AI rewriting article ID: 4921... Done.`}</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold mb-4">Oyuncu/Takım Kartları (@Hashtags)</h2>
             <div className="flex gap-2 mb-6">
               <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="@Messi veya @Takım"
                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
               />
               <button onClick={addCard} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                 <Plus size={20} />
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {cards.map((card, idx) => (
                 <div key={idx} className="bg-white/5 p-4 rounded-lg flex justify-between items-center group">
                   <div>
                     <div className="text-blue-400 font-bold">{card.tag}</div>
                     <div className="text-sm text-gray-400">{card.name}</div>
                   </div>
                   <button className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
             </div>
           </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center text-gray-400 py-20">
            Ayarlar yapılandırması geliştirme aşamasında.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;