import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Coins, 
  Compass, 
  Plus, 
  Trash2, 
  DollarSign, 
  Scale, 
  Lightbulb, 
  Flame, 
  Activity, 
  BookOpen, 
  ListTodo, 
  RotateCcw,
  Percent,
  ChevronRight,
  TrendingDown,
  Info,
  Edit3,
  Check
} from 'lucide-react';
import { Trade, Account } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface InvestorPlanTabProps {
  currentAccountId: string;
  accounts: Account[];
  trades: Trade[];
  startingBalance: number;
  currency: string;
}

export interface ScalingTier {
  id: string;
  tierName: string;
  startBalance: number;
  targetBalance: number;
  riskPercent: number;
  maxLeverage: number;
  rulesUnlocked: string;
}

// Interfaces for our plan schema
interface TradingPlanSchema {
  planNotes: string;
  assurances: string[];
  applicableAssets: string[];
  recollectionZone: string[];
  fomoZone: string[];
  walletCash: number;
  externalInvestments: Array<{ id: string; name: string; value: number; type: string }>;
  allocations: {
    crypto: number;
    stocks: number;
    forex: number;
    cash: number;
    other: number;
  };
  scalingPlan?: ScalingTier[];
}

const getDefaultPlan = (startingVal: number): TradingPlanSchema => {
  const base = startingVal || 10000;
  return {
    planNotes: "This trading plan rules my overall strategic execution. My goal is consistency over fast scaling, maintaining high discipline ratings on my checklist rules.",
    assurances: [
      "I will never adjust, widen, or delete my stop-loss during an active trade.",
      "I will only enter markets when minimum 3 Checklist Rules are green.",
      "I accept every loss as a cost of business, not a personal failure.",
      "If I lose 2 consecutive trades in one session, the computer stays shut."
    ],
    applicableAssets: ["BTC", "ETH", "EURUSD", "GOLD", "AAPL", "NVDA"],
    recollectionZone: [
      "Review pre-market economic schedule before first entry (avoids red folder slippage).",
      "Keep trade size constant relative to risk levels. No oversized revenge sizing.",
      "Most profitable trades was when structure breaking was heavily validated on higher timeframes."
    ],
    fomoZone: [
      "Trigger: Massive green candle without my volume checks. Mitigation: Wait for retest or skip entirely.",
      "Trigger: Chat room alerts on a hot coin. Mitigation: Verify independently or add to watch-only for the day.",
      "Trigger: Impulsive desire to win back losses after SL. Mitigation: Take a 15-minute screen walkout."
    ],
    walletCash: Math.round(base * 0.25) || 2500,
    externalInvestments: [
      { id: '1', name: 'Real Estate Fund', value: Math.round(base * 0.8) || 8500, type: 'Other' },
      { id: '2', name: 'Index Funds Allocation', value: Math.round(base * 1.2) || 12000, type: 'Stocks' },
      { id: '3', name: 'Hardware Cold Wallet', value: Math.round(base * 0.4) || 4200, type: 'Crypto' }
    ],
    allocations: {
      stocks: 40,
      crypto: 25,
      forex: 15,
      cash: 10,
      other: 10
    }
  };
};

const getDefaultScalingTiers = (startingVal: number): ScalingTier[] => {
  const base = startingVal || 10000;
  return [
    { id: 't1', tierName: 'Tier 1: Consistency Focus', startBalance: 0, targetBalance: Math.round(base * 1.2), riskPercent: 1.0, maxLeverage: 5, rulesUnlocked: 'Trade only 1 select A+ setup per day. Perfect checklist adherence.' },
    { id: 't2', tierName: 'Tier 2: Managed Aggression', startBalance: Math.round(base * 1.2), targetBalance: Math.round(base * 1.8), riskPercent: 1.5, maxLeverage: 10, rulesUnlocked: 'May enter secondary correlated assets. Sizing climbs incrementally.' },
    { id: 't3', tierName: 'Tier 3: Full Playbook Scale', startBalance: Math.round(base * 1.8), targetBalance: Math.round(base * 3.5), riskPercent: 2.0, maxLeverage: 20, rulesUnlocked: 'Unrestricted setup portfolio. Multi-position entries and scaling allowed.' }
  ];
};

