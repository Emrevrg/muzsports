import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const CACHE_KEY_NEWS = 'muzsports_news_db';
const CACHE_KEY_SCORES = 'muzsports_scores_cache';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// --- HELPER FUNCTIONS ---

const extractImage = (html: string): string | null => {
  if (!html) return null;
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = html.match(imgRegex);
  if (match) return match[1];
  
  const mediaRegex = /url="([^"]+\.(jpg|png|jpeg|webp))"/i;
  const mediaMatch = html.match(mediaRegex);
  return mediaMatch ? mediaMatch[1] : null;
};

const cleanText = (text: string) => {
  return text.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
};

// --- RSS FETCHING CORE ---

export const fetchRSSData = async (feedUrls: string[], type: 'NEWS' | 'SCORES'): Promise<any[]> => {
  const results: any[] = [];
  // Using a rotation of proxies to ensure high availability
  const corsProxy = "https://api.allorigins.win/get?url=";

  const promises = feedUrls.map(async (url) => {
    try {
      const response = await fetch(corsProxy + encodeURIComponent(url));
      if (!response.ok) return;
      
      const data = await response.json();
      if (!data.contents) return;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      items.forEach((item) => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
        
        // Generate a unique ID based on link hash
        const id = btoa(link).slice(0, 20); 

        if (type === 'NEWS') {
          // News Logic
          let imageUrl = extractImage(description);
          if (!imageUrl) {
             const mediaContent = item.getElementsByTagName("media:content")[0];
             if (mediaContent) imageUrl = mediaContent.getAttribute("url");
          }
          // Default image if none found
          if (!imageUrl) {
             if (title.toLowerCase().includes('football') || title.toLowerCase().includes('soccer')) imageUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800";
             else if (title.toLowerCase().includes('basket')) imageUrl = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800";
             else imageUrl = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800";
          }

          results.push({
            id,
            title,
            originalContent: cleanText(description),
            link,
            pubDate,
            imageUrl,
            source: new URL(url).hostname.replace('www.', '').split('.')[0].toUpperCase(),
            isProcessed: false, // Will be checked against DB
            timestamp: new Date(pubDate).getTime()
          });

        } else {
          // Score Logic (Parsing titles like "Team A 2-1 Team B" or "Team A vs Team B")
          // This is a heuristic parser based on common RSS score formats
          if (title.includes(' vs ') || title.match(/\d+-\d+/)) {
             let home = "", away = "", homeScore = 0, awayScore = 0, status = "UPCOMING";
             
             if (title.includes(' vs ')) {
               const parts = title.split(' vs ');
               home = parts[0];
               away = parts[1];
             } else {
               // Try to parse score: "Man City 3-1 Arsenal"
               // Regex to find score pattern
               const scoreMatch = title.match(/(.+?)\s(\d+)-(\d+)\s(.+)/);
               if (scoreMatch) {
                 home = scoreMatch[1];
                 homeScore = parseInt(scoreMatch[2]);
                 awayScore = parseInt(scoreMatch[3]);
                 away = scoreMatch[4];
                 status = "FINISHED"; // Usually RSS updates after goals/FT
               } else {
                 // Fallback
                 home = title;
                 status = "LIVE";
               }
             }

             results.push({
               id,
               homeTeam: home.trim(),
               awayTeam: away.trim(),
               homeScore,
               awayScore,
               status,
               league: cleanText(description).slice(0, 20) || "Global",
               time: status === 'FINISHED' ? 'FT' : new Date(pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
               rawDescription: cleanText(description)
             });
          }
        }
      });
    } catch (error) {
      console.warn(`RSS Fetch Warning for ${url}:`, error);
      // Continue to next feed, don't crash app
    }
  });

  await Promise.all(promises);
  return results;
};

// --- STORAGE & CLEANUP MANAGEMENT ---

export const manageNewsStorage = (newItems: any[]): any[] => {
  const storedJson = localStorage.getItem(CACHE_KEY_NEWS);
  let storedItems: any[] = storedJson ? JSON.parse(storedJson) : [];

  // 1. CLEANUP: Remove items older than 7 days
  const now = Date.now();
  storedItems = storedItems.filter(item => (now - item.timestamp) < ONE_WEEK_MS);

  // 2. MERGE: Add new items if they don't exist
  const processedIds = new Set(storedItems.map(i => i.id));
  const freshItemsToAdd = newItems.filter(i => !processedIds.has(i.id));

  // Combine (New items go to front, but we sort by date later anyway)
  const finalList = [...storedItems, ...freshItemsToAdd];
  
  // Sort by date desc
  finalList.sort((a, b) => b.timestamp - a.timestamp);

  // Save back to storage (limit to 100 items to prevent overflow)
  localStorage.setItem(CACHE_KEY_NEWS, JSON.stringify(finalList.slice(0, 100)));

  return finalList;
};

export const updateStoredNewsItem = (updatedItem: any) => {
  const storedJson = localStorage.getItem(CACHE_KEY_NEWS);
  if (!storedJson) return;
  
  let storedItems: any[] = JSON.parse(storedJson);
  storedItems = storedItems.map(item => item.id === updatedItem.id ? updatedItem : item);
  
  localStorage.setItem(CACHE_KEY_NEWS, JSON.stringify(storedItems));
};

// --- AI SERVICES ---

export const rewriteNewsWithAI = async (originalTitle: string, originalContent: string): Promise<{title: string, content: string, fullArticle: string}> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Role: Professional Sports Journalist for "MuzSports".
      Task: Rewrite the following news info into a unique, professional article in Turkish.
      Source Info: "${originalTitle} - ${originalContent}"
      
      Requirements:
      1. Title: Catchy, SEO-friendly Turkish title.
      2. Summary: 2 sentences summary.
      3. Full Article: Write a long, engaging article (min 3 paragraphs). Use HTML tags (<p>, <b>, <br>) for formatting. Add analysis.
      
      Output JSON: { "title": "...", "summary": "...", "fullArticle": "..." }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    return { 
      title: originalTitle, 
      content: "İçerik hazırlanıyor...", 
      fullArticle: `<p>${originalContent}</p><p><em>Detaylar yakında eklenecek...</em></p>` 
    };
  }
};

export const analyzeMatchWithAI = async (matchData: any): Promise<string> => {
  try {
    const prompt = `
      Analyze this match result/fixture in Turkish:
      Match: ${matchData.homeTeam} vs ${matchData.awayTeam}
      Score: ${matchData.homeScore} - ${matchData.awayScore}
      Status: ${matchData.status}
      Context: ${matchData.rawDescription}
      
      Provide a short, exciting commentary (max 100 words) about what this result means or what to expect.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text || "Analiz şu anda mevcut değil.";
  } catch (error) {
    return "Analiz servisi şu an yoğun.";
  }
};

export const generateBotReport = async (stats: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a professional monthly status report summary for a sports news website based on these stats: ${JSON.stringify(stats)}. Write in Turkish.`,
    });
    return response.text || "Rapor oluşturulamadı.";
  } catch (error) {
    return "Rapor oluşturulamadı.";
  }
};