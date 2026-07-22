import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Zap,
  TrendingUp,
  Sliders,
  DollarSign,
  Award,
  BookOpen,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  Target,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Smartphone,
  Send,
  Building,
  Wallet,
  Globe,
  Coins,
  Calculator,
  Calendar,
  Hourglass
} from 'lucide-react';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { UserSettings } from '../types';

interface FundingSuiteTabProps {
  settings: UserSettings;
  onUpdateSettings?: (settings: Partial<UserSettings>) => void;
}

// Philippine Prop Trading Information
const PH_PROP_PLATFORMS = [
  {
    id: 'apex',
    name: 'APEX Trader Funding',
    type: 'Futures',
    logo: '🔥',
    phAvailability: 'Highly Popular in PH. Supports Rithmic, Tradovate, and NinjaTrader.',
    payoutMethods: 'Deel (Direct Local Bank Transfer, GCash, PayMaya, Wise) or cryptocurrency (USDT - ERC20/TRC20).',
    feesAndSplit: '90/10 split (First $25,000 is 100% yours per account). Has low monthly/activation fees.',
    rules: 'Has a trailing drawdown that updates in real-time. No daily drawdown limit on standard accounts. Consistency requirements apply to payouts (no single-day trade profit should exceed 30% of total profit for that pay cycle).'
  },
  {
    id: 'ftmo',
    name: 'FTMO',
    type: 'Forex/CFD',
    logo: '🦁',
    phAvailability: 'Reputable standard. Fully accessible in the Philippines, uses MT4, MT5, or cTrader.',
    payoutMethods: 'Direct Bank Transfer (to BDO, BPI, Metrobank etc.), crypto payouts, or Wise.',
    feesAndSplit: '80/20 to 90/10 split. Refundable registration fee upon first payout.',
    rules: 'Strict 5% daily drawdown and 10% maximum drawdown limits. No consistency rules, but passing requires meeting 10% target in Phase 1 and 5% in Phase 2.'
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    type: 'Forex/CFD',
    logo: '▶️',
    phAvailability: 'Specially popular in Asia with custom GCash payout connections and responsive local timezone support.',
    payoutMethods: 'GCash, Local Bank Transfer, Crypto, Rise, or Perfect Money.',
    feesAndSplit: 'Up to 90/10 profit split. Offers 15% profit sharing during the demo evaluation phase.',
    rules: 'Features structural daily drawdown options based on balance or equity. Extremely flexible for swing and news trading.'
  },
  {
    id: 'myfundedfx',
    name: 'MyFundedFX',
    type: 'Forex/CFD/Crypto',
    logo: '🦊',
    phAvailability: 'Excellent support for GCash withdrawal channels and highly flexible rules.',
    payoutMethods: 'GCash, GrabPay, Rise (Local PH Banks), and USDT/BTC/LTC.',
    feesAndSplit: '80/20 profit split. Bi-weekly payouts.',
    rules: 'Both 1-step and 2-step evaluation challenges available. Strict daily and total drawdowns.'
  }
];

// Philippine Live Brokers Information
const PH_LIVE_BROKERS = [
  {
    id: 'exness',
    name: 'Exness',
    logo: '🏷️',
    defaultLeverage: 2000,
    defaultSpread: 0.1,
    defaultCommission: 3.5,
    phAvailability: 'Most popular FX broker in PH. GCash/Maya/InstaPay deposits instant with 0 fees.'
  },
  {
    id: 'icmarkets',
    name: 'IC Markets',
    logo: '🌐',
    defaultLeverage: 500,
    defaultSpread: 0.0,
    defaultCommission: 7.0,
    phAvailability: 'Top-tier true raw spreads. Fast local bank transfers, Maya, and Visa/Mastercard support.'
  },
  {
    id: 'xm',
    name: 'XM Global',
    logo: '❌',
    defaultLeverage: 1000,
    defaultSpread: 1.2,
    defaultCommission: 0.0,
    phAvailability: 'Highly active local webinars. High leverage, PHP direct deposit, and regular trading bonuses.'
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logo: '💎',
    defaultLeverage: 500,
    defaultSpread: 0.1,
    defaultCommission: 3.5,
    phAvailability: 'Premium ASIC/FCA regulated liquidity. Instant GCash connections and MT5 / cTrader support.'
  },
  {
    id: 'custom',
    name: 'Custom Broker Option',
    logo: '⚙️',
    defaultLeverage: 500,
    defaultSpread: 0.5,
    defaultCommission: 4.0,
    phAvailability: 'Manually input custom name and broker specifications beneath.'
  }
];

