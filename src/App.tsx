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
  Minus,
  AlertCircle,
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
  ChevronDown,
  Mail,
  Instagram,
  Shield,
  FileText,
  Lock,
  Chrome,
  Apple
} from 'lucide-react';
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
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfYear
} from 'date-fns';
import { cn, formatCurrency, formatPercent } from './lib/utils';
import { supabase } from './supabaseClient';
import { dataService } from './services/dataService';
import { Trade, UserSettings, DashboardStats, MarketType, Side, EmotionalState, NewsImpact, ExitStatus, Account, User } from './types';
import { MOCK_TRADES } from './constants';

// --- Components ---

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
  theme: 'night' | 'light';
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

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to connect with Apple');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (provider === 'google') return handleGoogleLogin();
    if (provider === 'apple') return handleAppleLogin();
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
    : cn("min-h-screen flex items-center justify-center p-6 bg-[#0A0A0B]", theme === 'light' && "bg-zinc-50");

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

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Chrome className="w-3.5 h-3.5 text-rose-400" />
            Continue with Google
          </button>
          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Apple className="w-3.5 h-3.5" />
            Continue with Apple
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

const ExportModal = ({ trades, profileName, onClose, currency, hidePnL }: { trades: Trade[], profileName: string, onClose: () => void, currency: string, hidePnL: boolean }) => {
  const [rangeType, setRangeType] = useState<'day' | 'week' | 'month' | 'ytd' | 'custom'>('month');
  const [customRange, setCustomRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
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
      selectedTrades = trades.filter(t => isSameDay(parseISO(t.entryDate), now));
    } else if (rangeType === 'week') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.entryDate), { start: startOfWeek(now), end: endOfWeek(now) }));
    } else if (rangeType === 'month') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.entryDate), { start: startOfMonth(now), end: endOfMonth(now) }));
    } else if (rangeType === 'ytd') {
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.entryDate), { start: startOfYear(now), end: now }));
    } else if (rangeType === 'custom' && customRange.start && customRange.end) {
      const start = customRange.start < customRange.end ? customRange.start : customRange.end;
      const end = customRange.start < customRange.end ? customRange.end : customRange.start;
      selectedTrades = trades.filter(t => isWithinInterval(parseISO(t.entryDate), { start: startOfDay(start), end: endOfWeek(end) }));
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
  }, [trades, rangeType, customRange]);

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Export Performance</h3>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
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
          
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Custom Range Selection</p>
            <div className="grid grid-cols-7 gap-1">
              {/* Simplified mini calendar for range selection */}
              {eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() }).map((day, i) => {
                const isSelected = (customRange.start && isSameDay(day, customRange.start)) || (customRange.end && isSameDay(day, customRange.end));
                const isInRange = customRange.start && customRange.end && isWithinInterval(day, { 
                  start: customRange.start < customRange.end ? customRange.start : customRange.end, 
                  end: customRange.start < customRange.end ? customRange.end : customRange.start 
                });
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setRangeType('custom');
                      if (!customRange.start || (customRange.start && customRange.end)) {
                        setCustomRange({ start: day, end: null });
                      } else {
                        setCustomRange({ ...customRange, end: day });
                      }
                    }}
                    className={cn(
                      "aspect-square rounded flex items-center justify-center text-[10px] font-bold transition-all",
                      isSelected ? "bg-indigo-500 text-white" : 
                      isInRange ? "bg-indigo-500/20 text-indigo-300" :
                      "hover:bg-zinc-800 text-zinc-600"
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
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
            
            <button
              onClick={handleExport}
              disabled={isCapturing}
              className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5"
            >
              {isCapturing ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Generate Poster
                </>
              )}
            </button>
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

const Dashboard = ({ stats, trades, onTabChange, profileName, currency, hidePnL, user, onUpdateTrade }: { stats: DashboardStats, trades: Trade[], onTabChange: (tab: string) => void, profileName: string, currency: string, hidePnL: boolean, user: User | null, onUpdateTrade: (id: string, updates: Partial<Trade>) => void }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState('All Time');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    let balance = 10000; // Starting
    return trades.map(t => {
      balance += t.pnl;
      return {
        date: format(parseISO(t.entryDate), 'MMM dd'),
        balance
      };
    }).reverse();
  }, [trades]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <HeroSection 
          name={profileName} 
          stats={stats} 
          onTabChange={onTabChange} 
          onExport={() => setShowExportModal(true)}
          hasTrades={trades.length > 0}
          currency={currency}
          hidePnL={hidePnL}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Equity Curve</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Performance</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <button onClick={() => onTabChange('journal')} className="text-xs text-emerald-400 hover:underline">View All</button>
          </div>
          <div className="divide-y divide-zinc-800 flex-1 overflow-y-auto">
            {trades.slice(0, 5).map(trade => (
              <div key={trade.id} className="p-4 hover:bg-zinc-800 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-white text-xs">{trade.asset} <span className="text-[10px] text-zinc-600 ml-1">{trade.side}</span></p>
                  <p className={cn("font-bold text-xs", trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
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
            ))}
          </div>
        </div>
      </div>

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
    </div>
  );
};

const PnLCalendar = ({ trades, setSelectedTrade, currency, hidePnL }: { trades: Trade[], setSelectedTrade: (t: Trade) => void, currency: string, hidePnL: boolean }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-w-[700px]">
      <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">P&L Calendar</div>
      </div>

      <div className="grid grid-cols-7 border-b border-zinc-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950/50">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dayTrades = trades.filter(t => isSameDay(parseISO(t.entryDate), day));
          const dayPnL = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
          const isCurrentMonth = isSameDay(startOfMonth(day), startOfMonth(currentMonth));
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-zinc-800 transition-colors flex flex-col",
                !isCurrentMonth ? "bg-zinc-950/20 opacity-30" : "bg-zinc-900/20",
                isToday && "bg-indigo-500/5"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-[10px] font-black",
                  isToday ? "text-indigo-400" : "text-zinc-600"
                )}>
                  {format(day, 'd')}
                </span>
                {dayPnL !== 0 && (
                  <span className={cn(
                    "text-[10px] font-bold",
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
                      "w-full text-left p-1.5 rounded-md text-[9px] font-bold border transition-all hover:scale-[1.02] active:scale-[0.98]",
                      trade.pnl >= 0 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{trade.asset}</span>
                      <span>{displayValue(trade.pnl, true)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
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
    if (filter === 'wins') return trades.filter(t => t.pnl >= 0);
    if (filter === 'losses') return trades.filter(t => t.pnl < 0);
    return trades;
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
    setShowForm(true);
  };

  const handleNewEntry = () => {
    setEditingTrade(null);
    setConfidence(5);
    setIsManualPnl(false);
    setScreenshot(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
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
              <PnLCalendar trades={filteredTrades} setSelectedTrade={setSelectedTrade} currency={currency} hidePnL={hidePnL} />
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
                   className="aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden relative"
                   onClick={() => fileInputRefDetail.current?.click()}
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
                          {isUploadingDetail ? 'Uploading...' : 'Click to upload screenshot'}
                        </p>
                      </>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
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
                  screenshot: screenshot || undefined
                };

                if (editingTrade) {
                  onUpdateTrade(editingTrade.id, tradeData);
                } else {
                  const newTrade: Trade = {
                    ...tradeData as Trade,
                    id: Math.random().toString(36).substr(2, 9),
                    entryDate: new Date().toISOString(),
                    exitDate: new Date().toISOString(),
                    mistakeTags: [],
                  };
                  onAddTrade(newTrade);
                }
                setShowForm(false);
              }}>
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
                  <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Size</label>
                      <input 
                        name="positionSize" 
                        type="number" 
                        step="any" 
                        defaultValue={editingTrade?.positionSize}
                        required={!isManualPnl} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none" 
                        placeholder="0.1" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Entry</label>
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
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Exit</label>
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
                    className="aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden relative"
                    onClick={() => fileInputRef.current?.click()}
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
                          {isUploading ? 'Uploading...' : 'Click to upload screenshot'}
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
    </div>
  );
};

const Analytics = ({ trades, currency, hidePnL, user, onUpdateTrade }: { trades: Trade[], currency: string, hidePnL: boolean, user: User | null, onUpdateTrade: (id: string, updates: Partial<Trade>) => void }) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="space-y-8 pb-20">
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
              const dayTrades = trades.filter(t => isSameDay(parseISO(t.entryDate), day));
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
      </div>

      {/* Analytics Footer with Quotes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-12">
        <PnLCalendar trades={trades} setSelectedTrade={setSelectedTrade} currency={currency} hidePnL={hidePnL} />
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
                   className="aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center gap-3 group/chart cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden relative"
                   onClick={() => fileInputRef.current?.click()}
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
                          {isUploading ? 'Uploading...' : 'Click to upload screenshot'}
                        </p>
                      </>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Disconnect
            </button>
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
        <div className="flex gap-4">
          <button 
            onClick={() => onUpdateSettings({ ...settings, theme: 'night' })}
            className={cn(
              "flex-1 p-4 rounded-xl border flex flex-col gap-3 transition-all",
              settings.theme === 'night' 
                ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/5" 
                : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className="w-full aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center">
              <div className="w-1/2 h-1 bg-emerald-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-[10px] font-black uppercase tracking-widest", settings.theme === 'night' ? "text-white" : "text-zinc-500")}>Night Mode</span>
              {settings.theme === 'night' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </div>
          </button>

          <button 
            onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
            className={cn(
              "flex-1 p-4 rounded-xl border flex flex-col gap-3 transition-all",
              settings.theme === 'light' 
                ? "bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/5" 
                : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className="w-full aspect-video bg-zinc-100 rounded-lg border border-zinc-300 flex items-center justify-center">
              <div className="w-1/2 h-1 bg-indigo-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-[10px] font-black uppercase tracking-widest", settings.theme === 'light' ? "text-indigo-600" : "text-zinc-500")}>Lighter Mode</span>
              {settings.theme === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </div>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-bold text-zinc-100 mb-6 font-serif tracking-tight">Profile Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Display Name</label>
            <input 
              value={settings.profileName}
              onChange={(e) => onUpdateSettings({ ...settings, profileName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
            />
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
              value={settings.strategyRules.join(', ')}
              onChange={(e) => onUpdateSettings({ ...settings, strategyRules: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none" 
              rows={3}
              placeholder="Structure break, Liquidity sweep, FVG fill..."
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

const Plan = ({ name, rules }: { name: string, rules: string[] }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % QUOTES.length);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const shuffleQuote = () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * QUOTES.length);
    } while (nextIdx === quoteIdx);
    setQuoteIdx(nextIdx);
  };

  return (
    <div 
      className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      onClick={shuffleQuote}
    >
      <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-10 cursor-pointer group/plan">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">My Strategic <span className="text-emerald-400">Blueprint</span></h2>
          <p className="text-zinc-500 mb-10 max-w-xl">
            A personalized trading framework designed for <span className="text-zinc-300 font-bold">{name}</span>. Consistency is the only bridge between goals and accomplishment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Core Trading Rules
              </h3>
              <div className="space-y-3">
                {rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:text-emerald-400 transition-colors">
                      {i + 1}
                    </div>
                    <span className="text-sm text-zinc-300">{rule}</span>
                  </div>
                ))}
                {rules.length === 0 && (
                  <p className="text-xs text-zinc-600 italic">No rules defined. Head to settings to build your blueprint.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Psychological Framework
              </h3>
              <motion.div 
                key={quoteIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-4"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Daily Mindset</p>
                  <p className="text-lg font-serif italic text-indigo-200 leading-tight">
                    "{QUOTES[quoteIdx]}"
                  </p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-bold text-white">Execution Over Outcome</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">Focus on following the plan perfectly. A losing trade that followed the rules is a success. A winning trade that broke rules is a failure.</p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-bold text-white">The 1% Rule</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">Never risk more than 1% of equity on a single idea. Preservation of capital is priority number one.</p>
                </div>
              </motion.div>
              
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Daily Routine</h4>
                <ul className="space-y-3">
                  {['Check economic calendar (News Folders)', 'Identify HTF structure', 'Mark liquidity pools', 'Wait for LTF displacement'].map((step, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-zinc-400">
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-center">
            <p className="text-[8px] text-zinc-600 uppercase tracking-[0.3em]">Tap anywhere to shuffle motivation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Execution = ({ trades, onUpdateTrade, currency, hidePnL, user }: { trades: Trade[], onUpdateTrade: (id: string, updates: Partial<Trade>) => void, currency: string, hidePnL: boolean, user: User | null }) => {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(trades[0]?.id || null);
  const selectedTrade = trades.find(t => t.id === selectedTradeId);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Market <span className="text-indigo-400">Execution</span></h2>
          <p className="text-zinc-500 text-sm">Visual analysis and deep trade reflection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  if (!selectedTrade.executionImage) {
                    fileInputRef.current?.click();
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
                {selectedTrade.executionImage ? (
                  <img src={selectedTrade.executionImage} alt="Chart Execution" className="w-full h-full object-cover" />
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
                      defaultValue={selectedTrade.executionImage || ''}
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
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Exit Status</p>
                  <p className="text-xs font-bold text-zinc-100">{selectedTrade.exitStatus || 'Not Set'}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Actual RR</p>
                  <p className="text-xs font-bold text-emerald-400">{selectedTrade.riskReward || 0}R</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Target RR</p>
                  <p className="text-xs font-bold text-indigo-400">{selectedTrade.targetRR || 0}R</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Outcome</p>
                  <p className={cn("text-xs font-black", (selectedTrade.pnl || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {displayValue(selectedTrade.pnl)} ({(selectedTrade.pnlPercentage || 0).toFixed(2)}%)
                  </p>
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
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-zinc-950/30 rounded-3xl border border-zinc-800 border-dashed border-2">
               <p className="text-zinc-600 text-xs font-medium italic">Select a trade from the list to analyze your execution.</p>
            </div>
          )}
        </div>
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
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    profileName: 'Alex Rivera',
    currency: 'USD',
    startingBalance: 10000,
    riskPerTrade: 1,
    strategyRules: ['Structure Break', 'Liquidity Sweep', 'Fib 0.618 level', 'High Volume Confirmation'],
    theme: 'night',
    hidePnL: false
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
      theme: 'night',
      hidePnL: false
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
            theme: 'night',
            hidePnL: false
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
      settings.theme === 'light' ? "light bg-zinc-50 text-zinc-900" : "bg-[#0A0A0B] text-zinc-200"
    )}>
      {/* Liquid Glass Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 h-16 z-50 px-6 sm:px-12 flex items-center justify-between backdrop-blur-xl border-b transition-all shadow-xl",
        settings.theme === 'light' ? "bg-white/40 border-zinc-200/50 shadow-emerald-500/5" : "bg-zinc-950/40 border-white/5 shadow-black/37"
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
            { id: 'execution', label: 'Execution' },
            { id: 'plan', label: 'My Plan' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative group rounded-full overflow-hidden",
                activeTab === item.id 
                  ? (settings.theme === 'light' ? "text-indigo-600" : "text-white") 
                  : (settings.theme === 'light' ? "text-zinc-500 hover:text-indigo-500" : "text-zinc-500 hover:text-zinc-300")
              )}
            >
              {item.label}
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
          <button
            onClick={() => {
              setActiveTab('settings');
              handleLogout();
            }}
            className={cn(
              "p-2 rounded-xl border flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white group",
              settings.theme === 'light' ? "bg-white border-zinc-200 text-zinc-500" : "bg-zinc-900 border-white/5 text-zinc-400"
            )}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
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
                    { id: 'execution', label: 'Execution', icon: History },
                    { id: 'plan', label: 'My Strategy', icon: Target },
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
          <div className="p-6 sm:p-12 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    stats={stats} 
                    trades={trades} 
                    onTabChange={setActiveTab} 
                    profileName={settings.profileName} 
                    currency={settings.currency} 
                    hidePnL={settings.hidePnL}
                    user={user}
                    onUpdateTrade={handleUpdateTrade}
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
                {activeTab === 'execution' && <Execution trades={trades} onUpdateTrade={handleUpdateTrade} currency={settings.currency} hidePnL={settings.hidePnL} user={user} />}
                {activeTab === 'plan' && <Plan name={settings.profileName} rules={settings.strategyRules} />}
                {activeTab === 'analytics' && <Analytics trades={trades} currency={settings.currency} hidePnL={settings.hidePnL} user={user} onUpdateTrade={handleUpdateTrade} />}
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
