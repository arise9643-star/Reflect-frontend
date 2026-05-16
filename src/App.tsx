/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Settings, 
  Plus, 
  X, 
  ChevronRight, 
  ArrowRight,
  Check,
  Cloud,
  Home,
  PenTool,
  Wind,
  History,
  Calendar,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { soundService } from './services/soundService';

import { DiscoverYourself } from './components/DiscoverYourself';

// --- API Configuration ---
const API_URL = "https://reflect-production-e11f.up.railway.app";

// --- Types & Context ---

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

interface AppContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<string>;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  currentView: string;
  setView: (view: string) => void;
  activeMonth: string | null;
  setActiveMonth: (month: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  mentorResponse: string;
  setMentorResponse: (r: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- Components ---

const OnboardingView = () => {
  const { completeOnboarding, setUserName, setView } = useAppContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [source, setSource] = useState('');

  const nextStep = () => {
    soundService.playNavigation();
    setStep(s => s + 1);
  };

  const prevStep = () => {
    soundService.playNavigation();
    setStep(s => s - 1);
  };

  const finish = () => {
    soundService.playSave();
    setUserName(name);
    completeOnboarding();
    setView('dashboard');
  };

  const steps = [
    // Step 1: Name
    (
      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white">To begin, what shall we call you?</h2>
          <p className="text-lavender-200/40 font-medium tracking-wide">Your sanctuary is a private space for your eyes only.</p>
        </div>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full bg-transparent border-b-2 border-lavender-100/30 py-4 text-3xl md:text-4xl font-serif text-white outline-none focus:border-lavender-500 transition-colors caret-lavender-500 placeholder:text-white/10"
          autoFocus
        />
        <button 
          onClick={nextStep}
          disabled={!name.trim()}
          className="group flex items-center gap-3 bg-lavender-500 text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-lavender-400 transition-all disabled:opacity-30"
        >
          Next <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    ),
    // Step 2: Birthday
    (
      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white">When did your journey begin?</h2>
          <p className="text-lavender-200/40 font-medium tracking-wide">We ask to better understand the seasons of your life.</p>
        </div>
        <input 
          type="date" 
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full bg-transparent border-b-2 border-lavender-100/30 py-4 text-2xl md:text-3xl font-serif text-white outline-none focus:border-lavender-500 transition-colors cursor-pointer [color-scheme:dark]"
        />
        <div className="flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-full border border-lavender-100/30 text-white/50 hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextStep}
            disabled={!birthday}
            className="flex-1 bg-lavender-500 text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-lavender-400 transition-all disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </motion.div>
    ),
    // Step 3: Source
    (
      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white">How did you find this sanctuary?</h2>
          <p className="text-lavender-200/40 font-medium tracking-wide">We love knowing where paths cross.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['YouTube', 'Instagram', 'Facebook', 'TikTok', 'X (Twitter)', 'A friend', 'Other'].map(opt => (
            <button
              key={opt}
              onClick={() => {
                setSource(opt);
                soundService.playSoftClick();
              }}
              className={`p-5 rounded-2xl border-2 transition-all text-left font-serif italic text-lg ${source === opt ? 'border-lavender-500 bg-lavender-500 text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={prevStep} className="p-4 rounded-full border border-lavender-100/30 text-white/50 hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextStep}
            disabled={!source}
            className="flex-1 bg-lavender-500 text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-lavender-400 transition-all disabled:opacity-30"
          >
            Almost there
          </button>
        </div>
      </motion.div>
    ),
    // Step 4: Tutorial
    (
      <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-serif italic text-white">Welcome to Reflect.</h2>
          <p className="text-lavender-200/60 leading-relaxed font-medium">
            This is your digital sanctuary—a quiet corner of the internet for your thoughts. 
            Here is how you can use it:
          </p>
        </div>

        <div className="grid gap-6 text-white">
          <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-lavender-500 text-white flex items-center justify-center rounded-full shrink-0 shadow-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white/80 mb-1">Journal</h4>
              <p className="text-sm text-white/50 italic">Record your daily reflections and moods.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-white/10 text-lavender-400 flex items-center justify-center rounded-full shrink-0 shadow-sm border border-white/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white/80 mb-1">Archive</h4>
              <p className="text-sm text-white/50 italic">Look back through time at your past sanctuaries.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-white/10 text-lavender-400 flex items-center justify-center rounded-full shrink-0 shadow-sm border border-white/10">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white/80 mb-1">Meditate</h4>
              <p className="text-sm text-white/50 italic">Guided breathing to find peace in any moment.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={finish}
          className="w-full bg-white text-[#13111a] py-5 rounded-full font-bold text-xs tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
        >
          Begin your journey
        </button>
      </motion.div>
    )
  ];

  return (
    <div className="min-h-screen bg-[#13111a] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(138, 120, 255, 0.1) 0%, transparent 100%)' }} />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-lavender-500 rounded-full blur-[100px] opacity-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-lavender-500 rounded-full blur-[100px] opacity-10" />

      <div className="w-full max-w-xl relative z-10">
        <div className="mb-12 flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(idx => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-700 ${step >= idx ? 'w-8 bg-lavender-500' : 'w-2 bg-white/10'}`} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {steps[step - 1]}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 text-[10px] uppercase font-bold tracking-[0.5em] text-white/20">
        Personal Sanctuary &bull; Setup
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { currentView, setView } = useAppContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'archive', label: 'Archive', icon: BookOpen },
    { id: 'meditate', label: 'Meditate', icon: Wind },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ivory/95 dark:bg-[#13111a]/95 backdrop-blur-2xl border-t border-lavender-100 flex items-center justify-around px-6 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => {
            soundService.playNavigation();
            setView('discover');
          }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 min-h-[50px] justify-center transition-all ${currentView === 'discover' ? 'text-lavender-500' : 'text-plum-grey/25'}`}
        >
          <div className="w-10 h-10 bg-lavender-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-lavender-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase">Discover</span>
        </button>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundService.playNavigation();
                setView(item.id);
              }}
              className="relative flex flex-col items-center gap-1 flex-1 py-1 min-h-[50px] justify-center transition-all"
            >
              {isActive && (
                <motion.div 
                  layoutId="tab-indicator"
                  className="absolute -top-3 w-1 h-1 rounded-full bg-lavender-500"
                />
              )}
              <div className={`transition-all duration-300 ${isActive ? 'w-10 h-10 bg-lavender-100 dark:bg-lavender-500/20 rounded-full flex items-center justify-center text-lavender-500' : 'text-plum-grey/25'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-lavender-500' : 'text-plum-grey/25'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-full flex items-center justify-center pointer-events-none z-40 px-4 md:pl-6 lg:pl-10">
      <motion.nav 
        initial={false}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pointer-events-auto bg-lavender-50/80 backdrop-blur-2xl border border-lavender-100/40 p-4 md:p-5 py-8 md:py-10 flex flex-col items-center gap-10 rounded-[3rem] md:rounded-[4rem] shadow-2xl h-fit min-h-[400px] max-h-[90vh] md:max-h-[650px] w-20 md:w-24"
      >
        <div className="flex flex-col items-center gap-8">
          <button onClick={() => {
            soundService.playNavigation();
            setView('discover');
          }} className="p-3 bg-lavender-500 rounded-full text-white shadow-lg shadow-lavender-500/30 hover:scale-110 active:scale-95 transition-all">
            <Sparkles className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundService.playNavigation();
                  setView(item.id);
                }}
                className={`relative p-4 rounded-full transition-all duration-300 group ${
                  currentView === item.id 
                    ? 'bg-lavender-500 text-white shadow-lg shadow-lavender-500/30' 
                    : 'text-plum-grey/30 hover:text-lavender-500 hover:bg-lavender-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="absolute left-16 px-4 py-2 bg-plum-grey text-ivory text-[10px] uppercase tracking-widest font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl max-w-[120px] overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden transition-colors duration-700 bg-ivory relative">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-14 pb-24 md:pt-0 md:pb-0 scroll-smooth md:pl-28 lg:pl-32">
          {children}
      </main>
    </div>
  );
};

// --- View Components ---

const Landing = () => {
  const { setView, theme } = useAppContext();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden py-20"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/meditation/1920/1080?blur=10" 
          alt="Peaceful background"
          className={`w-full h-full object-cover transition-opacity duration-700 ${theme === 'dark' ? 'opacity-20' : 'opacity-40'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/20 via-ivory/60 to-ivory" />
      </div>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Sparkles className="w-12 h-12 text-lavender-500 mb-4 mx-auto" />
          <h1 className="text-xl tracking-[0.2em] uppercase text-lavender-500 font-medium">Reflect</h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-plum-grey leading-tight mb-8">
            "Quiet the mind, <br/> and the soul will speak."
          </h2>
          <p className="text-sm tracking-widest uppercase text-plum-grey/60 font-semibold">— Ma Jaya Sati Bhagavati</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={() => {
              soundService.playNavigation();
              setView('dashboard');
            }}
            className="group relative px-10 py-4 bg-lavender-500 text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-lavender-500/20"
          >
              <span className="relative z-10 flex items-center gap-2">
                Enter Sanctuary <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
          </button>
        </motion.div>
      </main>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-plum-grey/30"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Breathe & Scroll</span>
        <ChevronRight className="w-4 h-4 rotate-90" />
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { setView, entries, deleteEntry, setActiveMonth, userName, theme } = useAppContext();
  const [showAllSanctuaries, setShowAllSanctuaries] = useState(false);
  
  const now = new Date();
  const allMonthCards = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    
    const monthStyles = [
      { light: { from: '#fef3c7', via: '#fffbeb', to: '#fadcc3' }, dark: { from: '#2a1f3d', via: '#1e1b2e', to: '#3d2a1e' } },
      { light: { from: '#dcfce7', via: '#f0fdf4', to: '#bbf7d0' }, dark: { from: '#1a2e1f', via: '#1e1b2e', to: '#1a3020' } },
      { light: { from: '#e0e7ff', via: '#eef2ff', to: '#c7d2fe' }, dark: { from: '#1e1b3d', via: '#1e1b2e', to: '#2a2640' } },
      { light: { from: '#ffe4e6', via: '#fff1f2', to: '#fecdd3' }, dark: { from: '#1e1b2e', via: '#2a2640', to: '#3d3860' } },
    ];
    
    const icons = ['🌿', '✨', '☁️', '🌙', '🍂', '☀️', '❄️', '🌸', '🌊', '🪁', '🕯️', '🧸'];
    
    const monthEntries = entries.filter(e => {
      const ed = new Date(e.date);
      return ed.toLocaleString('en-US', { month: 'long', year: 'numeric' }) === name;
    });

    const style = monthStyles[d.getMonth() % monthStyles.length];
    const currentStyle = theme === 'dark' ? style.dark : style.light;

    return {
      name,
      label,
      bgStyle: {
        background: `linear-gradient(to bottom right, ${currentStyle.from}, ${currentStyle.via}, ${currentStyle.to})`
      },
      icon: icons[d.getMonth() % icons.length],
      count: monthEntries.length,
      latest: monthEntries.length > 0 ? monthEntries[monthEntries.length - 1] : null
    };
  });

  const monthCards = showAllSanctuaries 
    ? allMonthCards 
    : allMonthCards.filter(card => card.count > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 relative min-h-full"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-lavender-300 rounded-full blur-[100px] pointer-events-none -z-10 opacity-10" />

      <header className="mb-8 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-plum-grey tracking-tight mb-2 leading-tight">Hi, {userName}.</h1>
            <p className="text-lavender-500/60 font-serif italic text-base md:text-lg opacity-80">Welcome back to your quiet space.</p>
          </div>
        </div>
      </header>

      <div className="mb-16 md:mb-20 relative w-full">
        <div className="flex gap-6 md:gap-10 overflow-x-auto pb-8 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-pl-4 md:scroll-pl-0">
          {monthCards.length === 0 && !showAllSanctuaries && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAllSanctuaries(true)}
              className="shrink-0 w-[calc(100vw-48px)] max-w-[340px] md:w-[320px] h-[360px] md:h-[480px] bg-lavender-50/50 rounded-[2.5rem] md:rounded-[3.5rem] p-7 md:p-10 flex flex-col justify-center items-center border-2 border-dashed border-lavender-100/30 text-lavender-300 hover:text-lavender-500 hover:border-lavender-300 transition-all group snap-start"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-lavender-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="font-serif italic text-base md:text-lg opacity-60 text-center">Begin your journey</p>
              <span className="text-[10px] font-bold tracking-widest mt-4 uppercase">See all months</span>
            </motion.button>
          )}
          
          {monthCards.map((card, idx) => (
            <motion.div
              key={card.name}
              initial={{ x: 50, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              whileHover={{ 
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }}
              transition={{ 
                delay: idx * 0.08, 
                type: 'spring', 
                stiffness: 120, 
                damping: 20 
              }}
              onClick={() => {
                soundService.playNavigation();
                setActiveMonth(card.name);
                setView('archive');
              }}
              style={card.bgStyle}
              className="shrink-0 w-[calc(100vw-48px)] max-w-[340px] md:w-[340px] h-[360px] md:h-[480px] rounded-[2.5rem] md:rounded-[3.5rem] p-7 md:p-10 flex flex-col border border-white/40 ring-1 ring-white/10 shadow-2xl shadow-lavender-500/5 cursor-pointer group relative overflow-hidden snap-start"
            >
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-plum-grey/30">Sanctuary</span>
                <div className="text-3xl md:text-4xl opacity-30 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700">{card.icon}</div>
              </div>

              <div className="flex-1 mt-6 md:mt-8 relative z-10">
                {card.latest ? (
                  <div className="space-y-4">
                    <div className="h-[1px] w-12 bg-plum-grey/20" />
                    <p className="text-lg md:text-xl font-serif text-plum-grey/80 leading-relaxed italic line-clamp-3 md:line-clamp-4">
                      "{card.latest.content}"
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-plum-grey/40 uppercase">
                      Latest entry: {new Date(card.latest.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <Cloud className="w-10 h-10 md:w-12 md:h-12 mb-4 text-plum-grey" />
                    <p className="text-sm font-serif italic text-plum-grey">Pure stillness...</p>
                  </div>
                )}
              </div>

              <div className="relative z-10 pt-4 md:pt-6 mt-auto">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-plum-grey tracking-tight mb-1 md:mb-2 group-hover:text-lavender-500 transition-colors uppercase">{card.label}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-plum-grey/30 uppercase">
                    {card.count} {card.count === 1 ? 'Reflection' : 'Reflections'}
                  </span>
                  <div className="p-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-plum-grey" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="mb-24">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-plum-grey">Daily Reflections</h2>
            <div className="h-1 w-12 bg-lavender-500 mt-2" />
          </div>
          <button onClick={() => {
            soundService.playNavigation();
            setView('archive');
          }} className="group flex items-center gap-3 text-lavender-500 hover:text-plum-grey transition-colors">
            <span className="text-[10px] font-bold tracking-widest uppercase">Full Journey</span>
            <div className="w-8 h-8 rounded-full bg-lavender-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-2xl">
          {entries.length > 0 ? (
            entries.slice(-3).reverse().map((entry, idx) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="bg-lavender-50/80 backdrop-blur-sm rounded-[1.8rem] p-8 border border-lavender-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-lavender-500/10 group-hover:bg-lavender-500 transition-colors duration-500" />
                <div className="flex gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold tracking-widest text-lavender-500/80 uppercase">
                        {entry.title}
                      </h4>
                      <button 
                        onClick={() => {
                          soundService.playDelete();
                          deleteEntry(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-200 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-plum-grey font-serif text-xl leading-loose mb-6 italic opacity-80 group-hover:opacity-100 transition-opacity">
                      "{entry.content.length > 120 ? entry.content.substring(0, 120) + '...' : entry.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <History className="w-3 h-3 text-lavender-500/40" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-lavender-500/40 uppercase">
                          {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-lavender-100/30" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-lavender-500/60 uppercase bg-lavender-50 px-3 py-1 rounded-full border border-lavender-100/20">
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-lavender-50/50 rounded-[1.5rem] self-center border border-lavender-100/30 group-hover:border-lavender-500/20 group-hover:bg-lavender-50 transition-all duration-500 shadow-inner">
                    <span className="text-2xl transform group-hover:scale-125 transition-transform duration-500">
                      {{
                        'Peaceful': '🌿',
                        'Grateful': '🙏',
                        'Inspired': '💡',
                        'Overwhelmed': '😔',
                        'Tired': '🌙'
                      }[entry.mood] || '✨'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-lavender-50/30 rounded-[3rem] border-2 border-solid border-lavender-100/50 flex flex-col items-center">
              <div className="w-20 h-20 bg-ivory rounded-full flex items-center justify-center shadow-sm mb-6">
                <PenTool className="w-8 h-8 text-lavender-100" />
              </div>
              <p className="text-plum-grey/50 font-serif italic text-2xl max-w-xs mx-auto">The universe is listening. Write your first line.</p>
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-[90px] md:bottom-12 right-6 md:right-16 z-40">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 45 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            soundService.playNavigation();
            setView('journal');
          }}
          className="w-12 h-12 md:w-16 md:h-16 bg-lavender-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-lavender-500/40 border-4 md:border-8 border-ivory active:bg-lavender-400 transition-all duration-500"
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const JournalEntryView = () => {
  const { setView, addEntry, setMentorResponse } = useAppContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Peaceful');

  const handleSave = async () => {
    if (!title || !content) return;
    soundService.playSave();
    const response = await addEntry({ 
      title, 
      content, 
      mood, 
      date: new Date().toISOString() 
    });
    setMentorResponse(response);
    setView('mentor');
  };

  const autoGrow = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = (target.scrollHeight) + 'px';
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 min-h-full"
    >
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex flex-col flex-1 w-full">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                soundService.playNavigation();
                setView('dashboard');
              }} 
              className="w-11 h-11 flex items-center justify-center bg-lavender-50 hover:bg-lavender-100 rounded-full transition-colors text-lavender-500 shadow-sm"
            >
              <Home className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-lavender-500/60 block italic">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <textarea
            placeholder="A title for your thoughts..."
            className="w-full text-2xl sm:text-4xl md:text-5xl font-serif italic bg-transparent border-0 focus:ring-0 focus:outline-none caret-lavender-500 text-plum-grey placeholder:text-plum-grey/10 resize-none h-auto overflow-hidden p-0 leading-tight"
            rows={1}
            value={title}
            onInput={autoGrow}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={!title || !content}
          className="fixed bottom-[90px] right-6 md:static w-14 h-14 sm:w-auto sm:px-10 sm:py-4 bg-lavender-500 text-white rounded-full font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-lavender-400 transition-all disabled:opacity-50 shadow-xl shadow-lavender-500/20 active:scale-95 z-50"
        >
          <Check className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Save</span>
        </button>
      </header>

      <div className="flex flex-wrap gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { label: 'Peaceful', icon: '🌿' },
          { label: 'Grateful', icon: '🙏' },
          { label: 'Overwhelmed', icon: '😔' },
          { label: 'Inspired', icon: '💡' },
          { label: 'Tired', icon: '🌙' }
        ].map((m) => (
          <button
            key={m.label}
            onClick={() => {
              soundService.playSoftClick();
              setMood(m.label);
            }}
            className={`min-h-[44px] px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              mood === m.label 
                ? 'bg-lavender-500 border-lavender-500 text-white shadow-md' 
                : 'border-lavender-100 text-plum-grey/40 hover:border-lavender-500/30'
            }`}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <textarea
          placeholder="Start writing..."
          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none caret-lavender-500 text-xl leading-[2] text-plum-grey placeholder:text-plum-grey/20 resize-none min-h-[200px] p-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="text-right mt-2 text-[10px] text-lavender-500/30 tracking-widest uppercase font-bold p-4">
          {wordCount} words
        </div>
      </motion.div>
    </motion.div>
  );
};

const Archive = () => {
  const { entries, setView, deleteEntry, activeMonth, setActiveMonth } = useAppContext();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredEntries = activeMonth 
    ? entries.filter(entry => {
        const date = new Date(entry.date);
        const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        return monthName === activeMonth;
      })
    : entries;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 min-h-full"
    >
      <header className="mb-12 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => {
              soundService.playNavigation();
              setActiveMonth(null);
              setView('dashboard');
            }} 
            className="p-3 bg-ivory dark:bg-lavender-500/10 hover:bg-lavender-100 dark:hover:bg-lavender-500/20 rounded-full transition-colors text-lavender-500 shadow-sm border border-lavender-100/30"
          >
            <Home className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-plum-grey tracking-tight">
              {activeMonth ? `${activeMonth} Sanctuary` : 'Past Entries'}
            </h1>
            <p className="text-xs md:text-sm text-plum-grey/40 italic mt-1">
              {activeMonth 
                ? `Exploring ${filteredEntries.length} reflections.` 
                : `A journey of ${entries.length} steps.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {activeMonth && (
            <button 
              onClick={() => {
                soundService.playSoftClick();
                setActiveMonth(null);
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-lavender-50 text-lavender-500 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-lavender-100 transition-colors shadow-sm"
            >
              Show All
            </button>
          )}
          <button 
            onClick={() => setView('journal')}
            className="w-12 h-12 md:w-14 md:h-14 bg-lavender-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-lavender-500/20 hover:scale-110 active:scale-90 transition-all font-bold"
          >
            <Plus className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </header>

      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-plum-grey/20">
          <Cloud className="w-20 h-20 mb-6 opacity-30" />
          <p className="font-serif italic text-2xl text-center">
            {activeMonth 
              ? `No entries found in ${activeMonth}.` 
              : "The clouds are clear. Start writing your story."}
          </p>
        </div>
      ) : (
        <div className="grid gap-12 relative">
          <div className="absolute left-[0.75rem] md:left-[1.35rem] top-0 bottom-0 w-[1px] bg-lavender-200/70" />
          
          {[...filteredEntries].reverse().map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ y: -4 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative pl-8 md:pl-12 pb-10 hover:bg-lavender-50/20 rounded-3xl transition-all duration-300 -ml-2 md:ml-0"
            >
              <div className="absolute left-[0.1rem] md:left-4 top-6 w-3 h-3 rounded-full bg-lavender-100 group-hover:bg-lavender-500 transition-all duration-300 border-2 border-ivory z-10" />
              
              <div className="pt-4 px-4">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-lavender-500/40 mb-3 block">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                
                <h3 className="text-xl md:text-2xl font-serif font-bold text-plum-grey mb-3 group-hover:text-lavender-500 transition-colors">
                  {entry.title}
                </h3>
                
                <p className="text-plum-grey/60 line-clamp-2 leading-relaxed mb-6 font-medium">
                  {entry.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 bg-lavender-50 border border-lavender-100/20 rounded-full text-lavender-500">
                    {entry.mood}
                  </span>
                  
                  <button 
                    onClick={() => {
                      if (confirmDelete === entry.id) {
                        soundService.playDelete();
                        deleteEntry(entry.id);
                        setConfirmDelete(null);
                      } else {
                        soundService.playSoftClick();
                        setConfirmDelete(entry.id);
                      }
                    }}
                    onMouseLeave={() => setConfirmDelete(null)}
                    className={`opacity-0 group-hover:opacity-100 p-2 transition-all font-semibold text-[10px] min-w-[80px] min-h-[44px] tracking-widest uppercase rounded-lg px-4 flex items-center justify-center ${
                      confirmDelete === entry.id 
                        ? 'bg-red-500 text-white opacity-100' 
                        : 'text-red-300 hover:text-red-500'
                    }`}
                  >
                    {confirmDelete === entry.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const MeditateView = () => {
  const { setView } = useAppContext();
  const [breatheState, setBreatheState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(1); // minutes
  const [timeLeft, setTimeLeft] = useState(60); // seconds
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playSound = (freq: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  useEffect(() => {
    if (!isActive) return;

    const sequence = [
      { state: 'inhale' as const, duration: 4000, freq: 440 },
      { state: 'hold' as const, duration: 2000, freq: 0 },
      { state: 'exhale' as const, duration: 4000, freq: 330 },
    ];
    let currentIndex = 0;
    let timer: any;

    const runSequence = () => {
      const current = sequence[currentIndex];
      setBreatheState(current.state);
      if (current.freq > 0) playSound(current.freq);
      
      timer = setTimeout(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        runSequence();
      }, current.duration);
    };

    runSequence();
    return () => clearTimeout(timer);
  }, [isActive]);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playSound(554.37);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startSession = (mins: number) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 flex flex-col items-center justify-start text-center min-h-[80vh]">
      <header className="w-full flex justify-start mb-16">
        <button onClick={() => {
          soundService.playNavigation();
          setView('dashboard');
        }} className="p-3 bg-ivory dark:bg-lavender-500/10 hover:bg-lavender-100 dark:hover:bg-lavender-500/20 rounded-full transition-colors text-lavender-500 shadow-sm border border-lavender-100/30">
          <Home className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="relative mb-16">
          <AnimatePresence>
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -inset-8 bg-lavender-300 rounded-full blur-3xl opacity-20 -z-10"
              />
            )}
          </AnimatePresence>
          
          <motion.div 
            animate={{ 
              scale: isActive ? (breatheState === 'inhale' ? 1.4 : breatheState === 'hold' ? 1.4 : 1) : 1,
              backgroundColor: isActive ? (breatheState === 'inhale' ? 'rgba(158, 150, 204, 0.2)' : 'rgba(158, 150, 204, 0.1)') : 'rgba(158, 150, 204, 0.05)'
            }}
            transition={{ 
              duration: breatheState === 'inhale' ? 4 : breatheState === 'exhale' ? 4 : 2, 
              ease: "easeInOut" 
            }}
            className="w-32 h-32 md:w-40 md:h-40 bg-ivory dark:bg-lavender-500/10 border-4 border-lavender-100/30 rounded-full shadow-2xl relative z-10 flex flex-col items-center justify-center text-lavender-500"
          >
            <Wind className={`w-8 h-8 md:w-12 md:h-12 transition-transform duration-1000 ${isActive ? 'rotate-12' : ''}`} />
            {isActive && (
              <motion.span 
                key={timeLeft}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-6 text-[10px] font-bold tracking-widest text-lavender-500/40"
              >
                {formatTime(timeLeft)}
              </motion.span>
            )}
          </motion.div>
        </div>

        <h2 className="text-4xl font-serif font-bold text-plum-grey mb-4 italic tracking-tight">
          {isActive ? breatheState.charAt(0).toUpperCase() + breatheState.slice(1) : 'Breath Work'}
        </h2>
        
        <p className="text-lg text-plum-grey/60 max-w-md mx-auto leading-relaxed mb-12 h-14">
          {isActive ? 'Follow the sound of the bell...' : 'Select a duration to begin your session.'}
        </p>
        
        {!isActive ? (
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 3, 5].map(mins => (
              <button
                key={mins}
                onClick={() => {
                  soundService.playNavigation();
                  startSession(mins);
                }}
                className="px-6 py-4 bg-lavender-50 dark:bg-lavender-500/10 border border-lavender-100/30 rounded-2xl text-lavender-500 font-bold text-xs tracking-widest uppercase hover:bg-lavender-500 hover:text-white transition-all shadow-sm"
              >
                {mins}m
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setIsActive(false)}
            className="px-10 py-4 border-2 border-lavender-100/30 text-plum-grey/40 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-red-50 hover:text-red-400 hover:border-red-100 transition-all"
          >
            End Early
          </button>
        )}

        {isActive && (
          <div className="mt-12 flex flex-col items-center gap-3 w-full">
             <div className="h-1 w-32 bg-lavender-100/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / (duration * 60)) * 100}%` }}
                  className="h-full bg-lavender-500"
                />
             </div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-lavender-500/30">Session Progress</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SettingsView = () => {
  const { setView, clearAllEntries, userName, setUserName, theme, toggleTheme } = useAppContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 flex flex-col justify-start min-h-[80vh]">
      <header className="w-full flex justify-start mb-16">
        <button onClick={() => {
          soundService.playNavigation();
          setView('dashboard');
        }} className="p-3 bg-ivory hover:bg-lavender-100 rounded-full transition-colors text-lavender-500 shadow-sm border border-lavender-100/30">
          <Home className="w-6 h-6" />
        </button>
      </header>

      <div className="w-full max-w-2xl text-left bg-lavender-50/50 backdrop-blur-sm p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-lavender-100/30 shadow-xl">
        <Settings className="w-10 h-10 md:w-12 md:h-12 text-lavender-500 mb-8" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-plum-grey mb-8 md:mb-12 text-center md:text-left">Sanctuary Settings</h2>
        
        <div className="space-y-8 md:space-y-12 max-w-md mx-auto md:mx-0">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-plum-grey/40 mb-3 block">Your name</label>
            <input 
              type="text" 
              value={editedName} 
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-lavender-100/30 py-3 md:py-4 focus:border-lavender-500 outline-none transition-all font-serif italic text-2xl md:text-4xl text-plum-grey"
            />
          </div>
          
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-plum-grey/40 mb-6 block">Appearance</label>
            <div className="flex bg-lavender-50 p-1.5 rounded-full border border-lavender-100/20 w-fit">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`px-8 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${theme === 'light' ? 'bg-lavender-500 text-white shadow-lg' : 'text-plum-grey/40'}`}
              >
                Light
              </button>
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`px-8 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${theme === 'dark' ? 'bg-lavender-500 text-white shadow-lg' : 'text-plum-grey/40'}`}
              >
                Dark
              </button>
            </div>
          </div>
          
          <div className="pt-12 border-t border-lavender-100/30">
            <label className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-6 block">Danger Zone</label>
            {showConfirm ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    soundService.playDelete();
                    clearAllEntries();
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-lg"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => {
                    soundService.playSoftClick();
                    setShowConfirm(false);
                  }}
                  className="px-6 py-4 bg-lavender-50 text-plum-grey rounded-2xl font-bold tracking-[0.2em] uppercase text-xs border border-lavender-100/30"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  soundService.playSoftClick();
                  setShowConfirm(true);
                }}
                className="w-full py-4 border-2 border-red-100 text-red-400 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-red-50 transition-colors"
                id="delete-all-btn"
              >
                Delete All Data
              </button>
            )}
          </div>
          
          <button 
            onClick={() => {
              soundService.playSave();
              setUserName(editedName);
              setView('dashboard');
            }}
            disabled={editedName === userName}
            className="w-full py-5 bg-plum-grey text-white rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MentorView = () => {
  const { setView, mentorResponse, setActiveMonth } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full md:max-w-5xl md:mx-auto px-5 py-6 md:px-16 md:py-16 min-h-full flex flex-col"
    >
      <header className="mb-12 md:mb-16 flex justify-between items-start">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => {
              soundService.playNavigation();
              setView('dashboard');
            }} 
            className="p-3 bg-ivory dark:bg-lavender-500/10 hover:bg-lavender-100 dark:hover:bg-lavender-500/20 rounded-full transition-colors text-lavender-500 shadow-sm border border-lavender-100/30"
          >
            <Home className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-plum-grey tracking-tight">
              Mentor's Insight
            </h1>
            <p className="text-xs md:text-sm text-plum-grey/40 italic mt-1">
              Personalized guidance based on your reflection.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            soundService.playNavigation();
            setActiveMonth(null);
            setView('archive');
          }}
          className="px-6 py-3 bg-lavender-50 text-lavender-500 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-lavender-100 transition-colors shadow-sm"
        >
          View All Entries
        </button>
      </header>

      <div className="flex-1 bg-lavender-50/50 backdrop-blur-sm p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-lavender-100/30 shadow-xl">
        <div className="prose prose-lg max-w-none text-plum-grey">
          <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {mentorResponse}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setView] = useState('landing');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [userName, setUserNameState] = useState('Marta');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [mentorResponse, setMentorResponse] = useState('');

  useEffect(() => {
    const savedEntries = localStorage.getItem('reflect_entries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedName = localStorage.getItem('reflect_username');
    if (savedName) setUserNameState(savedName);

    const savedTheme = localStorage.getItem('reflect_theme');
    if (savedTheme) setThemeState(savedTheme as 'light' | 'dark');

    const savedOnboarding = localStorage.getItem('reflect_onboarded');
    if (savedOnboarding === 'true') setHasOnboarded(true);
  }, []);

  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem('reflect_entries', JSON.stringify(updated));
    const res = await fetch(`${API_URL}/reflect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: entry.content })
    });
    const data = await res.json();
    return data.response;
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('reflect_entries', JSON.stringify(updated));
  };

  const clearAllEntries = () => {
    setEntries([]);
    setUserNameState('Marta');
    setHasOnboarded(false);
    localStorage.clear();
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('reflect_username', name);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    localStorage.setItem('reflect_theme', next);
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
    localStorage.setItem('reflect_onboarded', 'true');
  };

  const renderContent = () => {
    if (currentView === 'landing') {
      return (
        <div key="landing-wrapper" className="h-full relative overflow-y-auto">
          <Landing />
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/30 text-[10px] uppercase tracking-widest font-bold rounded-lg border border-white/5 transition-all"
          >
            Reset App State
          </button>
        </div>
      );
    }
    if (!hasOnboarded) return <OnboardingView key="onboarding" />;
    
    return (
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.6, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            className="h-full w-full"
          >
            {(() => {
              switch (currentView) {
                case 'dashboard': return <Dashboard />;
                case 'journal': return <JournalEntryView />;
                case 'archive': return <Archive />;
                case 'meditate': return <MeditateView />;
                case 'settings': return <SettingsView />;
                case 'mentor': return <MentorView />;
                case 'discover': return <DiscoverYourself entries={entries} userName={userName} onBack={() => setView('dashboard')} />;
                default: return null;
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    );
  };

  return (
    <AppContext.Provider value={{ 
      entries, 
      addEntry, 
      deleteEntry, 
      clearAllEntries, 
      currentView, 
      setView, 
      activeMonth, 
      setActiveMonth,
      userName,
      setUserName,
      theme,
      toggleTheme,
      hasOnboarded,
      completeOnboarding,
      mentorResponse,
      setMentorResponse
    }}>
      <div 
        data-theme={theme}
        className="font-sans antialiased h-full overflow-hidden transition-colors duration-700 bg-ivory"
      >
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
