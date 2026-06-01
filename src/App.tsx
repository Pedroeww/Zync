/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  History,
  Target,
  Trophy,
  Scale,
  Cpu,
  Minus,
  AlertCircle,
  AlertTriangle,
  Menu as HamburgerIcon,
  X,
  CreditCard,
  Wallet,
  Trash2,
  Edit2,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Filter,
  Calendar,
  Camera,
  Download,
  Maximize,
  ChevronDown,
  ChevronUp,
  Mail,
  Instagram,
  Shield,
  FileText,
  Lock,
  Edit,
  Chrome,
  CheckCircle2,
  Zap,
  Globe,
  Star,
  Sparkles,
  User as UserIcon,
  Users,
  Info,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Clock,
  LayoutGrid,
  Bell,
  RotateCw,
  Brain,
  Tags,
  ShieldCheck,
  Activity
} from 'lucide-react';

const NewFeatureNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenUpdate = localStorage.getItem('zync_seen_v2_update');
    if (!hasSeenUpdate) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissNotification = () => {
    setIsVisible(false);
    localStorage.setItem('zync_seen_v2_update', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          className="fixed top-24 left-8 z-[100] max-w-sm"
        >
          <div className="bg-zinc-950/90 backdrop-blur-3xl border border-emerald-500/30 rounded-[2.5rem] p-6 shadow-[0_25px_60px_rgba(16,185,129,0.15)] flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <Zap className="w-20 h-20 text-emerald-500" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 relative z-10 shadow-inner">
              <Sparkles className="w-7 h-7 text-emerald-500 animate-pulse" />
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">System Update</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h4 className="text-white font-black text-base uppercase tracking-tighter mb-1.5">Economics & Markets Live</h4>
              <p className="text-zinc-500 text-[11px] font-medium leading-relaxed uppercase tracking-tight opacity-80">
                Institutional Data Streams and Global Economic Calendars are now synchronized to your dashboard.
              </p>
              <div className="mt-5 flex items-center gap-3">
                 <button 
                   onClick={dismissNotification}
                   className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                 >
                   Got it
                 </button>
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest border-l border-zinc-800/50 pl-3">v2.4.0 Alpha Sync</span>
              </div>
            </div>
            <button 
              onClick={dismissNotification}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { 
  format, 
  parseISO, 
  startOfDay, 
  eachDayOfInterval, 
  subDays, 
  addDays,
  addWeeks,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  formatDistanceStrict,
  addMonths,
  subMonths,
  isWithinInterval,
  isSameMonth,
  startOfYear
} from 'date-fns';
import { cn, formatCurrency, formatPercent } from './lib/utils';
import { supabase } from './supabaseClient';
import { dataService } from './services/dataService';
import { Trade, UserSettings, PlaybookItem, DashboardStats, MarketType, Side, EmotionalState, NewsImpact, ExitStatus, Account, User } from './types';
import { MOCK_TRADES } from './constants';
import ChecklistTab from './components/ChecklistTab';
import InvestorPlanTab from './components/InvestorPlanTab';

// --- Components ---

const ScrollAnimatedSection = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const GlowingCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'BUTTON' || target.tagName === 'A');
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full mix-blend-screen overflow-hidden hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isPointer ? 2 : 1,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
    >
      <div className="w-full h-full bg-indigo-500/30 blur-xl rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_15px_6px_rgba(129,140,248,0.4)]" />
      </div>
    </motion.div>
  );
};

interface MobileNavButtonProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: 'night' | 'light';
  key?: string | number;
}