export function FundingSuiteTab({ settings, onUpdateSettings }: FundingSuiteTabProps) {
  // Account Mode selector: 'funded' or 'live'
  const [accountMode, setAccountMode] = useState<'funded' | 'live'>('funded');

  // Sub-Navigation Tabs inside Workspace
  const [activeTab, setActiveTab] = useState<'sizing' | 'ruin' | 'roadmap' | 'directory'>('sizing');
  
  // Custom interactive outputs
  const [customBalance, setCustomBalance] = useState<number>(settings.startingBalance || 50000);
  const [tradingStyle, setTradingStyle] = useState<'scalper' | 'daytrader' | 'swing' | 'news'>('daytrader');
  const [platformId, setPlatformId] = useState<string>('apex');
  
  // Custom calculator state
  const [stopLossPips, setStopLossPips] = useState<number>(15);
  const [riskPercentage, setRiskPercentage] = useState<number>(0.5); // Default 0.5% for funded safety
  const [calculatorCategory, setCalculatorCategory] = useState<'Forex' | 'Futures'>('Forex');

  // Live Broker Custom Selection States
  const [liveBrokerId, setLiveBrokerId] = useState<string>('exness');
  const [customBrokerName, setCustomBrokerName] = useState<string>('');
  const [liveLeverage, setLiveLeverage] = useState<number>(2000);
  const [liveSpread, setLiveSpread] = useState<number>(0.1); // in pips
  const [liveCommission, setLiveCommission] = useState<number>(3.5); // USD per round-turn lot
  const [winRate, setWinRate] = useState<number>(55); // Win rate percentage for computable ruin
  const [riskReward, setRiskReward] = useState<number>(2.0); // Reward to Risk ratio
  const [riskPerDayPct, setRiskPerDayPct] = useState<number>(2.0); // Daily Risk limit %

  // Scaling Challenge state variables
  const [challengeStartBalance, setChallengeStartBalance] = useState<number>(50); // Scale from $50
  const [challengeTargetBalance, setChallengeTargetBalance] = useState<number>(1000); // Scale up to $1,000+
  const [challengeGainTargetPct, setChallengeGainTargetPct] = useState<number>(10); // Gain target % per trade/milestone
  const [challengeWithdrawnRate, setChallengeWithdrawnRate] = useState<number>(0); // Reinvest everything or part
  const [milestonesPerMonth, setMilestonesPerMonth] = useState<number>(4); // Velocity: how many growth cycles/steps achieved per month

  // Automatically adjust default category when platform updates
  useEffect(() => {
    if (accountMode === 'funded') {
      const selected = PH_PROP_PLATFORMS.find(p => p.id === platformId);
      if (selected && selected.type === 'Futures') {
        setCalculatorCategory('Futures');
      } else {
        setCalculatorCategory('Forex');
      }
    }
  }, [platformId, accountMode]);

  // Derived calculation metrics based on Mode
  const metrics = useMemo(() => {
    const isFunded = accountMode === 'funded';
    
    // Limits
    const dailyDrawdownPct = isFunded ? 5 : riskPerDayPct; // funded standard is usually 5% daily, personal is user chosen
    const maxDrawdownPct = isFunded ? 10 : 100; // funded standard is 10% maximum
    
    const dailyLossLimitVal = customBalance * (dailyDrawdownPct / 100);
    const maxDrawdownVal = customBalance * (maxDrawdownPct / 100);
    
    // Sizing recommendations based on Style and Mode
    let baseRiskPct = 0.5;
    if (accountMode === 'live') {
      baseRiskPct = riskPercentage;
    } else {
      baseRiskPct = tradingStyle === 'swing' ? 0.8 : tradingStyle === 'scalper' ? 0.3 : 0.5;
    }

    const recommendedRiskAmount = customBalance * (baseRiskPct / 100);
    
    return {
      dailyDrawdownPct,
      maxDrawdownPct,
      dailyLossLimitVal,
      maxDrawdownVal,
      baseRiskPct,
      recommendedRiskAmount
    };
  }, [accountMode, customBalance, tradingStyle, riskPerDayPct, riskPercentage]);

  // Sizing Calculator Formula
  // Recommended lot size = (Balance * Risk%) / (StopLossPips * PipValue multiplier)
  // Assumes $10 standard pip value for standard lot size for Forex (EURUSD value)
  const calculatedLotSize = useMemo(() => {
    const riskCash = (riskPercentage / 100) * customBalance;
    const pipValueStandard = 10; 
    const lots = riskCash / (stopLossPips * pipValueStandard);
    return Math.max(0.01, parseFloat(lots.toFixed(2)));
  }, [riskPercentage, customBalance, stopLossPips]);

  // Sizing costs (Spread and commission overhead)
  const brokerOverhead = useMemo(() => {
    const activeSpread = liveSpread;
    const activeComm = liveCommission;
    const spreadCost = calculatedLotSize * activeSpread * 10;
    const commissionCost = calculatedLotSize * activeComm;
    return {
      spreadCost,
      commissionCost,
      totalOverhead: spreadCost + commissionCost
    };
  }, [calculatedLotSize, liveSpread, liveCommission]);

  // Calculated Contract Size for Futures
  const calculatedFuturesContracts = useMemo(() => {
    const riskCash = (riskPercentage / 100) * customBalance;
    // Micro contract (MES) point value is $5, standard E-mini (ES) point value is $50. Tick is 4 per point.
    // Let's assume size is stopLossPips. If tick is 1.25$ MES, 1.25 * stopLossPips.
    const microContracts = riskCash / (stopLossPips * 1.25);
    const miniContracts = microContracts / 10;
    return {
      micros: Math.max(1, Math.round(microContracts)),
      minis: Math.max(0, Math.round(miniContracts))
    };
  }, [riskPercentage, customBalance, stopLossPips]);

  // Computable Risk Management Survival Calculations 
  const survivalMetrics = useMemo(() => {
    const riskCash = (riskPercentage / 100) * customBalance;
    const totalOverheadPerTrade = accountMode === 'live' ? brokerOverhead.totalOverhead : 0;
    const totalCostPerTrade = riskCash + totalOverheadPerTrade;

    // 1. Linear Decay (Fixed Sizing): Losing a fixed amount of cash every trade
    const tradesUntilGoneFixed = totalCostPerTrade > 0 
      ? Math.max(1, Math.floor(customBalance / totalCostPerTrade)) 
      : 0;

    // 2. Fractional Decay (Compounded Sizing): Risking a % of remaining balance
    const riskFraction = (riskPercentage / 100);
    const tradesUntil90PercentLossCompounded = riskFraction > 0
      ? Math.max(1, Math.floor(Math.log(0.1) / Math.log(1 - riskFraction)))
      : Infinity;

    // 3. Days of Survival under Daily Loss Limit
    const survivalDaysLimit = Math.max(1, Math.floor(100 / Math.max(0.1, riskPerDayPct)));

    // 4. Mathematical Probability of Ruin
    const p = winRate / 100;
    const q = 1 - p;
    const R = riskReward;
    const expectancy = p * R - q;

    let ruinProbability = 100;
    if (expectancy > 0) {
      // Risk of Ruin = ((1 - A) / (1 + A)) ^ U
      const advantage = (p * R - q) / (p * R + q);
      const units = 100 / Math.max(0.1, riskPercentage);
      ruinProbability = Math.pow((1 - advantage) / (1 + advantage), units) * 100;
    }

    return {
      tradesUntilGoneFixed,
      tradesUntil90PercentLossCompounded,
      survivalDaysLimit,
      expectancy,
      ruinProbability: Math.min(100, Math.max(0, ruinProbability))
    };
  }, [accountMode, customBalance, riskPercentage, brokerOverhead, riskPerDayPct, winRate, riskReward]);

  // Challenge Compounding Projections 
  const challengeMilestones = useMemo(() => {
    let current = challengeStartBalance;
    const target = challengeTargetBalance;
    const rate = challengeGainTargetPct / 100;
    const withdrawRate = challengeWithdrawnRate / 100;
    const steps = [];
    
    let stepCount = 0;
    while (current < target && stepCount < 50) {
      stepCount++;
      const gain = current * rate;
      const profitToReinvest = gain * (1 - withdrawRate);
      const profitToWithdraw = gain * withdrawRate;
      const nextBalance = current + profitToReinvest;
      
      steps.push({
        step: stepCount,
        starting: current,
        gain,
        withdrawn: profitToWithdraw,
        ending: nextBalance
      });
      current = nextBalance;
    }
    
    return {
      steps,
      totalStepsNeeded: steps.length === 50 && current < target 
        ? Math.ceil(Math.log(target / challengeStartBalance) / Math.log(1 + rate * (1 - withdrawRate))) 
        : stepCount,
      finalProjected: current
    };
  }, [challengeStartBalance, challengeTargetBalance, challengeGainTargetPct, challengeWithdrawnRate]);

  // Computation of Scaling Timeline based on velocity (milestones completed per month)
  const scalingTimeline = useMemo(() => {
    const totalSteps = challengeMilestones.totalStepsNeeded;
    const velocity = milestonesPerMonth;
    if (totalSteps <= 0) {
      return { 
        totalDays: 0, 
        months: 0, 
        weeks: 0, 
        days: 0, 
        checkpoints: [], 
        monthlyMilestones: [] 
      };
    }

    // Average days to complete 1 milestone step = 30.4375 days / velocity
    const daysPerStep = 30.4375 / Math.max(0.5, velocity);
    const totalDaysNeeded = totalSteps * daysPerStep;
    const monthsCalculated = Math.floor(totalDaysNeeded / 30.4375);
    const remainingDays = totalDaysNeeded % 30.4375;
    const weeksCalculated = Math.floor(remainingDays / 7);
    const daysCalculated = Math.round(remainingDays % 7);

    // Calculate dates for checkpoints: Start, 25%, 50%, 75%, 100%
    const stepsArray = challengeMilestones.steps;
    const startBalance = challengeStartBalance;
    const targetBalance = challengeTargetBalance;
    const span = targetBalance - startBalance;

    const findStepForPct = (pct: number) => {
      const targetVal = startBalance + span * pct;
      const index = stepsArray.findIndex(s => s.ending >= targetVal);
      if (index !== -1) {
        return index + 1; // 1-indexed step
      }
      return Math.max(1, Math.round(totalSteps * pct));
    };

    const step25 = findStepForPct(0.25);
    const step50 = findStepForPct(0.50);
    const step75 = findStepForPct(0.75);
    const step100 = totalSteps;

    const formatDateVal = (daysOffset: number) => {
      // Create a fixed anchor (today or a specific mockup date like user balance timestamp)
      const d = new Date();
      d.setDate(d.getDate() + Math.round(daysOffset));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getBalanceAtStep = (stepNum: number) => {
      if (stepNum <= 0) return startBalance;
      if (stepNum <= stepsArray.length) {
        return stepsArray[stepNum - 1].ending;
      }
      // Extrapolate
      const rate = challengeGainTargetPct / 100;
      const withdraw = challengeWithdrawnRate / 100;
      return startBalance * Math.pow(1 + rate * (1 - withdraw), stepNum);
    };

    const checkpoints = [
      {
        id: 'start',
        label: 'Base Inception',
        pct: 0,
        step: 0,
        balance: startBalance,
        daysOffset: 0,
        dateStr: formatDateVal(0),
        desc: 'Seed deposit live'
      },
      {
        id: 'q1',
        label: '25% Progress Milestone',
        pct: 25,
        step: step25,
        balance: getBalanceAtStep(step25),
        daysOffset: step25 * daysPerStep,
        dateStr: formatDateVal(step25 * daysPerStep),
        desc: 'Contract scaling active'
      },
      {
        id: 'q2',
        label: '50% Halfway Point',
        pct: 50,
        step: step50,
        balance: getBalanceAtStep(step50),
        daysOffset: step50 * daysPerStep,
        dateStr: formatDateVal(step50 * daysPerStep),
        desc: 'Cushion protection secure'
      },
      {
        id: 'q3',
        label: '75% Strategic Threshold',
        pct: 75,
        step: step75,
        balance: getBalanceAtStep(step75),
        daysOffset: step75 * daysPerStep,
        dateStr: formatDateVal(step75 * daysPerStep),
        desc: 'Compounding acceleration'
      },
      {
        id: 'target',
        label: '100% Target Zenith',
        pct: 100,
        step: step100,
        balance: getBalanceAtStep(step100),
        daysOffset: step100 * daysPerStep,
        dateStr: formatDateVal(step100 * daysPerStep),
        desc: 'Peak milestone hit'
      },
    ];

    // Build monthly breakdown
    const totalEstMonths = Math.ceil(totalDaysNeeded / 30.4375);
    const maxMonthsShow = Math.min(12, Math.max(1, totalEstMonths));
    const monthlyMilestones = [];
    
    for (let m = 1; m <= maxMonthsShow; m++) {
      const stepAtEndOfMonth = Math.min(totalSteps, Math.round(m * velocity));
      const balanceAtEndOfMonth = getBalanceAtStep(stepAtEndOfMonth);
      const approxDateStr = formatDateVal(m * 30.4375);
      monthlyMilestones.push({
        monthNumber: m,
        step: stepAtEndOfMonth,
        balance: balanceAtEndOfMonth,
        dateStr: approxDateStr
      });
      if (stepAtEndOfMonth >= totalSteps) break;
    }

    return {
      totalDays: Math.ceil(totalDaysNeeded),
      months: monthsCalculated,
      weeks: weeksCalculated,
      days: daysCalculated,
      checkpoints,
      monthlyMilestones
    };
  }, [challengeMilestones, challengeStartBalance, challengeTargetBalance, challengeGainTargetPct, challengeWithdrawnRate, milestonesPerMonth]);

  const selectedPlatform = useMemo(() => {
    return PH_PROP_PLATFORMS.find(p => p.id === platformId) || PH_PROP_PLATFORMS[0];
  }, [platformId]);

  const selectedBroker = useMemo(() => {
    return PH_LIVE_BROKERS.find(b => b.id === liveBrokerId) || PH_LIVE_BROKERS[0];
  }, [liveBrokerId]);

  // Helper trigger to load broker values when selected broker changes
  useEffect(() => {
    if (selectedBroker && selectedBroker.id !== 'custom') {
      setLiveLeverage(selectedBroker.defaultLeverage);
      setLiveSpread(selectedBroker.defaultSpread);
      setLiveCommission(selectedBroker.defaultCommission);
    }
  }, [selectedBroker]);

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header Bannerized */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950/20 p-6 md:p-8">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-black tracking-widest border border-indigo-500/20">
                PRO LAB & COMPENSATORY ENGINE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
              Funding <span className="text-indigo-400">&amp; Live Broker</span> Suite
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              Equip your trading system with calibrated safety buffers, risk metrics, and country-tailored payout parameters. 
              Toggle modes and select tabs below to compute your optimal strategy parameters.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => {
                setAccountMode('funded');
                setActiveTab('sizing');
              }}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap",
                accountMode === 'funded'
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <Shield className="w-4 h-4 shrink-0" />
              Evaluation Prop Mode
            </button>
            <button
              onClick={() => {
                setAccountMode('live');
                setActiveTab('sizing');
              }}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap",
                accountMode === 'live'
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <Zap className="w-4 h-4 shrink-0" />
              Live Broker Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Structural Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Engine controls Bar (Column span 4) */}
        <div className="lg:col-span-4 bg-zinc-900 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h2 className="text-xs uppercase font-extrabold text-white tracking-widest font-mono">
                Engine Settings
              </h2>
            </div>
            <span className={cn(
              "text-xs font-bold font-mono uppercase px-2.5 py-1 rounded",
              accountMode === 'funded' ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400"
            )}>
              {accountMode === 'funded' ? "Prop account" : "Personal cash"}
            </span>
          </div>

          {/* Account Capital parameter */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider font-mono">
                Target Account Balance
              </label>
              <button
                type="button"
                onClick={() => setCustomBalance(settings.startingBalance || 50000)}
                className="text-xs text-zinc-400 hover:text-indigo-400 transition-all font-bold uppercase tracking-wider"
              >
                Sync Settings
              </button>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-405">
                {settings.currency || 'USD'}
              </span>
              <input
                type="number"
                value={customBalance}
                onChange={(e) => setCustomBalance(Math.max(10, Number(e.target.value)))}
                className="w-full pl-14 pr-4 py-3 bg-zinc-950 border border-zinc-850 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500/40 transition-all font-bold"
              />
            </div>

            {/* Quick Balance Presets */}
            <div className="grid grid-cols-3 gap-1.5">
              {[10000, 25000, 50000, 100000, 150000, 250000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomBalance(amt)}
                  className={cn(
                    "py-1.5 rounded-xl border text-xs font-mono font-bold transition-all",
                    customBalance === amt
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "bg-zinc-950 border-transparent text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Style selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-wider font-mono block">
              Trading Style Protocol
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'scalper', label: '⚡ Scalper', desc: 'Hold secs-mins' },
                { id: 'daytrader', label: '📅 Daytrader', desc: 'Closed same day' },
                { id: 'swing', label: '🌙 Swing', desc: 'Hold days-weeks' },
                { id: 'news', label: '📰 News Catalyst', desc: 'Event momentum' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTradingStyle(style.id as any)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-16",
                    tradingStyle === style.id
                      ? "bg-indigo-500/5 border-indigo-500 text-indigo-400"
                      : "bg-zinc-950 border-transparent text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-wider block">{style.label}</span>
                  <span className="text-xs text-zinc-400 font-medium leading-none block">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Engine Parameters Summary Card */}
          <div className="p-4 bg-zinc-950 rounded-2xl space-y-2 text-xs font-mono text-zinc-300">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block font-sans">
              System Active Diagnostics
            </span>
            <div className="flex justify-between items-center text-zinc-350 pb-1.5 font-mono">
              <span>Selected Balance:</span>
              <span className="text-white font-bold">{formatCurrency(customBalance, settings.currency)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-355 pb-1.5 font-mono">
              <span>Risk Recommendation:</span>
              <span className={cn("font-bold", accountMode === 'funded' ? "text-indigo-400" : "text-emerald-400")}>
                {metrics.baseRiskPct}% ({formatCurrency(metrics.recommendedRiskAmount, settings.currency)})
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-350 font-mono">
              <span className="truncate">Limit Capacity:</span>
              <span className="text-indigo-400 font-bold">-{metrics.dailyDrawdownPct}% Daily Threshold</span>
            </div>
          </div>
        </div>

        {/* Right Active Workspace Panel (Column span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Workspace Subtabs Navigation */}
          <div className="flex flex-col sm:flex-row gap-2 bg-zinc-950 p-1.5 rounded-2xl">
            {[
              { id: 'sizing', label: ' Sizing & Limits', icon: Calculator },
              { id: 'ruin', label: '🛡️ Safety & Ruin', icon: Shield },
              { id: 'roadmap', label: '📈 Compound Roadmap', icon: TrendingUp },
              { id: 'directory', label: accountMode === 'funded' ? '🏢 Prop Directory' : '🏢 Broker Settings', icon: Building },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                  activeTab === tab.id
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/25"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent"
                )}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display Container */}
          <div className="transition-all duration-300">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: SIZING & LIMITS */}
              {activeTab === 'sizing' && (
                <motion.div
                  key="sizing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Metric Block Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Safe Sizing Card */}
                    <div className="bg-zinc-900 rounded-3xl p-5 relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-3 text-zinc-800/20 pointer-events-none">
                        <TrendingUp className="w-10 h-10 stroke-1" />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono mb-1">
                        {accountMode === 'funded' ? "Safety Target allocation" : "Optimal Sizing Target"}
                      </p>
                      <p className="text-lg font-mono font-black text-white">
                        {formatPercent(metrics.baseRiskPct / 100)} Risk Target
                      </p>
                      <p className="text-xs text-zinc-300 mt-1.5 font-mono font-medium">
                        Base risk: <span className="text-indigo-400 font-bold">{formatCurrency(metrics.recommendedRiskAmount, settings.currency)}</span> cash risk budget.
                      </p>
                    </div>

                    {/* Daily drawdown limit */}
                    <div className="bg-zinc-900 rounded-3xl p-5 relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-3 text-zinc-850 pointer-events-none">
                        <AlertTriangle className="w-10 h-10 stroke-1 text-zinc-850" />
                      </div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono mb-1">
                        {accountMode === 'funded' ? "Daily Hard Stop threshold" : "Emergency Daily Drawdown limit"}
                      </p>
                      <p className="text-lg font-mono font-black text-indigo-400">
                        {formatCurrency(metrics.dailyLossLimitVal, settings.currency)}
                      </p>
                      <p className="text-xs text-zinc-300 mt-1.5 font-mono font-medium">
                        System hard cap of <span className="text-indigo-400 font-bold">{metrics.dailyDrawdownPct}%</span> budget per session.
                      </p>
                    </div>

                    {/* Peak-to-Valley Maximum drawdown limit */}
                    <div className="bg-zinc-900 rounded-3xl p-5 relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-3 text-zinc-800/20 pointer-events-none">
                        <TrendingDown className="w-10 h-10 stroke-1" />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono mb-1">
                        {accountMode === 'funded' ? "Total Prop Max Limit" : "Total Personal Capital Cap"}
                      </p>
                      <p className="text-lg font-mono font-black text-indigo-400">
                        {formatCurrency(metrics.maxDrawdownVal, settings.currency)}
                      </p>
                      <p className="text-xs text-zinc-300 mt-1.5 font-mono font-medium">
                        System fails if account drops beneath <span className="text-indigo-400 font-bold">{metrics.maxDrawdownPct}%</span> block value.
                      </p>
                    </div>
                  </div>

                  {/* Calculator Workspace Panel */}
                  <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-indigo-400 shrink-0" />
                          Position Size & Lot Capacity calculator
                        </h3>
                        <p className="text-zinc-400 text-xs uppercase font-mono tracking-wider mt-1">
                          Calculates contracts or lots mathematically backed by stop distances
                        </p>
                      </div>

                      {/* Currency or Future switch category */}
                      <div className="flex bg-zinc-950 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setCalculatorCategory('Forex')}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all",
                            calculatorCategory === 'Forex' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Forex Lots
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalculatorCategory('Futures')}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all",
                            calculatorCategory === 'Futures' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Futures Contracts
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Inputs Left side */}
                      <div className="space-y-4">
                        {/* Risk size selection */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-zinc-300 font-extrabold uppercase tracking-wider font-mono">
                            <span>Trade Sequence Risk (%)</span>
                            <span className="text-indigo-400 font-bold">{riskPercentage}% Risk</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.05"
                            value={riskPercentage}
                            onChange={(e) => setRiskPercentage(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-950 rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>0.1% (Safe passing)</span>
                            <span>1.0% (Balanced max)</span>
                            <span>5.0% (High live)</span>
                          </div>
                        </div>

                        {/* Stop loss in Pips/ticks */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-zinc-300 font-extrabold uppercase tracking-wider font-mono">
                            <span>Stop Loss Target distance</span>
                            <span className="text-zinc-300 font-bold">{stopLossPips} {calculatorCategory === 'Futures' ? 'Ticks' : 'Pips'} SL</span>
                          </div>
                          <input
                            type="number"
                            value={stopLossPips}
                            onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500/30"
                          />
                          <p className="text-xs text-zinc-400 leading-normal font-mono uppercase">
                            * {calculatorCategory === 'Futures' ? 'Standard Micro tick values computed at $1.25 MES / $12.50 ES standard' : 'Assumed standard major pair multiplier of $10 per pip per full lots'}
                          </p>
                        </div>
                      </div>

                      {/* Display calculations Right side */}
                      <div className="bg-zinc-950/40 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                            Maximum Safe Size allocation
                          </span>

                          {calculatorCategory === 'Futures' ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-zinc-300 uppercase font-mono">E-Mini Contracts Cap</p>
                                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Standard ES / NQ Indices / Crude Oil</p>
                                </div>
                                <p className="text-xl font-mono font-black text-indigo-400">{calculatedFuturesContracts.minis} Minis</p>
                              </div>
                              <div className="flex items-center justify-between pt-3">
                                <div>
                                  <p className="text-xs font-extrabold text-zinc-300 uppercase font-mono">Micro Contracts Cap</p>
                                  <p className="text-xs text-zinc-400 font-mono mt-0.5">MES / MNQ indices / Gold Micros</p>
                                </div>
                                <p className="text-xl font-mono font-black text-emerald-400">{calculatedFuturesContracts.micros} Micros</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-zinc-300 uppercase font-mono">Forex Standard Lots Cap</p>
                                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Optimal fully standard lot position</p>
                                </div>
                                <p className="text-xl font-mono font-black text-indigo-400">{calculatedLotSize} Lots</p>
                              </div>
                              <div className="flex items-center justify-between pt-3">
                                <div>
                                  <p className="text-xs font-extrabold text-zinc-300 uppercase font-mono">Forex CFD Mini Lots Capacity</p>
                                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Divided micro/mini contract setups</p>
                                </div>
                                <p className="text-sm font-mono font-black text-zinc-350">
                                  {(calculatedLotSize * 10).toFixed(1)} Minis / {(calculatedLotSize * 100).toFixed(0)} Micros
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3.5 bg-indigo-500/5 rounded-2xl space-y-1 animate-pulse">
                          <p className="text-xs font-extrabold text-zinc-200 uppercase font-mono block">
                            ⚠️ Sizing Risk Threshold Alert
                          </p>
                          <p className="text-xs text-zinc-300 leading-normal font-mono leading-relaxed">
                            Risking over <span className="text-indigo-400 font-bold">1.0%</span> triggers extreme sequence variance. Under funded rules, keeping single sequences below <span className="text-emerald-400 font-bold">0.5%</span> risk minimizes high liquidations.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Style Avoidance Guard */}
                  <div className="bg-zinc-900 rounded-3xl p-6">
                    <div className="flex items-center gap-2 pb-3 mb-4">
                      <AlertOctagon className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-xs font-black uppercase text-white tracking-widest font-mono">
                        Active Style Guard Guide: Things to Avoid
                      </h3>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tradingStyle === 'scalper' && (
                        <>
                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Clock className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Red-Folder News release volatility</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              High slippage orders. Passing standard evaluation protocols prohibits execution 2 minutes before and after high inflation indices.
                            </p>
                          </div>
                          
                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-zinc-300">
                              <TrendingDown className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">High volume transactional counts</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Executing 25+ trades daily bleeds account targets to commissions. Cap failed attempts to a strict limit of 3 per session.
                            </p>
                          </div>
                        </>
                      )}

                      {tradingStyle === 'daytrader' && (
                        <>
                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Target className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Holdings Past Market Settlement times</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Futures contract holds past 4:59 PM EST triggers hard account disqualification. Setup alerts or auto-flatten triggers.
                            </p>
                          </div>

                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-zinc-300">
                              <RefreshCw className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Chasing Midday Low liquidity volumes</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Trading between 11:30 AM and 1:30 PM EST leads to spread traps and whipsaws. Confine your setups to active morning margins.
                            </p>
                          </div>
                        </>
                      )}

                      {tradingStyle === 'swing' && (
                        <>
                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Weekend market opening gaps</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Significant opening spread gap is typical. Flatten trades before Friday closing times or scale down risk by 75% to protect capital.
                            </p>
                          </div>

                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-zinc-300">
                              <Layers className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Swap fee accumulation cost</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Holding non-hedged positions across multiple daily rollover segments accrues swap interest. Choose swap-free directories.
                            </p>
                          </div>
                        </>
                      )}

                      {tradingStyle === 'news' && (
                        <>
                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Market orders on exact millisecond outputs</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              Executing immediate market orders during CPI or FOMC releases captures catastrophic delay slippages. Use limit stop grids.
                            </p>
                          </div>

                          <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-zinc-300">
                              <Shield className="w-4 h-4 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">Evaluation specific news limits</span>
                            </div>
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed uppercase">
                              FTMO and FundedNext restrict payout allocations if trades occur within active windows. Monitor compliance parameters.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SYSTEM SAFETY & RISK OF RUIN */}
              {activeTab === 'ruin' && (
                <motion.div
                  key="ruin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-zinc-900 rounded-3xl p-6 space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Computable Ruin &amp; System edge viability guard
                      </h3>
                      <p className="text-zinc-400 text-xs font-mono tracking-wider uppercase mt-1">
                        Mathematical probability modeling consecutive failure sequences inside standard series
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* sliders parameters left */}
                    <div className="space-y-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        System Historical Parameters
                      </span>

                      {/* Win rate slider */}
                      <div className="space-y-2.5 p-4 bg-zinc-950 rounded-2xl font-sans">
                        <div className="flex justify-between font-black text-zinc-350 uppercase tracking-wider text-xs font-mono">
                          <span>Verified win rate (%)</span>
                          <span className="text-emerald-400 font-black">{winRate}% WinRate</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="95"
                          step="1"
                          value={winRate}
                          onChange={(e) => setWinRate(Number(e.target.value))}
                          className="w-full accent-emerald-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-mono text-zinc-400">
                          <span>20% (Low Edge RR build)</span>
                          <span>50% (Standard)</span>
                          <span>95% (Extreme Accuracy)</span>
                        </div>
                      </div>

                      {/* RR target slider */}
                      <div className="space-y-2.5 p-4 bg-zinc-950 rounded-2xl font-sans">
                        <div className="flex justify-between font-black text-zinc-350 uppercase tracking-wider text-xs font-mono">
                          <span>Expected Reward-to-Risk (R:R)</span>
                          <span className="text-indigo-400 font-black">{riskReward.toFixed(1)}R Average</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="5.0"
                          step="0.1"
                          value={riskReward}
                          onChange={(e) => setRiskReward(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-mono text-zinc-400">
                          <span>1.0R (Even Ratio)</span>
                          <span>2.0R (Symmetrical Advantage)</span>
                          <span>5.0R (High Swing Scale)</span>
                        </div>
                      </div>

                      {/* Swap fee calculator cost note */}
                      {accountMode === 'live' && (
                        <div className="p-4 bg-zinc-950 rounded-2xl space-y-1.5 text-xs font-mono">
                          <span className="text-zinc-300 uppercase font-black text-xs block">Broker Overhead Burden Details</span>
                          <div className="flex justify-between text-zinc-405">
                            <span>Lot Overhead (Spread + Commission):</span>
                            <span className="text-white font-bold">${brokerOverhead.totalOverhead.toFixed(2)} USD</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-normal uppercase">
                            Overhead represents silent balance decay on every transaction. raw spread accounts decrease transactional latency slippages.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* computed outcome visual cards right */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                        Survival Computations &amp; Decay Matrix
                      </span>

                      {/* ruin probability rating visualizer */}
                      <div className={cn(
                        "p-5 rounded-3xl text-center transition-all duration-300 font-sans relative overflow-hidden",
                        survivalMetrics.ruinProbability > 40
                          ? "bg-rose-500/10 text-rose-450"
                          : survivalMetrics.ruinProbability > 15
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-400"
                      )}>
                        <span className="text-xs font-bold uppercase tracking-widest block mb-1 font-mono text-zinc-300">
                          Stochastic Probability of Ruin
                        </span>
                        <span className="text-3xl font-black font-mono block tracking-wider">
                          {survivalMetrics.ruinProbability.toFixed(1)}%
                        </span>
                        
                        <p className="text-xs uppercase leading-normal text-zinc-300 mt-2 font-mono">
                          {survivalMetrics.expectancy <= 0 
                            ? "System edge is mathematically negative. Failure is inevitable over long series." 
                            : `Viable edge detected. Ratio represents +${survivalMetrics.expectancy.toFixed(2)}R average expectancy per execution.`
                          }
                        </p>
                      </div>

                      {/* Segmented Risk of Ruin Chart with glowing segment indicators */}
                      <div className="p-5 bg-zinc-950 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                              Ruin Probability Spectrum Chart
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 uppercase font-mono">
                            Current Stochastic: {survivalMetrics.ruinProbability.toFixed(1)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-10 gap-1.5 h-20 items-end">
                          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((bracketStart) => {
                            const isCurrent = survivalMetrics.ruinProbability >= bracketStart && survivalMetrics.ruinProbability < (bracketStart === 90 ? 101 : bracketStart + 10);
                            
                            // Determine color palette based on severity
                            let colorClass = "bg-emerald-500";
                            let glowClass = "shadow-[0_0_12px_rgba(16,185,129,0.7)]";
                            if (bracketStart >= 20 && bracketStart < 50) {
                              colorClass = "bg-amber-500";
                              glowClass = "shadow-[0_0_12px_rgba(245,158,11,0.7)]";
                            } else if (bracketStart >= 50) {
                              colorClass = "bg-rose-500";
                              glowClass = "shadow-[0_0_12px_rgba(239,68,68,0.7)]";
                            }

                            return (
                              <div key={bracketStart} className="flex flex-col items-center space-y-1.5 h-full justify-end group cursor-pointer">
                                <div className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-zinc-200">
                                  {bracketStart}%
                                </div>
                                <div
                                  className={cn(
                                    "w-full rounded-md transition-all duration-300",
                                    isCurrent 
                                      ? cn("h-10 opacity-100 scale-x-105 border border-white/45", colorClass, glowClass)
                                      : "h-6 bg-zinc-800 opacity-25 group-hover:opacity-40"
                                  )}
                                />
                                {isCurrent && (
                                  <span className="text-[8.5px] uppercase font-bold text-white tracking-tight animate-bounce mt-1">
                                    Active
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs font-mono text-zinc-400 uppercase leading-snug text-center pt-1.5">
                          {survivalMetrics.ruinProbability <= 15 ? (
                            <span className="text-emerald-400 font-bold">🟢 SAFE HARBOR: Excellent system expectancy. Under consecutive sequences, ruin probability is highly suppressed.</span>
                          ) : survivalMetrics.ruinProbability <= 45 ? (
                            <span className="text-amber-400 font-bold">🟡 WARNING: Sizable variance detected. Review your risk-to-reward ratio and scaling parameters immediately.</span>
                          ) : (
                            <span className="text-rose-400 font-bold">🔴 EXTREME CORROSION: Positive statistical edge has decomposed. Account bankruptcy highly predictable.</span>
                          )}
                        </p>
                      </div>

                      {/* linear decay sequence */}
                      <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-1">
                        <span className="text-zinc-300 font-bold uppercase block text-xs font-mono">Trades to Ruin (Fixed lot size)</span>
                        <p className="text-xs text-zinc-400 uppercase font-mono leading-relaxed">
                          Consistently losing flat {riskPercentage}% per sequence without sizing adjustments:
                        </p>
                        <span className="text-sm font-black text-rose-500 font-mono block pt-1">
                          {survivalMetrics.tradesUntilGoneFixed} Consecutive Trades Blown
                        </span>
                      </div>

                      {/* fractonal decay sequence */}
                      <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-1">
                        <span className="text-zinc-300 font-bold uppercase block text-xs font-mono">Trades to Critical Drawdown (-90% compounding)</span>
                        <p className="text-xs text-zinc-400 uppercase font-mono leading-relaxed">
                          Downscaling position contracts relative to remaining balance of your asset count:
                        </p>
                        <span className="text-sm font-black text-amber-500 font-mono block pt-1">
                          {survivalMetrics.tradesUntil90PercentLossCompounded === Infinity ? '∞' : survivalMetrics.tradesUntil90PercentLossCompounded} Cycles capacity
                        </span>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: COMPOUND ROADMAP & CHALLENGE */}
              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {accountMode === 'funded' ? (
                    /* Funded Passing Roadmap steps */
                    <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
                      <div className="flex items-center gap-2 pb-4">
                        <Award className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <h3 className="text-sm font-black uppercase text-white tracking-wider">
                            The Prop Challenge Passing &amp; Payout Roadmap
                          </h3>
                          <p className="text-zinc-400 text-xs font-mono tracking-wider uppercase mt-1">
                            Standard steps aligned to pass evaluations with high security buffers
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-zinc-300">
                        {/* Milestone Step 1 */}
                        <div className="bg-zinc-950 p-4 rounded-2xl space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-[10px] border border-rose-500/20">
                              1
                            </span>
                            <span className="text-white font-black uppercase tracking-wider text-xs">Evaluation Passing</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-300 font-mono">
                            Challenge passing requirement averages 8% to 10% ({formatCurrency(customBalance * 0.08, settings.currency)} to {formatCurrency(customBalance * 0.10, settings.currency)}). Maintain strict <strong className="text-rose-400 font-bold">0.5% risk</strong> per trade setup to pass safely in 6-12 clean sessions.
                          </p>
                        </div>

                        {/* Milestone Step 2 */}
                        <div className="bg-zinc-950 p-4 rounded-2xl space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/20">
                              2
                            </span>
                            <span className="text-white font-black uppercase tracking-wider text-xs">Capital Cushion accumulation</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-300 font-mono">
                            Upon activation, do NOT request instant payouts. First, build a safety capital cushion of <strong className="text-emerald-400 font-bold">3% to 4%</strong> to absorb eventual losses. Scale sizing down by 50% during cushion build.
                          </p>
                        </div>

                        {/* Milestone Step 3 */}
                        <div className="bg-zinc-950 p-4 rounded-2xl space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[10px] border border-indigo-500/20">
                              3
                            </span>
                            <span className="text-white font-black uppercase tracking-wider text-xs">Payout Security Plan</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-300 font-mono">
                            Aim for consistent {formatCurrency(customBalance * 0.05, settings.currency)} periodic withdrawals. Strictly monitor the max 30% single-day profit cap rules to maintain clear split payouts from Deel/Rise channels to PH.
                          </p>
                        </div>
                      </div>

                      {/* Rule caution */}
                      <div className="p-3.5 bg-zinc-950 rounded-2xl border border-dashed border-zinc-800">
                        <span className="text-xs font-black uppercase tracking-wider text-rose-400 block mb-1 font-mono">
                          🚨 IMPORTANT COMPLIANCE DIRECTIVE
                        </span>
                        <p className="uppercase text-xs leading-relaxed text-zinc-400 font-mono">
                          Apex Futures platforms utilize real-time trailing drawdowns computed on realized intra-day high values during volatile surges. To preserve the account, close active trades before high volatility events.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Live Broker $1-$100 Componding Challenge */
                    <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
                      <div className="flex items-center gap-2 pb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <h3 className="text-sm font-black uppercase text-white tracking-wider">
                            Interactive Compounding &amp; Small Capital Escalator
                          </h3>
                          <p className="text-zinc-400 text-xs font-mono tracking-wider uppercase mt-1">
                            Scale a small capital account to a robust target through compounding steps
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* configuration panel */}
                        <div className="space-y-4">
                          {/* Starting capital input */}
                          <div className="space-y-1.5 font-mono text-xs">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Starting balance ($)</span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[1, 5, 10, 50, 100, 250, 500, 1000].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setChallengeStartBalance(val)}
                                  className={cn(
                                    "py-2 rounded-xl text-xs font-mono font-black transition-all",
                                    challengeStartBalance === val
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
                                  )}
                                >
                                  ${val}
                                </button>
                              ))}
                            </div>
                            <div className="relative mt-2">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">$</span>
                              <input
                                type="number"
                                min="1"
                                max="100000"
                                placeholder="Or enter exact manual starting balance..."
                                value={challengeStartBalance}
                                onChange={(e) => setChallengeStartBalance(Math.max(1, Number(e.target.value)))}
                                className="w-full pl-7 pr-4 py-2 bg-zinc-950 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500/40"
                              />
                            </div>
                          </div>

                          {/* Compound goal input target */}
                          <div className="space-y-1.5 font-mono text-xs">
                            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Compounding Target Balance ($)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">$</span>
                              <input
                                type="number"
                                min="2"
                                max="1000000"
                                value={challengeTargetBalance}
                                onChange={(e) => setChallengeTargetBalance(Math.max(2, Number(e.target.value)))}
                                className="w-full pl-7 pr-4 py-2 bg-zinc-950 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500/40"
                              />
                            </div>
                          </div>

                          {/* compounding rate slider */}
                          <div className="space-y-1.5 p-4 bg-zinc-950 rounded-2xl font-mono text-xs">
                            <div className="flex justify-between font-black text-zinc-300 uppercase tracking-wider">
                              <span>Milestone growth rate per cycle</span>
                              <span className="text-emerald-450 font-bold">+{challengeGainTargetPct}%</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="50"
                              step="1"
                              value={challengeGainTargetPct}
                              onChange={(e) => setChallengeGainTargetPct(Number(e.target.value))}
                              className="w-full accent-emerald-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer mt-1.5"
                            />
                          </div>

                          {/* Withdrawn/payout rate */}
                          <div className="space-y-1.5 p-4 bg-zinc-950 rounded-2xl font-mono text-xs">
                            <div className="flex justify-between font-black text-zinc-300 uppercase tracking-wider">
                              <span>profit withdraw rate</span>
                              <span className="text-amber-500 font-bold">{challengeWithdrawnRate}% Taken</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="85"
                              step="5"
                              value={challengeWithdrawnRate}
                              onChange={(e) => setChallengeWithdrawnRate(Number(e.target.value))}
                              className="w-full accent-amber-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer mt-1.5"
                            />
                          </div>

                          {/* Live Mode Computable Risk Survival Matrix Card */}
                          <div className="p-4 bg-zinc-950 rounded-2xl space-y-3 font-mono text-xs text-zinc-300">
                            <div className="flex items-center gap-1.5 pb-2">
                              <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                                Challenge Survival Diagnostics
                              </span>
                            </div>

                            <p className="text-zinc-400 text-xs leading-relaxed uppercase">
                              Steady sequences with <span className="text-white font-bold">{riskPercentage}% risk / trade</span> and <span className="text-emerald-400 font-bold">{riskPerDayPct}% daily limit</span>:
                            </p>

                            <div className="space-y-2.5 pt-1 font-mono">
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-zinc-500">Max trades (Fixed risk):</span>
                                <span className="text-rose-400 font-extrabold text-right">
                                  {riskPercentage > 0 ? Math.floor(100 / riskPercentage) : "∞"} Trades
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 uppercase leading-snug">
                                Complete account depletion to zero under linear drawdowns.
                              </p>

                              <div className="flex justify-between items-start gap-4 pt-2">
                                <span className="text-zinc-500">Max trades (Compounded):</span>
                                <span className="text-amber-500 font-extrabold text-right">
                                  {riskPercentage > 0 ? Math.max(1, Math.floor(Math.log(0.1) / Math.log(1 - (riskPercentage / 100)))) : "∞"} Trades
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 uppercase leading-snug">
                                Transactions before active contract size hits a catastrophic 90% drawdown depth.
                              </p>

                              <div className="flex justify-between items-start gap-4 pt-2">
                                <span className="text-zinc-500">Survival at daily limit:</span>
                                <span className="text-emerald-400 font-extrabold text-right">
                                  {riskPerDayPct > 0 ? Math.floor(100 / riskPerDayPct) : "∞"} Sessions
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 uppercase leading-snug">
                                Daily consecutive hitting loss-limits before total account depletion.
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* milestone lists on the right */}
                        <div className="space-y-4 font-mono">
                          <div className="flex justify-between items-center text-xs font-bold uppercase text-zinc-400">
                            <span>Compounding milestone matrix schedule</span>
                            <span className="text-emerald-400 font-bold">Total steps: {challengeMilestones.totalStepsNeeded}</span>
                          </div>

                          {/* List frame */}
                          <div className="bg-zinc-950 rounded-3xl p-5 max-h-[380px] overflow-y-auto custom-scrollbar space-y-2 text-xs">
                            {challengeMilestones.steps.slice(0, 15).map((step) => {
                                const stepRiskCash = (riskPercentage / 100) * step.starting;
                                const stepLots = Math.max(0.01, parseFloat((stepRiskCash / (stopLossPips * 10)).toFixed(2)));
                                return (
                                  <div key={step.step} className="flex justify-between items-center py-2.5 text-zinc-404 font-mono">
                                    <span className="text-zinc-500 font-black">HURDLE {step.step}:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-zinc-350">${step.starting.toFixed(2)}</span>
                                      <span className="text-zinc-600 font-bold font-mono">→</span>
                                      <span className="text-white font-extrabold">${step.ending.toFixed(2)}</span>
                                      <span className="text-xs text-emerald-400 font-bold ml-1.5">({stepLots} Lot Cap)</span>
                                    </div>
                                  </div>
                                );
                            })}

                            {challengeMilestones.steps.length > 15 && (
                              <p className="text-center font-bold text-zinc-400 pt-3 uppercase text-xs">
                                ... + {challengeMilestones.steps.length - 15} compounding steps required to reach target limit of ${challengeTargetBalance}.
                              </p>
                            )}

                            {challengeMilestones.steps.length === 0 && (
                              <p className="text-center font-bold text-amber-500 py-6 uppercase text-xs font-mono">
                                Warning: Starting capital has already bypassed compounding target goal limit!
                              </p>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Full-width interactive computation timeline */}
                      <div className="pt-6 space-y-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <h3 className="text-sm font-black uppercase text-white tracking-wider">
                              Account Sizing &amp; Progress Computation Timeline
                            </h3>
                            <p className="text-zinc-400 text-xs font-mono tracking-wider uppercase mt-1">
                              Forecast target completion days and progress checkpoints required to scale from Starting to Target Balance
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-zinc-300">
                          
                          {/* Speed regulation controller */}
                          <div className="p-5 bg-zinc-950 rounded-3xl space-y-5">
                            <div className="flex items-center gap-2 pb-2">
                              <Hourglass className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                                Growth Velocity Controller
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed uppercase">
                              Define how many milestones/growth steps you aim to secure successfully per calendar month.
                            </p>

                            <div className="space-y-2.5 p-4 bg-zinc-900/50 rounded-2xl">
                              <div className="flex justify-between items-center text-xs font-black text-white uppercase tracking-wider">
                                <span>Steps Per Month</span>
                                <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                                  {milestonesPerMonth} Steps/Mo
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={milestonesPerMonth}
                                onChange={(e) => setMilestonesPerMonth(Number(e.target.value))}
                                className="w-full accent-emerald-500 h-1 bg-zinc-800/80 rounded-lg appearance-none cursor-pointer mt-2"
                              />
                              <div className="flex justify-between text-[10px] text-zinc-500 mt-1 uppercase">
                                <span>1 (Swing)</span>
                                <span>4 (1/Week)</span>
                                <span>10 (2+/Week)</span>
                                <span>20 (Velocity)</span>
                              </div>
                            </div>

                            <div className="p-4 bg-zinc-900/40 rounded-2xl space-y-3">
                              <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                                Projected Dynamic Calendar Summary
                              </span>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Estimated Duration:</span>
                                  <span className="text-white block font-black text-sm">
                                    {scalingTimeline.months} mo, {scalingTimeline.weeks} wk
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Total Days:</span>
                                  <span className="text-emerald-400 block font-black text-sm">
                                    ~ {scalingTimeline.totalDays} Days
                                  </span>
                                </div>
                              </div>
                              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase pt-2 font-mono">
                                *Assumes a consistent schedule and trading performance. Timelines account for standard risk & compounded reinvestment targets.
                              </p>
                            </div>
                          </div>

                          {/* Interactive Progress Journey (Checkpoints) */}
                          <div className="lg:col-span-2 p-5 bg-zinc-950 rounded-3xl space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                              <Target className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                                Chronological Sizing Roadmap
                              </span>
                            </div>

                            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800/80 before:border-dashed">
                              {scalingTimeline.checkpoints.map((checkpoint, index) => {
                                const isFinal = index === scalingTimeline.checkpoints.length - 1;
                                const isStart = index === 0;
                                return (
                                  <div key={checkpoint.id} className="relative group">
                                    {/* Bullet node */}
                                    <div className={cn(
                                      "absolute -left-6 top-1.5 w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-300",
                                      isStart 
                                        ? "bg-zinc-900 border-zinc-700 text-zinc-500"
                                        : isFinal 
                                          ? "bg-emerald-555/10 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                          : "bg-indigo-500/10 border-indigo-505 text-indigo-400"
                                    )}>
                                      <div className={cn(
                                        "w-1.5 h-1.5 rounded-full animate-pulse",
                                        isStart 
                                          ? "bg-zinc-500"
                                          : isFinal 
                                            ? "bg-emerald-400"
                                            : "bg-indigo-400"
                                      )} />
                                    </div>

                                    {/* Content inside checkpoint capsule */}
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 p-3.5 bg-zinc-900/30 hover:bg-zinc-900/70 rounded-2xl transition-all duration-300 font-mono">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 font-mono">
                                          <span className="text-xs font-black text-white uppercase tracking-wider">
                                            {checkpoint.label}
                                          </span>
                                          {checkpoint.step > 0 && (
                                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold uppercase">
                                              Step {checkpoint.step}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-mono">
                                          {checkpoint.desc}
                                        </p>
                                      </div>

                                      <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-1.5 md:pt-0">
                                        <span className="text-xs font-mono font-black text-white">
                                          {formatCurrency(checkpoint.balance, settings.currency)}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-950 px-2 py-0.5 rounded">
                                          Proj: {checkpoint.dateStr}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* Month-over-Month Calendar breakdown layout */}
                        {scalingTimeline.monthlyMilestones.length > 0 && (
                          <div className="p-5 bg-zinc-950 rounded-3xl space-y-3.5">
                            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider block font-mono pl-1 border-l-2 border-emerald-500">
                              Monthly Capital Escalation Milestones
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
                              {scalingTimeline.monthlyMilestones.map((m) => (
                                <div key={m.monthNumber} className="bg-zinc-900/55 hover:bg-zinc-900 rounded-2xl p-4 space-y-2 transition-all duration-300 text-center font-mono">
                                  <span className="text-[10px] text-zinc-400 font-black uppercase block pb-1.5">
                                    Month {m.monthNumber}
                                  </span>
                                  <span className="text-xs font-extrabold text-white block">
                                    {formatCurrency(m.balance, settings.currency)}
                                  </span>
                                  <div className="space-y-1 font-mono">
                                    <span className="text-[9px] text-emerald-450 bg-emerald-500/10 px-1 py-0.5 rounded block font-bold">
                                      Step {m.step}
                                    </span>
                                    <span className="text-[8.5px] text-zinc-500 block leading-none">
                                      {m.dateStr}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: DIRECTORY & LOCAL PH PAYOUTS */}
              {activeTab === 'directory' && (
                <motion.div
                  key="directory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {accountMode === 'funded' ? (
                    /* Funded mode platform directory comparison lists */
                    <div className="space-y-6">
                      <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">
                              Philippine-Accessible Prop Platforms comparison
                            </h3>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono uppercase font-black tracking-wider">
                            Interactive selection updates payout specs below
                          </span>
                        </div>

                        {/* List grid cards selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {PH_PROP_PLATFORMS.map((plat) => (
                            <button
                              key={plat.id}
                              type="button"
                              onClick={() => setPlatformId(plat.id)}
                              className={cn(
                                "p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between h-24 relative overflow-hidden",
                                platformId === plat.id
                                  ? "bg-indigo-500/5 text-indigo-400 font-bold"
                                  : "bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                              )}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className="text-lg">{plat.logo}</span>
                                <span className="text-[10px] font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded font-black">
                                  {plat.type}
                                </span>
                              </div>
                              <div className="mt-2 text-left">
                                <span className="text-xs font-black uppercase tracking-wider block leading-none mb-1 text-white">
                                  {plat.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono block truncate">
                                  Payouts: Wise / GCash / Local Wire
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* selected details visualization */}
                        <div className="bg-zinc-950 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-3 pb-3">
                            <span className="text-2xl">{selectedPlatform.logo}</span>
                            <div>
                              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block font-mono">
                                {selectedPlatform.name} Community Evaluation
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                                Platform Structure type: {selectedPlatform.type} exchange connections
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-zinc-300">
                            
                            <div className="p-4 bg-zinc-900/60 rounded-xl space-y-1">
                              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 block">
                                Local PH Availability &amp; ISP latency
                              </span>
                              <p className="leading-relaxed">
                                {selectedPlatform.phAvailability}
                              </p>
                            </div>

                            <div className="p-4 bg-zinc-900/60 rounded-xl space-y-1">
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-450 block">
                                Payout corridors (GCash &amp; Banks)
                              </span>
                              <p className="leading-relaxed text-zinc-300 font-mono">
                                {selectedPlatform.payoutMethods}
                              </p>
                            </div>

                            <div className="p-4 bg-zinc-900/60 rounded-xl space-y-1">
                              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 block">
                                split percentages &amp; Refund benchmarks
                              </span>
                              <p className="leading-relaxed">
                                {selectedPlatform.feesAndSplit}
                              </p>
                            </div>

                            <div className="p-4 bg-zinc-900/60 rounded-xl space-y-1">
                              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 block">
                                Platform core compliance rules
                              </span>
                              <p className="leading-relaxed text-zinc-400 uppercase">
                                {selectedPlatform.rules}
                              </p>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    /* Live broker mode parameters customization directory list */
                    <div className="space-y-6">
                      <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">
                              Philippines Popular Live Forex &amp; CFD Brokers
                            </h3>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono uppercase font-black tracking-wider">
                            Choose Broker to seed diagnostics values
                          </span>
                        </div>

                        {/* Broker selection list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                          {PH_LIVE_BROKERS.map((broker) => {
                            const isSelected = liveBrokerId === broker.id;
                            return (
                              <button
                                key={broker.id}
                                type="button"
                                onClick={() => setLiveBrokerId(broker.id)}
                                className={cn(
                                  "p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between h-24 relative overflow-hidden",
                                  isSelected
                                    ? "bg-indigo-500/5 text-indigo-400 font-bold"
                                    : "bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                                )}
                              >
                                <div className="flex justify-between items-start w-full">
                                  <span className="text-lg">{broker.logo}</span>
                                  {broker.defaultSpread !== undefined && (
                                    <span className="text-[10px] font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded font-black">
                                      {broker.defaultSpread} Pips
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 text-left">
                                  <span className="text-xs font-black uppercase tracking-wider block leading-none mb-1 text-white">
                                    {broker.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-mono block truncate">
                                    1:{broker.defaultLeverage || 500} Cap
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* selected details & manual customized inputs fields */}
                        <div className="bg-zinc-950 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2 pb-3">
                            <span className="text-2xl">{selectedBroker.logo}</span>
                            <div>
                              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block font-mono">
                                {selectedBroker.name} Specification Guide
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                                Recommended connection setup for Manila / Philippine region
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            
                            {/* general local corridor info */}
                            <div className="space-y-3 font-mono text-xs text-zinc-300">
                              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 block">
                                Direct Local Deposit Gateway
                              </span>
                              <div className="p-4 bg-zinc-900/60 rounded-xl">
                                <p className="leading-relaxed">
                                  {selectedBroker.phAvailability}
                                </p>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed uppercase">
                                * INSTAPAY / MAYA corridors clear deposit cycles instantly. Direct wire transfers may take 24-48 business hours. Choose raw spread accounts to minimize slippage overhead.
                              </p>
                            </div>

                            {/* sliders manual adjustment parameters */}
                            <div className="space-y-3 font-mono text-xs text-zinc-300">
                              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 block font-mono">
                                Live Broker Manual Calibration Override
                              </span>

                              {/* Custom name parameter if custom broker checked */}
                              {liveBrokerId === 'custom' && (
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Custom Broker Identity</label>
                                  <input
                                    type="text"
                                    placeholder="Enter Custom name..."
                                    value={customBrokerName}
                                    onChange={(e) => setCustomBrokerName(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 rounded-xl text-white text-xs focus:outline-none placeholder-zinc-700 font-mono"
                                  />
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-3">
                                {/* Leverage Input */}
                                <div className="space-y-1">
                                  <span className="text-xs font-bold text-zinc-350 uppercase tracking-wider font-mono">Leverage limit</span>
                                  <input
                                    type="number"
                                    value={liveLeverage}
                                    onChange={(e) => setLiveLeverage(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-3 py-1.5 bg-zinc-900 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500/30 font-bold"
                                  />
                                </div>

                                {/* spread input */}
                                <div className="space-y-1 font-mono">
                                  <span className="text-xs font-bold text-zinc-350 uppercase tracking-wider">Spread (Pips)</span>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={liveSpread}
                                    onChange={(e) => setLiveSpread(Math.max(0, Number(e.target.value)))}
                                    className="w-full px-3 py-1.5 bg-zinc-900 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500/30 font-bold"
                                  />
                                </div>

                                {/* Commission input */}
                                <div className="space-y-1 col-span-2 font-mono">
                                  <span className="text-xs font-bold text-zinc-350 uppercase tracking-wider">Commission ($ Per Lot round-turn)</span>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={liveCommission}
                                    onChange={(e) => setLiveCommission(Math.max(0, Number(e.target.value)))}
                                    className="w-full px-3 py-1.5 bg-zinc-900 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500/30 font-bold"
                                  />
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* Static expert advice card bottom */}
      <div className="bg-zinc-950 rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 text-rose-455" />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 font-mono">
                LOCAL INTEGRATION ADVICE FOR PILIPINO TRADERS
              </p>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Philippine Gateways, GCash Networks, and Wise remittance tips
              </h4>
              <p className="text-zinc-500 text-[10px] font-mono leading-relaxed max-w-xl uppercase mt-1">
                When withdrawing platform rewards, select Deel / Rise localized integration. Standard USD transfers to PHP accounts via local bank wires capture approximately 1.5% commission slip compared to virtual Wise accounts.
              </p>
            </div>
          </div>
          
          <div className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 px-4 py-3 rounded-2xl shrink-0 uppercase">
            ⚡ ISP setup limit: <span className="text-emerald-400 font-black">Converge Fiber / pldt Fibr</span> (SG ping path: 12ms to 24ms maximum)
          </div>
        </div>
      </div>
    </div>
  );
}
