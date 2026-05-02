export type MarketType = 'Forex' | 'Crypto' | 'Stocks' | 'Futures';
export type Side = 'Long' | 'Short';
export type EmotionalState = 'Neutral' | 'Angry' | 'Sad' | 'Anxious' | 'Disappointed' | 'Excited' | 'Calm' | 'Greedy' | 'Fearful';
export type NewsImpact = 'Red' | 'Orange' | 'Yellow' | 'None';
export type TradeStatus = 'Win' | 'Loss' | 'Break Even';
export type ExitStatus = 'Closed Manually' | 'BRE' | 'Closed by S/L' | 'Closed by T/P';

export interface Trade {
  id: string;
  asset: string;
  marketType: MarketType;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  side: Side;
  entryDate: string;
  exitDate: string;
  strategy: string;
  notes: string;
  emotionalState: EmotionalState;
  confidence: number; // 1-10
  newsImpact: NewsImpact;
  followedRules: string[];
  mistakeTags: string[];
  pnl: number;
  pnlPercentage: number;
  riskReward: number;
  targetRR: number;
  exitStatus: ExitStatus;
  screenshot?: string;
  executionComments?: string;
  executionImage?: string;
}

export interface UserSettings {
  profileName: string;
  currency: string;
  startingBalance: number;
  riskPerTrade: number;
  strategyRules: string[];
  theme: 'night' | 'light';
  hidePnL: boolean;
}

export interface Account {
  id: string;
  name: string;
  settings: UserSettings;
  trades: Trade[];
}

export interface DashboardStats {
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalTrades: number;
  winCount: number;
  lossCount: number;
}