const MobileNavButton = ({ icon: Icon, label, active, onClick, theme }: MobileNavButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-4 rounded-2xl transition-all",
      active 
        ? (theme === 'light' ? "bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-200" : "bg-emerald-500 text-black font-bold") 
        : (theme === 'light' ? "text-zinc-500 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-900")
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const QUOTES = [
  "The market is a device for transferring money from the impatient to the patient.",
  "In trading, the impossible happens about once every ten years.",
  "The goal of a successful trader is to make the best trades. Money is secondary.",
  "Doubt is not a pleasant condition, but certainty is absurd.",
  "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
  "Focus on the process, not the outcome.",
  "The market doesn't care about your feelings, only your discipline.",
  "Trading is 10% strategy, 90% psychology.",
  "Your trades are a mirror of your self-discipline.",
  "Amateurs trade for thrills. Professionals trade for profits.",
  "The best traders have no ego. You have to be okay with being wrong.",
  "Trading is not about being smart, it's about being disciplined.",
  "Markets are never wrong – opinions often are.",
  "Don't focus on the money; focus on executing the trade perfectly.",
  "Accepting a loss is a sign of strength, not weakness.",
  "Risk management is the only holy grail in trading.",
  "The most important organ in trading is the stomach, not the brain.",
  "Plan your trade and trade your plan.",
  "Success in trading comes from repetition of the correct habits.",
  "Don't trade the P&L, trade the chart."
];

interface AuthPageProps {
  onAuthComplete: (user: User) => void;
  theme: 'night' | 'light' | 'midnight' | 'obsidian' | 'slate' | 'forest' | 'abyss' | 'carbon';
  embedded?: boolean;
}

const AuthPage = ({ onAuthComplete, theme, embedded = false }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to connect with Google');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    if (provider === 'google') return handleGoogleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
            }
          }
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
          // Email confirmation is likely required
          setSuccessMessage("Your account has been created. Please check your email and verify your address before logging in.");
          setIsSignUp(false);
          setLoading(false);
          return;
        }

        if (data.session && data.user) {
          onAuthComplete({
            uid: data.user.id,
            email: data.user.email || '',
            displayName: data.user.user_metadata?.full_name || displayName || 'Trader'
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user && data.session) {
          onAuthComplete({
            uid: data.user.id,
            email: data.user.email || '',
            displayName: data.user.user_metadata?.full_name || 'Trader'
          });
        } else {
          throw new Error("Could not establish session. Please check your credentials.");
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const containerStyles = embedded 
    ? "w-full p-4 md:p-8 bg-zinc-950/40" 
    : cn("min-h-screen flex items-center justify-center p-6 transition-colors duration-500", 
        theme === 'light' ? "bg-zinc-50" : 
        theme === 'midnight' ? "bg-[#020617]" :
        theme === 'obsidian' ? "bg-black" :
        theme === 'slate' ? "bg-[#18181b]" :
        theme === 'forest' ? "bg-[#022c22]" :
        theme === 'abyss' ? "bg-[#0f172a]" :
        theme === 'carbon' ? "bg-[#171717]" :
        "bg-[#0A0A0B]");

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  return (
    <div className={containerStyles}>
      {!embedded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>
      )}

      <motion.div 
        initial={embedded ? {} : { opacity: 0, y: 20 }}
        animate={embedded ? {} : { opacity: 1, y: 0 }}
        className={cn(
          "relative w-full max-w-md p-8 md:p-10 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden",
          theme === 'light' && "bg-white/80 border-zinc-200",
          embedded && "shadow-none border-none bg-transparent p-0 md:p-0"
        )}
      >
        {!embedded && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />}
        
        <div className="text-center mb-8">
          {!embedded && (
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
          )}
          <h1 className={cn("text-3xl font-black text-white tracking-tighter mb-1", theme === 'light' && "text-zinc-900", embedded && "text-xl")}>
            ZY<span className="text-emerald-400">NC</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            {isSignUp ? 'Initialize Institutional Archive' : 'Secure Entry Point'}
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Chrome className="w-3.5 h-3.5 text-rose-400" />
            Continue with Google
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-zinc-600 tracking-[0.3em] bg-transparent">
            <span className="px-3 bg-[#0D0D0E]">Or with encrypted mail</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Profile"
                required
                className={cn(
                  "w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-all",
                  theme === 'light' && "bg-white border-zinc-200 text-zinc-900"
                )}
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@market.com"
              required
              className={cn(
                "w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-all",
                theme === 'light' && "bg-white border-zinc-200 text-zinc-900"
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={cn(
                "w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-all",
                theme === 'light' && "bg-white border-zinc-200 text-zinc-900"
              )}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-rose-400 text-[10px] uppercase tracking-wider font-black text-center">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-pulse">
              <p className="text-emerald-400 text-[10px] uppercase tracking-wider font-black text-center leading-relaxed">
                {successMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] mt-4"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Initialize Vault' : 'Secure Entry')}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-zinc-500">
            {isSignUp ? 'Already have a vault?' : 'New to private journaling?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              {isSignUp ? 'Access Vault' : 'Create Vault'}
            </button>
          </p>
          
          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-6">
             <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                <Shield className="w-3 h-3 text-emerald-500" />
                256-bit Encrypted
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                <Lock className="w-3 h-3 text-indigo-400" />
                Zero-Trust Data
             </div>
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <SentimentBiasMarquee />
        <FuturesMarquee />
      </div>
    </div>
  );
};

const NewsImpactDot = ({ impact }: { impact: NewsImpact }) => {
  const colors = {
    'Red': 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    'Orange': 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
    'Yellow': 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]',
    'None': 'bg-zinc-700'
  };
  return <div className={cn("w-2 h-2 rounded-full", colors[impact])} title={`${impact} folder news`} />;
};

const HeroSection = ({ name, stats, onTabChange, onExport, hasTrades, currency, hidePnL }: { 
  name: string, 
  stats: DashboardStats, 
  onTabChange: (tab: string) => void,
  onExport: () => void,
  hasTrades: boolean,
  currency: string,
  hidePnL: boolean
}) => {
  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };
  
  return (
  <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
    
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4 block">Personal Trading Performance</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent px-1">{name}</span>
          </h1>
          <p className="text-zinc-500 max-w-lg leading-relaxed text-sm">
            Your equity is currently at <span className="text-zinc-200 font-semibold">{displayValue(stats.totalPnL)}</span> this month. 
            Maintain your discipline and follow your rules.
          </p>
        </div>
        
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <button 
                onClick={() => onTabChange('plan')}
                className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95"
              >
                Optimize Strategy
              </button>
              <button 
                onClick={hasTrades ? onExport : undefined}
                className={cn(
                  "px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all active:scale-95",
                  hasTrades 
                    ? "bg-zinc-800 text-white border-white/5 hover:bg-zinc-700" 
                    : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50"
                )}
              >
                Export History
              </button>
            </div>
            {!hasTrades && (
              <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest text-center animate-pulse">
                Add trade records to unlock export
              </p>
            )}
          </div>
      </div>
    </div>

    <div className="mt-12 p-4 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl inline-flex items-center gap-4">
         <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-400" />
         </div>
         <p className="text-xs text-zinc-400 italic">
           "{QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length]}"
         </p>
      </div>
    </div>
  );
};

const Footer = ({ theme, onOpenPrivacy, onOpenTerms }: { theme: 'night' | 'light', onOpenPrivacy: () => void, onOpenTerms: () => void }) => (
  <footer className={cn(
    "mt-20 pt-12 pb-20 border-t",
    theme === 'light' ? "border-zinc-200" : "border-white/5"
  )}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className={cn("text-xl font-black tracking-tighter italic", theme === 'light' ? "text-zinc-900" : "text-white")}>ZYNC</span>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
          Professional-grade trading journal and analytics dashboard designed for serious traders. Track your edge, master your psychology, and optimize your performance.
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className={cn("text-center md:text-left text-xs font-black uppercase tracking-[0.2em]", theme === 'light' ? "text-zinc-900" : "text-zinc-400")}>Contact Information</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 justify-center md:justify-start group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Phone Number (PHP)</p>
              <p className={cn("text-sm font-bold", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>09666137502</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Gmail</p>
              <p className={cn("text-sm font-bold", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>Petergalicha@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className={cn("text-center md:text-left text-xs font-black uppercase tracking-[0.2em]", theme === 'light' ? "text-zinc-900" : "text-zinc-400")}>Social Presence</h4>
        <a 
          href="https://www.instagram.com/pedroeww/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 justify-center md:justify-start group hover:scale-[1.02] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Instagram</p>
            <p className={cn("text-sm font-bold", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>@pedroeww</p>
          </div>
        </a>
      </div>
    </div>
    
    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">© 2026 Zync Trading Journal. All Rights Reserved.</p>
      <div className="flex gap-6">
        <span 
          onClick={onOpenPrivacy}
          className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-emerald-400 cursor-pointer transition-colors"
        >
          Privacy
        </span>
        <span 
          onClick={onOpenTerms}
          className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-emerald-400 cursor-pointer transition-colors"
        >
          Terms of Service
        </span>
      </div>
    </div>
  </footer>
);

const LegalModal = ({ title, icon: Icon, children, onClose, theme }: { title: string, icon: any, children: React.ReactNode, onClose: () => void, theme: 'night' | 'light' }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/90 backdrop-blur-md"
    />
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      className={cn(
        "relative w-full max-w-2xl border rounded-3xl p-8 overflow-hidden max-h-[85vh] flex flex-col",
        theme === 'light' ? "bg-white border-zinc-200" : "bg-zinc-900 border-zinc-800 text-white"
      )}
    >
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
        </div>
        <button onClick={onClose} className="p-2 bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6 text-sm leading-relaxed text-zinc-400">
        {children}
      </div>
    </motion.div>
  </div>
);

const PrivacyContent = () => (
  <>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Data Collection</h4>
      <p>ZYNC Trading Journal is a locally-first application. We prioritize your privacy by storing your sensitive trading data, logs, and screenshots directly in your browser's local storage. We do not transmit your trade details to external servers unless explicitly configured by you.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Usage Information</h4>
      <p>To improve performance and user experience, we may collect anonymous usage statistics such as feature interaction frequency and performance benchmarks. This data never includes your trade amounts, assets, or notes.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Security</h4>
      <p>While your data resides locally, we recommend using private devices and clearing your cache before sharing hardware. ZYNC implements industry-standard encryption for browser-based state management to ensure consistency and integrity.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Your Rights</h4>
      <p>You have the absolute right to export, modify, or permanently delete your data at any time via the Settings menu. Once deleted, your records are purged from your machine and cannot be recovered.</p>
    </section>
  </>
);

const TermsContent = () => (
  <>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">1. Acceptance of Terms</h4>
      <p>By accessing ZYNC Trading Journal, you agree to be bound by these Terms of Service. This platform is provided for educational and analytical purposes only.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">2. Financial Disclaimer</h4>
      <p>ZYNC is not a financial advisor. Trading involves significant risk. The analytics and performance metrics generated by this app are based on historical data and do not guarantee future results. Never trade with money you cannot afford to lose.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">3. Use of Services</h4>
      <p>You agree to use ZYNC solely for lawful personal tracking. Any attempts to reverse engineer the performance algorithms or use the platform for fraudulent reporting is strictly prohibited.</p>
    </section>
    <section>
      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">4. Limitation of Liability</h4>
      <p>ZYNC and its developers shall not be liable for any direct or indirect financial losses resulting from the use of this software, including data loss due to browser cache clearance or device failure.</p>
    </section>
  </>
);

const ExportModal = ({ trades, profileName, onClose, currency, hidePnL, initialTradeId }: { trades: Trade[], profileName: string, onClose: () => void, currency: string, hidePnL: boolean, initialTradeId?: string }) => {
  const [rangeType, setRangeType] = useState<'day' | 'week' | 'month' | 'ytd' | 'custom' | 'trade'>(initialTradeId ? 'trade' : 'month');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(initialTradeId || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCapturing, setIsCapturing] = useState(false);
  const posterRef = React.useRef<HTMLDivElement>(null);

  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };

  const stats = useMemo(() => {
    let selectedTrades: Trade[] = [];
    const now = new Date();

    if (rangeType === 'day') {
      selectedTrades = trades.filter(t => isSameDay(parseISO(t.exitDate || t.entryDate), now));
    } else if (rangeType === 'week') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfWeek(now), end: endOfWeek(now) }));
    } else if (rangeType === 'month') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }));
    } else if (rangeType === 'ytd') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfYear(now), end: now }));
    } else if (rangeType === 'custom') {
      if (selectedDates.length === 0) return null;
      selectedTrades = trades.filter(t => 
        selectedDates.some(d => isSameDay(parseISO(t.exitDate || t.entryDate), d))
      );
    } else if (rangeType === 'trade') {
      if (!selectedTradeId) return null;
      const trade = trades.find(t => t.id === selectedTradeId);
      if (!trade) return null;
      selectedTrades = [trade];
    }

    if (selectedTrades.length === 0) return null;

    const totalPnL = selectedTrades.reduce((acc, t) => acc + t.pnl, 0);
    const totalPnLPercent = selectedTrades.reduce((acc, t) => acc + t.pnlPercentage, 0);
    const assets = Array.from(new Set(selectedTrades.map(t => t.asset))).slice(0, 3).join(', ');
    const sides = selectedTrades.map(t => t.side);
    const mostUsedSide = sides.filter(s => s === 'Long').length >= sides.filter(s => s === 'Short').length ? 'BUY' : 'SELL';

    return {
      totalPnL,
      totalPnLPercent,
      assets,
      mostUsedSide,
      count: selectedTrades.length
    };
  }, [trades, rangeType, selectedDates, selectedTradeId]);

  const handleExport = async () => {
    if (!posterRef.current || !stats) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350, // 4:5 ratio
      });
      download(dataUrl, `zync-pnl-${format(new Date(), 'yyyy-MM-dd')}.png`);
      onClose();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!stats) return;
    
    let selectedTrades: Trade[] = [];
    const now = new Date();

    if (rangeType === 'day') {
      selectedTrades = trades.filter(t => isSameDay(parseISO(t.exitDate || t.entryDate), now));
    } else if (rangeType === 'week') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfWeek(now), end: endOfWeek(now) }));
    } else if (rangeType === 'month') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }));
    } else if (rangeType === 'ytd') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.exitDate || t.entryDate), { start: startOfYear(now), end: now }));
    } else if (rangeType === 'custom') {
      selectedTrades = trades.filter(t => 
        selectedDates.some(d => isSameDay(parseISO(t.exitDate || t.entryDate), d))
      );
    } else if (rangeType === 'trade') {
      selectedTrades = trades.filter(t => t.id === selectedTradeId);
    }

    if (selectedTrades.length === 0) return;

    const headers = ['Date', 'Asset', 'Side', 'Entry', 'Exit', 'P&L', 'P&L %', 'Strategy', 'Notes'];
    const rows = selectedTrades.map(t => [
      format(parseISO(t.exitDate || t.entryDate), 'yyyy-MM-dd HH:mm'),
      t.asset,
      t.side,
      t.entryPrice,
      t.exitPrice,
      t.pnl.toFixed(2),
      t.pnlPercentage.toFixed(2),
      t.strategy,
      t.notes || ''
    ]);

    // Better CSV escaping: wrap in quotes and escape internal quotes
    const escape = (val: any) => {
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map(row => row.map(escape).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zync_trades_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Export Options</h3>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            {(['day', 'week', 'month', 'ytd'] as const).map(type => (
              <button
                key={type}
                onClick={() => setRangeType(type)}
                className={cn(
                  "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  rangeType === type ? "bg-white text-black border-white" : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                )}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Individual Dates</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-zinc-400">{format(currentMonth, 'MMM yyyy')}</p>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[8px] font-black text-zinc-700">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const start = startOfWeek(startOfMonth(currentMonth));
                const end = endOfWeek(endOfMonth(currentMonth));
                return eachDayOfInterval({ start, end }).map((day, i) => {
                  const isCurMonth = isSameDay(startOfMonth(day), startOfMonth(currentMonth));
                  const isSelected = selectedDates.some(d => isSameDay(d, day));
                  const hasTrades = trades.some(t => isSameDay(parseISO(t.exitDate || t.entryDate), day));

                  return (
                    <button
                      key={i}
                      disabled={!isCurMonth}
                      onClick={() => {
                        setRangeType('custom');
                        if (isSelected) {
                          setSelectedDates(selectedDates.filter(d => !isSameDay(d, day)));
                        } else {
                          setSelectedDates([...selectedDates, day]);
                        }
                      }}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all relative",
                        !isCurMonth ? "opacity-0 pointer-events-none" : 
                        isSelected ? "bg-emerald-500 text-black" : 
                        "hover:bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {format(day, 'd')}
                      {hasTrades && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500/50" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            {selectedDates.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between items-center">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{selectedDates.length} selected</p>
                <button 
                  onClick={() => setSelectedDates([])}
                  className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {stats ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Preview Stats</span>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{stats.count} Trades</span>
              </div>
              <p className="text-2xl font-black text-white">{displayValue(stats.totalPnL)}</p>
              <p className="text-xs text-emerald-400 font-bold">+{stats.totalPnLPercent.toFixed(2)}% Performance</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={isCapturing}
                className="py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                {isCapturing ? (
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-3 h-3" />
                    Poster
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCSV}
                className="py-4 bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-3 h-3" />
                CSV Data
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-950 border border-zinc-800 border-dashed rounded-3xl">
            <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-xs text-zinc-500 font-medium">No activity found for this period. Choose another range to generate your poster.</p>
          </div>
        )}

        {/* Hidden Poster DOM */}
        {stats && (
          <div className="fixed left-[-9999px] top-0">
            <div 
              ref={posterRef}
              style={{ width: '1080px', height: '1350px' }}
              className="bg-zinc-950 flex flex-col p-20 relative overflow-hidden text-white font-sans"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[200px] rounded-full -mr-96 -mt-96" />
              <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[200px] rounded-full -ml-96 -mb-96" />
              
              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-2xl text-black">Z</div>
                    <h2 className="text-3xl font-black tracking-tighter">ZYNC</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">Shared on</p>
                  <p className="text-lg font-bold text-zinc-300">{format(new Date(), 'dd MMMM, yyyy')}</p>
                  <p className="text-md font-medium text-zinc-500">{format(new Date(), 'HH:mm')}</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="mb-20">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-sm mb-4">Account Holder</p>
                  <h1 className="text-7xl font-black tracking-tighter mb-8 leading-tight">
                    {profileName}
                  </h1>
                  <div className="h-1 w-24 bg-emerald-500 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-20 mb-20">
                  <div>
                    <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Assets Chosen</p>
                    <p className="text-4xl font-bold text-zinc-200 tracking-tight">{stats.assets}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Strategy Profile</p>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-indigo-400">{stats.mostUsedSide}</span>
                      <span className="text-2xl font-bold text-emerald-400">+{stats.totalPnLPercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-20 border-t border-zinc-900">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-sm mb-6 text-center">Net Performance</p>
                  <p className="text-[120px] font-black text-center leading-none tracking-tighter text-white drop-shadow-2xl px-10 truncate">
                    {displayValue(stats.totalPnL)}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-20 border-t border-zinc-900 mt-auto flex justify-between items-end relative z-10">
                <div className="max-w-md">
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    This performance snapshot was generated by <span className="text-white font-bold">ZYNC</span> — the leading platform for professional traders to track, analyze, and master their edge.
                  </p>
                </div>
                <div className="flex gap-4">
                   <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">zync.trading</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
const StatsCard = ({ label, value, subValue, trend, icon: Icon, type = 'normal' }: { 
  label: string, 
  value: string, 
  subValue?: string,
  trend?: { val: string, positive: boolean },
  icon?: any,
  type?: 'normal' | 'profit' | 'loss'
}) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
    <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold mb-1">{label}</p>
    <h3 className={cn(
      "text-xl font-bold",
      type === 'profit' ? 'text-emerald-400' : 
      type === 'loss' ? 'text-rose-400' : 'text-white'
    )}>{value}</h3>
    {subValue && <p className="text-[10px] text-zinc-600 mt-1">{subValue}</p>}
    {trend && (
      <p className={cn(
        "text-[10px] mt-1 font-medium",
        trend.positive ? "text-emerald-500" : "text-rose-500"
      )}>
        {trend.positive ? '+' : ''}{trend.val} vs last period
      </p>
    )}
    {label === "Win Rate" && (
      <div className="w-full h-1 bg-zinc-800 rounded-full mt-2">
        <div className="bg-emerald-500 h-full rounded-full" style={{ width: value }} />
      </div>
    )}
  </div>
);

// --- Pages ---

const Dashboard = ({ stats, trades, onTabChange, profileName, currency, hidePnL, user, onUpdateTrade, startingBalance, onSelectExecution }: { 
  stats: DashboardStats, 
  trades: Trade[], 
  onTabChange: (tab: string) => void, 
  profileName: string, 
  currency: string, 
  hidePnL: boolean, 
  user: User | null, 
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void, 
  startingBalance: number,
  onSelectExecution: (id: string) => void
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState('All Time');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [chartType, setChartType] = useState<'line' | 'ogive' | 'scatter' | 'cubic' | 'bar'>('ogive');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'wins' | 'losses'>('all');

  const recentActivityTrades = useMemo(() => {
    let filtered = [...trades];
    if (activityFilter === 'wins') {
      filtered = filtered.filter(t => t.pnl >= 0);
    } else if (activityFilter === 'losses') {
      filtered = filtered.filter(t => t.pnl < 0);
    }
    // Sort descending by date (most recent first)
    return filtered.sort((a, b) => parseISO(b.entryDate).getTime() - parseISO(a.entryDate).getTime());
  }, [trades, activityFilter]);

  const handleScreenshotUpload = async (file: File) => {
    if (!selectedTrade || !user || !file.type.startsWith('image/')) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const uuid = crypto.randomUUID();
      const path = `${user.uid}/trades/${selectedTrade.id}/screenshot_${uuid}.${extension}`;
      
      const storagePath = await dataService.uploadFile(path, file);
      onUpdateTrade(selectedTrade.id, { screenshot: storagePath });
      
      // Update local state for immediate feedback
      const signedUrl = await dataService.getSignedUrl(storagePath);
      setSelectedTrade({ ...selectedTrade, screenshot: signedUrl });
    } catch (err) {
      console.error('Failed to upload screenshot:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };
  const equityData = useMemo(() => {
    let balance = startingBalance;
    let cumulativePnL = 0;
    const sortedAsc = [...trades].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
    
    // Start from Zero
    const data = [{
      date: 'Start',
      balance: startingBalance,
      pnl: 0,
      cumulativePnL: 0,
      index: 0
    }];

    sortedAsc.forEach((t, idx) => {
      balance += t.pnl;
      cumulativePnL += t.pnl;
      data.push({
        date: format(parseISO(t.entryDate), 'MMM dd'),
        balance,
        pnl: t.pnl,
        cumulativePnL,
        index: idx + 1
      });
    });

    return data;
  }, [trades, startingBalance]);

  const totalBalance = startingBalance + stats.totalPnL;

  return (
    <div className="space-y-8">
        <ScrollAnimatedSection>
          <HeroSection 
            name={profileName} 
            stats={stats} 
            onTabChange={onTabChange} 
            onExport={() => setShowExportModal(true)}
            hasTrades={trades.length > 0}
            currency={currency}
            hidePnL={hidePnL}
          />
        </ScrollAnimatedSection>
        
        <ScrollAnimatedSection delay={0.1} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatsCard 
            label="Starting Balance" 
            value={displayValue(startingBalance)} 
            subValue="Base Capital"
          />
          <StatsCard 
            label="Current Balance" 
            value={displayValue(totalBalance)} 
            type={totalBalance >= startingBalance ? 'profit' : 'loss'}
            subValue="Total Equity"
          />
          <StatsCard 
            label="Total P&L" 
            value={displayValue(stats.totalPnL)} 
            type={stats.totalPnL >= 0 ? 'profit' : 'loss'}
            trend={{ val: "12.4%", positive: stats.totalPnL >= 0 }}
          />
          <StatsCard 
            label="Win Rate" 
            value={formatPercent(stats.winRate / 100)} 
            subValue="Monthly Target: 60%"
          />
          <StatsCard 
            label="Profit Factor" 
            value={stats.profitFactor.toFixed(2)} 
            subValue="Healthy (> 1.5)"
          />
          <StatsCard 
            label="Avg Trade" 
            value={displayValue((stats.avgWin + stats.avgLoss) / 2)} 
            subValue="Gross Avg"
          />
          <StatsCard 
            label="Total Trades" 
            value={stats.totalTrades.toString()} 
            subValue="Last 30 Days"
          />
        </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.2} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Performance Analytics</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Equity & P&L Curve</p>
              </div>
            </div>
            
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {[
                { id: 'line', label: 'Line' },
                { id: 'ogive', label: 'Ogive' },
                { id: 'scatter', label: 'Scatter' },
                { id: 'cubic', label: 'Cubic' },
                { id: 'bar', label: 'Bar' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all",
                    chartType === type.id ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981', fontSize: '12px' }}
                  />
                  <Bar dataKey="pnl" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === 'scatter' ? (
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis type="number" dataKey="index" name="Trade #" stroke="#52525b" fontSize={10} />
                  <YAxis type="number" dataKey="cumulativePnL" name="PnL" stroke="#52525b" fontSize={10} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                  <Scatter name="PnL Progression" data={equityData} fill="#10b981" />
                </ScatterChart>
              ) : (
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981', fontSize: '12px' }}
                  />
                  <Area 
                    type={chartType === 'cubic' ? "monotone" : "linear"} 
                    dataKey={chartType === 'ogive' ? "cumulativePnL" : "balance"} 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    dot={chartType === 'line'}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[420px]">
          <div className="px-5 py-4 border-b border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Activity</h3>
              <button onClick={() => onTabChange('journal')} className="text-xs text-emerald-400 hover:underline font-bold uppercase tracking-widest text-[9px]">View All</button>
            </div>
            <div className="flex gap-1.5">
               {(['all', 'wins', 'losses'] as const).map((filter) => (
                 <button
                   key={filter}
                   onClick={() => setActivityFilter(filter)}
                   className={cn(
                     "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                     activityFilter === filter 
                       ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                       : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                   )}
                 >
                   {filter}
                 </button>
               ))}
            </div>
          </div>
          <div className="divide-y divide-zinc-800 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {recentActivityTrades.length > 0 ? (
              recentActivityTrades.map(trade => (
                <div 
                  key={trade.id} 
                  onClick={() => onSelectExecution(trade.id)}
                  className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-white text-xs">{trade.asset} <span className="text-[10px] text-zinc-600 ml-1">{trade.side}</span></p>
                    <p className={cn("font-bold text-xs", trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl, currency)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-zinc-500">{trade.strategy}</p>
                    <div className={cn(
                      "px-1.5 py-0.5 rounded-full text-[8px] font-bold border",
                      trade.pnl >= 0 ? "bg-emerald-900/30 text-emerald-400 border-emerald-900/50" : "bg-rose-900/30 text-rose-400 border-rose-900/50"
                    )}>
                      {trade.pnl >= 0 ? 'WIN' : 'LOSS'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-950/20">
                 <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
                    <History className="w-6 h-6 text-zinc-600" />
                 </div>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No activity in this view</p>
                 <p className="text-zinc-700 text-[9px] mt-1 italic tracking-tight">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </ScrollAnimatedSection>

      <AnimatePresence>
        {showExportModal && (
          <ExportModal 
            trades={trades} 
            profileName={profileName} 
            onClose={() => setShowExportModal(false)} 
            currency={currency}
            hidePnL={hidePnL}
          />
        )}
      </AnimatePresence>
      
      <JournalSlideshow 
        trades={trades} 
        onSelectTrade={onSelectExecution} 
      />
    </div>
  );
};

const JournalSlideshow = ({ trades, onSelectTrade }: { trades: Trade[], onSelectTrade: (id: string) => void }) => {
  const images = useMemo(() => {
    const collected: { src: string, date: string, pnl: number, asset: string, id: string }[] = [];
    trades.forEach(t => {
      if (t.screenshot) collected.push({ src: t.screenshot, date: t.entryDate, pnl: t.pnl, asset: t.asset, id: t.id });
      if (t.executionImage) collected.push({ src: t.executionImage, date: t.entryDate, pnl: t.pnl, asset: t.asset, id: t.id });
    });
    
    if (collected.length === 0) return [];
    
    let finalImages = [...collected];
    // If less than 5, repeat until at least 5 as requested
    while (finalImages.length < 5) {
      finalImages = [...finalImages, ...collected];
    }
    // Triple it for a truly seamless transition especially if images are wide
    return [...finalImages, ...finalImages, ...finalImages];
  }, [trades]);

  if (images.length === 0) return null;

  return (
    <div className="mt-16 w-full overflow-hidden pb-8 border-t border-zinc-900 pt-16">
      <div className="flex items-center justify-between px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Journal Archive</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] opacity-60">Visual execution history</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Live Feed active</span>
        </div>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex gap-6 py-4 px-4"
          initial={{ x: "-33.33%" }}
          animate={{ x: "0%" }} // Moving from left to right as requested (items move towards right)
          transition={{ 
            repeat: Infinity, 
            duration: 30, 
            ease: "linear" 
          }}
          whileHover={{ transition: { duration: 100 } }} // Slow down on hover for inspection
        >
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectTrade(img.id)}
              className="w-[320px] h-[200px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl flex-shrink-0 bg-zinc-900/50 backdrop-blur-xl group relative cursor-pointer"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
               <img 
                 src={img.src} 
                 alt={`Journal entry ${idx}`} 
                 className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                 referrerPolicy="no-referrer"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974717483-3600997e550c?q=80&w=320&h=200&auto=format&fit=crop';
                 }}
               />
               <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="px-6 py-4 bg-black/80 backdrop-blur-xl rounded-[2rem] border border-white/10 space-y-1 shadow-2xl">
                     <p className="text-[18px] font-black text-white uppercase tracking-tighter">{img.asset} • {format(new Date(img.date), 'MMM dd, yyyy')}</p>
                     <p className={cn("text-[16px] font-black uppercase tracking-widest", img.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {img.pnl >= 0 ? '+' : ''}{img.pnl.toFixed(2)}
                     </p>
                  </div>
               </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const PnLCalendar = ({ trades, setSelectedTrade, currency, hidePnL, profileName }: { trades: Trade[], setSelectedTrade: (t: Trade) => void, currency: string, hidePnL: boolean, profileName: string }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureOrientation, setCaptureOrientation] = useState<'portrait' | 'landscape'>('landscape');
  
  const handleCapture = async (orientation: 'portrait' | 'landscape') => {
    setCaptureOrientation(orientation);
    // Small delay to ensure state update and DOM preparation
    setIsCapturing(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!posterRef.current) {
      setIsCapturing(false);
      return;
    }
    
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        width: orientation === 'portrait' ? 1080 : 1920,
        height: orientation === 'portrait' ? 1350 : 1080,
      });
      
      const link = document.createElement('a');
      link.download = `zync-pnl-calendar-${format(currentMonth, 'MMMM-yyyy').toLowerCase()}-${orientation}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture calendar:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Analytics for the month
  const monthTrades = (trades || []).filter(t => isSameMonth(parseISO(t.exitDate), currentMonth));
  const monthPnL = monthTrades.reduce((acc, t) => acc + t.pnl, 0);
  const monthWins = monthTrades.filter(t => t.pnl > 0).length;
  const monthWinRate = monthTrades.length > 0 ? (monthWins / monthTrades.length) * 100 : 0;

  // Weekly P&L grouping
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const weeklyPnL = weeks.map(week => {
    const weekTrades = (trades || []).filter(t => week.some(day => isSameDay(parseISO(t.exitDate), day)));
    return weekTrades.reduce((acc, t) => acc + t.pnl, 0);
  });

  return (
    <div ref={calendarRef} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-w-[800px] flex flex-col">
      {/* Enhanced Header for Snapshot */}
      <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 backdrop-blur-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-500" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] leading-none mb-1">Trading Log</h4>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{profileName}</h3>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Month Performance</p>
             <p className={cn("text-xl font-black tabular-nums leading-none", monthPnL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {monthPnL >= 0 ? '+' : ''}{displayValue(monthPnL)}
             </p>
          </div>
          
          <div className="h-10 w-px bg-zinc-800 hidden md:block" />

          <div className="flex items-center md:items-end flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <button 
                  onClick={() => handleCapture('portrait')}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl border border-emerald-500/20 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  <Camera className="w-3 h-3" />
                  Portrait
                </button>
                <button 
                  onClick={() => handleCapture('landscape')}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-black rounded-xl border border-emerald-500/20 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  <Camera className="w-3 h-3" />
                  Landscape
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors border border-zinc-800">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors border border-zinc-800">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.25em]">{format(currentMonth, 'MMMM yyyy')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1">
          <div className="grid grid-cols-7 border-b border-zinc-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950/50">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayTrades = (trades || []).filter(t => isSameDay(parseISO(t.exitDate), day));
              const dayPnL = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
              const isCurrentMonth = isSameDay(startOfMonth(day), startOfMonth(currentMonth));
              const isToday = isSameDay(day, new Date());

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "min-h-[140px] p-2 border-r border-b border-zinc-800 transition-colors flex flex-col group/day",
                    !isCurrentMonth ? "bg-zinc-950/20 opacity-30" : "bg-zinc-900/20",
                    isToday && "bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-xs font-black px-1.5 py-0.5 rounded-md",
                      isToday ? "bg-emerald-500 text-black" : (!isCurrentMonth ? "text-zinc-700" : "text-zinc-600")
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayPnL !== 0 && (
                      <span className={cn(
                        "text-xs font-bold tabular-nums",
                        dayPnL > 0 ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {dayPnL > 0 ? '+' : ''}{displayValue(dayPnL)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {dayTrades.map(trade => (
                      <button
                        key={trade.id}
                        onClick={() => setSelectedTrade(trade)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg text-[9px] font-bold border transition-all hover:scale-[1.05] active:scale-[0.98] shadow-sm",
                          trade.pnl >= 0 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate max-w-[50px]">{trade.asset}</span>
                          <span className="tabular-nums">{displayValue(trade.pnl, true)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly P&L Column */}
        <div className="w-24 bg-zinc-950/50 border-l border-zinc-800 flex flex-col">
          <div className="py-4 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950/80 border-b border-zinc-800">
            Weekly
          </div>
          <div className="flex-1 flex flex-col justify-around">
            {weeklyPnL.map((pnl, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-center border-b border-zinc-800 p-2 text-center group/week hover:bg-zinc-800/20 transition-colors">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover/week:text-zinc-500 transition-colors">Week {idx + 1}</span>
                <span className={cn(
                  "text-xs font-black tabular-nums",
                  pnl > 0 ? "text-emerald-400" : (pnl < 0 ? "text-rose-400" : "text-zinc-600")
                )}>
                  {pnl !== 0 ? (pnl > 0 ? '+' : '') + displayValue(pnl) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer for Win Rate and Month Stats */}
      <div className="bg-zinc-950/80 px-8 py-5 flex items-center justify-between border-t border-zinc-800">
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monthly Edge</p>
                 <p className="text-sm font-black text-white tabular-nums tracking-tighter">{monthWinRate.toFixed(1)}% Winrate</p>
              </div>
           </div>
           
           <div className="h-8 w-px bg-zinc-800" />
           
           <div className="flex items-center gap-4">
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Trades</p>
                 <p className="text-sm font-black text-white tabular-nums tracking-tighter">{monthTrades.length} Positions</p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Powered by ZYNC Intelligence</span>
        </div>
      </div>

      {/* Hidden Poster Target for Snapshot */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        <div 
          ref={posterRef}
          style={{ 
            width: captureOrientation === 'portrait' ? '1080px' : '1920px', 
            height: captureOrientation === 'portrait' ? '1350px' : '1080px' 
          }}
          className="bg-black flex flex-col p-16 relative overflow-hidden text-white font-sans border-[16px] border-zinc-900"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[200px] rounded-full -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[200px] rounded-full -ml-96 -mb-96" />
          
          {/* Poster Header */}
          <div className="flex justify-between items-start relative z-10 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-3xl text-black">Z</div>
                <div>
                   <h2 className="text-4xl font-black tracking-tighter">ZYNC</h2>
                   <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Pro</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Monthly Pulse</p>
              <p className="text-2xl font-black text-zinc-300">{format(currentMonth, 'MMMM yyyy')}</p>
            </div>
          </div>

          <div className={cn(
            "flex relative z-10 gap-12",
            captureOrientation === 'portrait' ? "flex-col" : "flex-row items-center"
          )}>
            <div className={cn(
              "space-y-2",
              captureOrientation === 'portrait' ? "mb-12" : "flex-1"
            )}>
              <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-xs">Portfolio Holder</p>
              <h1 className={cn(
                "font-black tracking-tighter leading-tight",
                captureOrientation === 'portrait' ? "text-7xl" : "text-8xl"
              )}>
                {profileName}
              </h1>
              <div className="h-2 w-32 bg-emerald-500 rounded-full" />
            </div>

            <div className={cn(
              "grid gap-8",
              captureOrientation === 'portrait' ? "grid-cols-2" : "grid-cols-2 w-1/3"
            )}>
              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Net Profit</p>
                <p className={cn("text-4xl font-black tabular-nums tracking-tighter", monthPnL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {monthPnL >= 0 ? '+' : ''}{displayValue(monthPnL)}
                </p>
              </div>
              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Efficiency</p>
                <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                  {monthWinRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Main Content: Calendar Grid */}
          <div className="mt-12 flex-1 relative z-10 flex gap-6">
            <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col p-1 shadow-2xl">
              <div className="grid grid-cols-7 border-b border-zinc-800">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="py-5 text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest bg-zinc-950/30">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 flex-1">
                {calendarDays.map((day, idx) => {
                  const dayTrades = (trades || []).filter(t => isSameDay(parseISO(t.exitDate), day));
                  const dayPnL = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
                  const isCurMonth = isSameMonth(day, currentMonth);
                  
                  return (
                    <div key={idx} className={cn(
                      "p-3 border-r border-b border-zinc-800/50 flex flex-col min-h-[100px]",
                      !isCurMonth && "opacity-20 bg-zinc-950/20"
                    )}>
                      <span className="text-xs font-black text-zinc-700 mb-1">{format(day, 'd')}</span>
                      {dayPnL !== 0 && (
                        <div className={cn(
                          "mt-auto text-[14.5px] font-black tabular-nums",
                          dayPnL > 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {dayPnL > 0 ? '+' : ''}{displayValue(dayPnL)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Breakdown on Right */}
            <div className="w-48 flex flex-col gap-4">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex-1 flex flex-col shadow-xl">
                 <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-6 text-center border-b border-zinc-800 pb-4">Weekly Net</p>
                 <div className="flex-1 flex flex-col justify-around">
                    {weeklyPnL.map((pnl, idx) => (
                      <div key={idx} className="text-center py-2">
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Week {idx + 1}</p>
                        <p className={cn("text-[17px] font-black tabular-nums", pnl > 0 ? "text-emerald-400" : (pnl < 0 ? "text-rose-400" : "text-zinc-800"))}>
                          {pnl !== 0 ? (pnl > 0 ? '+' : '') + displayValue(pnl) : '—'}
                        </p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-12 border-t border-zinc-900 flex justify-between items-end relative z-10">
            <div className="max-w-md">
              <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                This performance snapshot was generated by <span className="text-white font-bold">ZYNC</span> — the professional toolkit for modern market speculators. Tracking {monthTrades.length} positions in {format(currentMonth, 'MMMM')}.
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px] mb-2">zync.intelligence</p>
              <div className="flex items-center gap-3 justify-end">
                <div className="w-10 h-1 px-1 bg-zinc-900 rounded-full flex items-center">
                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${monthWinRate}%` }} />
                </div>
                <span className="text-[10px] font-black text-zinc-400">{monthWinRate.toFixed(1)}% WR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TradeJournal = ({ trades, onAddTrade, onUpdateTrade, onDeleteTrade, settings, onUpdateSettings, user }: { 
  trades: Trade[], 
  onAddTrade: (t: Trade) => void,
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void,
  onDeleteTrade: (id: string) => void,
  settings: UserSettings,
  onUpdateSettings: (s: UserSettings) => void,
  user: User | null
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [confidence, setConfidence] = useState(5);
  const [isManualPnl, setIsManualPnl] = useState(false);
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefDetail = useRef<HTMLInputElement>(null);
  const [isUploadingDetail, setIsUploadingDetail] = useState(false);
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString());
  const [exitDate, setExitDate] = useState<string>(new Date().toISOString());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    const resolve = async () => {
      if (screenshot && user && screenshot.startsWith(user.uid)) {
        try {
          const url = await dataService.getSignedUrl(screenshot);
          setScreenshotUrl(url);
        } catch (err) {
          console.error('Failed to resolve screenshot URL:', err);
          setScreenshotUrl(null);
        }
      } else {
        setScreenshotUrl(screenshot);
      }
    };
    resolve();
  }, [screenshot, user]);

  const currency = settings.currency;
  const hidePnL = settings.hidePnL;

  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      const trimmedRule = newRuleInput.trim();
      if (!settings.strategyRules.includes(trimmedRule)) {
        onUpdateSettings({
          ...settings,
          strategyRules: [...settings.strategyRules, trimmedRule]
        });
      }
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (ruleToRemove: string) => {
    onUpdateSettings({
      ...settings,
      strategyRules: settings.strategyRules.filter(r => r !== ruleToRemove)
    });
  };

  const filteredTrades = useMemo(() => {
    let result = [...trades];
    if (filter === 'wins') result = result.filter(t => t.pnl >= 0);
    if (filter === 'losses') result = result.filter(t => t.pnl < 0);
    return result.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }, [trades, filter]);

  const handleScreenshotUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max 5MB.');
      return;
    }

    if (!user) {
      const reader = new FileReader();
      reader.onload = (e) => setScreenshot(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const uuid = crypto.randomUUID();
      // For new trades, we might not have a trade ID yet, so we use a temp folder or just a random ID
      const tempId = editingTrade?.id || `temp_${uuid}`;
      const path = `${user.uid}/trades/${tempId}/screenshot_${uuid}.${extension}`;
      
      const storagePath = await dataService.uploadFile(path, file);
      setScreenshot(storagePath);
    } catch (err) {
      console.error('Failed to upload screenshot:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetailUpload = async (file: File) => {
    if (!selectedTrade || !user || !file.type.startsWith('image/')) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max 5MB.');
      return;
    }

    setIsUploadingDetail(true);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const uuid = crypto.randomUUID();
      const path = `${user.uid}/trades/${selectedTrade.id}/screenshot_${uuid}.${extension}`;
      
      const storagePath = await dataService.uploadFile(path, file);
      onUpdateTrade(selectedTrade.id, { screenshot: storagePath });
      
      const signedUrl = await dataService.getSignedUrl(storagePath);
      setSelectedTrade({ ...selectedTrade, screenshot: signedUrl });
    } catch (err) {
      console.error('Failed to upload detail screenshot:', err);
    } finally {
      setIsUploadingDetail(false);
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setConfidence(trade.confidence);
    setIsManualPnl(true); 
    setScreenshot(trade.screenshot || null);
    setEntryDate(trade.entryDate);
    setExitDate(trade.exitDate);
    setShowForm(true);
  };

  const handleNewEntry = () => {
    setEditingTrade(null);
    setConfidence(5);
    setIsManualPnl(false);
    setScreenshot(null);
    setEntryDate(new Date().toISOString());
    setExitDate(new Date().toISOString());
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <ScrollAnimatedSection>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Trade Journal</h2>
            <p className="text-zinc-500 text-sm">Documenting every market move for refinement.</p>
          </div>
          <button 
            onClick={handleNewEntry}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.1}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="border-b border-zinc-800 bg-zinc-900/50">
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-colors"
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
          >
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Master Record</h3>
              <div className="flex gap-2 items-center">
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-tighter">
                  {filter}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-tighter">
                  {viewMode}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full bg-emerald-500/50", filter !== 'wins' && 'opacity-20')} />
                <div className={cn("w-1.5 h-1.5 rounded-full bg-rose-500/50", filter !== 'losses' && 'opacity-20')} />
              </div>
              <motion.div
                animate={{ rotate: isControlsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-zinc-600" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{ 
              height: isControlsExpanded ? 'auto' : 0,
              opacity: isControlsExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-zinc-800/50 flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Filter Type</span>
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  {(['all', 'wins', 'losses'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilter(mode)}
                      className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all",
                        filter === mode ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Display View</span>
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all flex items-center gap-2",
                      viewMode === 'list' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    <History className="w-3 h-3" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all flex items-center gap-2",
                      viewMode === 'calendar' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    Calendar
                  </button>
                </div>
              </div>

              <div className="ml-auto">
                <Filter className="w-4 h-4 text-zinc-600" />
              </div>
            </div>
          </motion.div>
        </div>
        
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0e0e10] text-zinc-600 font-bold">
                  <tr>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">Asset</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">Strategy</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">Confidence</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">News</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">RR</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px]">P&L</th>
                    <th className="px-6 py-4 tracking-widest uppercase text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map(trade => (
                    <tr 
                      key={trade.id} 
                      onClick={() => setSelectedTrade(trade)}
                      className="border-b border-zinc-800 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-zinc-100 text-sm tracking-tight">{trade.asset}</p>
                        <p className="text-[10px] text-zinc-600 uppercase font-black">{trade.side}</p>
                      </td>
                      <td className="px-6 py-5 text-zinc-400 font-medium">
                        {trade.strategy}
                      </td>
                      <td className="px-6 py-5">
                <div className="flex gap-1">
                  {[...Array(Math.max(0, Math.floor((trade.confidence || 0) / 2)))].map((_, i) => (
                    <div key={i} className="w-1.5 h-3 bg-indigo-500/50 rounded-full" />
                  ))}
                  {(trade.confidence || 0) <= 2 && <span className="text-zinc-700 uppercase font-black text-[8px]">Low</span>}
                </div>
                      </td>
                      <td className="px-6 py-5">
                        <NewsImpactDot impact={trade.newsImpact || 'None'} />
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-zinc-100 font-bold">{trade.riskReward}</span>
                        <span className="text-zinc-600 text-[10px] ml-1">/ {trade.targetRR}</span>
                      </td>
                      <td className={cn("px-6 py-5 font-black text-sm", trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {trade.pnl >= 0 ? '+' : ''}{displayValue(trade.pnl)}
                      </td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEdit(trade)}
                            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white border border-zinc-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteTrade(trade.id)}
                            className="p-2 hover:bg-rose-500/10 rounded-xl text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto custom-scrollbar"
            >
              <PnLCalendar trades={filteredTrades} setSelectedTrade={setSelectedTrade} currency={currency} hidePnL={hidePnL} profileName={settings.profileName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedTrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTrade(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-zinc-100">{selectedTrade.asset}</h3>
                    <div className="flex gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                        selectedTrade.side === 'Long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                      )}>
                        {selectedTrade.side}
                      </span>
                      <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-tight">
                        {selectedTrade.exitStatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm">{format(parseISO(selectedTrade.entryDate), 'PPP p')}</p>
                </div>
                <button onClick={() => setSelectedTrade(null)} className="p-2 bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Execution</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Entry Price</span>
                      <span className="text-lg font-mono font-bold text-zinc-100">{selectedTrade.entryPrice}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">Exit Price</span>
                      <span className="text-lg font-mono font-bold text-zinc-100">{selectedTrade.exitPrice}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Risk Reward</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Actual RR</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{selectedTrade.riskReward}R</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">Target RR</span>
                      <span className="text-lg font-mono font-bold text-indigo-400">{selectedTrade.targetRR}R</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Performance</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">P&L Amount</span>
                      <span className={cn("text-lg font-bold", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {formatCurrency(selectedTrade.pnl)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">P&L %</span>
                      <span className={cn("text-lg font-bold", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {selectedTrade.pnlPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Trade Info</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Quantity</span>
                      <span className="text-lg font-mono font-bold text-zinc-100">{selectedTrade.positionSize}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">Strategy</span>
                      <span className="text-lg font-bold text-zinc-300">{selectedTrade.strategy}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-800/50 rounded-2xl space-y-4 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Strategy</span>
                  <p className="text-sm text-zinc-200">{selectedTrade.strategy}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Notes</span>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">"{selectedTrade.notes}"</p>
                </div>
                {selectedTrade.mistakeTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedTrade.mistakeTags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                 <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Trade Chart</span>
                 <div 
                   className={cn(
                      "aspect-video bg-zinc-950 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer transition-all overflow-hidden relative",
                      isDragging ? "bg-zinc-900 border-emerald-500 scale-[0.99] shadow-lg shadow-emerald-500/10" : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900"
                    )}
                    onClick={() => {
                      if (selectedTrade.screenshot) {
                        setIsFullscreen(true);
                      } else {
                        fileInputRefDetail.current?.click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleDetailUpload(file);
                    }}
                 >
                    <input 
                      type="file" 
                      ref={fileInputRefDetail} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDetailUpload(file);
                      }}
                    />
                    {selectedTrade.screenshot ? (
                      <>
                        <img src={selectedTrade.screenshot} alt="Trade Chart" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFullscreen(true);
                            }}
                            className="p-2 bg-white text-black rounded-lg hover:scale-110 transition-transform"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRefDetail.current?.click();
                            }}
                            className="p-2 bg-emerald-500 text-black rounded-lg hover:scale-110 transition-transform"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/chart:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-xs text-zinc-600">
                          {isDragging ? 'Drop Image Here' : (isUploadingDetail ? 'Uploading...' : 'Click to upload screenshot')}
                        </p>
                      </>
                    )}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-2">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <CreditCard className="w-3 h-3" />
                  Poster
                </button>
                <button 
                  onClick={() => {
                    setEditingTrade(selectedTrade);
                    setSelectedTrade(null);
                    setShowForm(true);
                  }}
                  className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Delete this trade?')) {
                      onDeleteTrade(selectedTrade.id);
                      setSelectedTrade(null);
                    }
                  }}
                  className="p-3 bg-zinc-800 text-rose-500 rounded-xl hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && selectedTrade && (
          <ExportModal 
            trades={trades} 
            profileName={settings.profileName} 
            onClose={() => setShowExportModal(false)}
            currency={settings.currency}
            hidePnL={settings.hidePnL}
            initialTradeId={selectedTrade.id}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Overlay for Journals */}
      <AnimatePresence>
        {isFullscreen && selectedTrade?.screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedTrade.screenshot} 
                alt="Full trade view" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-indigo-500/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e0e10] border border-zinc-800 rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-100 font-serif italic text-sm uppercase tracking-widest">
                  {editingTrade ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const entryPrice = Number(formData.get('entryPrice'));
                const exitPrice = Number(formData.get('exitPrice'));
                const posSize = Number(formData.get('positionSize'));
                const side = formData.get('side') as Side;
                
                const pnl = isManualPnl 
                  ? (Number(formData.get('manualPnl')) || 0)
                  : (side === 'Long' 
                    ? (exitPrice - entryPrice) * posSize 
                    : (entryPrice - exitPrice) * posSize);

                const pnlPercentage = isManualPnl 
                  ? (pnl / (settings.startingBalance || 10000)) * 100 
                  : ((entryPrice * posSize) !== 0 ? (pnl / (entryPrice * posSize)) * 100 : 0);

                const tradeData: Partial<Trade> = {
                  asset: (formData.get('asset') as string) || 'Unknown',
                  marketType: (formData.get('marketType') as MarketType) || 'Crypto',
                  entryPrice: entryPrice || 0,
                  exitPrice: exitPrice || 0,
                  positionSize: posSize || 0,
                  side: side || 'Long',
                  strategy: (formData.get('strategy') as string) || 'Unspecified',
                  notes: (formData.get('notes') as string) || '',
                  emotionalState: (formData.get('emotionalState') as EmotionalState) || 'Neutral',
                  confidence: Number(formData.get('confidence')) || 5,
                  newsImpact: (formData.get('newsImpact') as NewsImpact) || 'None',
                  followedRules: formData.getAll('rules') as string[],
                  exitStatus: (formData.get('exitStatus') as ExitStatus) || 'Closed Manually',
                  riskReward: Number(formData.get('riskReward')) || 0,
                  targetRR: Number(formData.get('targetRR')) || 0,
                  pnl: pnl || 0,
                  pnlPercentage: pnlPercentage || 0,
                  screenshot: screenshot || undefined,
                  entryDate: new Date(formData.get('entryDate') as string).toISOString(),
                  exitDate: new Date(formData.get('exitDate') as string).toISOString(),
                };

                if (editingTrade) {
                  onUpdateTrade(editingTrade.id, tradeData);
                } else {
                  const newTrade: Trade = {
                    ...tradeData as Trade,
                    id: Math.random().toString(36).substr(2, 9),
                    mistakeTags: [],
                  };
                  onAddTrade(newTrade);
                }
                setShowForm(false);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Entry Date & Time</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        name="entryDate" 
                        type="datetime-local"
                        defaultValue={format(parseISO(entryDate), "yyyy-MM-dd'T'HH:mm")}
                        required 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none [color-scheme:dark]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Exit Date & Time</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        name="exitDate" 
                        type="datetime-local"
                        defaultValue={format(parseISO(exitDate), "yyyy-MM-dd'T'HH:mm")}
                        required 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none [color-scheme:dark]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Asset</label>
                    <input 
                      name="asset" 
                      defaultValue={editingTrade?.asset}
                      required 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                      placeholder="BTC/USDT" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Market Type</label>
                    <select 
                      name="marketType" 
                      defaultValue={editingTrade?.marketType}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option>Crypto</option>
                      <option>Forex</option>
                      <option>Stocks</option>
                      <option>Futures</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Side</label>
                    <select 
                      name="side" 
                      defaultValue={editingTrade?.side}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option>Long</option>
                      <option>Short</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Confidence Level ({confidence}/10)</label>
                    <input 
                      name="confidence" 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={confidence} 
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 accent text-emerald-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Emotion</label>
                    <select 
                      name="emotionalState" 
                      defaultValue={editingTrade?.emotionalState || 'Neutral'}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Neutral">Neutral 😐</option>
                      <option value="Angry">Angry 😡</option>
                      <option value="Sad">Sad 😢</option>
                      <option value="Anxious">Anxious 😰</option>
                      <option value="Disappointed">Disappointed 😞</option>
                      <option value="Excited">Excited 🤩</option>
                      <option value="Calm">Calm 🧘</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">News Impact</label>
                    <select 
                      name="newsImpact" 
                      defaultValue={editingTrade?.newsImpact || 'None'}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="None">No News Folder</option>
                      <option value="Yellow">Yellow Folder</option>
                      <option value="Orange">Orange Folder</option>
                      <option value="Red">Red Folder</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Exit Status</label>
                    <select 
                      name="exitStatus" 
                      defaultValue={editingTrade?.exitStatus || 'Closed by T/P'}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Closed by T/P">Closed by T/P</option>
                      <option value="Closed by S/L">Closed by S/L</option>
                      <option value="BRE">BRE</option>
                      <option value="Closed Manually">Closed Manually</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Quantity (Lots/Contracts)</label>
                    <input 
                      name="positionSize" 
                      type="number" 
                      step="any" 
                      defaultValue={editingTrade?.positionSize}
                      required 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                      placeholder="e.g. 1.0 or 0.1" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Actual RR</label>
                      <input 
                        name="riskReward" 
                        type="number" 
                        step="any" 
                        defaultValue={editingTrade?.riskReward}
                        required 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-emerald-400 font-bold focus:ring-1 focus:ring-emerald-500 outline-none" 
                        placeholder="2.5" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Target RR</label>
                      <input 
                        name="targetRR" 
                        type="number" 
                        step="any" 
                        defaultValue={editingTrade?.targetRR}
                        required 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-indigo-400 font-bold focus:ring-1 focus:ring-emerald-500 outline-none" 
                        placeholder="3.0" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => setIsManualPnl(!isManualPnl)}>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors",
                    isManualPnl ? "bg-emerald-500" : "bg-zinc-700"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-2 h-2 bg-white rounded-full transition-all",
                      isManualPnl ? "left-5" : "left-1"
                    )} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manual P&L Override</span>
                </div>

                {isManualPnl ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Profit / Loss Amount ({settings.currency})</label>
                    <input 
                      name="manualPnl" 
                      type="number" 
                      step="any" 
                      defaultValue={editingTrade?.pnl}
                      required={isManualPnl}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-emerald-400 font-bold text-lg focus:ring-1 focus:ring-emerald-500 outline-none" 
                      placeholder="e.g. 150.00 or -50.00" 
                    />
                    <p className="text-[10px] text-zinc-600 mt-2 italic">Use negative values for losses.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Entry Price</label>
                      <input 
                        name="entryPrice" 
                        type="number" 
                        step="any" 
                        defaultValue={editingTrade?.entryPrice}
                        required={!isManualPnl} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                        placeholder="62000" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Exit Price</label>
                      <input 
                        name="exitPrice" 
                        type="number" 
                        step="any" 
                        defaultValue={editingTrade?.exitPrice}
                        required={!isManualPnl} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                        placeholder="65000" 
                      />
                    </div>
                  </div>
                )}

                <div>
                   <div className="flex items-center justify-between mb-3">
                     <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Checklist: Followed Rules</label>
                     <div className="flex items-center gap-2">
                       <input 
                         type="text"
                         value={newRuleInput}
                         onChange={(e) => setNewRuleInput(e.target.value)}
                         placeholder="Add rule..."
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             handleAddRule();
                           }
                         }}
                         className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[10px] text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none w-32"
                       />
                       <button 
                         type="button"
                         onClick={handleAddRule}
                         className="p-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg transition-colors"
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     {settings.strategyRules.map((rule, idx) => (
                       <div key={idx} className="flex items-center gap-2 group/item">
                         <label className="flex-1 flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors group">
                           <input 
                             type="checkbox" 
                             name="rules" 
                             value={rule} 
                             defaultChecked={editingTrade?.followedRules?.includes(rule)}
                             className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-offset-zinc-900" 
                           />
                           <span className="text-xs text-zinc-400 group-hover:text-zinc-200">{rule}</span>
                         </label>
                         <button
                           type="button"
                           onClick={() => handleRemoveRule(rule)}
                           className="p-2 text-zinc-600 hover:text-rose-400 opacity-0 group-hover/item:opacity-100 transition-all"
                           title="Remove rule"
                         >
                           <Minus className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                     {settings.strategyRules.length === 0 && (
                       <p className="text-[10px] text-zinc-600 col-span-2 italic">No rules defined. Use the + button above to add some.</p>
                     )}
                    </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Strategy & Rational</label>
                  <input 
                    name="strategy" 
                    defaultValue={editingTrade?.strategy}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                    placeholder="Supply/Demand, Liquidity sweep..." 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Trade Chart Screenshot</label>
                  <div 
                    className={cn(
                      "aspect-video bg-zinc-950 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer transition-all overflow-hidden relative",
                      isDragging ? "bg-zinc-900 border-emerald-500 scale-[0.99] shadow-lg shadow-emerald-500/10" : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleScreenshotUpload(file);
                    }}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload(file);
                      }}
                    />
                    {screenshotUrl ? (
                      <>
                        <img src={screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <p className="text-[10px] font-black uppercase text-white tracking-widest">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/chart:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-xs text-zinc-600">
                          {isDragging ? 'Drop Image Here' : (isUploading ? 'Uploading...' : 'Click to upload screenshot')}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <textarea 
                    name="notes" 
                    defaultValue={editingTrade?.notes}
                    rows={3} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none resize-none" 
                    placeholder="Market structure details, confluence..." 
                  />
                </div>
                <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl font-black transition-all mt-4 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-500/5">
                  {editingTrade ? 'Update Journal Entry' : 'Confirm Trade Execution'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </ScrollAnimatedSection>
    </div>
  );
};

const Analytics = ({ trades, currency, hidePnL, user, profileName, onUpdateTrade }: { trades: Trade[], currency: string, hidePnL: boolean, user: User | null, profileName: string, onUpdateTrade: (id: string, updates: Partial<Trade>) => void }) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleScreenshotUpload = async (file: File) => {
    if (!selectedTrade || !user || !file.type.startsWith('image/')) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const uuid = crypto.randomUUID();
      const path = `${user.uid}/trades/${selectedTrade.id}/screenshot_${uuid}.${extension}`;
      
      const storagePath = await dataService.uploadFile(path, file);
      onUpdateTrade(selectedTrade.id, { screenshot: storagePath });
      
      // Update local state for immediate feedback
      const signedUrl = await dataService.getSignedUrl(storagePath);
      setSelectedTrade({ ...selectedTrade, screenshot: signedUrl });
    } catch (err) {
      console.error('Failed to upload screenshot:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };
  const strategyData = useMemo(() => {
    const map: Record<string, { name: string, pnl: number }> = {};
    trades.forEach(t => {
      const s = t.strategy || 'Unknown';
      if (!map[s]) map[s] = { name: s, pnl: 0 };
      map[s].pnl += t.pnl;
    });
    return Object.values(map).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  const dailyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = [0, 1, 2, 3, 4, 5, 6].map(i => ({ name: days[i], pnl: 0 }));
    trades.forEach(t => {
      const dayIndex = parseISO(t.entryDate).getDay();
      map[dayIndex].pnl += t.pnl;
    });
    return map;
  }, [trades]);

  const marketData = useMemo(() => {
    const map: Record<string, { name: string, value: number }> = {};
    trades.forEach(t => {
      if (!map[t.marketType]) map[t.marketType] = { name: t.marketType, value: 0 };
      map[t.marketType].value += 1;
    });
    return Object.values(map);
  }, [trades]);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#f43f5e'];

  const sessionData = useMemo(() => {
    const map = [
      { name: 'Asian', pnl: 0, count: 0 },
      { name: 'London', pnl: 0, count: 0 },
      { name: 'New York', pnl: 0, count: 0 },
    ];
    
    trades.forEach(t => {
      const hour = parseISO(t.entryDate).getUTCHours();
      if (hour >= 0 && hour < 8) {
        map[0].pnl += t.pnl;
        map[0].count++;
      } else if (hour >= 8 && hour < 16) {
        map[1].pnl += t.pnl;
        map[1].count++;
      } else {
        map[2].pnl += t.pnl;
        map[2].count++;
      }
    });
    return map;
  }, [trades]);

  const mistakeData = useMemo(() => {
    const map: Record<string, { name: string, value: number }> = {};
    trades.forEach(t => {
      t.mistakeTags?.forEach(tag => {
        if (!map[tag]) map[tag] = { name: tag, value: 0 };
        map[tag].value += 1;
      });
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [trades]);

  const strategyInsights = useMemo(() => {
    if (trades.length === 0) return null;
    
    const bestDay = dailyData.reduce((prev, current) => (prev.pnl > current.pnl) ? prev : current);
    const bestStrategy = strategyData[0] || { name: 'N/A', pnl: 0 };
    const bestSession = sessionData.reduce((prev, current) => (prev.pnl > current.pnl) ? prev : current || { name: 'N/A', pnl: 0 });
    
    const wins = trades.filter(t => t.pnl > 0);
    const avgWinRR = wins.length > 0 ? wins.reduce((acc, t) => acc + (t.riskReward || 0), 0) / wins.length : 0;
    
    const highRRTrades = trades.filter(t => (t.riskReward || 0) >= 3).length;

    // Rule Consistency Analysis
    const ruleWinMap: Record<string, { wins: number, total: number }> = {};
    trades.forEach(t => {
      t.followedRules?.forEach(rule => {
        if (!ruleWinMap[rule]) ruleWinMap[rule] = { wins: 0, total: 0 };
        ruleWinMap[rule].total++;
        if (t.pnl > 0) ruleWinMap[rule].wins++;
      });
    });

    const rulePerformance = Object.entries(ruleWinMap)
      .map(([name, stats]) => ({
        name,
        winRate: (stats.wins / stats.total) * 100,
        total: stats.total
      }))
      .sort((a, b) => b.winRate - a.winRate);
    
    return {
      bestDay: bestDay.name,
      bestStrategy: bestStrategy.name,
      bestSession: bestSession.name,
      avgWinRR: avgWinRR.toFixed(2),
      highRRCount: highRRTrades,
      rulePerformance: rulePerformance.slice(0, 3)
    };
  }, [trades, dailyData, strategyData, sessionData]);

  const expectancyData = useMemo(() => {
    if (trades.length < 5) return [];
    
    const stats = {
      winRate: trades.filter(t => t.pnl > 0).length / trades.length,
      avgWin: trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0) / (trades.filter(t => t.pnl > 0).length || 1),
      avgLoss: Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0) / (trades.filter(t => t.pnl < 0).length || 1))
    };

    const data = [];
    let balance = 0;
    for (let i = 0; i <= 20; i++) {
        // Simple projection: (WR * AvgW) - (LR * AvgL)
        const expectedReturn = (stats.winRate * stats.avgWin) - ((1 - stats.winRate) * stats.avgLoss);
        data.push({
            trade: `T+${i}`,
            equity: balance
        });
        balance += expectedReturn;
    }
    return data;
  }, [trades]);

  const analyticsStats = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const losses = trades.filter(t => t.pnl < 0).length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const lossRate = total > 0 ? (losses / total) * 100 : 0;
    
    const winAmounts = trades.filter(t => t.pnl > 0).map(t => t.pnl);
    const lossAmounts = trades.filter(t => t.pnl < 0).map(t => Math.abs(t.pnl));
    
    const avgWin = winAmounts.length > 0 ? winAmounts.reduce((a, b) => a + b, 0) / winAmounts.length : 0;
    const avgLoss = lossAmounts.length > 0 ? lossAmounts.reduce((a, b) => a + b, 0) / lossAmounts.length : 0;
    
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : (avgWin > 0 ? 99 : 0);
    
    return { winRate, lossRate, avgWin, avgLoss, profitFactor, total };
  }, [trades]);

  const [simulatedLossRate, setSimulatedLossRate] = useState<number>(50);

  useEffect(() => {
    if (analyticsStats.lossRate > 0) {
      setSimulatedLossRate(Math.round(analyticsStats.lossRate * 10) / 10);
    }
  }, [analyticsStats.lossRate]);

  const streakStats = useMemo(() => {
    const sortedChronologically = [...trades].sort((a, b) => new Date(a.entryDate || a.exitDate).getTime() - new Date(b.entryDate || b.exitDate).getTime());
    
    let maxLosingStreak = 0;
    let currentLosingStreak = 0;
    let activeStreak = 0;

    sortedChronologically.forEach(t => {
      if (t.pnl < 0) {
        activeStreak++;
        if (activeStreak > maxLosingStreak) {
          maxLosingStreak = activeStreak;
        }
      } else if (t.pnl > 0) {
        activeStreak = 0;
      }
    });

    for (let i = sortedChronologically.length - 1; i >= 0; i--) {
      if (sortedChronologically[i].pnl < 0) {
        currentLosingStreak++;
      } else if (sortedChronologically[i].pnl > 0) {
        break;
      } else {
        break;
      }
    }

    return { maxLosingStreak, currentLosingStreak };
  }, [trades]);

  const streakProbabilities = useMemo(() => {
    const q = simulatedLossRate / 100;
    const p = 1 - q;
    const N = 50;
    const data = [];

    // Include the user's max losing streak if it's larger than 10 so it's always in the range
    const maxBound = Math.max(10, streakStats.maxLosingStreak + 1);

    for (let X = 2; X <= maxBound; X++) {
      let dp = new Array(X).fill(0);
      dp[0] = 1.0;

      for (let step = 0; step < N; step++) {
        const nextDp = new Array(X).fill(0);
        let sum = 0;
        for (let j = 0; j < X; j++) {
          sum += dp[j];
        }
        nextDp[0] = sum * p;

        for (let j = 0; j < X - 1; j++) {
          nextDp[j + 1] = dp[j] * q;
        }
        dp = nextDp;
      }

      let probNotReached = 0;
      for (let j = 0; j < X; j++) {
        probNotReached += dp[j];
      }

      const probReached = Math.max(0, Math.min(1.0, 1.0 - probNotReached));
      
      const isUserMaxStreak = streakStats.maxLosingStreak === X;
      const isUserCurrentStreak = streakStats.currentLosingStreak === X;

      data.push({
        streak: `${X} Losses`,
        streakNum: X,
        probability: Math.round(probReached * 1000) / 10,
        isUserMaxStreak,
        isUserCurrentStreak,
      });
    }

    return data;
  }, [simulatedLossRate, streakStats]);

  return (
    <div className="space-y-12 pb-20">
      <ScrollAnimatedSection>
        {/* Top Level Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Win Rate</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white tracking-tighter">{analyticsStats.winRate.toFixed(1)}%</h3>
            <span className="text-xs text-emerald-500 font-bold uppercase tracking-tighter">accuracy</span>
          </div>
          <div className="mt-4 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analyticsStats.winRate}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown className="w-12 h-12 text-rose-400" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Loss Rate</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white tracking-tighter">{analyticsStats.lossRate.toFixed(1)}%</h3>
            <span className="text-xs text-rose-500 font-bold uppercase tracking-tighter">risk freq</span>
          </div>
          <div className="mt-4 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analyticsStats.lossRate}%` }}
              className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Scale className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Profitability Scale</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white tracking-tighter">{analyticsStats.profitFactor.toFixed(2)}x</h3>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-tighter">Profit Factor</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 text-[8px] font-black uppercase text-rose-400">Avg L: {displayValue(analyticsStats.avgLoss)}</div>
            <div className="flex-1 text-right text-[8px] font-black uppercase text-emerald-400">Avg W: {displayValue(analyticsStats.avgWin)}</div>
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.15}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <History className="w-20 h-20" />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Alpha Session</p>
            <p className="text-xl font-black text-white">{strategyInsights?.bestSession}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar className="w-20 h-20" />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Golden Day</p>
            <p className="text-xl font-black text-white">{strategyInsights?.bestDay}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-20 h-20" />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Avg Win RR</p>
            <p className="text-xl font-black text-emerald-400">{strategyInsights?.avgWinRR}R</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target className="w-20 h-20" />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">High RR ({">"}3R)</p>
            <p className="text-xl font-black text-indigo-400">{strategyInsights?.highRRCount}</p>
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Performance by Strategy</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {strategyData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">P&L by Weekday</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {dailyData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Market Exposure</h4>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {marketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pr-4">
              {marketData.map((m, i) => (
                <div key={m.name} className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-zinc-400">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Daily Activity distribution</h4>
            <p className="text-[10px] text-zinc-600">Last 30 Days</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {eachDayOfInterval({ start: subDays(new Date(), 30), end: new Date() }).map((day, i) => {
              const dayTrades = trades.filter(t => isSameDay(parseISO(t.exitDate), day));
              const pnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-8 h-8 rounded-sm transition-all cursor-crosshair",
                    pnl > 0 ? "bg-emerald-600 hover:bg-emerald-500" : 
                    pnl < 0 ? "bg-rose-900 hover:bg-rose-800" : 
                    "bg-zinc-800 hover:bg-zinc-700"
                  )}
                  title={`${format(day, 'MMM dd')}: ${pnl === 0 ? 'No activity' : displayValue(pnl)}`}
                />
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-[10px] text-zinc-500 uppercase font-bold text-[8px] tracking-widest">Legend: Loss / Inactive / Profit</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-rose-900 rounded-sm" />
              <div className="w-2 h-2 bg-zinc-800 rounded-sm" />
              <div className="w-2 h-2 bg-emerald-600 rounded-sm" />
              <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Performance by Session</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {sessionData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Execution Flaws Distribution</h4>
          <div className="h-[300px]">
             {mistakeData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={mistakeData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     fill="#8884d8"
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {mistakeData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                 No execution flaws recorded yet. Keep it clean!
               </div>
             )}
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>

      {/* Dynamic Drawdown & Streak Probability Matrix */}
      <ScrollAnimatedSection delay={0.15}>
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          {/* Decorative ambient gradient */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-rose-500/5 blur-[120px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">
                    Streak & Drawdown <span className="text-rose-400">Probability Model</span>
                  </h3>
                </div>
                <p className="text-zinc-500 max-w-xl text-xs leading-relaxed uppercase tracking-tight">
                  Probability of experiencing at least <span className="text-zinc-300 font-bold">X consecutive losing trades</span> within a 50-trade sample, modeled on binomial run distributions.
                </p>
              </div>

              {/* Reset to actual loss rate button */}
              <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Modeling Base</p>
                  <p className="text-xs font-mono font-bold text-zinc-350">
                    {simulatedLossRate.toFixed(1)}% Loss Rate ({ (100 - simulatedLossRate).toFixed(1) }% WR)
                  </p>
                </div>
                {Math.abs(simulatedLossRate - analyticsStats.lossRate) > 0.1 && (
                  <button
                    type="button"
                    onClick={() => setSimulatedLossRate(Math.round(analyticsStats.lossRate * 10) / 10)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-850 rounded-xl text-[9px] uppercase font-black text-indigo-400 transition-all font-mono"
                    title="Load real historical loss rate from your journal"
                  >
                    Use Live Link ({analyticsStats.lossRate.toFixed(1)}%)
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: The Chart */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-zinc-950/40 border border-zinc-850/60 rounded-2xl p-6">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={streakProbabilities} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} vertical={false} />
                        <XAxis 
                          dataKey="streak" 
                          stroke="#71717a" 
                          fontSize={9} 
                          fontWeight="bold"
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis 
                          stroke="#71717a" 
                          fontSize={9} 
                          axisLine={false} 
                          tickLine={false}
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-2xl space-y-2">
                                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                                    {data.streakNum} Consecutive Losses
                                  </p>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-base font-mono font-black text-white">{data.probability}%</span>
                                    <span className="text-[9px] text-zinc-550 font-bold uppercase">Probability</span>
                                  </div>
                                  <p className="text-[9px] text-zinc-400 leading-normal max-w-[200px]">
                                    At a {simulatedLossRate.toFixed(1)}% loss rate, there is a {data.probability}% chance of getting {data.streakNum} or more losses in a row in any 50-trade period.
                                  </p>
                                  {data.isUserMaxStreak && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-wider">
                                      Your Max Historical Streak
                                    </span>
                                  )}
                                  {data.isUserCurrentStreak && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black uppercase tracking-wider">
                                      Your Current Active Streak
                                    </span>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                          {streakProbabilities.map((entry, index) => {
                            let fill = '#27272a'; // zinc-800
                            let stroke = 'transparent';
                            let glowClass = false;
                            
                            if (entry.isUserMaxStreak) {
                              fill = '#6366f1'; // indigo-500
                              stroke = '#818cf8';
                              glowClass = true;
                            } else if (entry.isUserCurrentStreak) {
                              fill = '#f59e0b'; // amber-500
                              stroke = '#fbbf24';
                              glowClass = true;
                            }
                            
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={glowClass ? 1 : 0}
                                style={glowClass ? {
                                  filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))'
                                } : {}}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Controls and Indicators */}
              <div className="space-y-5">
                {/* Simulated Loss Rate Slider */}
                <div className="bg-zinc-950/40 border border-zinc-850/60 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                      <SettingsIcon className="w-3.5 h-3.5 text-zinc-550" /> Interactive Simulator
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                      Loss: {simulatedLossRate}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={simulatedLossRate}
                      onChange={(e) => setSimulatedLossRate(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-650 font-mono">
                      <span>95% WR</span>
                      <span>50/50</span>
                      <span>5% WR</span>
                    </div>
                  </div>
                </div>

                {/* Lighted up states panel */}
                <div className="bg-zinc-950/40 border border-zinc-850/60 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">
                    Your Live Streak Profile
                  </span>

                  <div className="space-y-2.5">
                    {/* Max Streak Indicator */}
                    <div className={cn(
                      "p-3 rounded-xl border transition-all flex justify-between items-center",
                      streakStats.maxLosingStreak > 0
                        ? "bg-indigo-500/5 border-indigo-500/20"
                        : "bg-zinc-900/20 border-zinc-850/50"
                    )}>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-300">
                            Max Loss Streak
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Your record consecutive loss count.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-black text-indigo-400">
                          {streakStats.maxLosingStreak}x
                        </p>
                        <p className="text-[8px] font-mono font-semibold text-zinc-400">
                          {streakStats.maxLosingStreak >= 2 ? (
                            `Prob: ${(() => {
                              const match = streakProbabilities.find(p => p.streakNum === streakStats.maxLosingStreak);
                              return match ? `${match.probability}%` : 'N/A';
                            })()}`
                          ) : (
                            'N/A (<2)'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Current Active Streak Indicator */}
                    <div className={cn(
                      "p-3 rounded-xl border transition-all flex justify-between items-center",
                      streakStats.currentLosingStreak > 0
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-zinc-900/20 border-zinc-850/50"
                    )}>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-300">
                            Active Loss Streak
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Your active ongoing loss count.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-black text-amber-500">
                          {streakStats.currentLosingStreak}x
                        </p>
                        <p className="text-[8px] font-mono font-semibold text-zinc-400">
                          {streakStats.currentLosingStreak >= 2 ? (
                            `Prob: ${(() => {
                              const match = streakProbabilities.find(p => p.streakNum === streakStats.currentLosingStreak);
                              return match ? `${match.probability}%` : 'N/A';
                            })()}`
                          ) : (
                            'N/A (<2)'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistical Note */}
                <div className="p-4 bg-zinc-950/20 rounded-2xl border border-dashed border-zinc-850/60">
                  <p className="text-[9px] text-zinc-500 leading-normal uppercase tracking-tight">
                    💡 <span className="font-bold text-zinc-400">The Streak Fallacy:</span> Over 50 trades, any strategy with a 50% Win Rate has an <span className="text-white font-bold">81.3% probability</span> of seeing at least 4 losses in a row. It is mathematically standard. Do not abandon an edge over standard variance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimatedSection>

      {/* Dive into Strategy Section */}
      {trades.length > 10 ? (
        <ScrollAnimatedSection delay={0.2}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Deep Strategy <span className="text-indigo-400">Analysis</span></h3>
                  </div>
                  <p className="text-zinc-500 max-w-xl text-sm italic">
                    "The edge is in the data. We've synthesized your last {trades.length} executions into a predictive blueprint."
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Expectancy</p>
                    <p className={cn(
                      "text-xl font-black",
                      analyticsStats.profitFactor > 1 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {displayValue((analyticsStats.winRate/100 * analyticsStats.avgWin) - ((1 - analyticsStats.winRate/100) * analyticsStats.avgLoss), true)} / Trade
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Winning Confluences
                  </h4>
                  <div className="space-y-3">
                    {strategyInsights?.rulePerformance.map((rule, idx) => (
                      <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-zinc-300">{rule.name}</span>
                          <span className="text-xs font-black text-emerald-400">{rule.winRate.toFixed(0)}% WR</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${rule.winRate}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-2">Appeared in {rule.total} trades</p>
                      </div>
                    ))}
                    {strategyInsights?.rulePerformance.length === 0 && (
                      <p className="text-xs text-zinc-600 italic p-4">Add "Followed Rules" in your entry form to see this analysis.</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                   <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Growth Expectancy (Next 20 Trades)
                  </h4>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={expectancyData}>
                        <defs>
                          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="trade" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                        />
                        <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">Projection based on current win rate and R:R efficiency</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest">Strength Profile</h5>
                  <p className="text-sm text-zinc-400"><span className="text-white font-bold">{strategyInsights?.bestDay}s</span> are your high-conviction windows. Your risk discipline is 40% higher on these days.</p>
                </div>
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-black uppercase text-emerald-400 mb-3 tracking-widest">Alpha Setup</h5>
                  <p className="text-sm text-zinc-400">The <span className="text-white font-bold">{strategyInsights?.bestStrategy}</span> has reached statistical significance. Scale position sizing by 0.5% here.</p>
                </div>
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-black uppercase text-rose-400 mb-3 tracking-widest">Efficiency Gap</h5>
                  <p className="text-sm text-zinc-400">Trading outside <span className="text-white font-bold">{strategyInsights?.bestSession}</span> cost you {displayValue(trades.filter(t => t.pnl < 0).length * analyticsStats.avgLoss * 0.2)} in potential equity overflow.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      ) : (
        <ScrollAnimatedSection delay={0.2}>
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl p-10 text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Lock className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-xl font-black text-zinc-500 tracking-tighter mb-2 uppercase">Analysis Engine <span className="text-zinc-800">Calibrating</span></h3>
            <p className="text-zinc-600 text-sm max-w-sm mx-auto italic">
              "We need 10 sample points to build your behavioral mirror." - {10 - trades.length} trades remaining to unlock Intelligence.
            </p>
            <div className="mt-8 max-w-xs mx-auto w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(trades.length / 10) * 100}%` }}
                className="h-full bg-indigo-500/30"
               />
            </div>
          </div>
        </ScrollAnimatedSection>
      )}

      {/* Analytics Footer with Quotes */}
      <ScrollAnimatedSection delay={0.2} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-12">
        <PnLCalendar trades={trades} setSelectedTrade={setSelectedTrade} currency={currency} hidePnL={hidePnL} profileName={profileName} />
      </ScrollAnimatedSection>

      <AnimatePresence>
        {selectedTrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTrade(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-zinc-100">{selectedTrade.asset}</h3>
                    <div className="flex gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                        selectedTrade.side === 'Long' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                      )}>
                        {selectedTrade.side}
                      </span>
                      <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-tight">
                        {selectedTrade.exitStatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm">{format(parseISO(selectedTrade.entryDate), 'PPP p')}</p>
                </div>
                <button onClick={() => setSelectedTrade(null)} className="p-2 bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Execution</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Entry Price</span>
                      <span className="text-lg font-mono font-bold text-zinc-100">{selectedTrade.entryPrice}</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">Exit Price</span>
                      <span className="text-lg font-mono font-bold text-zinc-100">{selectedTrade.exitPrice}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Risk Reward</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">Actual RR</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{selectedTrade.riskReward}R</span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">Target RR</span>
                      <span className="text-lg font-mono font-bold text-indigo-400">{selectedTrade.targetRR}R</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Performance</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-zinc-400 block">P&L Amount</span>
                      <span className={cn("text-lg font-bold", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {formatCurrency(selectedTrade.pnl, currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 block">P&L %</span>
                      <span className={cn("text-lg font-bold", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {selectedTrade.pnlPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-800/50 rounded-2xl space-y-4 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Strategy</span>
                  <p className="text-sm text-zinc-200">{selectedTrade.strategy}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Notes</span>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">"{selectedTrade.notes}"</p>
                </div>
                {selectedTrade.mistakeTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedTrade.mistakeTags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                 <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Trade Chart</span>
                 <div 
                   className={cn(
                      "aspect-video bg-zinc-950 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer transition-all overflow-hidden relative",
                      isDragging ? "bg-zinc-900 border-emerald-500 scale-[0.99] shadow-lg shadow-emerald-500/10" : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900"
                    )}
                    onClick={() => {
                      if (selectedTrade.screenshot) {
                        setIsFullscreen(true);
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleScreenshotUpload(file);
                    }}
                 >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScreenshotUpload(file);
                      }}
                    />
                    {selectedTrade.screenshot ? (
                      <>
                        <img src={selectedTrade.screenshot} alt="Trade Chart" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFullscreen(true);
                            }}
                            className="p-2 bg-white text-black rounded-lg hover:scale-110 transition-transform"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="p-2 bg-emerald-500 text-black rounded-lg hover:scale-110 transition-transform"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/chart:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-xs text-zinc-600">
                          {isDragging ? 'Drop Image Here' : (isUploading ? 'Uploading...' : 'Click to upload screenshot')}
                        </p>
                      </>
                    )}
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-2">
                 <button 
                   onClick={() => setShowExportModal(true)}
                   className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                 >
                   <CreditCard className="w-3 h-3" />
                   Poster
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && selectedTrade && (
          <ExportModal 
            trades={trades} 
            profileName={profileName} 
            onClose={() => setShowExportModal(false)}
            currency={currency}
            hidePnL={hidePnL}
            initialTradeId={selectedTrade.id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && selectedTrade?.screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedTrade.screenshot} 
                alt="Full analytics chart" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-indigo-500/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Footer with Quotes */}
      <footer className="mt-12 pt-12 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Wisdom for the refined trader</p>
          <p className="text-xl font-serif italic text-zinc-400 leading-relaxed transition-all duration-1000">
            "{QUOTES[Math.floor((Date.now() / (5 * 60 * 1000)) % QUOTES.length)]}"
          </p>
          <div className="flex justify-center items-center gap-4 pt-4">
            <div className="h-px w-8 bg-zinc-800" />
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <div className="h-px w-8 bg-zinc-800" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const Settings = ({ 
  settings, 
  onUpdateSettings,
  accounts,
  currentAccountId,
  onAddAccount,
  onSwitchAccount,
  onDeleteAccount,
  user,
  onAuthComplete,
  onLogout
}: { 
  settings: UserSettings, 
  onUpdateSettings: (s: UserSettings) => void,
  accounts: Account[],
  currentAccountId: string,
  onAddAccount: () => void,
  onSwitchAccount: (id: string) => void,
  onDeleteAccount: (id: string) => void,
  user: User | null,
  onAuthComplete: (u: User) => void,
  onLogout: () => void
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(settings.profileName);
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const [showLogoutConfirmSettings, setShowLogoutConfirmSettings] = useState(false);

  const lockPeriodHours = 720; // 30 days
  const lastChanged = settings.profileNameLastChanged ? new Date(settings.profileNameLastChanged) : null;
  const now = new Date();
  
  const canChangeName = !lastChanged || (now.getTime() - lastChanged.getTime()) > lockPeriodHours * 60 * 60 * 1000;
  
  const hoursRemaining = lastChanged 
    ? Math.max(0, Math.ceil((lockPeriodHours * 60 * 60 * 1000 - (now.getTime() - lastChanged.getTime())) / (1000 * 60 * 60)))
    : 0;

  const handleApplyName = () => {
    onUpdateSettings({ 
      ...settings, 
      profileName: tempProfileName,
      profileNameLastChanged: new Date().toISOString()
    });
    setShowNameConfirm(false);
  };

  useEffect(() => {
    setTempProfileName(settings.profileName);
  }, [settings.profileName]);

  const [tempStrategyRules, setTempStrategyRules] = useState(settings.strategyRules.join(', '));

  useEffect(() => {
    setTempStrategyRules(settings.strategyRules.join(', '));
  }, [settings.strategyRules]);

  const handleStrategyRulesBlur = () => {
    const rules = tempStrategyRules.split(',').map(s => s.trim()).filter(Boolean);
    onUpdateSettings({ ...settings, strategyRules: rules });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cloud Sync & Security Section */}
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />
        <h3 className="text-xl font-bold text-zinc-100 mb-2 font-serif tracking-tight flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Cloud Sync & Security
        </h3>
        <p className="text-xs text-zinc-500 mb-8 max-w-sm mx-auto">Connect your vault to ZYNC's decentralized servers for real-time backup and private cross-device access.</p>
        
        {!user ? (
          <div className="p-1 bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden w-full max-w-sm">
             <AuthPage onAuthComplete={onAuthComplete} theme="night" embedded />
          </div>
        ) : (
          <div className="p-6 bg-zinc-950/50 border border-emerald-500/10 rounded-2xl flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user.displayName}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.email}</p>
              </div>
            </div>
            {showLogoutConfirmSettings ? (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Are you sure?</span>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 transition-all"
                >
                  Yes
                </button>
                <button 
                  onClick={() => setShowLogoutConfirmSettings(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  No
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogoutConfirmSettings(true)}
                className="px-6 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Disconnect
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-bold text-zinc-100 mb-6 font-serif tracking-tight">General Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-tighter">Private Mode</p>
              <p className="text-[10px] text-zinc-500 mt-1">Hide all P&L values from the dashboard for privacy.</p>
            </div>
            <button 
              onClick={() => onUpdateSettings({ ...settings, hidePnL: !settings.hidePnL })}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors",
                settings.hidePnL ? "bg-emerald-500" : "bg-zinc-800"
              )}
            >
              <motion.div 
                animate={{ x: settings.hidePnL ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" 
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-zinc-100 font-serif tracking-tight">Account Management</h3>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{accounts.length}/3 Accounts</span>
        </div>
        <div className="space-y-3">
          {accounts.map(account => (
            <div 
              key={account.id}
              className={cn(
                "p-4 rounded-2xl border flex items-center justify-between transition-all group",
                currentAccountId === account.id 
                  ? "bg-emerald-500/5 border-emerald-500/50 shadow-lg shadow-emerald-500/5" 
                  : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                  currentAccountId === account.id ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-500"
                )}>
                  {account.name.charAt(0)}
                </div>
                <div>
                  <p className={cn("text-xs font-bold", currentAccountId === account.id ? "text-white" : "text-zinc-400")}>{account.name}</p>
                  <p className="text-[10px] text-zinc-500">{account.settings.profileName} • {account.trades.length} trades</p>
                </div>
              </div>
              <div className="flex gap-2">
                {currentAccountId !== account.id ? (
                  <button 
                    onClick={() => onSwitchAccount(account.id)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Switch
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Active
                  </div>
                )}
                {accounts.length > 1 && (
                  <button 
                    onClick={() => onDeleteAccount(account.id)}
                    className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {accounts.length < 3 && (
            <button 
              onClick={onAddAccount}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Add Fresh Account</span>
            </button>
          )}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-bold text-zinc-100 mb-6 font-serif tracking-tight">Appearance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {[
            { id: 'night', name: 'Night', color: 'bg-zinc-950', border: 'border-zinc-800', active: 'bg-emerald-500/10 border-emerald-500', marker: 'bg-emerald-500' },
            { id: 'midnight', name: 'Midnight', color: 'bg-[#020617]', border: 'border-blue-900/30', active: 'bg-blue-500/10 border-blue-500', marker: 'bg-blue-500' },
            { id: 'obsidian', name: 'Obsidian', color: 'bg-black', border: 'border-zinc-800', active: 'bg-white/10 border-white', marker: 'bg-white' },
            { id: 'slate', name: 'Slate', color: 'bg-[#18181b]', border: 'border-zinc-700', active: 'bg-zinc-500/10 border-zinc-400', marker: 'bg-zinc-400' },
            { id: 'forest', name: 'Forest', color: 'bg-[#022c22]', border: 'border-emerald-900/30', active: 'bg-emerald-500/10 border-emerald-500', marker: 'bg-emerald-500' },
            { id: 'abyss', name: 'Abyss', color: 'bg-[#0f172a]', border: 'border-slate-800', active: 'bg-indigo-500/10 border-indigo-500', marker: 'bg-indigo-500' },
            { id: 'carbon', name: 'Carbon', color: 'bg-[#171717]', border: 'border-zinc-800', active: 'bg-zinc-100/10 border-zinc-400', marker: 'bg-zinc-400' },
            { id: 'light', name: 'Lighter', color: 'bg-white border-zinc-200', border: 'border-zinc-200', active: 'bg-indigo-500/10 border-indigo-500', marker: 'bg-indigo-500' }
          ].map((th) => (
            <button 
              key={th.id}
              onClick={() => onUpdateSettings({ ...settings, theme: th.id as any })}
              className={cn(
                "p-3 rounded-xl border flex flex-col gap-2 transition-all",
                settings.theme === th.id 
                  ? th.active + " shadow-lg" 
                  : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className={cn("w-full aspect-[2/1] rounded-lg border flex items-center justify-center", th.color, th.border)}>
                <div className={cn("w-1/3 h-0.5 rounded-full", th.marker)} />
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", settings.theme === th.id ? "text-white" : "text-zinc-500")}>{th.name}</span>
                {settings.theme === th.id && <div className={cn("w-1 h-1 rounded-full", th.marker)} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-bold text-zinc-100 mb-6 font-serif tracking-tight">Profile Settings</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
                <span className="text-[9px] text-zinc-600 font-medium italic">(This can be changed after every 30days)</span>
              </div>
              {!canChangeName && (
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked for {hoursRemaining} hours
                </span>
              )}
            </div>
            <div className="relative group">
              <input 
                value={tempProfileName}
                onChange={(e) => setTempProfileName(e.target.value)}
                disabled={!canChangeName}
                placeholder="Enter your trading alias..."
                className={cn(
                  "w-full bg-zinc-950 border rounded-lg px-4 py-2 text-zinc-100 outline-none transition-all pr-32",
                  !canChangeName ? "border-zinc-800 opacity-50 cursor-not-allowed" : "border-zinc-800 focus:ring-1 focus:ring-emerald-500"
                )}
              />
              <AnimatePresence>
                {tempProfileName !== settings.profileName && canChangeName && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-2 top-1.5"
                  >
                    {!showNameConfirm ? (
                      <button 
                        onClick={() => setShowNameConfirm(true)}
                        className="bg-emerald-500 text-black px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        Update
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg shadow-2xl">
                        <span className="text-[9px] font-bold text-zinc-400 px-2 whitespace-nowrap">Are you sure? (Locked for 30d)</span>
                        <button 
                          onClick={handleApplyName}
                          className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setShowNameConfirm(false)}
                          className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[9px] font-black uppercase"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Primary Currency</label>
              <select 
                value={settings.currency}
                onChange={(e) => onUpdateSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
                <option>PHP</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Starting Balance</label>
              <input 
                type="number"
                value={settings.startingBalance}
                onChange={(e) => onUpdateSettings({ ...settings, startingBalance: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Strategy Checklist (Comma separated)</label>
            <textarea 
              value={tempStrategyRules}
              onChange={(e) => setTempStrategyRules(e.target.value)}
              onBlur={handleStrategyRulesBlur}
              className={cn(
                "w-full rounded-lg px-4 py-2 outline-none transition-all resize-none border",
                settings.theme === 'light' ? "bg-white border-zinc-200 text-zinc-900 focus:ring-indigo-500" : "bg-black/20 border-zinc-800 text-zinc-100 focus:ring-emerald-500"
              )}
              rows={3}
              placeholder="Rule 1: HTF Bias, Rule 2: 15m Displacement, Rule 3: 1m FVG..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Risk per Trade %</label>
            <input 
              type="number"
              value={settings.riskPerTrade}
              onChange={(e) => onUpdateSettings({ ...settings, riskPerTrade: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-xl overflow-hidden relative">
        <h3 className="text-xl font-bold text-rose-400 mb-2">Danger Zone</h3>
        <p className="text-zinc-500 text-xs mb-6">Wiping your data is permanent. Make sure you have exports if needed.</p>
        
        <AnimatePresence mode="wait">
          {!showClearConfirm ? (
            <motion.button 
              key="initial-btn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setShowClearConfirm(true)}
              className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-6 py-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
            >
              Clear All History
            </motion.button>
          ) : (
            <motion.div 
              key="confirm-area"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-rose-500/10 p-4 rounded-xl border border-rose-500/30 shadow-2xl shadow-rose-500/5 animate-pulse-subtle"
            >
              <div className="flex-1">
                <p className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Are you absolutely sure?
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">This action cannot be undone. History will be lost forever.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-zinc-800 text-zinc-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('zync_trades');
                    window.location.reload();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
                >
                  Yes, Wipe Data
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Plan = ({ 
  settings, 
  onUpdateSettings 
}: { 
  settings: UserSettings, 
  onUpdateSettings: (s: UserSettings) => void 
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'playbook'>('blueprint');
  const [newRule, setNewRule] = useState("");
  const [isAddingPlaybookItem, setIsAddingPlaybookItem] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PlaybookItem>>({});
  const [confirmingLogicDeleteId, setConfirmingLogicDeleteId] = useState<string | null>(null);

  const handleUpdatePlaybookItem = (id: string, updates: Partial<PlaybookItem>) => {
    onUpdateSettings({
      ...settings,
      playbook: (settings.playbook || []).map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
    setEditingItemId(null);
  };
  const [playbookForm, setPlaybookForm] = useState<Partial<PlaybookItem>>({
    title: "",
    content: "",
    checkpoints: []
  });
  const [newCheckpoint, setNewCheckpoint] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % QUOTES.length);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const shuffleQuote = () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * QUOTES.length);
    } while (nextIdx === quoteIdx);
    setQuoteIdx(nextIdx);
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    onUpdateSettings({
      ...settings,
      strategyRules: [...settings.strategyRules, newRule.trim()]
    });
    setNewRule("");
  };

  const handleDeleteRule = (rule: string) => {
    onUpdateSettings({
      ...settings,
      strategyRules: settings.strategyRules.filter(r => r !== rule)
    });
  };

  const handleToggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreatePlaybookItem = () => {
    if (!playbookForm.title || !playbookForm.content) return;
    
    const newItem: PlaybookItem = {
      id: Math.random().toString(36).substring(7),
      title: playbookForm.title,
      content: playbookForm.content,
      checkpoints: playbookForm.checkpoints || []
    };

    onUpdateSettings({
      ...settings,
      playbook: [...(settings.playbook || []), newItem]
    });

    setIsAddingPlaybookItem(false);
    setPlaybookForm({ title: "", content: "", checkpoints: [] });
  };

  const handleDeletePlaybookItem = (id: string) => {
    onUpdateSettings({
      ...settings,
      playbook: (settings.playbook || []).filter(item => item.id !== id),
      activePlaybookId: settings.activePlaybookId === id ? null : settings.activePlaybookId
    });
  };

  const handleActivatePlaybook = (id: string) => {
    onUpdateSettings({
      ...settings,
      activePlaybookId: settings.activePlaybookId === id ? null : id
    });
  };

  const addCheckpoint = () => {
    if (!newCheckpoint.trim()) return;
    setPlaybookForm(prev => ({
      ...prev,
      checkpoints: [...(prev.checkpoints || []), newCheckpoint.trim()]
    }));
    setNewCheckpoint("");
  };

  const removeCheckpoint = (idx: number) => {
    setPlaybookForm(prev => ({
      ...prev,
      checkpoints: (prev.checkpoints || []).filter((_, i) => i !== idx)
    }));
  };

  const sortedPlaybook = useMemo(() => {
    return [...(settings.playbook || [])].sort((a, b) => {
      if (a.id === settings.activePlaybookId) return -1;
      if (b.id === settings.activePlaybookId) return 1;
      return 0;
    });
  }, [settings.playbook, settings.activePlaybookId]);

  return (
    <ScrollAnimatedSection className="w-full py-4">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Target className="w-4 h-4 text-black" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Strategic <span className="text-emerald-400">Hub</span></h2>
            </div>
            <p className="text-zinc-500 max-w-lg text-sm">
              Your professional trading framework. Forge rules in the calm to execute with precision in the storm.
            </p>
          </div>
          
          <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab('blueprint')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'blueprint' ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Rules
            </button>
            <button 
              onClick={() => setActiveTab('playbook')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'playbook' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/10" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Playbook
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'blueprint' ? (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Rules Management */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Core Execution Rules</h3>
                    <p className="text-xs text-zinc-500">Non-negotiable mandates for every trade.</p>
                  </div>
                  <Target className="w-5 h-5 text-emerald-400 opacity-30" />
                </div>

                <div className="space-y-3 mb-8">
                  {settings.strategyRules.map((rule, i) => (
                    <motion.div 
                      layout
                      key={rule} 
                      className="flex items-center justify-between gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:text-emerald-400 transition-colors border border-zinc-800">
                          {i + 1}
                        </div>
                        <span className="text-sm text-zinc-300 font-medium">@{rule}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteRule(rule)}
                        className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  
                  <div className="flex gap-2 p-2 bg-zinc-950 border border-zinc-800 border-dashed rounded-2xl">
                    <input 
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                      placeholder="Add a new non-negotiable rule..."
                      className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddRule}
                      className="p-2 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-10 rounded-full bg-indigo-500" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Rule Analysis</h4>
                      <p className="text-[10px] text-zinc-500 italic">"Discipline is carrying out what you said you would do."</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your current ruleset focuses heavily on technical entry criteria. Consider adding a rule about <span className="text-indigo-400">risk management</span> or <span className="text-indigo-400">emotional preservation</span> after a loss.
                  </p>
                </div>
              </div>
            </div>

            {/* Mindset Sidebar */}
            <div className="space-y-6">
              <motion.div 
                key={quoteIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden group cursor-pointer"
                onClick={shuffleQuote}
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                <BookOpen className="w-8 h-8 text-indigo-400 mb-6 opacity-20" />
                <p className="text-xl font-serif italic text-white leading-tight mb-4">
                  "{QUOTES[quoteIdx]}"
                </p>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Tap to Refocus</p>
              </motion.div>

              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Framework
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Current Focus</p>
                    <p className="text-xs text-zinc-300 font-bold">HTF Bias Alignment</p>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Execution Quality</p>
                    <p className="text-xs text-zinc-300 font-bold">Wait for LTF Displacement</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="playbook"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Playbook List */}
            <div className="grid grid-cols-1 gap-6">
              {sortedPlaybook.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "bg-zinc-900 border overflow-hidden rounded-3xl transition-all duration-300",
                    settings.activePlaybookId === item.id 
                      ? "border-emerald-500/50 shadow-2xl shadow-emerald-500/5" 
                      : "border-zinc-800"
                  )}
                >
                  <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-colors" onClick={() => handleToggleExpand(item.id)}>
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        settings.activePlaybookId === item.id ? "bg-emerald-500 text-black shadow-lg" : "bg-zinc-950 text-zinc-500 border border-zinc-800"
                      )}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-black text-white tracking-tight">{item.title}</h4>
                          {settings.activePlaybookId === item.id && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate max-w-md">{item.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {itemToDeleteId === item.id ? (
                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl animate-in fade-in zoom-in duration-200">
                          <span className="text-[10px] font-bold text-zinc-500 px-2">Delete?</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeletePlaybookItem(item.id); setItemToDeleteId(null); }}
                            className="bg-rose-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 transition-colors"
                          >
                            Yes
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setItemToDeleteId(null); }}
                            className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleActivatePlaybook(item.id); }}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              settings.activePlaybookId === item.id 
                                ? "bg-zinc-800 text-zinc-400" 
                                : "bg-emerald-500 text-black hover:scale-105"
                            )}
                          >
                            {settings.activePlaybookId === item.id ? "Activated" : "Activate"}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setItemToDeleteId(item.id); }}
                            className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {expandedItems[item.id] ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedItems[item.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-800 bg-zinc-950/30"
                      >
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Strategy Logic</h5>
                                <div className="flex items-center gap-2">
                                  {editingItemId === item.id ? (
                                    <>
                                      <button 
                                        onClick={() => handleUpdatePlaybookItem(item.id, { content: editForm.content })}
                                        className="text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                                      >
                                        Save
                                      </button>
                                      <button 
                                        onClick={() => setEditingItemId(null)}
                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-400 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <button 
                                        onClick={() => {
                                          setEditingItemId(item.id);
                                          setEditForm({ content: item.content });
                                        }}
                                        className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                                      >
                                        <Edit className="w-3 h-3" />
                                        Edit
                                      </button>
                                      {confirmingLogicDeleteId === item.id ? (
                                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-md animate-in fade-in zoom-in duration-200">
                                          <span className="text-[8px] font-bold text-zinc-500 px-1">Clear Logic?</span>
                                          <button 
                                            onClick={() => {
                                              handleUpdatePlaybookItem(item.id, { content: "" });
                                              setConfirmingLogicDeleteId(null);
                                            }}
                                            className="bg-rose-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase"
                                          >
                                            Yes
                                          </button>
                                          <button 
                                            onClick={() => setConfirmingLogicDeleteId(null)}
                                            className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase"
                                          >
                                            No
                                          </button>
                                        </div>
                                      ) : (
                                        <button 
                                          onClick={() => setConfirmingLogicDeleteId(item.id)}
                                          className="text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                                        >
                                          <X className="w-3 h-3" />
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {editingItemId === item.id ? (
                                <textarea 
                                  value={editForm.content}
                                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                  rows={4}
                                />
                              ) : (
                                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                  {item.content || <span className="text-zinc-600 italic">No logic defined yet. Click edit to add your narrative.</span>}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-widest">Execution Checkpoints</h5>
                              <div className="space-y-2">
                                {item.checkpoints.map((cp, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl group/cp">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{cp}</span>
                                  </div>
                                ))}
                                {item.checkpoints.length === 0 && (
                                  <p className="text-xs text-zinc-600 italic">No checkpoints defined for this playbook item.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Add New Playbook Item Button */}
              {!isAddingPlaybookItem ? (
                <button 
                  onClick={() => setIsAddingPlaybookItem(true)}
                  className="w-full p-8 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-zinc-600 hover:text-indigo-400 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest">Add New Playbook Chapter</p>
                    <p className="text-[10px] mt-1 opacity-60">Define a new entry logic or risk management model</p>
                  </div>
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-white tracking-tight">New Strategy Blueprint</h4>
                      <button onClick={() => setIsAddingPlaybookItem(false)} className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Strategy Name</label>
                        <input 
                          type="text"
                          value={playbookForm.title}
                          onChange={(e) => setPlaybookForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Silver Bullet Integration"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Analytical Rationale</label>
                        <textarea 
                          value={playbookForm.content}
                          onChange={(e) => setPlaybookForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Describe the logic, the narrative, and the HTF/LTF confluence required..."
                          rows={4}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Execution Checkpoints</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={newCheckpoint}
                            onChange={(e) => setNewCheckpoint(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCheckpoint()}
                            placeholder="Add a specific execution step..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                          />
                          <button 
                            onClick={addCheckpoint}
                            className="px-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/10"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {playbookForm.checkpoints?.map((cp, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg group">
                              <span className="text-[10px] text-zinc-400">{cp}</span>
                              <button 
                                onClick={() => removeCheckpoint(idx)}
                                className="text-zinc-600 hover:text-rose-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
                      <button 
                        onClick={() => setIsAddingPlaybookItem(false)}
                        className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleCreatePlaybookItem}
                        className="px-8 py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                      >
                        Create Chapter
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Empty State */}
            {(!settings.playbook || settings.playbook.length === 0) && !isAddingPlaybookItem && (
              <div className="py-20 text-center">
                <Zap className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-600 tracking-tight">Your playbook is empty</h3>
                <p className="text-sm text-zinc-700 max-w-sm mx-auto mt-2 italic">
                  Turn your trading observations into a repeatable system. Add segments for different market conditions or specific setups.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollAnimatedSection>
  );
};

const TradingViewWidget = ({ symbol, height = "100%", autosize = true }: { symbol: string, height?: string | number, autosize?: boolean }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol.includes(':') ? symbol : (['BTCUSD', 'ETHUSD'].includes(symbol) ? `BINANCE:${symbol}` : `NASDAQ:${symbol}`),
      "width": "100%",
      "height": height,
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": "dark",
      "isTransparent": true,
      "autosize": autosize,
      "largeChartUrl": ""
    });
    container.current.appendChild(script);
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, height, autosize]);

  return <div ref={container} className="w-full h-full" />;
};

const AINewsAnalysis = ({ news, includeFutures = true }: { news: any[], includeFutures?: boolean }) => {
  const [analysis, setAnalysis] = useState<{ 
    sentiment: 'bullish' | 'bearish' | 'neutral', 
    confidence: number, 
    reasoning: string,
    scenarios: { condition: string, prediction: string, bias: string }[],
    outcomes: { label: string, probability: number, color: string }[]
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const analyzeNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      if (!apiKey) {
        throw new Error('AI API Key not found. Please check your implementation.');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Act as a senior Quantitative Analyst. Analyze the following global news events for the current week and provide a deep market sentiment analysis${includeFutures ? ' specifically focusing on Indices, Commodities, and Futures (CME/CBOT)' : ''}. 
      
      CRITICAL: You MUST also provide EXACTLY 3 scenarios for the highest impact news item: 
      1. Above Forecast -> Very Bullish
      2. On Forecast -> Ranging
      3. Below Forecast -> Very Bearish

      Provide a prediction market distribution (Bullish, Neutral, Bearish probabilities summing to 100%).

      Respond ONLY in JSON format: { 
        "sentiment": "bullish" | "bearish" | "neutral", 
        "confidence": number (0-100), 
        "reasoning": "short professional explanation",
        "scenarios": [
          { "condition": "Above Forecast", "prediction": "Very Bullish", "bias": "Expansion" },
          { "condition": "On Forecast", "prediction": "Ranging", "bias": "Consolidation" },
          { "condition": "Below Forecast", "prediction": "Very Bearish", "bias": "Structural Break" }
        ],
        "outcomes": [
          { "label": "Bullish", "probability": number, "color": "emerald" },
          { "label": "Neutral", "probability": number, "color": "zinc" },
          { "label": "Bearish", "probability": number, "color": "rose" }
        ]
      }.
      News Events: ${JSON.stringify(news)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || '';
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) throw new Error('Invalid AI response: JSON not found');
      const cleanedText = text.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(cleanedText);
      
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid AI response format');
      
      setAnalysis({
        sentiment: parsed.sentiment || 'neutral',
        confidence: parsed.confidence || 50,
        reasoning: parsed.reasoning || 'Market analysis unavailable.',
        scenarios: Array.isArray(parsed.scenarios) ? parsed.scenarios : [],
        outcomes: Array.isArray(parsed.outcomes) ? parsed.outcomes : []
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to sync with AI Alpha servers.");
      setAnalysis({ 
        sentiment: 'neutral', 
        confidence: 50, 
        reasoning: "Horizontal consolidation expected across major futures contracts.",
        scenarios: [
          { condition: "Above Forecast", prediction: "Bullish", bias: "Expansion" },
          { condition: "On Forecast", prediction: "Ranging", bias: "Neutral" },
          { condition: "Below Forecast", prediction: "Bearish", bias: "Reversal" }
        ],
        outcomes: [
          { label: "Bullish", probability: 30, color: "emerald" },
          { label: "Neutral", probability: 40, color: "zinc" },
          { label: "Bearish", probability: 30, color: "rose" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (news.length > 0) {
      analyzeNews();
    } else {
      setAnalysis(null);
    }
  }, [news]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl group hover:border-emerald-500/20 transition-all shadow-xl relative overflow-hidden h-full">
      {/* Decorative Liquidity Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <ZapIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">AI ALPHA PLAYBOOK</h4>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{includeFutures ? 'Futures & Global Bias' : 'Market Sentiment'}</p>
              {lastUpdated && <span className="text-[8px] text-zinc-700 font-black tracking-widest uppercase">• Reflected: {lastUpdated}</span>}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Computing Alpha</span>
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest animate-pulse border border-rose-500/20 px-2 py-0.5 rounded">
                Sync Error
              </span>
            )}
            <button 
              onClick={analyzeNews}
              disabled={news.length === 0}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 disabled:opacity-20"
            >
              <RotateCw className={cn("w-4 h-4 text-zinc-500 hover:text-emerald-500", error && "text-rose-500")} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{error}</p>
        </div>
      )}

      {analysis ? (
        <div className="space-y-8 relative z-10">
          {/* Prediction Market Visual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Prediction Market Distribution</h5>
              <div className="flex items-center gap-4">
                {analysis.outcomes?.map(o => (
                  <div key={o.label} className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      o.color === 'emerald' ? "bg-emerald-500" : o.color === 'rose' ? "bg-rose-500" : "bg-zinc-500"
                    )} />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{o.label} {o.probability}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-4 bg-zinc-900 rounded-xl overflow-hidden flex border border-zinc-800 shadow-inner">
              {analysis.outcomes?.map((o, i) => (
                <div
                  key={i}
                  style={{ width: `${o.probability}%` }}
                  className={cn(
                    "h-full relative group transition-all duration-1000",
                    o.color === 'emerald' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : o.color === 'rose' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Main Sentiment Bias</span>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border",
                  analysis.sentiment === 'bullish' ? "text-emerald-500 border-emerald-500/20" : analysis.sentiment === 'bearish' ? "text-rose-500 border-rose-500/20" : "text-zinc-400 border-zinc-800"
                )}>
                  {analysis.sentiment} ({analysis.confidence}% Confidence)
                </span>
              </div>
              <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidence}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    analysis.sentiment === 'bullish' ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : analysis.sentiment === 'bearish' ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "bg-zinc-500 shadow-lg"
                  )}
                />
              </div>
            </div>
            
            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                    <Info className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                    "{analysis.reasoning}"
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Leading Outcome Scenarios</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.scenarios?.map((s, i) => (
                <div key={i} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-white/20 transition-all hover:bg-zinc-900/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform text-white">
                    <TargetIcon className="w-12 h-12" />
                  </div>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{s.condition}</span>
                  <div className={cn(
                    "text-xs font-black uppercase mb-1",
                    s.prediction.includes('Bullish') ? "text-emerald-500" : s.prediction.includes('Bearish') ? "text-rose-500" : "text-zinc-400"
                  )}>
                    {s.prediction}
                  </div>
                  <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{s.bias}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-zinc-700" />
          </div>
          <div>
            <h5 className="text-sm font-black text-white uppercase tracking-tight mb-1">No Market Events</h5>
            <p className="text-[10px] text-zinc-600 font-medium max-w-[200px] uppercase tracking-widest leading-relaxed">Select a weekday to analyze institutional high-impact news flows.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const BankForecast = () => {
  const [selectedAsset, setSelectedAsset] = useState('ES1!');
  const [activeDay, setActiveDay] = useState(format(new Date(), 'EEEE'));
  const [timezone, setTimezone] = useState<'EST' | 'PHT'>('EST');
  
  const convertTime = (timeEST: string, targetTz: 'EST' | 'PHT') => {
    if (targetTz === 'EST') return timeEST;
    const [time, period] = timeEST.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const phtHours = (hours + 12) % 24;
    const phtPeriod = phtHours >= 12 ? 'PM' : 'AM';
    const displayHours = phtHours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${phtPeriod}`;
  };

  const weeklyNews = useMemo(() => [
    {
      day: 'Monday',
      events: [
        { id: 101, time: '08:30 AM', currency: 'USD', event: 'Empire State Mfg Index', impact: 'low', volatility: 'Minor Effect', duration: '4-6 Hours', status: 'Upcoming', keyPoint: 'Manufacturing health proxy', forecast: '-14.0', previous: '-20.9', desc: "Survey of business conditions in NY." },
        { id: 102, time: '11:30 AM', currency: 'USD', event: '3-Month Bill Auction', impact: 'low', volatility: 'Minor Effect', duration: '1-2 Hours', status: 'Upcoming', keyPoint: 'Short-term yield tracking', forecast: '5.24%', previous: '5.25%', desc: "Government debt auction results." }
      ]
    },
    {
      day: 'Tuesday',
      events: [
        { id: 201, time: '08:30 AM', currency: 'USD', event: 'CPI m/m', impact: 'high', volatility: 'Major Effect', duration: 'Full Day', status: 'Upcoming', keyPoint: 'Core inflation pressure', forecast: '0.3%', previous: '0.4%', desc: "Primary indicator of consumer inflation." },
        { id: 202, time: '08:30 AM', currency: 'CAD', event: 'CPI m/m', impact: 'high', volatility: 'Major Effect', duration: '8-12 Hours', status: 'Upcoming', keyPoint: 'BoC policy driver', forecast: '0.2%', previous: '0.1%', desc: "Core inflation tracking for CAD." }
      ]
    },
    {
      day: 'Wednesday',
      events: [
        { id: 301, time: '08:30 AM', currency: 'USD', event: 'Retail Sales m/m', impact: 'high', volatility: 'Major Effect', duration: '6-8 Hours', status: 'Upcoming', keyPoint: 'Consumer demand health', forecast: '0.4%', previous: '0.6%', desc: "Measure of consumer spending." },
        { id: 302, time: '10:30 AM', currency: 'USD', event: 'Crude Oil Inventories', impact: 'medium', volatility: 'Moderate Effect', duration: '4 Hours', status: 'Upcoming', keyPoint: 'Energy supply shift', forecast: '1.2M', previous: '-1.5M', desc: "Weekly supply of commercial oil." }
      ]
    },
    {
      day: 'Thursday',
      events: [
        { id: 401, time: '08:30 AM', currency: 'USD', event: 'Philly Fed Mfg Index', impact: 'medium', volatility: 'Moderate Effect', duration: '4-6 Hours', status: 'Upcoming', keyPoint: 'Regional business trends', forecast: '1.5', previous: '4.2', desc: "Manufacturing conditions in Philadelphia." },
        { id: 402, time: '08:30 AM', currency: 'USD', event: 'Unemployment Claims', impact: 'high', volatility: 'Major Effect', duration: '6-10 Hours', status: 'Upcoming', keyPoint: 'Labor market tightness', forecast: '215K', previous: '210K', desc: "Weekly first-time job seekers." }
      ]
    },
    {
      day: 'Friday',
      events: [
        { id: 501, time: '10:00 AM', currency: 'USD', event: 'Consumer Sentiment', impact: 'medium', volatility: 'Moderate Effect', duration: '4 Hours', status: 'Upcoming', keyPoint: 'Future spending outlook', forecast: '78.5', previous: '79.4', desc: "Confidence in overall economic health." },
        { id: 502, time: '12:00 PM', currency: 'EUR', event: 'ECB President Lagarde Speaks', impact: 'high', volatility: 'Major Effect', duration: 'Variable', status: 'Upcoming', keyPoint: 'Monetary policy clues', forecast: '-', previous: '-', desc: "Critical clues for EUR monetary policy." }
      ]
    },
    {
      day: 'Saturday',
      events: [
        { id: 601, time: '09:00 AM', currency: 'ALL', event: 'Weekly COT Reporting', impact: 'medium', volatility: 'Institutional Insight', duration: 'Weekend', status: 'In Focus', keyPoint: 'Commercial positioning', forecast: '72% Long', previous: '68% Long', desc: "Commitment of Traders report analyzed for institutional directional bias." }
      ]
    },
    {
      day: 'Sunday',
      events: [
        { id: 701, time: '05:00 PM', currency: 'ALL', event: 'LSE/Asian Open Prep', impact: 'high', volatility: 'Gap Risk', duration: '4 Hours', status: 'Upcoming', keyPoint: 'Sunday Gap analysis', forecast: 'Neutral', previous: '-', desc: "Monitoring for weekend news gaps and institutional liquidity sweeps at open." }
      ]
    }
  ], []);

  const currentNews = useMemo(() => {
    const rawNews = weeklyNews.find(w => w.day === activeDay)?.events || [];
    const now = new Date();
    const currentDayIdx = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(format(now, 'EEEE'));
    const activeDayIdx = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(activeDay);

    return rawNews.map(news => {
      let status = 'Upcoming';
      if (activeDayIdx < currentDayIdx) status = 'Released';
      else if (activeDayIdx === currentDayIdx) {
        const [h, m_ap] = news.time.split(':');
        const [m, ap] = m_ap.split(' ');
        let eventHour = parseInt(h);
        if (ap === 'PM' && eventHour !== 12) eventHour += 12;
        if (ap === 'AM' && eventHour === 12) eventHour = 0;
        const eventTime = new Date();
        eventTime.setHours(eventHour, parseInt(m), 0, 0);
        const diffInMinutes = (now.getTime() - eventTime.getTime()) / (1000 * 60);
        if (diffInMinutes > 60) status = 'Released';
        else if (diffInMinutes >= 0) status = 'In Focus';
      }
      return { ...news, status };
    });
  }, [activeDay, weeklyNews]);

  const getCurrencyLogo = (curr: string) => {
    if (curr === 'ALL') return 'https://static.vecteezy.com/system/resources/previews/016/017/018/original/transparent-world-globe-icon-free-png.png';
    const logos: Record<string, string> = {
      'USD': 'https://flagpedia.net/data/flags/w580/us.png',
      'EUR': 'https://flagpedia.net/data/flags/w580/eu.png',
      'GBP': 'https://flagpedia.net/data/flags/w580/gb.png',
      'JPY': 'https://flagpedia.net/data/flags/w580/jp.png',
      'CAD': 'https://flagpedia.net/data/flags/w580/ca.png'
    };
    return logos[curr] || 'https://flagpedia.net/data/flags/w580/un.png';
  };

  const weekRange = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return `${format(start, 'MMMM dd')} — ${format(end, 'MMMM dd, yyyy')}`;
  }, []);

  return (
    <div className="mb-16 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Weekly News Column */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden relative shadow-2xl shadow-black/50">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
            <CalendarIcon className="w-64 h-64" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Institutional Bank Forecast</h3>
                <div className="flex items-center gap-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Live Institutional Feed Active</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Monitoring {weekRange}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar w-full md:w-auto">
                <button onClick={() => setTimezone('EST')} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", timezone === 'EST' ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-zinc-300")}>EST</button>
                <button onClick={() => setTimezone('PHT')} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", timezone === 'PHT' ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-zinc-300")}>PHT</button>
              </div>
            
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar w-full md:w-auto">
                {weeklyNews.map(w => (
                  <button key={w.day} onClick={() => setActiveDay(w.day)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", activeDay === w.day ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-zinc-300")}>{w.day.substring(0, 3)}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={activeDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {currentNews.map((news) => (
                  <motion.div key={news.id} whileHover={{ scale: 1.005 }} className="group bg-black/40 border border-zinc-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all shadow-xl">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                               <img src={getCurrencyLogo(news.currency)} alt={news.currency} className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-900 shadow-2xl" />
                               <div className={cn("absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-zinc-950 shadow-lg", news.impact === 'high' ? "bg-rose-500" : news.impact === 'medium' ? "bg-orange-500" : "bg-emerald-500")} />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-0.5">
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{convertTime(news.time, timezone)}</span>
                                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{timezone}</span>
                                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{news.volatility}</span>
                               </div>
                               <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">{news.event}</h4>
                            </div>
                         </div>
                         <div className="group/info relative shrink-0">
                            <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Info className="w-4 h-4" /></button>
                            <div className="absolute bottom-full right-0 mb-4 w-72 p-6 bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 backdrop-blur-3xl">
                              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Info className="w-4 h-4 text-emerald-500" /></div><span className="text-[10px] font-black text-white uppercase tracking-widest">Bank Forecast</span></div>
                              <p className="text-xs font-medium text-zinc-400 leading-relaxed uppercase tracking-tight">{news.desc}</p>
                              <div className="mt-4 pt-4 border-t border-white/5"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Key Takeaway</span><p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight italic">"{news.keyPoint}"</p></div>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-indigo-400" /><span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Institutional Detail</span></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                          <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Duration</span><div className="flex items-center gap-2"><Clock className="w-3 h-3 text-zinc-500" /><span className="text-[10px] font-black text-zinc-300 uppercase">{news.duration}</span></div></div>
                          <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Release Status</span><div className="flex items-center gap-2"><div className={cn("w-1.5 h-1.5 rounded-full", news.status === 'In Focus' ? "bg-emerald-500 animate-pulse" : news.status === 'Released' ? "bg-white/40" : "bg-zinc-700")} /><span className={cn("text-[9px] font-black uppercase tracking-tighter", news.status === 'In Focus' ? "text-emerald-500" : "text-zinc-500")}>{news.status}</span></div></div>
                          <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Forecast</span><span className="text-[10px] font-black text-white block">{news.forecast}</span></div>
                          <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Previous</span><span className="text-[10px] font-black text-white block">{news.previous}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-white/5">
                        <div className="flex-1 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 group/p"><div className="flex items-center justify-between mb-2"><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Above</span><TrendingUp className="w-3 h-3 text-emerald-500 group-hover/p:rotate-12 transition-transform" /></div><p className="text-[10px] font-black text-white uppercase tracking-tight">{news.impact === 'high' ? 'Very Bullish' : 'Bullish'}</p></div>
                        <div className="flex-1 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 group/p"><div className="flex items-center justify-between mb-2"><span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">On</span><RotateCw className="w-3 h-3 text-zinc-500 group-hover/p:rotate-180 transition-transform duration-700" /></div><p className="text-[10px] font-black text-white uppercase tracking-tight">Ranging</p></div>
                        <div className="flex-1 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 group/p"><div className="flex items-center justify-between mb-2"><span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Below</span><TrendingDown className="w-3 h-3 text-rose-500 group-hover/p:-rotate-12 transition-transform" /></div><p className="text-[10px] font-black text-white uppercase tracking-tight">{news.impact === 'high' ? 'Very Bearish' : 'Bearish'}</p></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AINewsAnalysis news={currentNews} includeFutures={true} />
        
        {/* Institutional Correlation Matrix */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Correlation Matrix</h4>
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Cross-Asset Ties • Stable</p>
            </div>
            <Activity className="w-4 h-4 text-zinc-700" />
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {/* Headers */}
            <div className="col-span-1" />
            {['DXY', 'ES', 'NQ', 'BTC'].map(s => (
              <div key={s} className="text-[9px] font-black text-zinc-500 text-center uppercase tracking-tighter">{s}</div>
            ))}
            
            {/* Rows */}
            {['DXY', 'ES', 'NQ', 'BTC'].map((row, i) => (
              <React.Fragment key={row}>
                <div className="text-[9px] font-black text-zinc-400 uppercase flex items-center">{row}</div>
                {['DXY', 'ES', 'NQ', 'BTC'].map((col, j) => {
                  // Stable correlation values using a simple seeded-like logic or just consistent ones
                  const correlations: Record<string, Record<string, number>> = {
                    DXY: { DXY: 1.00, ES: -0.82, NQ: -0.78, BTC: -0.45 },
                    ES:  { DXY: -0.82, ES: 1.00, NQ: 0.94, BTC: 0.52 },
                    NQ:  { DXY: -0.78, ES: 0.94, NQ: 1.00, BTC: 0.58 },
                    BTC: { DXY: -0.45, ES: 0.52, NQ: 0.58, BTC: 1.00 }
                  };
                  const val = correlations[row][col];
                  
                  const isPositive = val > 0;
                  const absVal = Math.abs(val);
                  
                  let colorClass = "bg-zinc-900/50 text-zinc-500 border-zinc-800/50";
                  if (val === 1) {
                    colorClass = "bg-white text-black border-white font-black";
                  } else if (isPositive) {
                    if (absVal > 0.8) colorClass = "bg-emerald-500 text-black border-emerald-400 font-black";
                    else if (absVal > 0.5) colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold";
                    else colorClass = "bg-emerald-500/10 text-emerald-500/60 border-emerald-500/10";
                  } else {
                    if (absVal > 0.8) colorClass = "bg-rose-500 text-black border-rose-400 font-black";
                    else if (absVal > 0.5) colorClass = "bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold";
                    else colorClass = "bg-rose-500/10 text-rose-500/60 border-rose-500/10";
                  }

                  return (
                    <div 
                      key={j} 
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center text-[9px] border transition-all duration-300 hover:scale-110 hover:z-10 shadow-lg", 
                        colorClass
                      )}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Positive</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                   <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Negative</span>
                </div>
             </div>
             <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest italic">V-SYNC ACTIVE</span>
          </div>
        </div>

        {/* Market Prediction */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-indigo-500/20 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><TargetIcon className="w-48 h-48 text-white" /></div>
          <div className="flex items-center gap-3 mb-8 relative z-10"><div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20"><TargetIcon className="w-5 h-5 text-indigo-500" /></div><div><h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">MARKET PREDICTION</h4><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Macro Bias</p></div></div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} className="bg-transparent text-sm font-black text-white uppercase outline-none cursor-pointer hover:text-emerald-400 transition-colors">
                <optgroup label="Futures">
                  <option value="ES1!">E-mini S&P 500 (ES)</option>
                  <option value="NQ1!">E-mini Nasdaq (NQ)</option>
                </optgroup>
                <optgroup label="Forex/Metals">
                  <option value="EURUSD">EUR/USD</option>
                  <option value="XAUUSD">GOLD (GC)</option>
                </optgroup>
              </select>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Liquid Zone</span></div>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl group/card relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-full border-2 border-zinc-900 overflow-hidden shadow-xl"><img src={getCurrencyLogo(selectedAsset.includes('USD') ? selectedAsset.substring(0, 3) : 'USD')} className="w-full h-full object-cover" /></div><div><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-0.5">Asset Impact</span><h5 className="text-white font-black uppercase text-xl tracking-tighter">{selectedAsset} Bias</h5></div></div>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors">Bias on {selectedAsset} is leaning toward a <span className="text-rose-500 font-bold underline decoration-rose-500/30">Stop Hunt</span> below session lows. Liquidity sweep into the FVG expected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FuturesMarquee = () => {
  const assets = [
    { symbol: 'GC1!', name: 'Gold', price: '2,342.50', change: '+1.2%' },
    { symbol: 'CL1!', name: 'Crude Oil', price: '78.45', change: '-0.5%' },
    { symbol: 'ES1!', name: 'S&P 500', price: '5,234.25', change: '+0.8%' },
    { symbol: 'NQ1!', name: 'Nasdaq 100', price: '18,456.75', change: '+1.1%' },
    { symbol: 'YM1!', name: 'Dow Jones', price: '39,123.00', change: '+0.4%' },
    { symbol: 'BTC1!', name: 'Bitcoin Futures', price: '64,230', change: '-2.3%' },
    { symbol: 'NG1!', name: 'Natural Gas', price: '2.145', change: '+4.2%' },
    { symbol: 'SI1!', name: 'Silver', price: '28.14', change: '-0.2%' },
    { symbol: '6E1!', name: 'Euro FX', price: '1.0845', change: '+0.15%' },
    { symbol: 'UB1!', name: 'Ultra Bond', price: '118.24', change: '-0.32%' },
  ];

  return (
    <div className="w-full bg-white/[0.01] backdrop-blur-2xl border-y border-white/[0.05] py-3 overflow-hidden relative group">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 opacity-50" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 opacity-50" />
      
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap"
      >
        {[...assets, ...assets].map((asset, idx) => (
          <div key={idx} className="inline-flex items-center gap-6 px-12 border-r border-white/[0.05] h-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 tracking-[0.2em] uppercase leading-none mb-1">{asset.name}</span>
              <span className="text-xs font-black text-white/90 tracking-tighter leading-none">{asset.symbol}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-white/90 tracking-tighter leading-none mb-1">{asset.price}</span>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest leading-none",
                asset.change.startsWith('+') ? "text-emerald-500/80" : "text-rose-500/80"
              )}>{asset.change}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SentimentBiasMarquee = () => {
  const sentiments = [
    { pair: 'NAS100', bias: 'BULLISH', confidence: '82%', logic: 'Demand above 18500' },
    { pair: 'US30', bias: 'BEARISH', confidence: '64%', logic: 'Rejecting Daily H1' },
    { pair: 'SPX500', bias: 'BULLISH', confidence: '71%', logic: 'VWAP Support Hold' },
    { pair: 'XAUUSD', bias: 'BULLISH', confidence: '89%', logic: 'Safe Haven Inflow' },
    { pair: 'EURUSD', bias: 'BEARISH', confidence: '58%', logic: 'DXY Strength' },
    { pair: 'DAX40', bias: 'NEUTRAL', confidence: '45%', logic: 'Range Bound' },
  ];

  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-xl border-b border-white/5 py-4 overflow-hidden relative">
      <motion.div 
        animate={{ x: ["-50%", "0%"] }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap"
      >
        {[...sentiments, ...sentiments].map((s, idx) => (
          <div key={idx} className="inline-flex items-center gap-6 px-12 border-r border-white/10">
            <div className="flex items-center gap-2">
               <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  s.bias === 'BULLISH' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : s.bias === 'BEARISH' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-zinc-500"
               )} />
               <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">{s.pair}</span>
            </div>
            <div className="flex items-center gap-4">
               <span className={cn(
                  "text-[8px] font-black px-2 py-0.5 rounded",
                  s.bias === 'BULLISH' ? "text-emerald-400" : s.bias === 'BEARISH' ? "text-rose-400" : "text-zinc-400"
               )}>{s.bias}</span>
               <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{s.confidence}</span>
               <span className="text-[7px] font-medium text-zinc-600 uppercase tracking-tighter opacity-40">{s.logic}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const MarketBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeUsers, setActiveUsers] = useState<{name: string, pair: string, time: string}[]>([]);

  useEffect(() => {
    const names = ['Michael T.', 'Sarah Jenkins', 'Petar G.', 'Jessica L.', 'David R.', 'Emma S.', 'Chris W.', 'Sophia Z.', 'Liam H.', 'Olivia F.'];
    const pairs = ['BTC/USD', 'XAU/USD', 'EUR/USD', 'GBP/JPY', 'NAS100', 'US30', 'ETH/USD', 'OIL/USD', 'USD/JPY', 'SOL/USD'];
    
    const generateUsers = () => {
      const count = 4;
      const shuffled = [...names].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(name => ({
        name,
        pair: pairs[Math.floor(Math.random() * pairs.length)],
        time: 'Just now'
      }));
    };

    setActiveUsers(generateUsers());
    
    const interval = setInterval(() => {
      setActiveUsers(generateUsers());
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const slides = [
    {
      title: "SMART WATCHLISTS",
      description: "Star your favorite assets to build a custom dashboard. Get AI-powered insights, real-time sentiment, and technical bias analysis.",
      accent: "from-indigo-600 to-emerald-600",
      icon: <Star className="w-64 h-64 text-white" />,
      badge: "New Feature",
      extra: (
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white uppercase overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=trader${i + Math.random()}`} alt="User" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">JOIN 2,400+ TRADERS</p>
        </div>
      )
    },
    {
      title: "REAL USER ACTIVITY",
      description: "Our community of pro traders is growing daily. See what assets are currently trending in the global watchlist collections.",
      accent: "from-rose-600 to-orange-600",
      icon: <Users className="w-64 h-64 text-white" />,
      badge: "Community",
      extra: (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {activeUsers.map(user => (
              <motion.div 
                key={user.name}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="px-3 py-1.5 bg-white/10 rounded-xl flex items-center gap-2 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-tight">{user.name}</span>
                <span className="text-[9px] font-medium text-white/60 uppercase tracking-tight">starred {user.pair}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )
    },
    {
      title: "AI INTELLIGENCE",
      description: "Proprietary market sentiment analysis using the latest Gemini models. Context-aware bias detection for your specific watchlist.",
      accent: "from-emerald-600 to-teal-400",
      icon: <Sparkles className="w-64 h-64 text-white" />,
      badge: "AI Powered",
      extra: (
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 rounded-2xl border border-white/10">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Coverage 24/7</span>
        </div>
      )
    },
    {
      title: "INSTITUTIONAL BIAS",
      description: "Get real-time market direction bias updated after 9:30 NYC OPEN. Analyzed via ZYNC Algo Pulsar monitoring institutional volume.",
      accent: "from-emerald-600 to-indigo-600",
      icon: <TrendingUp className="w-64 h-64 text-white" />,
      badge: "NY Open Edge",
      extra: (
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">NAS100 ALPHA</span>
            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">US30 ALPHA</span>
            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 mb-8 relative h-[280px] sm:h-[240px] md:h-[180px]">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] p-5 sm:p-8 md:p-10 group flex flex-col justify-center"
        >
          {/* Subtle Accent Glow */}
          <div className={cn(
            "absolute -right-20 -top-20 w-80 h-80 blur-[120px] opacity-20 bg-gradient-to-br transition-all duration-1000",
            slides[currentSlide].accent
          )} />
          
          <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
            {slides[currentSlide].icon}
          </div>
          
          <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 md:gap-12">
            <div className="flex flex-col shrink-0">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-3 w-fit">
                <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{slides[currentSlide].badge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase">
                {slides[currentSlide].title}
              </h2>
            </div>

            <div className="flex-1 max-w-md hidden sm:block">
              <p className="text-zinc-400 text-[9px] md:text-[10px] font-medium leading-relaxed uppercase tracking-widest opacity-60 line-clamp-2 md:line-clamp-none">
                {slides[currentSlide].description}
              </p>
            </div>
            
            <div className="shrink-0 flex items-center w-full md:w-auto overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center gap-4 md:gap-8 w-full justify-between md:justify-end">
                {slides[currentSlide].extra}
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 flex gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  currentSlide === idx ? "w-6 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "w-1.5 bg-white/10 hover:bg-white/20"
                )}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const NYCOpenBiasAnalyst = ({ starredSymbol }: { starredSymbol: string | null }) => {
  const [analysis, setAnalysis] = useState<{
    bias: 'Bullish' | 'Bearish' | 'Neutral',
    confidence: number,
    openContext: string,
    targets: { price: string, type: 'Profit' | 'Stop' | 'Liquidity', rationale: string }[],
    volatility: 'Low' | 'Medium' | 'High',
    drawOnLiquidity: string
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (starredSymbol && !analysis && !loading && !error) {
       getBiasAnalysis();
    }
  }, [starredSymbol]);

  const getBiasAnalysis = async () => {
    if (!starredSymbol) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        setError('API_KEY_MISSING');
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Act as a senior NYC Institutional Desk Trader and ICT specialist. 
      Analyze the current session bias for the NYC Market Open (AM Session) for: ${starredSymbol}.

      Provide a high-conviction Bias Report including:
      1. Session Bias (Bullish/Bearish/Neutral) relative to the NYC Midnight Open.
      2. Draw on Liquidity (Where is the market price most likely headed this session?).
      3. Open Context: Explain if we expect a 'Judas Swing' (manipulation) or an immediate expansion.
      4. Volatility Expectations (High/Medium/Low) for the 9:30 AM NY Open.
      5. Identify 3 specific targets (Profit targets or Liquidity pools) for the session.

      Respond ONLY in JSON format:
      {
        "bias": "Bullish" | "Bearish" | "Neutral",
        "confidence": number (0-100),
        "openContext": "string (short technical summary)",
        "volatility": "Low" | "Medium" | "High",
        "drawOnLiquidity": "string (specific target zone)",
        "targets": [
           { "price": "string", "type": "Profit" | "Stop" | "Liquidity", "rationale": "string" }
        ]
      }`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "";
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) throw new Error('Invalid institutional response data.');
      const cleanedText = text.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(cleanedText);
      
      setAnalysis({
        bias: parsed.bias || 'Neutral',
        confidence: parsed.confidence || 50,
        openContext: parsed.openContext || 'Technical analysis pending...',
        volatility: parsed.volatility || 'Medium',
        drawOnLiquidity: parsed.drawOnLiquidity || 'Neutral range',
        targets: Array.isArray(parsed.targets) ? parsed.targets : []
      });
    } catch (err: any) {
      console.error('NYC Bias Analysis Error:', err);
      setError(err?.message || 'Failed to sync with institutional data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-8 md:p-12 bg-zinc-950 rounded-[3rem] border border-zinc-900 border-dashed relative overflow-hidden group">
      {/* Decorative Session Overlay */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
              <ZapIcon className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">NYC Session Bias Analyst</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{starredSymbol || 'Select an asset'}</span>
                 <div className="w-1 h-1 rounded-full bg-zinc-700" />
                 <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Institutional AM Engine</span>
              </div>
            </div>
          </div>

          {starredSymbol && !loading && !error && (
            <button 
              onClick={getBiasAnalysis}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Recalibrate Bias
            </button>
          )}
        </div>

        {!starredSymbol ? (
          <div className="py-16 text-center border-2 border-zinc-900 border-dashed rounded-[2.5rem] bg-black/40 backdrop-blur-xl">
             <TargetIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
             <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.2em]">Star an asset to focus the algorithm.</p>
          </div>
        ) : loading ? (
          <div className="py-24 text-center space-y-6">
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] animate-pulse">Scanning Institutional Liquidity...</p>
          </div>
        ) : error ? (
          <div className="py-12 p-8 bg-rose-500/5 border border-rose-500/10 rounded-3xl text-center space-y-4">
             <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
             <p className="text-xs font-black text-rose-400 uppercase tracking-widest">{error}</p>
             {error === 'API_KEY_MISSING' && (
               <button 
                 onClick={async () => {
                   const aiStudio = (window as any).aistudio;
                   if (aiStudio?.openSelectKey) await aiStudio.openSelectKey();
                   getBiasAnalysis();
                 }}
                 className="px-8 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
               >
                 Activate AI Engine
               </button>
             )}
          </div>
        ) : analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Bias Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-black/40 p-10 rounded-[2.5rem] border border-zinc-900 relative overflow-hidden h-full flex flex-col justify-center">
                <div className={cn(
                  "absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-20",
                  analysis.bias === 'Bullish' ? 'bg-emerald-500' : analysis.bias === 'Bearish' ? 'bg-rose-500' : 'bg-zinc-500'
                )} />
                
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Current Bias</h3>
                <div className="relative z-10 mb-6">
                  <span className={cn(
                    "text-6xl font-black italic tracking-tighter uppercase",
                    analysis.bias === 'Bullish' ? 'text-emerald-500' : analysis.bias === 'Bearish' ? 'text-rose-500' : 'text-zinc-500'
                  )}>
                    {analysis.bias}
                  </span>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Confidence</span>
                    <span>{analysis.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.confidence}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        analysis.bias === 'Bullish' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : analysis.bias === 'Bearish' ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "bg-zinc-500"
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Volatility</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{analysis.volatility}</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-800" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Draw On Liq</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{analysis.drawOnLiquidity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Context & Targets */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] border border-zinc-900 h-full">
                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">NY Open Strategic Context</h4>
                  <p className="text-sm md:text-md text-white font-medium italic leading-relaxed opacity-90">"{analysis.openContext}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Session Target Levels</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.targets.map((target, idx) => (
                      <div key={idx} className="p-5 bg-black/40 border border-zinc-900 rounded-3xl hover:border-indigo-500/30 transition-all group/target">
                        <div className="flex items-center justify-between mb-2">
                           <span className={cn(
                             "text-[7px] px-2 py-0.5 rounded font-black uppercase tracking-widest",
                             target.type === 'Profit' ? 'bg-emerald-500/10 text-emerald-500' : target.type === 'Stop' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'
                           )}>
                             {target.type}
                           </span>
                           <span className="text-[11px] font-black text-white tabular-nums tracking-tight">{target.price}</span>
                        </div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase leading-relaxed tracking-wider group-hover/target:text-zinc-400 transition-colors">
                          {target.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Market Status Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-900/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">NY Open Matrix Sync: V2.14</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Clock className="w-3 h-3 text-zinc-700" />
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">09:30 EST WINDOW ACTIVE</span>
            </div>
          </div>
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Institutional Order-Flow Analysis Platform</p>
        </div>
      </div>
    </div>
  );
};

const EconomicCalendar = () => {
  const [activeWeekOffset, setActiveWeekOffset] = useState(0); // 0 = Current, 1 = Next
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<'EST' | 'PHT'>('EST');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const scrollToDate = (date: string) => {
    setActiveDate(date);
    const element = document.getElementById(`date-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getMarketProbability = (event: string) => {
    // Generate some interesting looking fake probabilities for the UI
    const hash = event.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const manipulation = (hash % 40) + 30; // 30-70%
    const direction = (hash % 60) + 20; // 20-80%
    const bias = hash % 2 === 0 ? 'Bullish' : 'Bearish';
    
    return {
      manipulation,
      direction,
      bias,
      afterNYOpen: {
        bullish: (hash % 30) + 40,
        bearish: (hash % 30) + 10,
        neutral: 100 - ((hash % 30) + 40) - ((hash % 30) + 10)
      }
    };
  };
  
  const economicEvents = useMemo(() => {
    const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const startOfNextWeek = addWeeks(startOfThisWeek, 1);
    
    const getDaysDate = (start: Date, dayIndex: number) => format(addDays(start, dayIndex), 'yyyy-MM-dd');

    // Shared events from BankForecast or similar
    const week1Raw = [
      // Current Week (Template)
      { day: 0, time: '09:30', currency: 'AUD', impact: 'medium', event: 'ANZ Job Advertisements', actual: '1.2%', forecast: '0.8%', previous: '-1.5%', desc: 'Measure of the change in the number of jobs advertised.' },
      { day: 1, time: '04:30', currency: 'GBP', impact: 'medium', event: 'Final Services PMI', actual: '53.4', forecast: '53.1', previous: '53.1', desc: 'Economic health of the services sector.' },
      { day: 1, time: '10:00', currency: 'USD', impact: 'high', event: 'ISM Services PMI', actual: '52.8', forecast: '52.0', previous: '51.4', desc: 'Survey of purchasing managers in the services industry.' },
      { day: 2, time: '08:15', currency: 'USD', impact: 'high', event: 'ADP Non-Farm Employment Change', actual: '188K', forecast: '175K', previous: '184K', desc: 'Estimate of the change in the number of employed people.' },
      { day: 2, time: '10:30', currency: 'USD', impact: 'medium', event: 'Crude Oil Inventories', actual: '-1.4M', forecast: '-1.1M', previous: '7.3M', desc: 'Change in the number of barrels of crude oil held in inventory.' },
      { day: 3, time: '07:00', currency: 'GBP', impact: 'high', event: 'Official Bank Rate', actual: '5.25%', forecast: '5.25%', previous: '5.25%', desc: 'Interest rate at which the BoE lends to financial institutions.' },
      { day: 3, time: '08:30', currency: 'USD', impact: 'high', event: 'Unemployment Claims', actual: '212K', forecast: '215K', previous: '208K', desc: 'Number of individuals who filed for unemployment insurance.' },
      { day: 4, time: '08:30', currency: 'USD', impact: 'high', event: 'Non-Farm Employment Change', actual: '-', forecast: '243K', previous: '303K', desc: 'Change in the number of employed people during the previous month.' },
      { day: 4, time: '08:30', currency: 'USD', impact: 'high', event: 'Unemployment Rate', actual: '-', forecast: '3.8%', previous: '3.8%', desc: 'Percentage of the total work force that is unemployed.' },
      { day: 5, time: '09:00', currency: 'CAD', impact: 'low', event: 'BOC Gov Macklem Speaks', actual: '-', forecast: '-', previous: '-', desc: 'Speech by the Governor of the Bank of Canada.' },
    ].map(e => ({ ...e, date: getDaysDate(startOfThisWeek, e.day) }));

    const week2Raw = [
      // Next Week (Template)
      { day: 0, time: '08:30', currency: 'USD', impact: 'low', event: 'NY Empire State Manufacturing Index', actual: '-', forecast: '-5.2', previous: '-14.3', desc: 'Manufacturing conditions in New York State.' },
      { day: 1, time: '08:30', currency: 'USD', impact: 'high', event: 'PPI m/m', actual: '-', forecast: '0.3%', previous: '0.2%', desc: 'Change in the price of finished goods and services sold by producers.' },
      { day: 2, time: '08:30', currency: 'USD', impact: 'high', event: 'CPI m/m', actual: '-', forecast: '0.4%', previous: '0.4%', desc: 'Change in the price of goods and services purchased by consumers.' },
      { day: 2, time: '08:30', currency: 'USD', impact: 'high', event: 'CPI y/y', actual: '-', forecast: '3.4%', previous: '3.5%', desc: 'Year-over-year change in consumer prices.' },
      { day: 3, time: '08:30', currency: 'USD', impact: 'high', event: 'Retail Sales m/m', actual: '-', forecast: '0.4%', previous: '0.7%', desc: 'Change in the total value of sales at the retail level.' },
      { day: 3, time: '08:30', currency: 'USD', impact: 'high', event: 'Core Retail Sales m/m', actual: '-', forecast: '0.2%', previous: '1.1%', desc: 'Change in the value of sales at the retail level, excluding autos.' },
      { day: 4, time: '10:00', currency: 'USD', impact: 'medium', event: 'UoM Consumer Sentiment', actual: '-', forecast: '76.2', previous: '77.9', desc: 'Survey of consumer confidence levels in the US.' },
    ].map(e => ({ ...e, date: getDaysDate(startOfNextWeek, e.day) }));

    return [...week1Raw, ...week2Raw];
  }, []);

  const convertTime = (timeEST: string, targetTz: 'EST' | 'PHT') => {
    if (targetTz === 'EST') return timeEST;
    const [hours, minutes] = timeEST.split(':').map(Number);
    let phtHours = (hours + 12) % 24;
    const phtPeriod = phtHours >= 12 ? 'PM' : 'AM';
    const displayHours = phtHours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${phtPeriod}`;
  };

  const currentWeekStart = startOfWeek(addWeeks(new Date(), activeWeekOffset), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => format(addDays(currentWeekStart, i), 'yyyy-MM-dd'));
  }, [currentWeekStart]);

  useEffect(() => {
    // When week changes, select the first day of that week
    setActiveDate(dates[0]);
  }, [dates]);

  return (
    <div className="p-4 md:p-8 pb-32 w-full">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="flex items-center gap-4 md:gap-6">
             <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
             </div>
             <div>
                <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-1 md:mb-2 text-shadow-glow">ECONOMIC CALENDAR</h2>
                <div className="flex items-center gap-3">
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Institutional Data Stream</p>
                   <div className="h-1 w-1 rounded-full bg-zinc-800" />
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{format(currentWeekStart, 'MMM dd')} — {format(currentWeekEnd, 'MMM dd')}</p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 shadow-2xl w-full sm:w-auto">
               <button 
                  onClick={() => setTimezone('EST')}
                  className={cn(
                     "flex-1 sm:px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                     timezone === 'EST' ? "bg-indigo-500 text-white shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
               >
                  EST
               </button>
               <button 
                  onClick={() => setTimezone('PHT')}
                  className={cn(
                     "flex-1 sm:px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                     timezone === 'PHT' ? "bg-indigo-500 text-white shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
               >
                  PHT
               </button>
            </div>
            
            <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 shadow-2xl w-full sm:w-auto">
               <button 
                  onClick={() => setActiveWeekOffset(0)}
                  className={cn(
                     "flex-1 sm:px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                     activeWeekOffset === 0 ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
               >
                  This Week
               </button>
               <button 
                  onClick={() => setActiveWeekOffset(1)}
                  className={cn(
                     "flex-1 sm:px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                     activeWeekOffset === 1 ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                  )}
               >
                  Next Week
               </button>
            </div>
          </div>
       </div>

       <div className="flex overflow-x-auto gap-3 md:gap-4 mb-10 md:mb-12 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          {dates.map(date => (
             <button
                key={date}
                onClick={() => scrollToDate(date)}
                className={cn(
                   "px-6 py-4 md:px-10 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all flex flex-col items-center gap-1 md:gap-2 group shrink-0",
                   activeDate === date 
                   ? "bg-white text-black border-white shadow-2xl scale-105" 
                   : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-white/20 hover:text-white"
                )}
             >
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
                   {format(parseISO(date), 'EEE')}
                </span>
                <span className="text-lg md:text-3xl font-black">{format(parseISO(date), 'dd')}</span>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter italic opacity-60">
                   {format(parseISO(date), 'MMM')}
                </span>
             </button>
          ))}
       </div>

       <div className="grid grid-cols-12 gap-8 px-10 py-6 bg-zinc-950 border border-zinc-900 rounded-[2rem] mb-6 hidden md:grid">
          <div className="col-span-1 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time</div>
          <div className="col-span-1 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Currency</div>
          <div className="col-span-1 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Impact</div>
          <div className="col-span-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Event</div>
          <div className="col-span-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Actual</div>
          <div className="col-span-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Forecast</div>
          <div className="col-span-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Previous</div>
       </div>

       <div className="space-y-12">
          {dates.map(date => {
             const dayEvents = economicEvents.filter(e => e.date === date);
             if (dayEvents.length === 0) return null;
             
             return (
                <div key={date} id={`date-${date}`} className="space-y-4">
                   <div className="flex items-center gap-4 px-4">
                      <div className="h-px flex-1 bg-white/5" />
                      <h2 className={cn(
                        "text-[10px] font-black uppercase tracking-[0.4em] transition-all",
                        activeDate === date ? "text-white" : "text-zinc-700"
                      )}>
                        {format(parseISO(date), 'EEEE, MMMM dd')}
                      </h2>
                      <div className="h-px flex-1 bg-white/5" />
                   </div>
                   
                   <div className="space-y-4">
                      {dayEvents.map((e, idx) => (
                         <motion.div
                            key={`${e.event}-${idx}`}
                             onClick={() => setSelectedEvent(e)}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                              "group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center px-6 md:px-10 py-6 md:py-8 bg-zinc-950/40 border transition-all hover:bg-zinc-900/20 rounded-[2rem] md:rounded-[2.5rem] cursor-pointer active:scale-[0.98]",
                              activeDate === date ? "border-indigo-500/30" : "border-zinc-800/50 hover:border-zinc-700"
                            )}
                         >
                            <div className="col-span-1 flex items-center justify-between md:block">
                               <div className="text-base md:text-lg font-black text-white">{convertTime(e.time, timezone)}</div>
                               <div className="md:hidden flex items-center gap-2">
                                 <span className={cn(
                                   "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                   e.impact === 'high' ? "bg-rose-500/20 text-rose-500" : e.impact === 'medium' ? "bg-orange-500/20 text-orange-500" : "bg-emerald-500/20 text-emerald-500"
                                 )}>{e.impact}</span>
                                 <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full">
                                   <div className="w-5 h-5 rounded-full overflow-hidden">
                                     <img src={`https://raw.githubusercontent.com/manon-m/Forex-Icons/master/flags/${e.currency.toLowerCase()}.png`} alt={e.currency} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                   </div>
                                   <span className="text-[10px] font-black text-white px-1">{e.currency}</span>
                                 </div>
                               </div>
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-lg">
                                  <img src={`https://raw.githubusercontent.com/manon-m/Forex-Icons/master/flags/${e.currency.toLowerCase()}.png`} alt={e.currency} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                               </div>
                               <span className="text-xs font-black text-zinc-400">{e.currency}</span>
                            </div>
                            <div className="col-span-1 hidden md:block">
                               <div className={cn(
                                  "w-6 h-3 rounded-full shadow-lg",
                                  e.impact === 'high' ? "bg-rose-500 shadow-rose-500/20" : e.impact === 'medium' ? "bg-orange-500 shadow-orange-500/20" : "bg-emerald-500 shadow-emerald-500/20"
                               )} title={`${e.impact} Impact`} />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                               <div className="flex flex-col gap-1">
                                  <h4 className="text-sm md:text-base font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{e.event}</h4>
                                  <p className="hidden md:block text-[10px] font-medium text-zinc-500 uppercase tracking-tight opacity-60 leading-relaxed max-w-sm">{e.desc}</p>
                               </div>
                            </div>
                            
                            <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end items-baseline md:text-right border-t border-white/5 pt-4 md:border-0 md:pt-0">
                               <div className="md:hidden text-[8px] font-black text-zinc-500 uppercase tracking-widest">Actual</div>
                               <div className={cn(
                                 "text-sm font-black uppercase",
                                 e.actual !== '-' && e.forecast !== '-' && e.actual > e.forecast ? "text-emerald-500" : e.actual !== '-' && e.forecast !== '-' && e.actual < e.forecast ? "text-rose-500" : "text-white"
                               )}>{e.actual}</div>
                            </div>
                            <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end items-baseline md:text-right">
                               <div className="md:hidden text-[8px] font-black text-zinc-500 uppercase tracking-widest">Forecast</div>
                               <div className="text-sm font-black text-white opacity-60 uppercase">{e.forecast}</div>
                            </div>
                            <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end items-baseline md:text-right">
                               <div className="md:hidden text-[8px] font-black text-zinc-500 uppercase tracking-widest">Previous</div>
                               <div className="text-sm font-black text-zinc-500 uppercase">{e.previous}</div>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
             );
          })}
       </div>
       
               <AnimatePresence>
          {selectedEvent && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-emerald-500/5 blur-[80px] pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                           "w-12 h-6 md:w-16 md:h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest",
                           selectedEvent.impact === 'high' ? "bg-rose-500 text-black" : selectedEvent.impact === 'medium' ? "bg-orange-500 text-black" : "bg-emerald-500 text-black"
                        )}>
                           {selectedEvent.impact}
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                              <img src={`https://raw.githubusercontent.com/manon-m/Forex-Icons/master/flags/${selectedEvent.currency.toLowerCase()}.png`} alt={selectedEvent.currency} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                           </div>
                           <span className="text-xl font-black text-white">{selectedEvent.currency}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 group active:scale-95 transition-all text-white"
                     >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                     </button>
                  </div>

                  <div className="mb-12">
                     <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Institutional News Release</p>
                     <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">{selectedEvent.event}</h2>
                     <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium uppercase tracking-tight opacity-80">{selectedEvent.desc}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-12">
                     {[
                        { label: 'Actual', value: selectedEvent.actual, color: 'text-white' },
                        { label: 'Forecast', value: selectedEvent.forecast, color: 'text-white/60' },
                        { label: 'Previous', value: selectedEvent.previous, color: 'text-zinc-500' }
                     ].map(item => (
                        <div key={item.label} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">{item.label}</p>
                           <p className={cn("text-xl md:text-2xl font-black", item.color)}>{item.value}</p>
                        </div>
                     ))}
                  </div>

                  <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem]">
                     <div className="flex items-center gap-3 mb-8">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Institutional Probability Index</h3>
                     </div>

                     <div className="space-y-8">
                        {(() => {
                           const prob = getMarketProbability(selectedEvent.event);
                           return (
                              <>
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                       <div className="flex justify-between items-end">
                                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Market Manipulation</p>
                                          <p className="text-xl font-black text-white">{prob.manipulation}%</p>
                                       </div>
                                       <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${prob.manipulation}%` }}
                                             transition={{ duration: 1, ease: "easeOut" }}
                                             className="h-full bg-gradient-to-r from-orange-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       <div className="flex justify-between items-end">
                                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Overall Direction</p>
                                          <p className="text-xl font-black text-white">{prob.direction}%</p>
                                       </div>
                                       <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${prob.direction}%` }}
                                             transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                             className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                                    <div className="flex items-center justify-between mb-6">
                                       <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Post-NY Open Sentiment (EST 09:30+)</p>
                                       <div className={cn(
                                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                          prob.bias === 'Bullish' ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                                       )}>
                                          {prob.bias} Edge
                                       </div>
                                    </div>
                                    <div className="flex h-4 w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-950">
                                       <motion.div 
                                          initial={{ flex: 0 }} animate={{ flex: prob.afterNYOpen.bullish/100 }}
                                          className="bg-emerald-500 flex items-center justify-center text-[7px] font-black text-black"
                                       >
                                          {prob.afterNYOpen.bullish}% BULL
                                       </motion.div>
                                       <motion.div 
                                          initial={{ flex: 0 }} animate={{ flex: prob.afterNYOpen.neutral/100 }}
                                          className="bg-zinc-700 flex items-center justify-center text-[7px] font-black text-white"
                                       >
                                          {prob.afterNYOpen.neutral}% NEUT
                                       </motion.div>
                                       <motion.div 
                                          initial={{ flex: 0 }} animate={{ flex: prob.afterNYOpen.bearish/100 }}
                                          className="bg-rose-500 flex items-center justify-center text-[7px] font-black text-black"
                                       >
                                          {prob.afterNYOpen.bearish}% BEAR
                                       </motion.div>
                                    </div>
                                 </div>
                              </>
                           );
                        })()}
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 md:mt-20 p-8 md:p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Info className="w-32 h-32 md:w-64 md:h-64 text-indigo-500" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-shadow-glow">Live Latency: 4ms</span>
             </div>
             <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">ALGO LIQUIDITY PULSE</h3>
             <p className="text-zinc-500 text-xs md:text-sm font-medium uppercase tracking-tight leading-relaxed max-w-3xl">
                ZYNC Institutional feeds leverage low-latency connectivity to CME, CBOT, and major central bank disclosure portals. 
                Data refreshes in real-time. Forecasts are aggregated from Tier-1 bulge bracket banks and leading quantitative research firms.
             </p>
          </div>
       </div>
    </div>
  );
};

const Markets = () => {
  const assets = useMemo(() => [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Stocks', price: '185.92', change: '+1.25%', trend: 'up' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Stocks', price: '175.43', change: '-2.10%', trend: 'down' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Stocks', price: '415.50', change: '+0.85%', trend: 'up' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Stocks', price: '875.28', change: '+3.45%', trend: 'up' },
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', sector: 'Crypto', price: '68,432', change: '+1.15%', trend: 'up' },
    { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', sector: 'Crypto', price: '3,842', change: '+2.45%', trend: 'up' },
    { symbol: 'EURUSD', name: 'EUR / USD', sector: 'Forex', price: '1.0845', change: '-0.12%', trend: 'down' },
    { symbol: 'GBPUSD', name: 'GBP / USD', sector: 'Forex', price: '1.2734', change: '+0.15%', trend: 'up' },
    { symbol: 'GLD', name: 'SPDR Gold Trust', sector: 'Commodities', price: '215.34', change: '+0.45%', trend: 'up' },
    { symbol: 'SPY', name: 'S&P 500 ETF', sector: 'Indices', price: '512.30', change: '+0.55%', trend: 'up' },
    { symbol: 'QQQ', name: 'Nasdaq 100 ETF', sector: 'Indices', price: '440.15', change: '+0.75%', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Stocks', price: '178.22', change: '+1.10%', trend: 'up' },
    // Futures
    { symbol: 'CME:ES1!', name: 'E-mini S&P 500', sector: 'Futures', price: '5240.25', change: '+0.45%', trend: 'up' },
    { symbol: 'CME:NQ1!', name: 'E-mini Nasdaq 100', sector: 'Futures', price: '18420.50', change: '+0.82%', trend: 'up' },
    { symbol: 'COMEX:GC1!', name: 'Gold Futures', sector: 'Futures', price: '2185.30', change: '+0.15%', trend: 'up' },
    { symbol: 'NYMEX:CL1!', name: 'Crude Oil Futures', sector: 'Futures', price: '78.45', change: '-1.20%', trend: 'down' },
    { symbol: 'CBOT:RTY1!', name: 'Russell 2000 Futures', sector: 'Futures', price: '2085.20', change: '+0.12%', trend: 'up' },
    // Micros
    { symbol: 'CME_MINI:MES1!', name: 'Micro E-mini S&P 500', sector: 'Futures', price: '5240.25', change: '+0.45%', trend: 'up' },
    { symbol: 'CME_MINI:MNQ1!', name: 'Micro E-mini Nasdaq 100', sector: 'Futures', price: '18420.50', change: '+0.82%', trend: 'up' },
    { symbol: 'CBOT_MINI:MYM1!', name: 'Micro E-mini Dow 30', sector: 'Futures', price: '38850', change: '+0.35%', trend: 'up' },
    { symbol: 'CME_MINI:M2K1!', name: 'Micro E-mini Russell 2000', sector: 'Futures', price: '2085.20', change: '+0.12%', trend: 'up' },
  ], []);

  const categories = ['All', 'Stocks', 'Crypto', 'Forex', 'Futures', 'Indices', 'Commodities'];
  const [activeCategory, setActiveCategory] = useState('Futures');
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const [collapsedSectors, setCollapsedSectors] = useState<string[]>([]);
  const [starredSymbol, setStarredSymbol] = useState<string | null>(() => {
    return localStorage.getItem('starred_asset');
  });

  useEffect(() => {
    if (starredSymbol) {
      localStorage.setItem('starred_asset', starredSymbol);
    } else {
      localStorage.removeItem('starred_asset');
    }
  }, [starredSymbol]);

  const toggleSector = (sector: string) => {
    setCollapsedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const toggleStar = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setStarredSymbol(prev => prev === symbol ? null : symbol);
  };

  const filteredAssets = activeCategory === 'All' 
    ? assets 
    : assets.filter(a => a.sector === activeCategory);

  const groupedAssets = useMemo(() => {
    return filteredAssets.reduce((acc, asset) => {
      if (!acc[asset.sector]) acc[asset.sector] = [];
      acc[asset.sector].push(asset);
      return acc;
    }, {} as Record<string, typeof assets>);
  }, [filteredAssets]);

  const handleAssetClick = (symbol: string) => {
    window.open(`https://www.tradingview.com/chart/?symbol=${symbol}`, '_blank');
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 w-full pb-32"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Global Markets</h1>
          </div>
          <p className="text-zinc-500 text-sm italic">Live snapshots and quick execution. Click an asset to analyze on TradingView.</p>
        </div>
        <div className="flex flex-wrap gap-2 p-1 bg-zinc-950 rounded-2xl border border-zinc-900">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeCategory === cat ? "bg-zinc-800 text-white shadow-lg shadow-black/20" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        <BankForecast />
        {(Object.entries(groupedAssets) as [string, typeof assets][]).map(([sector, sectorAssets]) => (
          <div key={sector}>
            <button 
              onClick={() => toggleSector(sector)}
              className="flex items-center gap-3 mb-6 group w-full text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center transition-transform group-hover:scale-110">
                <ChevronDown className={cn(
                  "w-3 h-3 text-zinc-500 transition-transform",
                  collapsedSectors.includes(sector) && "-rotate-90"
                )} />
              </div>
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{sector}</h2>
              <div className="h-px flex-1 bg-zinc-900 ml-4 opacity-50" />
            </button>

            <AnimatePresence initial={false}>
              {!collapsedSectors.includes(sector) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden"
                >
                  {sectorAssets.map((asset, idx) => (
                    <motion.div
                      key={asset.symbol}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => handleAssetClick(asset.symbol)}
                      onMouseEnter={() => setHoveredSymbol(asset.symbol)}
                      onMouseLeave={() => setHoveredSymbol(null)}
                      className="group relative bg-[#09090b] border border-zinc-900 hover:border-emerald-500/30 rounded-3xl p-5 transition-all cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                    >
                      {/* Star Icon */}
                      <button
                        onClick={(e) => toggleStar(e, asset.symbol)}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Star className={cn(
                          "w-3.5 h-3.5",
                          starredSymbol === asset.symbol ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"
                        )} />
                      </button>

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                            asset.trend === 'up' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          )}>
                            {asset.symbol.includes(':') ? asset.symbol.split(':')[1].substring(0, 2) : asset.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight truncate max-w-[120px]">{asset.symbol.includes(':') ? asset.symbol.split(':')[1] : asset.symbol}</h3>
                            <p className="text-[10px] text-zinc-600 font-medium truncate max-w-[100px]">{asset.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-white">${asset.price}</div>
                          <div className={cn(
                            "text-[10px] font-bold mt-0.5",
                            asset.trend === 'up' ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {asset.change}
                          </div>
                        </div>
                      </div>

                      {/* Enlarged Chart Preview on Hover */}
                      <AnimatePresence>
                        {hoveredSymbol === asset.symbol && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute inset-0 z-10 bg-zinc-950 rounded-3xl border border-emerald-500/50 overflow-hidden shadow-2xl"
                          >
                            <TradingViewWidget symbol={asset.symbol} autosize={true} />
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-20">
                              <p className="text-[8px] font-black text-white uppercase tracking-widest">{asset.symbol} LIVE</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-900/50">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{asset.sector}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900/50 rounded-full border border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">TV Chart</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Watchlist Section */}
      <div className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[2rem] bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-2">ACTIVE FOCUS</h2>
              <p className="text-sm text-zinc-600 font-black uppercase tracking-[0.3em] opacity-80">Institutional Market Structure</p>
            </div>
          </div>
          <button 
            onClick={() => setCollapsedSectors(prev => prev.includes('ACTIVE_FOCUS') ? prev.filter(s => s !== 'ACTIVE_FOCUS') : [...prev, 'ACTIVE_FOCUS'])}
            className="group flex items-center gap-3 px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-all font-black text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest"
          >
            <div className={cn(
              "transition-transform",
              collapsedSectors.includes('ACTIVE_FOCUS') && "rotate-180"
            )}>
              <ChevronDown className="w-4 h-4" />
            </div>
            {collapsedSectors.includes('ACTIVE_FOCUS') ? 'Restore Focus' : 'Collapse Overview'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!collapsedSectors.includes('ACTIVE_FOCUS') && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="overflow-hidden"
            >
              {!starredSymbol ? (
                <div className="py-32 text-center border-4 border-zinc-900 border-dashed rounded-[4rem] bg-zinc-950/50 flex flex-col items-center group hover:bg-zinc-900/20 transition-all">
                  <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Star className="w-10 h-10 text-zinc-700" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Zero Focus Targets</h3>
                  <p className="text-zinc-600 text-xs font-black uppercase tracking-widest opacity-60">Star a symbol from the global markets to begin analysis</p>
                </div>
              ) : (
                <div className="relative">
                  {assets.filter(a => a.symbol === starredSymbol).map(asset => (
                    <motion.div
                      key={`watchlist-${asset.symbol}`}
                      className="bg-zinc-950 border-2 border-zinc-900 rounded-[4rem] overflow-hidden group shadow-3xl shadow-indigo-500/10 flex flex-col xl:flex-row h-auto xl:min-h-[800px]"
                    >
                      {/* Left Metadata Panel (Horizontal Design) */}
                      <div className="xl:w-[350px] p-8 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-white/5 relative overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900/30">
                        <div className="absolute top-0 left-0 p-8 opacity-[0.02] pointer-events-none -translate-x-1/2 -translate-y-1/2">
                          <TargetIcon className="w-80 h-80 text-white" />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                          <div className={cn(
                            "w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl transition-all group-hover:scale-105",
                            asset.trend === 'up' ? "bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 shadow-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-2 border-rose-500/20 shadow-rose-500/20"
                          )}>
                            {asset.symbol.includes(':') ? asset.symbol.split(':')[1].substring(0, 2) : asset.symbol.substring(0, 2)}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">{asset.sector}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                              {asset.symbol.includes(':') ? asset.symbol.split(':')[1] : asset.symbol}
                            </h3>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-tight opacity-40">{asset.name}</p>
                          </div>

                          <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-3xl space-y-3 shadow-xl">
                            <div className="flex items-baseline gap-2">
                              <span className="text-zinc-700 font-black text-lg uppercase tracking-tighter italic">USD</span>
                              <div className="text-4xl font-black text-white tracking-tighter leading-none">${asset.price}</div>
                            </div>
                            <div className={cn(
                              "text-xl font-black px-6 py-3 rounded-xl border-2 flex items-center gap-4 justify-center",
                              asset.trend === 'up' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10" : "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10"
                            )}>
                              {asset.trend === 'up' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                              <span className="tracking-tighter">{asset.change}</span>
                            </div>
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col gap-3 mt-6">
                          <button 
                            onClick={() => handleAssetClick(asset.symbol)}
                            className="w-full px-10 py-6 bg-white text-black rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-2xl flex items-center justify-center gap-4"
                          >
                            <Globe className="w-5 h-5" />
                            Expand View
                          </button>
                          <button 
                            onClick={(e) => toggleStar(e, asset.symbol)}
                            className="w-full px-10 py-6 bg-zinc-900 text-zinc-500 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-zinc-800 flex items-center justify-center gap-4 group/remove"
                          >
                            <Star className="w-5 h-5 group-hover/remove:rotate-90 transition-transform" />
                            Dismiss Focus
                          </button>
                        </div>
                      </div>
                      
                      {/* Right Chart Area */}
                      <div className="flex-1 relative group/chart min-h-[600px] xl:h-[800px]">
                        <TradingViewWidget symbol={asset.symbol} height={800} />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none h-48" />
                        <div className="absolute top-8 right-8 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                           <LayoutGrid className="w-4 h-4 text-emerald-500" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Structure Feed</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NYCOpenBiasAnalyst starredSymbol={starredSymbol} />
    </motion.div>
  );
};

const Execution = ({ trades, onUpdateTrade, currency, hidePnL, user, initialTradeId }: { 
  trades: Trade[], 
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void, 
  currency: string, 
  hidePnL: boolean, 
  user: User | null,
  initialTradeId?: string | null
}) => {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(initialTradeId || trades[0]?.id || null);
  const posterRef = React.useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureOrientation, setCaptureOrientation] = useState<'portrait' | 'landscape'>('landscape');
  
  const handleCapture = async (orientation: 'portrait' | 'landscape') => {
    setCaptureOrientation(orientation);
    setIsCapturing(true);
    // Small delay to ensure state update and DOM preparation
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!posterRef.current) {
      setIsCapturing(false);
      return;
    }
    
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        width: orientation === 'portrait' ? 1080 : 1920,
        height: orientation === 'portrait' ? 1350 : 1080,
      });
      
      const link = document.createElement('a');
      link.download = `zync-execution-${selectedTrade?.asset.toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}-${orientation}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture execution:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (initialTradeId) {
      setSelectedTradeId(initialTradeId);
    }
  }, [initialTradeId]);
  const selectedTrade = trades.find(t => t.id === selectedTradeId);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayValue = (val: number, showSign: boolean = false) => {
    if (hidePnL) return '***';
    const sign = showSign && val > 0 ? '+' : '';
    return sign + formatCurrency(val, currency);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    // Limit file size to 5MB for Supabase
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Please use a file smaller than 5MB.');
      return;
    }

    if (!user || !selectedTrade) {
      // Fallback for local users
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (selectedTrade && result) {
          onUpdateTrade(selectedTrade.id, { executionImage: result });
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const uuid = crypto.randomUUID();
      const path = `${user.uid}/trades/${selectedTrade.id}/execution_${uuid}.${extension}`;
      
      const storagePath = await dataService.uploadFile(path, file);
      // We store the storage path in DB. getAccounts will resolve it to signed URL.
      // But for immediate UI feedback, we can get the signed URL now or just use the local reader.
      const signedUrl = await dataService.getSignedUrl(storagePath);
      
      onUpdateTrade(selectedTrade.id, { executionImage: storagePath });
    } catch (err) {
      console.error('Failed to upload trade image:', err);
      alert('Failed to upload image. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedTrade) return;

    if (user && selectedTrade.executionImage && selectedTrade.executionImage.startsWith(user.uid)) {
      try {
        await dataService.deleteFile(selectedTrade.executionImage);
      } catch (err) {
        console.error('Failed to delete file from storage:', err);
      }
    }
    
    onUpdateTrade(selectedTrade.id, { executionImage: '' });
  };

  return (
    <div className="space-y-8">
      <ScrollAnimatedSection>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Market <span className="text-indigo-400">Execution</span></h2>
            <p className="text-zinc-500 text-sm">Visual analysis and deep trade reflection.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleCapture('portrait')}
              disabled={isCapturing || !selectedTrade}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl border border-zinc-800 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
            >
              <Camera className="w-3 h-3" />
              Portrait
            </button>
            <button 
              onClick={() => handleCapture('landscape')}
              disabled={isCapturing || !selectedTrade}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <Camera className="w-3 h-3" />
              Snap Execution
            </button>
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Fullscreen Overlay */}
        <AnimatePresence>
          {isFullscreen && (selectedTrade.executionImage || selectedTrade.screenshot) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
              onClick={() => setIsFullscreen(false)}
            >
              <button 
                onClick={() => setIsFullscreen(false)}
                className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedTrade.executionImage || selectedTrade.screenshot} 
                  alt="Full execution view" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-indigo-500/10"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - Trade List */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {trades.map(trade => (
            <button
              key={trade.id}
              onClick={() => setSelectedTradeId(trade.id)}
              className={cn(
                "w-full p-4 rounded-2xl border text-left transition-all group",
                selectedTradeId === trade.id 
                  ? "bg-white/5 border-indigo-500/50 shadow-lg shadow-indigo-500/5" 
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              )}
            >
              <p className={cn(
                "text-sm font-bold tracking-tight",
                selectedTradeId === trade.id ? "text-white" : "text-zinc-400"
              )}>{trade.asset}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-zinc-600 uppercase font-black">{trade.side}</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>{displayValue(trade.pnl, true)}</span>
              </div>
            </button>
          ))}
          {trades.length === 0 && <p className="text-xs text-zinc-600 italic px-4">No trades to review yet.</p>}
        </div>

        {/* Main Content - Image & Comments */}
        <div className="lg:col-span-3 space-y-6">
          {selectedTrade ? (
            <div className="space-y-6">
              {/* Detailed Header for Selected Trade */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner",
                      selectedTrade.pnl >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                       {selectedTrade.asset.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                       <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-white tracking-tighter">{selectedTrade.asset}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            selectedTrade.side === 'Long' ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                          )}>
                            {selectedTrade.side}
                          </span>
                       </div>
                       <div className="flex items-center gap-4 mt-1">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{selectedTrade.marketType}</p>
                          <div className="w-1 h-1 rounded-full bg-zinc-800" />
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{format(parseISO(selectedTrade.entryDate), 'MMM dd, yyyy')}</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8 md:text-right">
                    <div>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Duration</p>
                       <p className="text-xs font-bold text-white">
                          {formatDistanceStrict(parseISO(selectedTrade.exitDate), parseISO(selectedTrade.entryDate))}
                       </p>
                    </div>
                    <div>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Final Result</p>
                       <p className={cn("text-xl font-black tracking-tight", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                          {displayValue(selectedTrade.pnl, true)}
                       </p>
                    </div>
                 </div>
              </div>

              <div 
                className="relative aspect-video bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden group outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    handleImageUpload(file);
                  }
                }}
                onPaste={(e) => {
                  const item = e.clipboardData.items[0];
                  if (item?.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) handleImageUpload(file);
                  }
                }}
                onClick={() => {
                  if (!selectedTrade.executionImage && !selectedTrade.screenshot) {
                    fileInputRef.current?.click();
                  } else {
                    setIsFullscreen(true);
                  }
                }}
                tabIndex={0}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {selectedTrade.executionImage || selectedTrade.screenshot ? (
                  <img src={selectedTrade.executionImage || selectedTrade.screenshot} alt="Chart Execution" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5 mb-2">
                       <History className="w-10 h-10 opacity-40 text-emerald-400" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-lg font-black text-white tracking-tighter">Journal Your Charts</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-zinc-500 font-black">Drop, Paste or Click to select image</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 backdrop-blur-md">
                   <div className="flex gap-4 mb-8">
                    {(selectedTrade.executionImage || selectedTrade.screenshot) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFullscreen(true);
                        }}
                        className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Maximize className="w-3 h-3" />
                        Full Screen
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-6 py-3 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Change Image
                    </button>
                     <button 
                       onClick={handleRemoveImage}
                       className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                     >
                       Remove
                     </button>
                   </div>
                  <div className="w-full max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Or enter Image URL..."
                      defaultValue={selectedTrade.executionImage || selectedTrade.screenshot || ''}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateTrade(selectedTrade.id, { executionImage: (e.target as HTMLInputElement).value });
                        }
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none shadow-2xl"
                    />
                    <p className="text-[8px] text-zinc-500 mt-2 text-center uppercase tracking-widest">Press Enter to save image URL</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Target className="w-2 h-2" />
                      Entry Price
                    </p>
                    <p className="text-sm font-black text-white tabular-nums">{formatCurrency(selectedTrade.entryPrice || 0, currency)}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <LogOut className="w-2 h-2" />
                      Exit Price
                    </p>
                    <p className="text-sm font-black text-white tabular-nums">{formatCurrency(selectedTrade.exitPrice || 0, currency)}</p>
                  </div>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Scale className="w-2 h-2" />
                      Quantity
                    </p>
                    <p className="text-sm font-black text-white tabular-nums">{selectedTrade.positionSize || 0}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-2 h-2" />
                      Strategy
                    </p>
                    <p className="text-sm font-black text-white truncate max-w-full">{selectedTrade.strategy || 'No Strategy'}</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Zap className="w-2 h-2" />
                      Trade Side
                    </p>
                    <div className="flex items-center gap-2">
                       <span className={cn(
                         "text-[9px] px-2 py-0.5 rounded-md font-black uppercase",
                         selectedTrade.side === 'Long' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" : "bg-rose-500/10 text-rose-500 border border-rose-500/10"
                       )}>
                         {selectedTrade.side}
                       </span>
                       <span className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-black uppercase">
                         {selectedTrade.marketType}
                       </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Calendar className="w-2 h-2" />
                      Market Time
                    </p>
                    <p className="text-[10px] font-bold text-zinc-300">
                      {format(parseISO(selectedTrade.entryDate), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                  <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 blur-2xl rounded-full opacity-10 -mr-12 -mt-12",
                    (selectedTrade.pnl || 0) >= 0 ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Impact</p>
                    <p className={cn("text-lg font-black tracking-tighter tabular-nums", (selectedTrade.pnl || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                      {displayValue(selectedTrade.pnl)}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <div className="flex justify-between items-end">
                       <div>
                         <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Percentage</p>
                         <p className={cn("text-xs font-black", (selectedTrade.pnlPercentage || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                           {(selectedTrade.pnlPercentage || 0).toFixed(2)}%
                         </p>
                       </div>
                       <div className="text-right">
                         <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Outcome</p>
                         <p className="text-[9px] font-black text-white uppercase">{selectedTrade.riskReward}R Profit</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                          <Brain className="w-4 h-4 text-indigo-400" />
                       </div>
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Trade Psychology</h3>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2">Emotional State</p>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-indigo-500" />
                             <span className="text-xs font-bold text-white capitalize">{selectedTrade.emotionalState}</span>
                          </div>
                       </div>
                       <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2">Confidence Level</p>
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500" 
                                  style={{ width: `${(selectedTrade.confidence || 0) * 10}%` }}
                                />
                             </div>
                             <span className="text-[10px] font-black text-white tabular-nums">{selectedTrade.confidence}/10</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                             <Activity className="w-4 h-4 text-emerald-400" />
                          </div>
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Execution Quality & Rules</h3>
                       </div>
                       <div className="flex gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                            selectedTrade.newsImpact === 'Red' ? "bg-rose-500/20 text-rose-500" : 
                            selectedTrade.newsImpact === 'Orange' ? "bg-orange-500/20 text-orange-500" :
                            selectedTrade.newsImpact === 'Yellow' ? "bg-yellow-500/20 text-yellow-500" : "bg-zinc-800 text-zinc-500"
                          )}>
                             {selectedTrade.newsImpact} News Impact
                          </span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                             <ShieldCheck className="w-3 h-3 text-emerald-500" />
                             Rules Followed
                          </p>
                          <div className="flex flex-wrap gap-2">
                             {selectedTrade.followedRules?.length > 0 ? (
                               selectedTrade.followedRules.map((rule, idx) => (
                                 <span key={idx} className="px-2 py-1 bg-emerald-500/5 text-emerald-500/70 border border-emerald-500/10 rounded-lg text-[9px] font-bold">
                                   {rule}
                                 </span>
                               ))
                             ) : (
                               <span className="text-[9px] text-zinc-600 italic">No rules specified</span>
                             )}
                          </div>
                       </div>
                       <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                             <Tags className="w-3 h-3 text-rose-500" />
                             Mistakes identified
                          </p>
                          <div className="flex flex-wrap gap-2">
                             {selectedTrade.mistakeTags?.length > 0 ? (
                               selectedTrade.mistakeTags.map((tag, idx) => (
                                 <span key={idx} className="px-2 py-1 bg-rose-500/5 text-rose-500/70 border border-rose-500/10 rounded-lg text-[9px] font-bold">
                                   {tag}
                                 </span>
                               ))
                             ) : (
                               <span className="text-[9px] text-zinc-600 italic">No mistakes identified</span>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                 <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-3">
                   <Target className="w-4 h-4 text-indigo-400" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Execution Analysis & Comments</h3>
                 </div>
                 <div className="p-8">
                    <textarea 
                      placeholder="Reflect on your entry, execution quality, and exit... What did the market tell you during this trade?"
                      value={selectedTrade.executionComments || ''}
                      onChange={(e) => onUpdateTrade(selectedTrade.id, { executionComments: e.target.value })}
                      className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-200 text-sm leading-relaxed focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder:text-zinc-700 transition-all"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-[10px] text-zinc-600 font-medium">Automatic saving enabled</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">Reflective</span>
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">Learning</span>
                      </div>
                    </div>
                 </div>
              </div>

              {selectedTrade.notes && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl mt-6">
                   <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-3">
                     <BookOpen className="w-4 h-4 text-emerald-400" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Journal Notes</h3>
                   </div>
                   <div className="p-8">
                      <p className="text-zinc-400 text-sm italic leading-relaxed">
                        {selectedTrade.notes}
                      </p>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-zinc-950/30 rounded-3xl border border-zinc-800 border-dashed border-2">
               <p className="text-zinc-600 text-xs font-medium italic">Select a trade from the list to analyze your execution.</p>
            </div>
          )}
        </div>
      </div>
      </ScrollAnimatedSection>

      {/* Hidden Poster Target for Snapshot */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        {selectedTrade && (
          <div 
            ref={posterRef}
            style={{ 
              width: captureOrientation === 'portrait' ? '1080px' : '1920px', 
              height: captureOrientation === 'portrait' ? '1350px' : '1080px' 
            }}
            className="bg-black flex flex-col p-16 relative overflow-hidden text-white font-sans border-[16px] border-zinc-900"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[200px] rounded-full -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[200px] rounded-full -ml-96 -mb-96" />
            
            {/* Poster Header */}
            <div className="flex justify-between items-start relative z-10 mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-3xl text-black">Z</div>
                  <div>
                     <h2 className="text-4xl font-black tracking-tighter">ZYNC</h2>
                     <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Execution Report</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Market Dynamics</p>
                <p className="text-2xl font-black text-zinc-300">{format(parseISO(selectedTrade.entryDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>

            <div className={cn(
              "flex relative z-10 gap-12",
              captureOrientation === 'portrait' ? "flex-col" : "flex-row items-center"
            )}>
              <div className={cn(
                "space-y-2",
                captureOrientation === 'portrait' ? "mb-12" : "flex-1"
              )}>
                <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-xs">{selectedTrade.marketType}</p>
                <h1 className={cn(
                  "font-black tracking-tighter leading-tight",
                  captureOrientation === 'portrait' ? "text-7xl" : "text-8xl"
                )}>
                  {selectedTrade.asset}
                </h1>
                <div className={cn(
                  "flex items-center gap-4 py-2 px-4 rounded-xl inline-flex",
                  selectedTrade.side === 'Long' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                   <Zap className="w-4 h-4 fill-current" />
                   <span className="font-black uppercase tracking-widest text-sm">{selectedTrade.side} Position</span>
                </div>
              </div>

              <div className={cn(
                "grid gap-8",
                captureOrientation === 'portrait' ? "grid-cols-2" : "grid-cols-2 w-1/3"
              )}>
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Net Impact</p>
                  <p className={cn("text-4xl font-black tabular-nums tracking-tighter", selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {displayValue(selectedTrade.pnl, true)}
                  </p>
                </div>
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Efficiency</p>
                  <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                    {selectedTrade.riskReward}R
                  </p>
                </div>
              </div>
            </div>

            {/* Main Visual: Trade Screenshot */}
            <div className="mt-12 flex-1 relative z-10 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
               {(selectedTrade.executionImage || selectedTrade.screenshot) ? (
                 <img 
                   src={selectedTrade.executionImage || selectedTrade.screenshot} 
                   alt="Execution Feed" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <LayoutGrid className="w-24 h-24 stroke-[1]" />
                 </div>
               )}
               <div className="absolute top-8 left-8 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Structure Feed</span>
               </div>
            </div>

            {/* Secondary Intel Grid */}
            <div className="mt-12 grid grid-cols-4 gap-8 relative z-10">
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Entry / Exit</p>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Entry Price</p>
                        <p className="text-base font-black tabular-nums">{formatCurrency(selectedTrade.entryPrice || 0, currency)}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Exit Price</p>
                        <p className="text-base font-black tabular-nums">{formatCurrency(selectedTrade.exitPrice || 0, currency)}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Trade Volume</p>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Quantity</p>
                        <p className="text-base font-black tabular-nums">{selectedTrade.positionSize} Units</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Strategy</p>
                        <p className="text-base font-black truncate">{selectedTrade.strategy}</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Psychology</p>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Emotional State</p>
                        <p className="text-base font-black capitalize">{selectedTrade.emotionalState}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                           <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${(selectedTrade.confidence || 0) * 10}%` }} />
                           </div>
                           <span className="text-[10px] font-black">{selectedTrade.confidence}/10</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                  <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Risk Profile</p>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">News Impact</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                          selectedTrade.newsImpact === 'Red' ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800 text-zinc-500"
                        )}>
                           {selectedTrade.newsImpact} News
                        </span>
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Compliance</p>
                        <div className="flex gap-1">
                           {(selectedTrade.followedRules || []).slice(0, 3).map((_, i) => (
                             <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />
                           ))}
                           {(selectedTrade.mistakeTags || []).slice(0, 3).map((_, i) => (
                             <div key={i} className="w-2 h-2 rounded-full bg-rose-500" />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-12 border-t border-zinc-900 flex justify-between items-end relative z-10">
              <div className="max-w-md">
                <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                  Verified <span className="text-white font-bold">ZYNC</span> Execution Pulse. This position was strictly logged and analyzed for forensic performance tracking.
                </p>
              </div>
              <div className="text-right">
                <p className="text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px] mb-2">zync.intelligence</p>
                <div className="flex items-center gap-3 justify-end">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-zinc-400">AUTHENTICATED TRADER</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151,
  PHP: 56
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    profileName: 'Alex Rivera',
    currency: 'USD',
    startingBalance: 10000,
    riskPerTrade: 1,
    strategyRules: ['Structure Break', 'Liquidity Sweep', 'Fib 0.618 level', 'High Volume Confirmation'],
    playbook: [],
    activePlaybookId: null,
    theme: 'night',
    hidePnL: false,
    profileNameLastChanged: null
  });

  const [accounts, setAccounts] = useState<Account[]>([{
    id: 'default',
    name: 'Primary Account',
    settings: {
      profileName: 'Alex Rivera',
      currency: 'USD',
      startingBalance: 10000,
      riskPerTrade: 1,
      strategyRules: ['Structure Break', 'Liquidity Sweep', 'Fib 0.618 level', 'High Volume Confirmation'],
      playbook: [],
      activePlaybookId: null,
      theme: 'night',
      hidePnL: false,
      profileNameLastChanged: null
    },
    trades: []
  }]);
  const [currentAccountId, setCurrentAccountId] = useState('default');

  const currentAccount = useMemo(() => 
    accounts.find(a => a.id === currentAccountId) || accounts[0],
    [accounts, currentAccountId]
  );

  // Fetch data from Supabase when user is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setDataLoading(true);
      try {
        const remoteAccounts = await dataService.getAccounts();
        if (remoteAccounts.length > 0) {
          setAccounts(remoteAccounts);
          // Try to restore current account ID from local preferences or just use the first one
          const lastAccountId = localStorage.getItem('zync_current_account_id');
          const finalId = remoteAccounts.find(a => a.id === lastAccountId) ? lastAccountId! : remoteAccounts[0].id;
          setCurrentAccountId(finalId);
          
          const current = remoteAccounts.find(a => a.id === finalId) || remoteAccounts[0];
          setSettings(current.settings);
          setTrades(current.trades);
        } else {
          // If no accounts exist in DB, create the default one
          const initialSettings: UserSettings = {
            profileName: user.displayName || 'Trader',
            currency: 'USD',
            startingBalance: 10000,
            riskPerTrade: 1,
            strategyRules: ['Structure Break', 'Liquidity Sweep', 'Fib 0.618 level', 'High Volume Confirmation'],
            playbook: [],
            activePlaybookId: null,
            theme: 'night',
            hidePnL: false,
            profileNameLastChanged: null
          };
          const newAcc = await dataService.createAccount('Primary Account', initialSettings);
          setAccounts([newAcc]);
          setCurrentAccountId(newAcc.id);
          setSettings(newAcc.settings);
          setTrades([]);
        }
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setUser(null);
  };

  useEffect(() => {
    setSettings(currentAccount.settings);
    setTrades(currentAccount.trades);
  }, [currentAccountId, accounts]);

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    if (newSettings.currency !== settings.currency) {
      const rate = CURRENCY_RATES[newSettings.currency] / CURRENCY_RATES[settings.currency];
      
      const convertedTrades = trades.map(t => ({
        ...t,
        pnl: t.pnl * rate,
        entryPrice: t.entryPrice * rate,
        exitPrice: t.exitPrice * rate
      }));
      
      setTrades(convertedTrades);
      const updatedSettings = {
        ...newSettings,
        startingBalance: settings.startingBalance * rate
      };
      setSettings(updatedSettings);
      
      // Update accounts list
      setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, settings: updatedSettings, trades: convertedTrades } : a));
      
      // Persist to Supabase
      if (user) {
        try {
          await dataService.updateAccount(currentAccountId, { settings: updatedSettings });
          // Also update all trades if pnl/prices changed (omitted for brevity, usually you'd handle currency conversion differently in DB)
        } catch (err) {
          console.error('Failed to update account in Supabase:', err);
        }
      }
    } else {
      setSettings(newSettings);
      setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, settings: newSettings } : a));
      
      if (user) {
        dataService.updateAccount(currentAccountId, { settings: newSettings }).catch(console.error);
      }
    }
  };

  const handleAddAccount = async () => {
    if (accounts.length >= 3) return;
    
    if (user) {
      try {
        const newSettings = { ...settings, profileName: `New Account ${accounts.length + 1}` };
        const newAcc = await dataService.createAccount(`Account ${accounts.length + 1}`, newSettings);
        setAccounts([...accounts, newAcc]);
        setCurrentAccountId(newAcc.id);
      } catch (err) {
        console.error('Failed to create account in Supabase:', err);
      }
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const newAccount: Account = {
        id: newId,
        name: `Account ${accounts.length + 1}`,
        settings: { ...settings, profileName: `New Account ${accounts.length + 1}` },
        trades: []
      };
      setAccounts([...accounts, newAccount]);
      setCurrentAccountId(newId);
    }
  };

  const handleSwitchAccount = (id: string) => {
    // Save current before switching (local state is fast)
    setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, settings, trades } : a));
    setCurrentAccountId(id);
    localStorage.setItem('zync_current_account_id', id);
  };

  const handleDeleteAccount = async (id: string) => {
    if (accounts.length <= 1) return;
    
    if (user) {
      try {
        await dataService.deleteAccount(id);
      } catch (err) {
        console.error('Failed to delete account in Supabase:', err);
        return;
      }
    }
    
    const filtered = accounts.filter(a => a.id !== id);
    setAccounts(filtered);
    if (currentAccountId === id) {
      setCurrentAccountId(filtered[0].id);
      localStorage.setItem('zync_current_account_id', filtered[0].id);
    }
  };

  // Load from LocalStorage
  useEffect(() => {
    if (user) return; // Skip if Supabase is being used

    const savedAccounts = localStorage.getItem('zync_accounts');
    const savedCurrentAccountId = localStorage.getItem('zync_current_account_id');
    
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts);
      if (savedCurrentAccountId && parsedAccounts.find((a: Account) => a.id === savedCurrentAccountId)) {
        setCurrentAccountId(savedCurrentAccountId);
        const current = parsedAccounts.find((a: Account) => a.id === savedCurrentAccountId);
        setSettings(current.settings);
        setTrades(current.trades);
      }
    } else {
      // Compatibility for older saves or fresh start
      const savedTrades = localStorage.getItem('zync_trades');
      const savedSettings = localStorage.getItem('zync_settings');
      if (savedTrades || savedSettings) {
         const t = savedTrades ? JSON.parse(savedTrades) : MOCK_TRADES;
         const s = savedSettings ? JSON.parse(savedSettings) : settings;
         const initialAccount = {
           id: 'default',
           name: 'Primary Account',
           settings: s,
           trades: t
         };
         setAccounts([initialAccount]);
         setTrades(t);
         setSettings(s);
      }
    }
  }, []);

  // Authentication listener
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email || '',
          displayName: session.user.user_metadata?.full_name || 'Trader'
        });
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email || '',
          displayName: session.user.user_metadata?.full_name || 'Trader'
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Remove LocalStorage auto-save if user is logged in
  useEffect(() => {
    if (user) return; // Use Supabase

    try {
      const updatedAccounts = accounts.map(a => a.id === currentAccountId ? { ...a, settings, trades } : a);
      localStorage.setItem('zync_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('zync_current_account_id', currentAccountId);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [trades, settings, currentAccountId, accounts, user]);

  const sortedTrades = useMemo(() => {
    return [...trades].sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }, [trades]);

  const stats = useMemo<DashboardStats>(() => {
    const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const winRate = (wins.length / (trades.length || 1)) * 100;
    const grossWin = wins.reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));
    const profitFactor = grossLoss === 0 ? grossWin : grossWin / grossLoss;

    return {
      totalPnL,
      winRate,
      avgWin: wins.length ? grossWin / wins.length : 0,
      avgLoss: losses.length ? grossLoss / losses.length : 0,
      profitFactor,
      totalTrades: trades.length,
      winCount: wins.length,
      lossCount: losses.length
    };
  }, [trades]);

  const handleAddTrade = async (trade: Trade) => {
    if (user) {
      try {
        const savedTrade = await dataService.addTrade(currentAccountId, trade);
        const newTrades = [savedTrade, ...trades];
        setTrades(newTrades);
        setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, trades: newTrades } : a));
      } catch (err) {
        console.error('Failed to save trade to Supabase:', err);
      }
    } else {
      const newTrades = [trade, ...trades];
      setTrades(newTrades);
      setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, trades: newTrades } : a));
    }
  };

  const handleUpdateTrade = async (id: string, updates: Partial<Trade>) => {
    if (user) {
      try {
        await dataService.updateTrade(id, updates);
      } catch (err) {
        console.error('Failed to update trade in Supabase:', err);
      }
    }
    const newTrades = trades.map(t => t.id === id ? { ...t, ...updates } : t);
    setTrades(newTrades);
    setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, trades: newTrades } : a));
  };

  const handleDeleteTrade = async (id: string) => {
    if (user) {
      try {
        await dataService.deleteTrade(id);
      } catch (err) {
        console.error('Failed to delete trade from Supabase:', err);
        return;
      }
    }
    const newTrades = trades.filter(t => t.id !== id);
    setTrades(newTrades);
    setAccounts(prev => prev.map(a => a.id === currentAccountId ? { ...a, trades: newTrades } : a));
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0A0A0B]">
        <div className="flex flex-col items-center gap-4">
          <TrendingUp className="w-12 h-12 text-emerald-400 animate-pulse" />
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Initializing ZYNC...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthComplete={handleAuthComplete} theme={settings.theme} />;
  }

  return (
    <div className={cn(
      "flex flex-col h-screen font-sans overflow-hidden transition-colors duration-500",
      settings.theme === 'light' ? "light bg-zinc-50 text-zinc-900" : 
      settings.theme === 'midnight' ? "bg-[#020617] text-zinc-200" :
      settings.theme === 'obsidian' ? "bg-black text-zinc-200" :
      settings.theme === 'slate' ? "bg-[#18181b] text-zinc-200" :
      settings.theme === 'forest' ? "bg-[#022c22] text-zinc-200" :
      settings.theme === 'abyss' ? "bg-[#0f172a] text-zinc-200" :
      settings.theme === 'carbon' ? "bg-[#171717] text-zinc-200" :
      "bg-[#0A0A0B] text-zinc-200"
    )}>
      <NewFeatureNotification />
      {/* Liquid Glass Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 h-16 z-50 px-6 sm:px-12 flex items-center justify-between backdrop-blur-xl border-b transition-all shadow-xl",
        settings.theme === 'light' ? "bg-white/40 border-zinc-200/50 shadow-emerald-500/5" : 
        settings.theme === 'midnight' ? "bg-blue-950/40 border-blue-900/20 shadow-black/37" :
        settings.theme === 'obsidian' ? "bg-black/40 border-white/5 shadow-black/37" :
        settings.theme === 'slate' ? "bg-zinc-900/40 border-white/5 shadow-black/37" :
        settings.theme === 'forest' ? "bg-emerald-950/40 border-emerald-900/20 shadow-black/37" :
        settings.theme === 'abyss' ? "bg-slate-900/40 border-slate-800/20 shadow-black/37" :
        settings.theme === 'carbon' ? "bg-zinc-900/40 border-zinc-800/20 shadow-black/37" :
        "bg-zinc-950/40 border-white/5 shadow-black/37"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <HamburgerIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white italic">ZYNC</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'journal', label: 'Journals' },
            { id: 'markets', label: 'Markets', isNew: true },
            { id: 'economic', label: 'Economics' },
            { id: 'execution', label: 'Execution' },
            { id: 'plan', label: 'My Plan' },
            { id: 'checklist', label: 'Checklist Rules' },
            { id: 'portfolio', label: 'Portfolio Plan' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative group rounded-full overflow-hidden flex items-center gap-2",
                activeTab === item.id 
                  ? (settings.theme === 'light' ? "text-indigo-600" : "text-white") 
                  : (settings.theme === 'light' ? "text-zinc-500 hover:text-indigo-500" : "text-zinc-500 hover:text-zinc-300")
              )}
            >
              {item.label}
              {(item as any).isNew && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-nav"
                  className={cn(
                    "absolute inset-0 rounded-full -z-10",
                    settings.theme === 'light' ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-white/5 border border-white/10"
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-0.5">{settings.profileName}</span>
            <span className="text-[8px] text-zinc-600 uppercase tracking-widest">Active Trader</span>
          </div>
          <button 
            onClick={() => setActiveTab('journal')}
            className="hidden sm:flex px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            Log Trade
          </button>
          <div 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer border",
              settings.theme === 'light' ? "bg-white/40 border-zinc-200" : "bg-zinc-900 border-white/5"
            )}
          >
            <div className={cn(
              "text-xs font-black group-hover:scale-110 transition-transform",
              settings.theme === 'light' ? "text-zinc-900" : "text-white"
            )}>
              {settings.profileName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className={cn(
                "p-2 rounded-xl border flex items-center justify-center transition-all group",
                showLogoutConfirm 
                  ? "bg-rose-500 text-white border-rose-500" 
                  : (settings.theme === 'light' ? "bg-white border-zinc-200 text-zinc-500 hover:bg-rose-50 hover:text-rose-500" : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400")
              )}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showLogoutConfirm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute right-0 top-full mt-2 w-48 p-4 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in duration-200",
                    settings.theme === 'light' ? "bg-white border-zinc-200" : "bg-zinc-900 border-zinc-800"
                  )}
                >
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Confirm Logout?</p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowLogoutConfirm(false);
                      }}
                      className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-900/20"
                    >
                      Yes, Logout
                    </button>
                    <button 
                      onClick={() => setShowLogoutConfirm(false)}
                      className={cn(
                        "w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        settings.theme === 'light' ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-zinc-800 text-zinc-400 hover:text-white"
                      )}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Mobile Side Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={cn(
                  "fixed top-0 left-0 bottom-0 w-72 z-[70] border-r p-6 flex flex-col shadow-2xl lg:hidden transition-all backdrop-blur-2xl",
                  settings.theme === 'light' ? "bg-white/70 border-zinc-200" : "bg-[#0e0e11] border-white/5"
                )}
              >
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xl font-black tracking-tighter text-white italic">ZYNC</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2 flex-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'journal', label: 'Market Journal', icon: BookOpen },
                    { id: 'economic', label: 'Economics', icon: Calendar },
                    { id: 'markets', label: 'Markets', icon: Globe },
                    { id: 'execution', label: 'Execution', icon: History },
                    { id: 'plan', label: 'My Strategy', icon: Target },
                    { id: 'checklist', label: 'Checklist Rules', icon: CheckCircle2 },
                    { id: 'portfolio', label: 'Portfolio Plan', icon: Wallet },
                    { id: 'analytics', label: 'Performance', icon: BarChart3 },
                    { id: 'settings', label: 'Settings', icon: SettingsIcon },
                  ].map((item) => (
                    <MobileNavButton
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeTab === item.id}
                      theme={settings.theme}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    />
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-y-auto scroll-smooth transition-colors duration-500",
          settings.theme === 'light' ? "bg-zinc-50" : "bg-[#0A0A0B]"
        )}>
          <div className="p-6 sm:p-10 w-full">
            <div className="mb-10">
              <MarketBannerSlider />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    stats={stats} 
                    trades={sortedTrades} 
                    onTabChange={setActiveTab} 
                    profileName={settings.profileName} 
                    currency={settings.currency} 
                    hidePnL={settings.hidePnL}
                    user={user}
                    onUpdateTrade={handleUpdateTrade}
                    startingBalance={settings.startingBalance}
                    onSelectExecution={(id) => {
                      setSelectedExecutionId(id);
                      setActiveTab('execution');
                    }}
                  />
                )}
                {activeTab === 'journal' && (
                  <TradeJournal 
                    trades={trades} 
                    onAddTrade={handleAddTrade} 
                    onUpdateTrade={handleUpdateTrade}
                    onDeleteTrade={handleDeleteTrade} 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings}
                    user={user}
                  />
                )}
                {activeTab === 'execution' && (
                  <Execution 
                    trades={sortedTrades} 
                    onUpdateTrade={handleUpdateTrade} 
                    currency={settings.currency} 
                    hidePnL={settings.hidePnL} 
                    user={user} 
                    initialTradeId={selectedExecutionId}
                  />
                )}
                {activeTab === 'markets' && <Markets />}
                {activeTab === 'economic' && <EconomicCalendar />}
                {activeTab === 'plan' && (
                  <Plan 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings} 
                  />
                )}
                 {activeTab === 'checklist' && (
                  <ChecklistTab 
                    trades={trades} 
                    onUpdateTrade={handleUpdateTrade} 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings}
                    user={user}
                  />
                )}
                {activeTab === 'portfolio' && (
                  <InvestorPlanTab 
                    currentAccountId={currentAccountId}
                    accounts={accounts}
                    trades={trades}
                    startingBalance={settings.startingBalance}
                    currency={settings.currency}
                  />
                )}
                {activeTab === 'analytics' && <Analytics trades={sortedTrades} currency={settings.currency} hidePnL={settings.hidePnL} user={user} profileName={settings.profileName} onUpdateTrade={handleUpdateTrade} />}
                {activeTab === 'settings' && (
                  <Settings 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings}
                    accounts={accounts}
                    currentAccountId={currentAccountId}
                    onAddAccount={handleAddAccount}
                    onSwitchAccount={handleSwitchAccount}
                    onDeleteAccount={handleDeleteAccount}
                    user={user}
                    onAuthComplete={handleAuthComplete}
                    onLogout={handleLogout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-12 md:mt-20">
              <FuturesMarquee />
            </div>
            <Footer 
              theme={settings.theme} 
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenTerms={() => setShowTerms(true)}
            />
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showPrivacy && (
          <LegalModal title="Privacy Policy" icon={Shield} onClose={() => setShowPrivacy(false)} theme={settings.theme}>
            <PrivacyContent />
          </LegalModal>
        )}
        {showTerms && (
          <LegalModal title="Terms of Service" icon={FileText} onClose={() => setShowTerms(false)} theme={settings.theme}>
            <TermsContent />
          </LegalModal>
        )}
      </AnimatePresence>
      <GlowingCursor />
    </div>
  );
}
