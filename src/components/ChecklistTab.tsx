import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Sparkles,
  Info,
  Sliders,
  Filter,
  BarChart3,
  Brain,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Play,
  Eye,
  Target,
  DollarSign,
  CheckSquare,
  Calendar
} from 'lucide-react';
import { Trade, UserSettings } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { dataService } from '../services/dataService';

export function isTradeInPeriod(dateStr: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'overall'): boolean {
  if (period === 'overall') return true;
  if (!dateStr) return false;
  
  try {
    const tradeDate = parseISO(dateStr);
    if (isNaN(tradeDate.getTime())) return false;
    
    // Use dynamic current date for logic comparisons
    const now = new Date();
    
    if (period === 'daily') {
      return tradeDate.getFullYear() === now.getFullYear() &&
             tradeDate.getMonth() === now.getMonth() &&
             tradeDate.getDate() === now.getDate();
    }
    
    if (period === 'monthly') {
      return tradeDate.getFullYear() === now.getFullYear() &&
             tradeDate.getMonth() === now.getMonth();
    }
    
    if (period === 'yearly') {
      return tradeDate.getFullYear() === now.getFullYear();
    }
    
    if (period === 'weekly') {
      // Find start of week (Monday)
      const getStartOfWeek = (d: Date) => {
        const copy = new Date(d);
        const day = copy.getDay();
        const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(copy.setDate(diff));
      };
      const nowStart = getStartOfWeek(now);
      const tradeStart = getStartOfWeek(tradeDate);
      
      return nowStart.getFullYear() === tradeStart.getFullYear() &&
             nowStart.getMonth() === tradeStart.getMonth() &&
             nowStart.getDate() === tradeStart.getDate();
    }
  } catch (err) {
    console.error('Error in isTradeInPeriod check:', err);
  }
  return false;
}

interface TradeScreenshotMiniProps {
  path: string;
  user: any;
  onZoom: (url: string) => void;
}

function TradeScreenshotMini({ path, user, onZoom }: TradeScreenshotMiniProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let active = true;
    const resolve = async () => {
      if (!path) {
        setLoading(false);
        return;
      }
      if (user && path.startsWith(user.uid)) {
        try {
          const resolvedUrl = await dataService.getSignedUrl(path);
          if (active) setUrl(resolvedUrl);
        } catch (err) {
          console.error('Failed to resolve screenshot in audit log:', err);
        }
      } else {
        if (active) setUrl(path);
      }
      if (active) setLoading(false);
    };
    resolve();
    return () => {
      active = false;
    };
  }, [path, user]);

  if (loading) {
    return (
      <div className="w-10 h-7 bg-zinc-950 rounded-lg border border-zinc-800 animate-pulse flex items-center justify-center shrink-0">
        <span className="text-[7px] text-zinc-600 font-bold">...</span>
      </div>
    );
  }

  if (!url) return null;

  return (
    <div className="relative group/img overflow-hidden rounded-lg border border-zinc-800 w-10 h-7 shrink-0 bg-zinc-950 shadow-sm">
      <img 
        src={url} 
        alt="Chart" 
        className="w-full h-full object-cover transition-transform duration-200 group-hover/img:scale-115 cursor-pointer" 
        referrerPolicy="no-referrer"
        onClick={() => onZoom(url)}
      />
      <div 
        onClick={() => onZoom(url)}
        className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
      >
        <Eye className="w-2.5 h-2.5 text-white" />
      </div>
    </div>
  );
}

export function getTradeGrade(followedCount: number, totalRules: number): string {
  if (totalRules === 0) return 'A+++'; 
  const r = followedCount / totalRules;
  if (r >= 1.0) return 'A+++';
  if (r >= 0.85) return 'A++';
  if (r >= 0.70) return 'A+';
  if (r >= 0.60) return 'A-';
  if (r >= 0.50) return 'B+';
  if (r >= 0.35) return 'B';
  if (r >= 0.20) return 'C+';
  if (r >= 0.10) return 'C';
  return 'F';
}