export default function InvestorPlanTab({
  currentAccountId,
  accounts,
  trades,
  startingBalance,
  currency = 'USD'
}: InvestorPlanTabProps) {
  
  // Account level LocalStorage persistence key
  const storageKey = useMemo(() => `zync_investor_plan_${currentAccountId}`, [currentAccountId]);

  // Load from LocalStorage
  const [planData, setPlanData] = useState<TradingPlanSchema>(() => {
    let parsed: TradingPlanSchema;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        parsed = JSON.parse(stored);
      } else {
        parsed = getDefaultPlan(startingBalance);
      }
    } catch (e) {
      console.error("Failed to parse trading plan data", e);
      parsed = getDefaultPlan(startingBalance);
    }
    if (!parsed.scalingPlan || parsed.scalingPlan.length === 0) {
      parsed.scalingPlan = getDefaultScalingTiers(startingBalance);
    }
    return parsed;
  });

  // Keep state updated when current account switches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`zync_investor_plan_${currentAccountId}`);
      let parsed: TradingPlanSchema;
      if (stored) {
        parsed = JSON.parse(stored);
      } else {
        parsed = getDefaultPlan(startingBalance);
      }
      if (!parsed.scalingPlan || parsed.scalingPlan.length === 0) {
        parsed.scalingPlan = getDefaultScalingTiers(startingBalance);
      }
      setPlanData(parsed);
    } catch (e) {
       console.error("Failed to load trading plan on account switch", e);
    }
  }, [currentAccountId, startingBalance]);

  // Persist plan changes
  const savePlan = (updatedPlan: TradingPlanSchema) => {
    setPlanData(updatedPlan);
    localStorage.setItem(storageKey, JSON.stringify(updatedPlan));
  };

  // State managers for fast inline additions
  const [assuranceInput, setAssuranceInput] = useState('');
  const [assetInput, setAssetInput] = useState('');
  const [recollectionInput, setRecollectionInput] = useState('');
  const [fomoInput, setFomoInput] = useState('');

  // Spliced state managers for inline editing of existing items
  const [editingAssuranceIdx, setEditingAssuranceIdx] = useState<number | null>(null);
  const [editingAssuranceVal, setEditingAssuranceVal] = useState('');

  const [editingFomoIdx, setEditingFomoIdx] = useState<number | null>(null);
  const [editingFomoVal, setEditingFomoVal] = useState('');

  const [editingRecollectionIdx, setEditingRecollectionIdx] = useState<number | null>(null);
  const [editingRecollectionVal, setEditingRecollectionVal] = useState('');

  const [editingExternalId, setEditingExternalId] = useState<string | null>(null);
  const [editingExternalName, setEditingExternalName] = useState('');
  const [editingExternalValue, setEditingExternalValue] = useState(1000);
  const [editingExternalType, setEditingExternalType] = useState('Stocks');

  // States for setting customizable scaling plan tiers
  const [newTierName, setNewTierName] = useState('');
  const [newTierStart, setNewTierStart] = useState(0);
  const [newTierTarget, setNewTierTarget] = useState(Math.round(startingBalance * 1.5) || 15000);
  const [newTierRisk, setNewTierRisk] = useState(1.5);
  const [newTierLeverage, setNewTierLeverage] = useState(10);
  const [newTierRules, setNewTierRules] = useState('');
  const [selectedTierIdForEdit, setSelectedTierIdForEdit] = useState<string | null>(null);
  
  // Wallet / Accounts managers
  const [invName, setInvName] = useState('');
  const [invValue, setInvValue] = useState(1000);
  const [invType, setInvType] = useState('Stocks');

  // Interactive Calculator State
  const [activeCalculator, setActiveCalculator] = useState<'compound' | 'position' | 'dcf' | 'rebalancer'>('compound');
  
  // Compound Calc inputs
  const [capitalInput, setCapitalInput] = useState(startingBalance || 10000);
  const [monthlyReturn, setMonthlyReturn] = useState(5);
  const [durYears, setDurYears] = useState(3);
  
  // Position Calc inputs
  const [riskPercent, setRiskPercent] = useState(1); // 1%
  const [stopDistance, setStopDistance] = useState(2); // 2% stop-loss
  const [leverageCap, setLeverageCap] = useState(10); // 10x
  
  // DCF Calc inputs
  const [earnings, setEarnings] = useState(500);
  const [growthRate, setGrowthRate] = useState(15); // 15% growth
  const [discountRate, setDiscountRate] = useState(10); // 10%
  const [terminalMultiple, setTerminalMultiple] = useState(15); // 15x

  // Compute calculated portfolio stats
  const journalBalanceSum = useMemo(() => {
    const pnlSum = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return startingBalance + pnlSum;
  }, [startingBalance, trades]);

  const totalPortfolioValue = useMemo(() => {
    const extSum = planData.externalInvestments.reduce((sum, item) => sum + item.value, 0);
    return journalBalanceSum + planData.walletCash + extSum;
  }, [journalBalanceSum, planData.walletCash, planData.externalInvestments]);

  // Interactive Allocations calculated relative to portfolio values
  const relativeAllocations = useMemo(() => {
    // Collect active currency values classified by asset types
    let stocksVal = 0;
    let cryptoVal = 0;
    let forexVal = 0;
    let cashVal = planData.walletCash + journalBalanceSum; // Active journal balance represents ready tradable cash/capital pool
    let otherVal = 0;

    // Distribute investments
    planData.externalInvestments.forEach(item => {
      if (item.type === 'Stocks') stocksVal += item.value;
      else if (item.type === 'Crypto') cryptoVal += item.value;
      else if (item.type === 'Forex') forexVal += item.value;
      else if (item.type === 'Cash') cashVal += item.value;
      else otherVal += item.value;
    });

    const total = stocksVal + cryptoVal + forexVal + cashVal + otherVal;
    if (total === 0) {
      return [
        { name: 'Stocks', value: 0, percent: 0 },
        { name: 'Crypto', value: 0, percent: 0 },
        { name: 'Forex', value: 0, percent: 0 },
        { name: 'Cash', value: 0, percent: 0 },
        { name: 'Other', value: 0, percent: 0 }
      ];
    }

    return [
      { name: 'Stocks', value: stocksVal, percent: (stocksVal / total) * 100, color: '#3b82f6' },
      { name: 'Crypto', value: cryptoVal, percent: (cryptoVal / total) * 100, color: '#f59e0b' },
      { name: 'Forex', value: forexVal, percent: (forexVal / total) * 100, color: '#10b981' },
      { name: 'Cash', value: cashVal, percent: (cashVal / total) * 100, color: '#6366f1' },
      { name: 'Other', value: otherVal, percent: (otherVal / total) * 100, color: '#8b5cf6' }
    ];
  }, [planData.walletCash, journalBalanceSum, planData.externalInvestments]);

  // Dynamic Insights calculated from real user journals (the trades prop!)
  const journaledAssets = useMemo(() => {
    const counts: Record<string, { count: number; wins: number; losses: number; pnl: number }> = {};
    if (trades && Array.isArray(trades)) {
      trades.forEach(t => {
        if (!t.asset) return;
        const sym = t.asset.toUpperCase().trim();
        if (!counts[sym]) {
          counts[sym] = { count: 0, wins: 0, losses: 0, pnl: 0 };
        }
        counts[sym].count += 1;
        counts[sym].pnl += (t.pnl || 0);
        if ((t.pnl || 0) > 0) {
          counts[sym].wins += 1;
        } else if ((t.pnl || 0) < 0) {
          counts[sym].losses += 1;
        }
      });
    }

    return Object.entries(counts).map(([asset, data]) => ({
      asset,
      count: data.count,
      pnl: data.pnl,
      winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
      wins: data.wins,
      losses: data.losses
    })).sort((a, b) => b.pnl - a.pnl); // sort by highest profitability
  }, [trades]);

  const activeTiers = useMemo(() => planData.scalingPlan || [], [planData.scalingPlan]);

  // Compute active scaling tier based on total portfolio value
  const activeScalingTier = useMemo(() => {
    if (activeTiers.length === 0) return null;
    
    // Find tier where total portfolio balance sits
    const sittingTier = activeTiers.find(tier => 
      totalPortfolioValue >= tier.startBalance && totalPortfolioValue < tier.targetBalance
    );

    if (sittingTier) return sittingTier;

    // Fallbacks: if balance is higher than any target, return the last one
    if (totalPortfolioValue >= activeTiers[activeTiers.length - 1].targetBalance) {
      return activeTiers[activeTiers.length - 1];
    }

    // Default to the first one
    return activeTiers[0];
  }, [activeTiers, totalPortfolioValue]);

  // Handle scaling tiers addition / modifications
  const handleAddScalingTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierName.trim()) return;
    
    const newTier: ScalingTier = {
      id: Math.random().toString(36).substring(7),
      tierName: newTierName.trim(),
      startBalance: newTierStart,
      targetBalance: newTierTarget,
      riskPercent: newTierRisk,
      maxLeverage: newTierLeverage,
      rulesUnlocked: newTierRules.trim() || 'Focus on main setup rules.'
    };
    
    savePlan({
      ...planData,
      scalingPlan: [...activeTiers, newTier].sort((a, b) => a.startBalance - b.startBalance)
    });

    setNewTierName('');
    setNewTierStart(0);
    setNewTierTarget(Math.round(startingBalance * 1.5) || 15000);
    setNewTierRisk(1.5);
    setNewTierLeverage(10);
    setNewTierRules('');
  };

  const handleUpdateScalingTier = (id: string, updatedFields: Partial<ScalingTier>) => {
    const updatedTiers = activeTiers.map(tier => {
      if (tier.id === id) {
        return { ...tier, ...updatedFields };
      }
      return tier;
    }).sort((a, b) => a.startBalance - b.startBalance);

    savePlan({
      ...planData,
      scalingPlan: updatedTiers
    });
  };

  const handleRemoveScalingTier = (id: string) => {
    savePlan({
      ...planData,
      scalingPlan: activeTiers.filter(t => t.id !== id)
    });
  };

  // Handle addition utilities
  const handleAddAssurance = () => {
    if (!assuranceInput.trim()) return;
    savePlan({
      ...planData,
      assurances: [...planData.assurances, assuranceInput.trim()]
    });
    setAssuranceInput('');
  };

  const handleRemoveAssurance = (index: number) => {
    savePlan({
      ...planData,
      assurances: planData.assurances.filter((_, idx) => idx !== index)
    });
  };

  const handleAddAsset = () => {
    if (!assetInput.trim()) return;
    const cleanAsset = assetInput.trim().toUpperCase();
    if (planData.applicableAssets.includes(cleanAsset)) return;
    savePlan({
      ...planData,
      applicableAssets: [...planData.applicableAssets, cleanAsset]
    });
    setAssetInput('');
  };

  const handleRemoveAsset = (asset: string) => {
    savePlan({
      ...planData,
      applicableAssets: planData.applicableAssets.filter(a => a !== asset)
    });
  };

  const handleAddRecollection = () => {
    if (!recollectionInput.trim()) return;
    savePlan({
      ...planData,
      recollectionZone: [...planData.recollectionZone, recollectionInput.trim()]
    });
    setRecollectionInput('');
  };

  const handleRemoveRecollection = (index: number) => {
    savePlan({
      ...planData,
      recollectionZone: planData.recollectionZone.filter((_, idx) => idx !== index)
    });
  };

  const handleAddFomoRule = () => {
    if (!fomoInput.trim()) return;
    savePlan({
      ...planData,
      fomoZone: [...planData.fomoZone, fomoInput.trim()]
    });
    setFomoInput('');
  };

  const handleRemoveFomoRule = (index: number) => {
    savePlan({
      ...planData,
      fomoZone: planData.fomoZone.filter((_, idx) => idx !== index)
    });
  };

  const handleUpdateAssurance = (index: number) => {
    if (!editingAssuranceVal.trim()) return;
    const updated = [...planData.assurances];
    updated[index] = editingAssuranceVal.trim();
    savePlan({
      ...planData,
      assurances: updated
    });
    setEditingAssuranceIdx(null);
    setEditingAssuranceVal('');
  };

  const handleUpdateFomoRule = (index: number) => {
    if (!editingFomoVal.trim()) return;
    const updated = [...planData.fomoZone];
    updated[index] = editingFomoVal.trim();
    savePlan({
      ...planData,
      fomoZone: updated
    });
    setEditingFomoIdx(null);
    setEditingFomoVal('');
  };

  const handleUpdateRecollection = (index: number) => {
    if (!editingRecollectionVal.trim()) return;
    const updated = [...planData.recollectionZone];
    updated[index] = editingRecollectionVal.trim();
    savePlan({
      ...planData,
      recollectionZone: updated
    });
    setEditingRecollectionIdx(null);
    setEditingRecollectionVal('');
  };

  const handleUpdateExternalInvestment = (id: string) => {
    if (!editingExternalName.trim() || editingExternalValue <= 0) return;
    const updated = planData.externalInvestments.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: editingExternalName.trim(),
          value: editingExternalValue,
          type: editingExternalType
        };
      }
      return item;
    });
    savePlan({
      ...planData,
      externalInvestments: updated
    });
    setEditingExternalId(null);
    setEditingExternalName('');
    setEditingExternalValue(1000);
  };

  const handleAddExternalInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || invValue <= 0) return;
    const newItem = {
      id: Math.random().toString(36).substring(7),
      name: invName.trim(),
      value: invValue,
      type: invType
    };
    savePlan({
      ...planData,
      externalInvestments: [...planData.externalInvestments, newItem]
    });
    setInvName('');
    setInvValue(1000);
  };

  const handleRemoveExternalInvestment = (id: string) => {
    savePlan({
      ...planData,
      externalInvestments: planData.externalInvestments.filter(item => item.id !== id)
    });
  };

  const handleUpdateWalletCash = (val: number) => {
    savePlan({
      ...planData,
      walletCash: val
    });
  };

  const handleUpdateTargetAllocations = (asset: keyof typeof planData.allocations, val: number) => {
    const updatedAllocations = { ...planData.allocations, [asset]: val };
    savePlan({
      ...planData,
      allocations: updatedAllocations
    });
  };

  // Safe analysis of real trade history to populate compounding presets
  const journalMetrics = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        winRate: 0,
        averageWinPct: 0,
        averageLossPct: 0,
        estimatedROI: 4.5, // optimal default conservative target
        totalTrades: 0
      };
    }
    const wins = trades.filter(t => (t.pnl || 0) > 0);
    const losses = trades.filter(t => (t.pnl || 0) < 0);
    
    const winRate = Math.round((wins.length / trades.length) * 100);
    
    const averageWinPct = wins.length > 0 
      ? (wins.reduce((sum, t) => sum + (t.pnlPercentage || 1.8), 0) / wins.length) 
      : 1.8;
      
    const averageLossPct = losses.length > 0 
      ? (losses.reduce((sum, t) => sum + (t.pnlPercentage || -1.2), 0) / losses.length) 
      : -1.2;

    const ev = ((winRate / 100) * averageWinPct) + ((1 - winRate / 100) * averageLossPct);
    const estimatedROI = Math.round(Math.max(1.5, Math.min(25.0, ev * 10)) * 10) / 10;

    return {
      winRate,
      averageWinPct: Math.round(averageWinPct * 10) / 10,
      averageLossPct: Math.round(averageLossPct * 10) / 10,
      estimatedROI,
      totalTrades: trades.length
    };
  }, [trades]);

  // Compounding Calculator computation
  const compoundChartData = useMemo(() => {
    const data = [];
    let cumulative = capitalInput;
    const rate = monthlyReturn / 100;
    const steps = durYears * 12;

    for (let i = 0; i <= steps; i++) {
      if (i % 6 === 0 || i === steps) {
        data.push({
          period: i === 0 ? 'Capital' : `M${i}`,
          balance: Math.round(cumulative),
          contributions: Math.round(capitalInput)
        });
      }
      cumulative = cumulative * (1 + rate);
    }
    return data;
  }, [capitalInput, monthlyReturn, durYears]);

  // Position Risk Sizing calculation
  const positionCalculatorResult = useMemo(() => {
    const riskCash = (journalBalanceSum * (riskPercent / 100));
    const positionValue = stopDistance > 0 ? (riskCash / (stopDistance / 100)) : 0;
    const suggestedLotOrSize = leverageCap > 0 ? (positionValue * leverageCap) : positionValue;
    return {
      riskCash,
      positionValue,
      suggestedLotOrSize
    };
  }, [journalBalanceSum, riskPercent, stopDistance, leverageCap]);

  // Intrinsic Stock Valuation Calculation (DCF style model)
  const intrinsicStockValuation = useMemo(() => {
    let pvOfCashFlows = 0;
    const projectCFs = [];
    let currentCF = earnings;
    const disc = discountRate / 100;
    const growth = growthRate / 100;

    for (let k = 1; k <= 5; k++) {
      currentCF = currentCF * (1 + growth);
      const discountFactor = Math.pow(1 + disc, k);
      const pv = currentCF / discountFactor;
      pvOfCashFlows += pv;
      projectCFs.push({
        year: `Yr ${k}`,
        cashFlow: Math.round(currentCF),
        discounted: Math.round(pv)
      });
    }

    // Terminal Value
    const terminalValue = currentCF * terminalMultiple;
    const discountedTerminalValue = terminalValue / Math.pow(1 + disc, 5);
    const fairIntrinsicValue = pvOfCashFlows + discountedTerminalValue;

    return {
      fairIntrinsicValue,
      projectCFs,
      discountedTerminalValue
    };
  }, [earnings, growthRate, discountRate, terminalMultiple]);

  return (
    <div id="investor-portfolio-workspace" className="space-y-8 pb-12">
      {/* Tab Visual Title Banner */}
      <div>
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5 block">Portfolio Hub & Tactical Planner</span>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Investor Plan & Asset Wealth</h2>
        <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed mt-1">
          Synchronize your active account state, budget external investment channels of your wallet portfolio, forge psychological constraints, and perform analytical simulations in one unified control desk.
        </p>
      </div>

      {/* Grid: Financial Wallet & allocation state */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Money balances & Wallet trackcard */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between lg:col-span-1">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-gradient-to-br from-emerald-500/10 to-transparent blur-[50px] rounded-full" />
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Capital Desk
              </span>
              <span className="text-[9px] font-black uppercase text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 rounded-lg">
                Consolidated View
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Strategic Wealth</span>
              <div className="text-4xl font-black text-white tracking-tight">
                {formatCurrency(totalPortfolioValue, currency)}
              </div>
            </div>

            {/* Split sources */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-850">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase">Journal Base Cash</span>
                </div>
                <span className="text-[11px] font-mono font-black text-zinc-200">
                  {formatCurrency(journalBalanceSum, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-850">
                <div className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase">Reserve Wallet (Cash)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-zinc-500">{currency}</span>
                  <input
                    type="number"
                    value={planData.walletCash}
                    onChange={(e) => handleUpdateWalletCash(Number(e.target.value) || 0)}
                    className="w-18 bg-transparent text-right border-none font-mono font-black text-white text-[11px] focus:ring-0 p-0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-850">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono">External assets sum</span>
                </div>
                <span className="text-[11px] font-mono font-black text-zinc-300">
                  {formatCurrency(planData.externalInvestments.reduce((sum, item) => sum + item.value, 0), currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-550">
            <span className="font-bold uppercase tracking-wider">Trading Account</span>
            <span className="font-mono font-black text-emerald-400">
              {accounts.find(a => a.id === currentAccountId)?.name || 'Default Desk'}
            </span>
          </div>
        </div>

        {/* Allocation allocation pie-chart representation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" />
                Wealth Asset Allocations
              </h3>
              <p className="text-zinc-500 text-[10px]">Real aggregate exposure across stocks, crypto, cash reserves, and forex desks.</p>
            </div>
            
            <span className="text-[9px] font-black text-white uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
              Dynamic Exposure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Recharts Pie */}
            <div className="h-44 flex items-center justify-center relative">
              {totalPortfolioValue === 0 ? (
                <span className="text-[10px] text-zinc-650 uppercase font-black">No allocation records yet</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={relativeAllocations.filter(a => a.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {relativeAllocations.filter(a => a.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${formatCurrency(Number(value), currency)}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Abs center balance */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-[8px] text-zinc-550 font-black tracking-widest uppercase mb-0.5">ALLOCATED</span>
                <span className="text-xs font-black text-zinc-200">{formatCurrency(totalPortfolioValue, currency)}</span>
              </div>
            </div>

            {/* Asset Distribution Legend list */}
            <div className="space-y-2">
              {relativeAllocations.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-zinc-850/60 text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-350 uppercase">{item.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-zinc-250 font-mono font-black">{Math.round(item.percent)}%</span>
                    <span className="text-zinc-600 text-[10px] font-mono leading-none">{formatCurrency(item.value, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Plan Elements (Assurances, FOMO countermeasures, recollection notes, assets) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Column: Interactive Plan Notes & Assets */}
        <div className="space-y-6 xl:col-span-1">
          {/* Notes Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Executive Plan Notes</span>
            <textarea
              value={planData.planNotes}
              onChange={(e) => savePlan({ ...planData, planNotes: e.target.value })}
              className="w-full min-h-[110px] bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed resize-none font-medium"
              placeholder="Draft your overarching rule sets, risk models, and target milestones..."
            />
            <div className="flex items-center gap-1.5 p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-zinc-400 italic">This plan dictates strategic compliance.</span>
            </div>
          </div>

          {/* Spliced High conviction target assets Checklist */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Applicable Assets Focus</span>
              <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">Narrow down strategy setups specifically to assets you yield highest edges on.</p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                value={assetInput}
                onChange={(e) => setAssetInput(e.target.value)}
                placeholder="e.g. BTC"
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-1.5 text-xs text-center placeholder-zinc-650 tracking-wider text-white uppercase focus:ring-1 focus:ring-emerald-500 outline-none"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddAsset(); }}
              />
              <button
                type="button"
                onClick={handleAddAsset}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-neutral-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {planData.applicableAssets.map((asset) => (
                <div key={asset} className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-850 group/item">
                  <span className="text-[10px] font-bold text-zinc-200 font-mono">{asset}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveAsset(asset)}
                    className="hover:text-rose-400 text-zinc-600 transition-all font-bold p-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
              {planData.applicableAssets.length === 0 && (
                <span className="text-[10px] italic text-zinc-650 block text-center w-full py-1">No focus asset scopes defined.</span>
              )}
            </div>

            {/* Smart Journal Suggestion integration here */}
            {journaledAssets && journaledAssets.length > 0 && (
              <div className="pt-3.5 border-t border-zinc-800/60 space-y-2 mt-2">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Traded in Active Journal</span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                  {journaledAssets.slice(0, 4).map((jAsset) => {
                    const isAlreadyTracked = planData.applicableAssets.includes(jAsset.asset);
                    return (
                      <div key={jAsset.asset} className="flex items-center justify-between p-1.5 rounded-xl bg-zinc-950/80 border border-zinc-900 text-[10px] font-bold">
                        <div className="min-w-0 flex-1">
                          <span className="text-zinc-200 font-mono tracking-wider">{jAsset.asset}</span>
                          <div className="flex items-center gap-1.5 text-[8px] text-zinc-500 font-bold uppercase mt-0.5">
                            <span>{jAsset.count} Trades</span>
                            <span className={cn(jAsset.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                              {jAsset.pnl >= 0 ? "+" : ""}{formatCurrency(jAsset.pnl, currency)}
                            </span>
                          </div>
                        </div>
                        {!isAlreadyTracked && (
                          <button
                            type="button"
                            onClick={() => {
                              savePlan({
                                ...planData,
                                applicableAssets: [...planData.applicableAssets, jAsset.asset]
                              });
                            }}
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider transition-all scale-95 origin-right"
                          >
                            + Focus
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Add External Investment Channel Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Add Asset Ledger</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Diversify your portfolio by adding stock, crypto holds, forex accounts, or cash buckets.</p>
            </div>

            <form onSubmit={handleAddExternalInvestment} className="space-y-2.5">
              <input 
                type="text" 
                placeholder="Asset Name (e.g. Robinhood Portfolio)" 
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-660 focus:ring-1 focus:ring-emerald-500 outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  min="1"
                  placeholder="Value" 
                  value={invValue}
                  onChange={(e) => setInvValue(Number(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                />

                <select 
                  value={invType}
                  onChange={(e) => setInvType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-zinc-400 font-bold focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="Stocks">Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Forex">Forex</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-550 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Log Allocation
              </button>
            </form>

            {/* List current external investments */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
              {planData.externalInvestments.map((item) => {
                const isEditing = editingExternalId === item.id;
                return (
                  <div key={item.id} className="p-2 bg-zinc-950 rounded-xl border border-zinc-850/60 transition-all">
                    {isEditing ? (
                      <div className="space-y-2 p-1">
                        <input
                          type="text"
                          value={editingExternalName}
                          onChange={(e) => setEditingExternalName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                          placeholder="Asset Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={editingExternalValue}
                            onChange={(e) => setEditingExternalValue(Number(e.target.value) || 0)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                            placeholder="Value"
                          />
                          <select
                            value={editingExternalType}
                            onChange={(e) => setEditingExternalType(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300 font-bold focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                          >
                            <option value="Stocks">Stocks</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Forex">Forex</option>
                            <option value="Cash">Cash</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex gap-1.5 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingExternalId(null)}
                            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] uppercase font-black tracking-wider text-zinc-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateExternalInvestment(item.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] uppercase font-black tracking-wider text-white"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase font-black text-zinc-300 truncate">{item.name}</p>
                          <span className="text-[8px] uppercase tracking-widest text-zinc-550 font-bold">{item.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black text-indigo-400">{formatCurrency(item.value, currency)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingExternalId(item.id);
                              setEditingExternalName(item.name);
                              setEditingExternalValue(item.value);
                              setEditingExternalType(item.type);
                            }}
                            className="text-zinc-500 hover:text-indigo-400 p-0.5 transition-colors"
                            title="Edit Ledger Entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveExternalInvestment(item.id)}
                            className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Sections: Assurances, Recollections, FOMO controls */}
        <div className="space-y-6 xl:col-span-3">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assurances (trading/mental constraints) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  My Assurances & Affirmatory Rules
                </h3>
                <p className="text-zinc-500 text-[10px] mt-0.5 text-balance">Read these affirmations before every single market entry. Check them off as mental contracts.</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={assuranceInput}
                  onChange={(e) => setAssuranceInput(e.target.value)}
                  placeholder="e.g. I will not seek revenge after stops..."
                  className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-660 focus:ring-1 focus:ring-emerald-500 outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddAssurance(); }}
                />
                <button
                  type="button"
                  onClick={handleAddAssurance}
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {planData.assurances.map((item, idx) => {
                  const isEditing = editingAssuranceIdx === idx;
                  return isEditing ? (
                    <div key={idx} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                      <input
                        type="text"
                        value={editingAssuranceVal}
                        onChange={(e) => setEditingAssuranceVal(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateAssurance(idx); }}
                      />
                      <div className="flex gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingAssuranceIdx(null)}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] uppercase font-black tracking-wider text-zinc-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateAssurance(idx)}
                          className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] uppercase font-black tracking-wider text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-start justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 group">
                      <div className="flex gap-2.5 items-start min-w-0 flex-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 mt-1.5 shadow-[0_0_6px_#34d399]" />
                        <p className="text-[11px] text-zinc-300 font-medium leading-relaxed uppercase tracking-tight">{item}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAssuranceIdx(idx);
                            setEditingAssuranceVal(item);
                          }}
                          className="text-zinc-500 hover:text-indigo-450 p-0.5 transition-colors"
                          title="Edit rule text"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveAssurance(idx)}
                          className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="Remove rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {planData.assurances.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-zinc-850 rounded-xl bg-zinc-950/10">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pl-2">No assurances declared yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* FOMO Zone Tracker counter-actions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Self-Control / FOMO Recovery Zone
                </h3>
                <p className="text-zinc-500 text-[10px] mt-0.5">Map out exact psychological triggers, FOMO impulses, and physical rules to break loop conditions.</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={fomoInput}
                  onChange={(e) => setFomoInput(e.target.value)}
                  placeholder="e.g. Trigger: High volatility spike. Counter: Wait 1 HR stop trading..."
                  className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-660 focus:ring-1 focus:ring-emerald-500 outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddFomoRule(); }}
                />
                <button
                  type="button"
                  onClick={handleAddFomoRule}
                  className="p-2 bg-orange-500/90 hover:bg-orange-400 text-black rounded-xl transition-all font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {planData.fomoZone.map((item, idx) => {
                  const isEditing = editingFomoIdx === idx;
                  return isEditing ? (
                    <div key={idx} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                      <input
                        type="text"
                        value={editingFomoVal}
                        onChange={(e) => setEditingFomoVal(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateFomoRule(idx); }}
                      />
                      <div className="flex gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingFomoIdx(null)}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] uppercase font-black tracking-wider text-zinc-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateFomoRule(idx)}
                          className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] uppercase font-black tracking-wider text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-start justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 group">
                      <div className="flex gap-2.5 items-start min-w-0 flex-1">
                        <AlertTriangle className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed uppercase tracking-tight">{item}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFomoIdx(idx);
                            setEditingFomoVal(item);
                          }}
                          className="text-zinc-500 hover:text-indigo-450 p-0.5 transition-colors"
                          title="Edit FOMO rule text"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFomoRule(idx)}
                          className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="Remove Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {planData.fomoZone.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-zinc-850 rounded-xl bg-zinc-950/10">
                    <span className="text-[10px] text-zinc-650 font-bold uppercase tracking-widest block pl-2">No triggers configured</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recollection Retro Zone (High profitability patterns / crucial lessons learned) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Recollection Zone (Historical Post-Mortems)
              </h3>
              <p className="text-zinc-500 text-[10px] mt-0.5">Crucial, hard-learned lessons logged instantly to memory. Maintain historical trade setups knowledge.</p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={recollectionInput}
                onChange={(e) => setRecollectionInput(e.target.value)}
                placeholder="e.g. Never enter when spreads widen at 5PM open..."
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-660 focus:ring-1 focus:ring-emerald-500 outline-none"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddRecollection(); }}
              />
              <button
                type="button"
                onClick={handleAddRecollection}
                className="p-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto custom-scrollbar">
              {planData.recollectionZone.map((item, idx) => {
                const isEditing = editingRecollectionIdx === idx;
                return isEditing ? (
                  <div key={idx} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 col-span-1">
                    <input
                      type="text"
                      value={editingRecollectionVal}
                      onChange={(e) => setEditingRecollectionVal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateRecollection(idx); }}
                    />
                    <div className="flex gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingRecollectionIdx(null)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] uppercase font-black tracking-wider text-zinc-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateRecollection(idx)}
                        className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] uppercase font-black tracking-wider text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800 group relative col-span-1">
                    <div className="flex gap-2 items-start min-w-0 pr-12">
                      <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-zinc-400 leading-normal font-bold lowercase first-letter:uppercase">{item}</p>
                    </div>
                    <div className="flex items-center gap-1.5 absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecollectionIdx(idx);
                          setEditingRecollectionVal(item);
                        }}
                        className="text-zinc-500 hover:text-indigo-400 p-0.5 transition-colors"
                        title="Edit recollection"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRecollection(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                        title="Remove recollection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scaling Profits Milestone Plan Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 block">Account Milestones & Capital Growth</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-400 animate-pulse" />
                  Profit Scaling & Risk Progression Plan
                </h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">Define structured milestones with scaling target balances, step-up risk tolerances, leverage tiers, and unlocked playbook rules.</p>
              </div>
              <span className="text-[9px] font-mono font-black text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 rounded-xl shrink-0 uppercase animate-pulse">
                Active Tier: {activeScalingTier ? activeScalingTier.tierName : "Stage 1"}
              </span>
            </div>

            {/* Live Progress towards next Milestone */}
            {activeScalingTier && (
              <div className="bg-zinc-950 p-4.5 rounded-2xl border border-zinc-850 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase font-black text-zinc-400">Progression Stage Target</span>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-indigo-400">Current Portfolio Value: {formatCurrency(totalPortfolioValue, currency)}</span>
                    <span className="text-[10px] text-zinc-500 pl-2">/ Tier Cap: {formatCurrency(activeScalingTier.targetBalance, currency)}</span>
                  </div>
                </div>

                {/* Progress bar calculation */}
                {(() => {
                  const denominator = (activeScalingTier.targetBalance - activeScalingTier.startBalance);
                  const numerator = (totalPortfolioValue - activeScalingTier.startBalance);
                  const progressPct = denominator > 0 ? Math.min(100, Math.max(0, (numerator / denominator) * 100)) : 0;
                  return (
                    <div className="space-y-1">
                      <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>Min Start {formatCurrency(activeScalingTier.startBalance, currency)}</span>
                        <span className="text-emerald-400 font-black">{Math.round(progressPct)}% UNLOCKED</span>
                        <span>Unlock Target {formatCurrency(activeScalingTier.targetBalance, currency)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Privileges/Rules for Active Tier block */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-850/60 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Unlocked Playbook Sizing Guidelines & Rules:</span>
                    <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed mt-0.5">{activeScalingTier.rulesUnlocked}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-[9px] font-mono text-zinc-500">
                      <span>• Risk Allocated: <strong className="text-indigo-400">{activeScalingTier.riskPercent}% per trade</strong></span>
                      <span>• Max Leverage Margin: <strong className="text-indigo-400">{activeScalingTier.maxLeverage}x caps</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List all stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTiers.map((tier, index) => {
                const isCurrent = activeScalingTier?.id === tier.id;
                return (
                  <div 
                    key={tier.id || index} 
                    className={cn(
                      "flex flex-col justify-between p-4 rounded-2xl border transition-all relative group/tier",
                      isCurrent 
                        ? "bg-indigo-500/5 border-indigo-500/40 shadow-lg shadow-indigo-500/5" 
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-800"
                    )}
                  >
                    {isCurrent && (
                      <span className="absolute -top-2 px-2 py-0.5 bg-indigo-500 text-black font-black text-[8.5px] uppercase tracking-wider rounded-md left-4">
                        Current Stage
                      </span>
                    )}

                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-tight">{tier.tierName}</h4>
                          <span className="text-[9px] font-medium font-mono text-zinc-500">Tier {index + 1} Profile</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/tier:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTierIdForEdit(tier.id);
                              setNewTierName(tier.tierName);
                              setNewTierStart(tier.startBalance);
                              setNewTierTarget(tier.targetBalance);
                              setNewTierRisk(tier.riskPercent);
                              setNewTierLeverage(tier.maxLeverage);
                              setNewTierRules(tier.rulesUnlocked);
                            }}
                            className="p-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all"
                            title="Edit Stage Parameters"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveScalingTier(tier.id)}
                            className="p-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-rose-400 rounded-lg transition-all"
                            title="Remove Stage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-b border-zinc-850/50 py-2">
                        <div>
                          <span className="text-[8px] text-zinc-550 uppercase tracking-wider block">Balance Range:</span>
                          <span className="font-bold text-zinc-300">
                            {formatCurrency(tier.startBalance, currency)} – {formatCurrency(tier.targetBalance, currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-550 uppercase tracking-wider block">Risk Policy:</span>
                          <span className="font-bold text-indigo-400">{tier.riskPercent}% risk @ {tier.maxLeverage}x</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] text-zinc-550 uppercase tracking-wider block font-mono">Privileges / Playbook rule:</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{tier.rulesUnlocked}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Tier Creator Form */}
            <form 
              onSubmit={(e) => {
                if (selectedTierIdForEdit) {
                  e.preventDefault();
                  handleUpdateScalingTier(selectedTierIdForEdit, {
                    tierName: newTierName,
                    startBalance: newTierStart,
                    targetBalance: newTierTarget,
                    riskPercent: newTierRisk,
                    maxLeverage: newTierLeverage,
                    rulesUnlocked: newTierRules
                  });
                  setSelectedTierIdForEdit(null);
                  setNewTierName('');
                  setNewTierStart(0);
                  setNewTierTarget(Math.round(startingBalance * 1.5) || 15000);
                  setNewTierRisk(1.5);
                  setNewTierLeverage(10);
                  setNewTierRules('');
                } else {
                  handleAddScalingTier(e);
                }
              }} 
              className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850/60 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedTierIdForEdit ? "Edit Stage parameters" : "Formulate custom progression Stage"}
                </span>
                {selectedTierIdForEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTierIdForEdit(null);
                      setNewTierName('');
                      setNewTierStart(0);
                      setNewTierTarget(Math.round(startingBalance * 1.5) || 15000);
                      setNewTierRisk(1.5);
                      setNewTierLeverage(10);
                      setNewTierRules('');
                    }}
                    className="text-[10px] text-rose-400 uppercase font-black tracking-wider hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Stage Name</span>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Tier 4: Fund Allocation Stage"
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-650 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1 pb-1">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Start Balance ({currency})</span>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newTierStart}
                    onChange={(e) => setNewTierStart(Number(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1 pb-1 font-mono">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Target Balance ({currency})</span>
                  <input 
                    type="number"
                    min="1"
                    placeholder="15000"
                    value={newTierTarget}
                    onChange={(e) => setNewTierTarget(Number(e.target.value) || 1)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 pb-1">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Risk Per Trade %</span>
                  <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3">
                    <input 
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="1.5"
                      value={newTierRisk}
                      onChange={(e) => setNewTierRisk(Number(e.target.value) || 0.1)}
                      className="w-full bg-transparent border-none text-xs font-mono text-white outline-none py-1.5 focus:ring-0 p-0"
                    />
                    <Percent className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  </div>
                </div>

                <div className="space-y-1 pb-1 font-mono">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Allowed Leverage</span>
                  <select
                    value={newTierLeverage}
                    onChange={(e) => setNewTierLeverage(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400 font-bold focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="1">1x Spot No Lev</option>
                    <option value="5">5x Leveraged</option>
                    <option value="10">10x Leveraged</option>
                    <option value="20">20x Leveraged</option>
                    <option value="50">50x Multiplier</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-1">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Unlocked Sizing Rules / Privileges</span>
                  <input 
                    type="text"
                    placeholder="e.g. Unlocks secondary asset scalps"
                    value={newTierRules}
                    onChange={(e) => setNewTierRules(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-650 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-500/10"
              >
                {selectedTierIdForEdit ? "Save Stage changes" : "Deploy Profit Scaling Stage"}
              </button>
            </form>
          </div>

          {/* Buildable Portfolio & Investment calculator Models */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Interactive Portfolio Analyst & Modeling Tools
                </h3>
                <p className="text-zinc-500 text-[10px] mt-0.5">Simulate macro trends, compounding parameters, valuations, and tactical rebalancing.</p>
              </div>

              {/* Toggles */}
              <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-2xl border border-zinc-850/50 shrink-0 select-none">
                {([
                  { id: 'compound', label: 'Compound Interest' },
                  { id: 'position', label: 'Position Sizing' },
                  { id: 'dcf', label: 'DCF Intrinsic' },
                  { id: 'rebalancer', label: 'Target Allocations' }
                ] as const).map(calc => (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => setActiveCalculator(calc.id)}
                    className={cn(
                      "px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all",
                      activeCalculator === calc.id 
                        ? "bg-zinc-900 text-white shadow" 
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {calc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Calculator views */}
            <div>
              <AnimatePresence mode="wait">
                {activeCalculator === 'compound' && (
                  <motion.div
                    key="compound-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="space-y-4 md:col-span-1">
                        <div className="space-y-1 font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Initial Investment</span>
                            <button
                              type="button"
                              onClick={() => setCapitalInput(Math.round(totalPortfolioValue))}
                              className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-all font-mono"
                              title="Load live consolidated portfolio value"
                            >
                              Sync Live ({formatCurrency(totalPortfolioValue, currency)})
                            </button>
                          </div>
                          <input 
                            type="number"
                            value={capitalInput}
                            onChange={(e) => setCapitalInput(Number(e.target.value) || 0)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-white outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Nominal Return / MO</span>
                            <div className="relative flex items-center bg-zinc-950 border border-zinc-850 rounded-xl px-2.5">
                              <input 
                                type="number"
                                value={monthlyReturn}
                                onChange={(e) => setMonthlyReturn(Number(e.target.value) || 0)}
                                className="w-full bg-transparent border-none text-[11px] font-bold font-mono text-white outline-none py-1.5 focus:ring-0 p-0"
                              />
                              <Percent className="w-3 h-3 text-zinc-500 shrink-0" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Timeline (Years)</span>
                            <input 
                              type="number"
                              min="1"
                              value={durYears}
                              onChange={(e) => setDurYears(Number(e.target.value) || 1)}
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-white focus:ring-0 outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-3.5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-1">
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Projected compound amount</span>
                          <div className="text-xl font-mono font-black text-white">
                            {formatCurrency(compoundChartData[compoundChartData.length - 1]?.balance || 0, currency)}
                          </div>
                        </div>
                      </div>

                      <div className="h-44 md:col-span-2 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={compoundChartData}>
                            <XAxis dataKey="period" tick={{ fill: '#71717a', fontSize: '9px', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#71717a', fontSize: '9px' }} axisLine={false} tickLine={false} />
                            <Tooltip 
                              formatter={(value: any) => [formatCurrency(Number(value), currency), 'Balance']}
                              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                            />
                            <Bar dataKey="balance" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Artificial suggestions based on journal stats and target presets */}
                    <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-emerald-450 shrink-0" />
                        <div>
                          <span className="text-[9px] font-black text-zinc-300 uppercase tracking-wider block">Artificial Compounding Presets & Modeling Advice</span>
                          <p className="text-[9px] text-zinc-500 mt-0.5">Presets matched to trading styles. Clicking any strategy below automatically configures the calculator.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Preset 1: Conservative */}
                        <button
                          type="button"
                          onClick={() => setMonthlyReturn(3.0)}
                          className={cn(
                            "text-left p-3 rounded-xl border transition-all text-pretty block w-full",
                            monthlyReturn === 3.0 
                              ? "bg-emerald-500/10 border-emerald-500/30" 
                              : "bg-zinc-900/40 border-zinc-850/55 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">3.0% / Month</span>
                            <span className="text-[8px] bg-emerald-500/15 text-emerald-350 font-bold px-1.5 py-0.5 rounded uppercase font-sans">Conservative</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            Protects capital drawdowns. Best for steady long-term building. Compounds <span className="font-mono text-zinc-350">{formatCurrency(capitalInput, currency)}</span> to <span className="font-mono text-zinc-300 font-bold">
                              {formatCurrency(capitalInput * Math.pow(1 + 0.03, durYears * 12), currency)}
                            </span> over {durYears} yr(s).
                          </p>
                        </button>

                        {/* Preset 2: Moderate Progress */}
                        <button
                          type="button"
                          onClick={() => setMonthlyReturn(6.0)}
                          className={cn(
                            "text-left p-3 rounded-xl border transition-all text-pretty block w-full",
                            monthlyReturn === 6.0 
                              ? "bg-indigo-500/10 border-indigo-500/30" 
                              : "bg-zinc-900/40 border-zinc-850/55 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono font-bold">6.0% / Month</span>
                            <span className="text-[8px] bg-indigo-500/15 text-indigo-300 font-bold px-1.5 py-0.5 rounded uppercase font-sans">Steady Growth</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            A solid targets path to accelerate milestone stage progression safely. Compounds to <span className="font-mono text-zinc-300 font-bold">
                              {formatCurrency(capitalInput * Math.pow(1 + 0.06, durYears * 12), currency)}
                            </span> over {durYears} yr(s).
                          </p>
                        </button>

                        {/* Preset 3: Journal Grounded (Dynamic) */}
                        <button
                          type="button"
                          onClick={() => setMonthlyReturn(journalMetrics.estimatedROI)}
                          className={cn(
                            "text-left p-3 rounded-xl border transition-all text-pretty block w-full",
                            monthlyReturn === journalMetrics.estimatedROI 
                              ? "bg-purple-500/10 border-purple-500/30" 
                              : "bg-zinc-900/40 border-zinc-850/55 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono font-bold">
                              {journalMetrics.estimatedROI}% / Month
                            </span>
                            <span className="text-[8px] bg-purple-500/15 text-purple-300 font-bold px-1.5 py-0.5 rounded uppercase font-sans">Journal Based</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            {journalMetrics.totalTrades > 0 ? (
                              <>
                                Modeled on <span className="font-bold text-zinc-300">{journalMetrics.totalTrades} journal trades</span>. Win Rate: <span className="text-emerald-400 font-sans font-semibold">{journalMetrics.winRate}%</span>. Compounds portfolio to <span className="font-mono text-zinc-300 font-bold">
                                  {formatCurrency(capitalInput * Math.pow(1 + (journalMetrics.estimatedROI / 100), durYears * 12), currency)}
                                </span>.
                              </>
                            ) : (
                              <>
                                No trade metrics yet. Log trades in your journal to calculate a dynamic growth rate matching your exact win-rate capabilities.
                              </>
                            )}
                          </p>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCalculator === 'position' && (
                  <motion.div
                    key="position-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest block">Allowed Account Risk</span>
                          <div className="relative flex items-center bg-zinc-950 border border-zinc-850 rounded-xl px-2.5">
                            <input 
                              type="number"
                              step="0.1"
                              value={riskPercent}
                              onChange={(e) => setRiskPercent(Number(e.target.value) || 0.1)}
                              className="w-full bg-transparent border-none text-[11px] font-bold font-mono text-white outline-none py-1.5 focus:ring-0 p-0"
                            />
                            <Percent className="w-3 h-3 text-zinc-500 shrink-0" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest block">Stop-Loss Size</span>
                          <div className="relative flex items-center bg-zinc-950 border border-zinc-850 rounded-xl px-2.5">
                            <input 
                              type="number"
                              step="0.1"
                              value={stopDistance}
                              onChange={(e) => setStopDistance(Number(e.target.value) || 0.1)}
                              className="w-full bg-transparent border-none text-[11px] font-bold font-mono text-white outline-none py-1.5 focus:ring-0 p-0"
                            />
                            <Percent className="w-3 h-3 text-zinc-500 shrink-0" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest block">Available Margin leverage Multiplier</span>
                        <select
                          value={leverageCap}
                          onChange={(e) => setLeverageCap(Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-400 font-bold outline-none cursor-pointer"
                        >
                          <option value="1">1x (Spot-No Lev)</option>
                          <option value="5">5x Leveraged</option>
                          <option value="10">10x Leveraged</option>
                          <option value="20">20x Leveraged</option>
                          <option value="50">50x Multiplier</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between h-full space-y-3">
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Risk Analysis based on account balance</span>
                        <p className="text-[11px] font-bold text-zinc-400 mt-1">
                          Maximum capital risk size allowed:{' '}
                          <code className="text-rose-400 font-mono text-xs pl-1">
                            {formatCurrency(positionCalculatorResult.riskCash, currency)}
                          </code>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-850/60 pt-3">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-550 uppercase tracking-widest">Base Cash size</span>
                          <div className="text-sm font-mono font-black text-white">{formatCurrency(positionCalculatorResult.positionValue, currency)}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-550 uppercase tracking-widest">Leveraged Position Notional</span>
                          <div className="text-sm font-mono font-black text-emerald-400">{formatCurrency(positionCalculatorResult.suggestedLotOrSize, currency)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCalculator === 'dcf' && (
                  <motion.div
                    key="dcf-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
                  >
                    <div className="space-y-3 md:col-span-1">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Base Annual Net Profits</span>
                        <input 
                          type="number"
                          value={earnings}
                          onChange={(e) => setEarnings(Number(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Growth rate %</span>
                          <input 
                            type="number"
                            value={growthRate}
                            onChange={(e) => setGrowthRate(Number(e.target.value) || 0)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Discount Rate %</span>
                          <input 
                            type="number"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(Number(e.target.value) || 1)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Terminal Value P/E multiple</span>
                        <input 
                          type="number"
                          value={terminalMultiple}
                          onChange={(e) => setTerminalMultiple(Number(e.target.value) || 10)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-1 text-xs font-semibold font-mono text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Intrinsic fair stock model value</span>
                          <p className="text-[12px] text-zinc-400 max-w-sm mt-0.5">Calculated as aggregate present value of all cash flows over the next 5 years, plus discounted terminal value.</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-emerald-400 font-mono font-black block">Intrinsic Valuation:</span>
                          <span className="text-xl font-mono font-black text-emerald-300">
                            {formatCurrency(intrinsicStockValuation.fairIntrinsicValue, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="h-24 w-full pr-1 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={intrinsicStockValuation.projectCFs}>
                            <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: '9px', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                            <Bar dataKey="cashFlow" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Future CF" />
                            <Bar dataKey="discounted" fill="#10b981" radius={[2, 2, 0, 0]} name="Value today" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCalculator === 'rebalancer' && (
                  <motion.div
                    key="rebalancer-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                  >
                    <div className="space-y-4">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Set Target Allocations % (Values must add to 100%)</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
                        {Object.keys(planData.allocations).map((asset) => (
                          <div key={asset} className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl space-y-1">
                            <span className="text-[8px] font-black text-zinc-550 uppercase truncate block">{asset}</span>
                            <div className="relative flex items-center">
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={planData.allocations[asset as keyof typeof planData.allocations] || 0}
                                onChange={(e) => handleUpdateTargetAllocations(asset as keyof typeof planData.allocations, Number(e.target.value) || 0)}
                                className="w-full bg-transparent border-none text-[11px] font-bold font-mono text-white outline-none p-0 focus:ring-0"
                              />
                              <Percent className="w-2.5 h-2.5 text-zinc-550 shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cumulative check indicator */}
                      {(Object.values(planData.allocations) as number[]).reduce((a, b) => a + b, 0) !== 100 && (
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Total sum is currently {(Object.values(planData.allocations) as number[]).reduce((a, b) => a + b, 0)}% (must sum to exactly 100%).
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5 bg-zinc-950 p-4 rounded-2xl border border-zinc-850/60 overflow-y-auto max-h-[170px] custom-scrollbar">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Required Asset Rebalancing Measures (Self-Buy or Sell adjustments)</span>
                      
                      {relativeAllocations.map(allocate => {
                        const targetPct = planData.allocations[allocate.name.toLowerCase() as keyof typeof planData.allocations] || 0;
                        const actualPct = allocate.percent;
                        const pctDeviation = targetPct - actualPct;
                        const deviationAmount = (pctDeviation / 100) * totalPortfolioValue;

                        return (
                          <div key={allocate.name} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-[10px] font-mono">
                            <div className="font-bold uppercase text-zinc-350">{allocate.name} model:</div>
                            <div className="text-right">
                              {Math.abs(deviationAmount) < 5 ? (
                                <span className="text-emerald-400 font-black">BALANCED</span>
                              ) : deviationAmount > 0 ? (
                                <span className="text-indigo-400 font-black">
                                  BUY CLOSELY {formatCurrency(deviationAmount, currency)} (+{Math.round(pctDeviation)}%)
                                </span>
                              ) : (
                                <span className="text-rose-400 font-black">
                                  SELL CLOSELY {formatCurrency(Math.abs(deviationAmount), currency)} ({Math.round(pctDeviation)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
