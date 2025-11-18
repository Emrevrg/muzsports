export interface NewsItem {
  id: string;
  title: string;
  originalContent: string;
  aiContent?: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  date: string;
  tags: string[]; // e.g., @Messi, @RealMadrid
}

export interface Score {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'FINISHED' | 'UPCOMING';
  time: string;
  league: string;
}

export interface PlayerCard {
  id: string;
  name: string; // e.g., Messi
  team: string;
  stats: {
    matches: number;
    goals: number;
    assists: number;
  };
  imageUrl: string;
  description: string;
}

export interface AdminConfig {
  lastReportDate: string;
  botStatus: 'ACTIVE' | 'PAUSED';
  autoFetchInterval: number;
}