export const GRADE_STYLES: Record<string, {
  text: string;
  bg: string;
  border: string;
  glow: string;
  description: string;
  colorHex: string;
}> = {
  'A+++': {
    text: 'text-emerald-400 font-extrabold',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    description: 'Perfect Discipline: Flawless execution of all setup criteria.',
    colorHex: '#34d399'
  },
  'A++': {
    text: 'text-emerald-400 font-bold',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    description: 'Excellent Execution: Followed almost all setup confirmations.',
    colorHex: '#34d399'
  },
  'A+': {
    text: 'text-emerald-500/90 font-medium',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    glow: 'shadow-none',
    description: 'Strong Discipline: Steady compliance with core logic rules.',
    colorHex: '#10b981'
  },
  'A-': {
    text: 'text-teal-400 font-medium',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    glow: 'shadow-none',
    description: 'Good Compliance: Standard trade execution with minor omissions.',
    colorHex: '#2dd4bf'
  },
  'B+': {
    text: 'text-indigo-400 font-medium',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    glow: 'shadow-none',
    description: 'Moderate Compliance: Left out secondary validation rules.',
    colorHex: '#818cf8'
  },
  'B': {
    text: 'text-indigo-400/80',
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/20',
    glow: 'shadow-none',
    description: 'Fair Execution: Missing multiple checklist items prior to entry.',
    colorHex: '#6366f1'
  },
  'C+': {
    text: 'text-amber-400 font-medium',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    glow: 'shadow-none',
    description: 'Low Discipline: Traded on thin setup conditions; watch out for FOMO.',
    colorHex: '#fbbf24'
  },
  'C': {
    text: 'text-amber-400/80',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/15',
    glow: 'shadow-none',
    description: 'Near-Impulsive: Traded on very loose grounds. Risk exceeding limits.',
    colorHex: '#f59e0b'
  },
  'F': {
    text: 'text-rose-400 font-bold',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/35',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    description: 'Disruptive Trading: Zero strategy rules followed. FOMO or emotional revenge trade!',
    colorHex: '#f87171'
  }
};

interface ChecklistTabProps {
  trades: Trade[];
  onUpdateTrade: (id: string, updates: Partial<Trade>) => Promise<void> | void;
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  user: any;
}

export default function ChecklistTab({ 
  trades, 
  onUpdateTrade, 
  settings, 
  onUpdateSettings,
  user
}: ChecklistTabProps) {
  const [newRule, setNewRule] = useState('');
  const [filterGrade, setFilterGrade] = useState<string | null>(null);
  const [searchAsset, setSearchAsset] = useState('');
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const activeRules = useMemo(() => {
    return settings.strategyRules || [];
  }, [settings.strategyRules]);

  // Handle adding new strategy-wide rule
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    const trimmed = newRule.trim();
    if (activeRules.includes(trimmed)) return;

    onUpdateSettings({
      ...settings,
      strategyRules: [...activeRules, trimmed]
    });
    setNewRule('');
  };

  // Handle removing a strategy rule
  const handleRemoveRule = (ruleToRemove: string) => {
    onUpdateSettings({
      ...settings,
      strategyRules: activeRules.filter(r => r !== ruleToRemove)
    });
  };

  // Toggle a rule follow status for a unique trade
  const handleToggleTradeRule = async (trade: Trade, rule: string) => {
    const currentFollowed = trade.followedRules || [];
    let updatedRules: string[];
    if (currentFollowed.includes(rule)) {
      updatedRules = currentFollowed.filter(r => r !== rule);
    } else {
      updatedRules = [...currentFollowed, rule];
    }
    
    await onUpdateTrade(trade.id, { followedRules: updatedRules });
  };

  // Process trades with ratings and scores
  const gradedTrades = useMemo(() => {
    return trades.map(t => {
      const followed = (t.followedRules || []).filter(r => activeRules.includes(r));
      const grade = getTradeGrade(followed.length, activeRules.length);
      return {
        ...t,
        grade,
        followedCount: followed.length,
        style: GRADE_STYLES[grade] || GRADE_STYLES['F']
      };
    });
  }, [trades, activeRules]);

  const targetPeriod = settings.checklistTargetPeriod || 'weekly';
  const targetAmount = settings.checklistTargetAmount !== undefined ? settings.checklistTargetAmount : 1000;
  const targetType = settings.checklistTargetType || 'profit';

  const handleUpdateTargetPeriod = (period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'overall') => {
    onUpdateSettings({
      ...settings,
      checklistTargetPeriod: period
    });
  };

  const handleUpdateTargetType = (type: 'profit' | 'discipline') => {
    onUpdateSettings({
      ...settings,
      checklistTargetType: type,
      checklistTargetAmount: type === 'discipline' ? 10 : 1000
    });
  };

  const handleUpdateTargetAmount = (val: number) => {
    onUpdateSettings({
      ...settings,
      checklistTargetAmount: val
    });
  };

  const targetPeriodTrades = useMemo(() => {
    return gradedTrades.filter(t => {
      const dateStr = t.exitDate || t.entryDate;
      if (!dateStr) return false;
      return isTradeInPeriod(dateStr, targetPeriod);
    });
  }, [gradedTrades, targetPeriod]);

  const periodProfit = useMemo(() => {
    return targetPeriodTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  }, [targetPeriodTrades]);

  const periodCheckmarksFollowed = useMemo(() => {
    return targetPeriodTrades.reduce((sum, t) => sum + (t.followedCount || 0), 0);
  }, [targetPeriodTrades]);

  const currentProgressValue = targetType === 'profit' ? periodProfit : periodCheckmarksFollowed;
  const progressPercent = targetAmount > 0 ? Math.min(100, Math.max(0, (currentProgressValue / targetAmount) * 100)) : 0;

  // Overall Statistics computation
  const stats = useMemo(() => {
    if (gradedTrades.length === 0) {
      return {
        avgCompliance: 0,
        averageGrade: 'N/A',
        perfectTrades: 0,
        ruleComplianceRate: {} as Record<string, number>,
        winRateByGrade: {} as Record<string, { wins: number, losses: number, total: number, wr: number }>,
        gradeCounts: {
          'A+++': 0, 'A++': 0, 'A+': 0, 'A-': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0
        } as Record<string, number>
      };
    }

    let totalFollows = 0;
    let perfectTrades = 0;
    const ruleFollowCounts: Record<string, number> = {};
    activeRules.forEach(r => { ruleFollowCounts[r] = 0; });

    const winRateByGrade: Record<string, { wins: number, losses: number, total: number, wr: number }> = {};
    const gradeCounts = {
      'A+++': 0, 'A++': 0, 'A+': 0, 'A-': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0
    };

    gradedTrades.forEach(t => {
      totalFollows += t.followedCount;
      if (activeRules.length > 0 && t.followedCount === activeRules.length) {
        perfectTrades++;
      }

      // Sum follows per individual rule
      activeRules.forEach(r => {
        if (t.followedRules?.includes(r)) {
          ruleFollowCounts[r]++;
        }
      });

      // Grade distribution counts
      if (t.grade in gradeCounts) {
        gradeCounts[t.grade as keyof typeof gradeCounts]++;
      }

      // Initialize winrate by grade
      if (!winRateByGrade[t.grade]) {
        winRateByGrade[t.grade] = { wins: 0, losses: 0, total: 0, wr: 0 };
      }
      const isWin = t.pnl > 0;
      const isLoss = t.pnl < 0;
      winRateByGrade[t.grade].total++;
      if (isWin) winRateByGrade[t.grade].wins++;
      if (isLoss) winRateByGrade[t.grade].losses++;
    });

    // Calculate final win-rate per grade
    Object.keys(winRateByGrade).forEach(g => {
      const gStats = winRateByGrade[g];
      const validTrades = gStats.wins + gStats.losses;
      gStats.wr = validTrades > 0 ? (gStats.wins / validTrades) * 100 : 0;
    });

    const totalPossibleFollows = gradedTrades.length * activeRules.length;
    const avgCompliance = totalPossibleFollows > 0 ? (totalFollows / totalPossibleFollows) * 100 : 0;
    const averageGrade = activeRules.length > 0 
      ? getTradeGrade(Math.round((avgCompliance / 100) * activeRules.length), activeRules.length) 
      : 'A+++';

    const ruleComplianceRate: Record<string, number> = {};
    activeRules.forEach(r => {
      ruleComplianceRate[r] = gradedTrades.length > 0 ? (ruleFollowCounts[r] / gradedTrades.length) * 100 : 0;
    });

    return {
      avgCompliance,
      averageGrade,
      perfectTrades,
      ruleComplianceRate,
      winRateByGrade,
      gradeCounts
    };
  }, [gradedTrades, activeRules]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    return Object.keys(stats.gradeCounts).map(g => ({
      name: g,
      count: stats.gradeCounts[g],
      fill: GRADE_STYLES[g]?.colorHex || '#9ca3af'
    }));
  }, [stats.gradeCounts]);

  const filteredTrades = useMemo(() => {
    return gradedTrades.filter(t => {
      const matchesSearch = t.asset.toLowerCase().includes(searchAsset.toLowerCase()) || 
                            t.strategy.toLowerCase().includes(searchAsset.toLowerCase());
      const matchesGrade = !filterGrade || t.grade === filterGrade;
      return matchesSearch && matchesGrade;
    });
  }, [gradedTrades, searchAsset, filterGrade]);

  // Discipline Level Description text helper
  const disciplineLevelInfo = useMemo(() => {
    const score = stats.avgCompliance;
    if (score >= 90) return { title: 'Elite Master', desc: 'Sovereign-level execution. Strategy edge is fully realized. Minimize tweaking.', color: 'text-emerald-400' };
    if (score >= 70) return { title: 'Consistent Pro', desc: 'Strong setup validation. Keep weeding out gray area trades.', color: 'text-teal-400' };
    if (score >= 50) return { title: 'Disciplined Draft', desc: 'Moderate system following. Emotional leaks likely present.', color: 'text-indigo-400' };
    if (score >= 30) return { title: 'Rule Bender', desc: 'Entering trades without enough criteria support. Tighten system guidelines.', color: 'text-amber-400' };
    return { title: 'Impulsive gambler', desc: 'Frequent trade departures. Trading blind is high-stakes stress. Redraw strategy rules!', color: 'text-rose-400 font-bold' };
  }, [stats.avgCompliance]);

  return (
    <div id="checklist-rules-panel" className="space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1.5 block">Trade Auditing & Quality Console</span>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Rules & Checklist Follows</h2>
        <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed mt-1">
          Each trade is graded from <code className="text-emerald-400 font-mono font-bold">A+++</code> down to <code className="text-rose-400 font-mono font-bold">F</code>. Review exactly how close you stick to your core entries, where you slip up, and check how discipline directly controls your win rates.
        </p>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Discipline Gauge Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-36 h-36 bg-blue-500/5 blur-[50px] rounded-full" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Compliance Rate</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tighter text-white">
                {stats.avgCompliance.toFixed(1)}%
              </span>
              <span className={cn("text-xs font-black tracking-widest uppercase border px-2 py-0.5 rounded-lg", 
                GRADE_STYLES[stats.averageGrade]?.text,
                GRADE_STYLES[stats.averageGrade]?.bg,
                GRADE_STYLES[stats.averageGrade]?.border
              )}>
                {stats.averageGrade} AVG
              </span>
            </div>

            <div>
              <p className={cn("text-xs font-black uppercase tracking-wider", disciplineLevelInfo.color)}>
                {disciplineLevelInfo.title}
              </p>
              <p className="text-zinc-500 text-[11px] leading-relaxed mt-1">
                {disciplineLevelInfo.desc}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Perfect Trades</span>
            <span className="text-emerald-400 text-xs font-black">
              {stats.perfectTrades} / {gradedTrades.length} ({gradedTrades.length > 0 ? Math.round((stats.perfectTrades / gradedTrades.length) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Grade Frequency distribution chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Grade Distribution</span>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            
            {gradedTrades.length === 0 ? (
              <div className="h-32 flex items-center justify-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">No trading logs yet</span>
              </div>
            ) : (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: '10px', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: '9px' }} axisLine={false} tickLine={false} precision={0} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 6 }} 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
            <span>MOST COMPILED SCORING</span>
            <span className="font-black text-zinc-200">
              {Object.keys(stats.gradeCounts).reduce((a, b) => stats.gradeCounts[a] >= stats.gradeCounts[b] ? a : b)} Grade
            </span>
          </div>
        </div>

        {/* Dynamic Checklist Integrity Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rule Follow Leaderboard</span>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>

            {activeRules.length === 0 ? (
              <p className="text-zinc-500 text-[11px] leading-relaxed italic">No strategy checklist rules configured. Proceed to My Rules sidebar to initialize some.</p>
            ) : (
              <div className="space-y-2.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                {activeRules.map((rule, idx) => {
                  const rate = stats.ruleComplianceRate[rule] || 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-zinc-400 truncate max-w-[170px] uppercase tracking-tight">{rule}</span>
                        <span className={cn(
                          rate >= 80 ? "text-emerald-400" :
                          rate >= 50 ? "text-indigo-400" :
                          rate >= 30 ? "text-amber-400" : "text-rose-400 font-black"
                        )}>{Math.round(rate)}% followed</span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-1">
                        <div 
                          className={cn("h-1 rounded-full",
                            rate >= 80 ? "bg-emerald-500" :
                            rate >= 50 ? "bg-indigo-500" :
                            rate >= 30 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${rate}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
            <span>RULE ENFORCEMENT GAP</span>
            <span className="font-black text-rose-400">
              {activeRules.length > 0 ? (
                activeRules.map(r => ({ name: r, rate: stats.ruleComplianceRate[r] }))
                  .sort((a,b) => a.rate - b.rate)[0]?.name || 'N/A'
              ) : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist Editor + Logs split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Strategy Checklist Manager */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Configure Checklist
            </h3>
            <p className="text-zinc-500 text-[11px] mt-1">
              Add or remove rules that you check before entering every strategy catalog setup. Adding rules re-grades all logs.
            </p>
          </div>

          <form onSubmit={handleAddRule} className="flex gap-2">
            <input 
              type="text" 
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="e.g., Structure Break" 
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Active Checklist Matrix</span>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {activeRules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/40 group hover:border-zinc-750 transition-colors">
                  <span className="text-[11px] text-zinc-300 font-semibold truncate uppercase tracking-tight">{rule}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveRule(rule)}
                    className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {activeRules.length === 0 && (
                <div className="text-center py-4 bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800">
                  <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest pl-2">No rules active</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Target Goal Tracker
              </h3>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                Define a dynamic milestone to conquer. Track targets over daily, weekly, monthly, yearly, or overall periods.
              </p>
            </div>

            {/* Target Type Selector */}
            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850/60">
              <button
                type="button"
                onClick={() => handleUpdateTargetType('profit')}
                className={cn(
                  "py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all",
                  targetType === 'profit' 
                    ? "bg-zinc-900 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Profit Target
              </button>
              <button
                type="button"
                onClick={() => handleUpdateTargetType('discipline')}
                className={cn(
                  "py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all",
                  targetType === 'discipline' 
                    ? "bg-zinc-900 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Rules Checklist
              </button>
            </div>

            {/* Target Period Choices */}
            <div className="space-y-1">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Goal Timeframe</span>
              <div className="grid grid-cols-5 gap-0.5">
                {(['daily', 'weekly', 'monthly', 'yearly', 'overall'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handleUpdateTargetPeriod(period)}
                    className={cn(
                      "py-1 text-[8px] font-extrabold uppercase rounded border text-center transition-all",
                      targetPeriod === period
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                        : "bg-zinc-950/40 border-zinc-850/50 text-zinc-500 hover:text-zinc-400 hover:border-zinc-800"
                    )}
                  >
                    {period.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Amount Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Goal Threshold</span>
                <span className="text-[8px] font-mono text-zinc-500 font-bold uppercase">
                  {targetType === 'profit' ? settings.currency || 'USD' : 'RULES FOLLOWED'}
                </span>
              </div>
              <div className="relative flex items-center bg-zinc-950 border border-zinc-850/80 rounded-xl px-2.5 py-1.5 focus-within:border-zinc-700">
                {targetType === 'profit' ? (
                  <DollarSign className="w-3 h-3 text-zinc-550 mr-1 shrink-0" />
                ) : (
                  <CheckSquare className="w-3 h-3 text-zinc-550 mr-1 shrink-0" />
                )}
                <input 
                  type="number"
                  min="1"
                  value={targetAmount}
                  onChange={(e) => handleUpdateTargetAmount(Number(e.target.value) || 0)}
                  className="w-full bg-transparent border-none text-[11px] text-white outline-none focus:ring-0 p-0 font-bold font-mono"
                  placeholder="Enter target..."
                />
              </div>
            </div>

            {/* Progress Visualization Gauge */}
            <div className="bg-zinc-950/50 rounded-2xl border border-zinc-850/60 p-3 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                  {targetPeriod} Milestone
                </span>
                <span className="font-mono text-[10px] font-black text-indigo-400">
                  {Math.round(progressPercent)}%
                </span>
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-850/30">
                <motion.div 
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    progressPercent >= 100 
                      ? "from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                      : progressPercent >= 60 
                        ? "from-indigo-550 to-purple-400" 
                        : progressPercent >= 30 
                          ? "from-amber-500 to-orange-400" 
                          : "from-rose-500 to-pink-500"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Target progress state details */}
              <div className="flex justify-between items-center text-[10px] font-mono font-bold pt-0.5">
                <div className="text-zinc-350 truncate max-w-[100px]">
                  {targetType === 'profit' 
                    ? formatCurrency(currentProgressValue, settings.currency)
                    : `${currentProgressValue} Rules`
                  }
                </div>
                <div className="text-zinc-600 font-normal shrink-0">
                  / {targetType === 'profit' ? formatCurrency(targetAmount, settings.currency) : `${targetAmount} Rules`}
                </div>
              </div>

              {progressPercent >= 100 && (
                <div className="pt-1 text-center">
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 animate-bounce" /> Target Conquered!
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-2">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Correlation insights</span>
             </div>
             <p className="text-[11px] text-zinc-400 leading-relaxed">
               Compliance is proportional to trading edges. High compliance (Grade A+, A++) holds a stronger win-rate over random impulsive positions.
             </p>
          </div>
        </div>

        {/* Right Side: Displaying and Auditing the journaled trades */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-header">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Trades Compliance Audit Log</h3>
              <p className="text-zinc-500 text-[11px] mt-0.5">Toggle rules directly on each trade card to correct records. Grade metrics will adjust on click.</p>
            </div>

            {/* Controls Filter */}
            <div className="flex gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchAsset}
                  onChange={(e) => setSearchAsset(e.target.value)}
                  placeholder="Filter asset / strategy..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-600 outline-none w-44 focus:border-zinc-700"
                />
              </div>

              {/* Grade selectors */}
              <select
                value={filterGrade || ''}
                onChange={(e) => setFilterGrade(e.target.value || null)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 font-bold"
              >
                <option value="">All Grades</option>
                {Object.keys(GRADE_STYLES).map(g => (
                  <option key={g} value={g}>{g} Grade</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trade Cards list container */}
          <div className="space-y-4">
            {filteredTrades.map((trade) => {
              const dateObj = parseISO(trade.exitDate || trade.entryDate);
              const formattedDate = format(dateObj, 'MMM d, yyyy');
              const isWin = trade.pnl > 0;
              const isWinBadge = isWin 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : trade.pnl < 0 
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                  : "bg-zinc-800 text-zinc-400 border-zinc-700";
              const isEditingRules = editingTradeId === trade.id;

              return (
                <motion.div
                  layout
                  key={trade.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all flex flex-col md:flex-row gap-5 items-stretch relative overflow-hidden group"
                >
                  {/* Left Side: Grade & General Info */}
                  <div className="flex flex-col justify-between items-start shrink-0 w-full md:w-44 border-b md:border-b-0 md:border-r border-zinc-850 pb-4 md:pb-0 md:pr-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black",
                          trade.side === 'Long' ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                        )}>
                          {trade.side === 'Long' ? 'L' : 'S'}
                        </span>
                        <h4 className="text-sm font-black text-white leading-none uppercase tracking-tight">{trade.asset}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{trade.strategy || 'Unspecified Strategy'}</p>
                      <p className="text-[9px] text-zinc-600 font-bold">{formattedDate}</p>
                    </div>

                    <div className="mt-4 flex flex-row md:flex-col gap-2 items-center md:items-start w-full justify-between md:justify-start">
                      {/* Grade display */}
                      <div className={cn(
                        "px-4 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[70px] relative transition-all duration-300",
                        trade.style.bg,
                        trade.style.border,
                        trade.style.glow
                      )} title={trade.style.description}>
                        <span className="text-[8px] text-zinc-500 font-black tracking-widest uppercase mb-0.5">GRADE</span>
                        <span className={cn("text-xl font-black italic tracking-tighter leading-none", trade.style.text)}>
                          {trade.grade}
                        </span>
                      </div>

                      {/* PnL and score indicator */}
                      <div className="md:mt-1">
                        <span className={cn("text-[10px] font-black border px-2.5 py-0.5 rounded-lg inline-block uppercase tracking-wider", isWinBadge)}>
                          {trade.pnl > 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Checklist execution progress and toggling rules */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2 min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest shrink-0">Rule follow rate:</span>
                        <span className="text-zinc-300 text-xs font-black truncate">
                          {trade.followedCount} / {activeRules.length} followed (
                          {activeRules.length > 0 ? Math.round((trade.followedCount / activeRules.length) * 100) : 100}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        { (trade.screenshot || trade.executionImage) && (
                          <TradeScreenshotMini 
                            path={trade.screenshot || trade.executionImage || ''} 
                            user={user} 
                            onZoom={setZoomedImage} 
                          />
                        )}

                        {/* Quick Toggle Rules controller */}
                        <button
                          onClick={() => setEditingTradeId(isEditingRules ? null : trade.id)}
                          className={cn(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all duration-200",
                            isEditingRules 
                              ? "bg-indigo-500 text-white border-indigo-500" 
                              : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-750"
                          )}
                        >
                          {isEditingRules ? 'Done' : 'Audit Checklist'}
                        </button>
                      </div>
                    </div>

                    {/* Description of grade */}
                    {!isEditingRules && (
                      <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-850/50 flex items-start gap-2.5">
                        <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-zinc-400 italic font-mono leading-relaxed truncate max-w-[500px]">
                          {trade.style.description} {trade.notes ? `| Note: "${trade.notes}"` : ''}
                        </p>
                      </div>
                    )}

                    {/* Rule Followers checklist interactive selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {activeRules.map((rule, idx) => {
                        const isFollowed = trade.followedRules?.includes(rule);
                        
                        if (isEditingRules) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleTradeRule(trade, rule)}
                              className={cn(
                                "p-2.5 rounded-xl border text-left text-[11px] font-bold uppercase tracking-tight flex items-center justify-between transition-all duration-200 shadow-inner",
                                isFollowed 
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                  : "bg-zinc-950 border-zinc-850 text-zinc-600 hover:border-zinc-750 hover:text-zinc-500"
                              )}
                            >
                              <span className="truncate max-w-[130px]">{rule}</span>
                              {isFollowed ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Minus className="w-3 h-3 text-zinc-700" />
                              )}
                            </button>
                          );
                        } else {
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "p-2.5 rounded-xl border text-left text-[11px] font-bold uppercase tracking-tight flex items-center gap-2 select-none truncate",
                                isFollowed 
                                  ? "bg-zinc-950/80 border-emerald-500/20 text-zinc-300" 
                                  : "bg-zinc-950/30 border-zinc-900 text-zinc-650 opacity-55"
                              )}
                            >
                              {isFollowed ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                              )}
                              <span className="truncate">{rule}</span>
                            </div>
                          );
                        }
                      })}
                      {activeRules.length === 0 && (
                        <div className="col-span-full py-4 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                          <p className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest">
                            No strategy rules active. Add rules on the Left panel config.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredTrades.length === 0 && (
              <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                <AlertTriangle className="w-8 h-8 text-indigo-400/70 mx-auto mb-3" />
                <h4 className="text-white font-black uppercase tracking-wider text-sm mb-1">No Graded Logs Found</h4>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Adjust your search parameters, grade filter, or proceed to the Market Journal to log trades and grade them.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Overlay Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={zoomedImage} 
                alt="Full Trade Chart Screenshot" 
                className="max-w-full max-h-[85vh] object-contain block mx-auto"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors border border-zinc-805 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
