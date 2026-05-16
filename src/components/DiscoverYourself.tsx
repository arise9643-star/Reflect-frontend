import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { soundService } from '../services/soundService';

// --- API Configuration ---
const API_URL = "https://reflect-production-e11f.up.railway.app";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

interface DiscoverYourselfProps {
  entries: JournalEntry[];
  userName: string;
  onBack: () => void;
}

export const DiscoverYourself = ({ entries, userName, onBack }: DiscoverYourselfProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const suggestions = [
    "What should I do differently?",
    "Analyze my mood patterns.",
    "How can I find more peace?",
    "Am I being too hard on myself?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Use a small timeout to let the input state update before sending
    setTimeout(() => {
      handleSend(suggestion);
    }, 10);
  };

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = messageToSend.trim();
    if (!overrideInput) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    soundService.playSoftClick();

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          entries: entries,
          userName: userName
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
      soundService.playSave();
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The connection to your inner sanctuary was interrupted. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full relative bg-ivory"
    >
      <header className="px-6 py-4 flex items-center justify-center border-b border-lavender-100/20 bg-ivory/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                soundService.playNavigation();
                onBack();
              }}
              className="p-2 hover:bg-lavender-100/50 rounded-full text-lavender-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-serif italic text-plum-grey flex items-center gap-2">
                Discover Yourself <Sparkles className="w-4 h-4 text-lavender-500" />
              </h2>
              <p className="text-[9px] uppercase tracking-widest text-plum-grey/30 font-bold">AI Reflection Companion</p>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-6 pb-12 px-4 md:px-0 scroll-smooth no-scrollbar"
      >
        <div className="max-w-3xl mx-auto w-full space-y-8">
          {messages.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 bg-lavender-500/10 rounded-full flex items-center justify-center border border-lavender-500/20 shadow-2xl shadow-lavender-500/10">
                <Sparkles className="w-8 h-8 text-lavender-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-plum-grey">Ask your inner self...</h3>
                <div className="text-sm text-plum-grey/60 max-w-xs mx-auto space-y-2">
                  <p className="bg-lavender-50/50 px-4 py-2 rounded-xl shadow-sm border border-lavender-100/30 font-medium">"Analyze my mood patterns from this month."</p>
                  <p className="bg-lavender-50/50 px-4 py-2 rounded-xl shadow-sm border border-lavender-100/30 font-medium">"What qualities should I pursue?"</p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'max-w-[85%] sm:max-w-[70%] bg-lavender-500 text-white rounded-tr-none shadow-lg shadow-lavender-500/20' 
                    : 'max-w-[95%] sm:max-w-[85%] bg-lavender-50/80 text-plum-grey border border-lavender-100/30 rounded-tl-none font-serif leading-relaxed'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm max-w-none prose-p:text-plum-grey prose-headings:text-plum-grey">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-lavender-50 p-5 rounded-3xl rounded-tl-none border border-lavender-100 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-lavender-500 animate-spin" />
                <span className="text-[10px] text-lavender-500 font-bold uppercase tracking-widest">Reflecting on your journals...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="shrink-0 w-full p-4 md:p-8 bg-ivory/80 backdrop-blur-lg border-t border-lavender-100/10 z-10">
        <div className="max-w-3xl mx-auto w-full">
          {/* Suggestions */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar flex-nowrap sm:flex-wrap sm:justify-center">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="whitespace-nowrap px-4 py-2 bg-ivory/50 hover:bg-lavender-500 border border-lavender-100/30 rounded-full text-[10px] sm:text-xs text-lavender-500 hover:text-white transition-all active:scale-95 shadow-sm font-bold uppercase tracking-wider"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Discover yourself..."
              className="w-full bg-lavender-50/50 backdrop-blur-md border border-lavender-100/40 text-plum-grey rounded-3xl py-4 sm:py-5 pl-7 pr-16 outline-none focus:border-lavender-500/50 focus:bg-lavender-50 transition-all placeholder:text-plum-grey/30 shadow-xl"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-lavender-500 text-white rounded-2xl flex items-center justify-center hover:bg-lavender-400 transition-all disabled:opacity-20 active:scale-90 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[9px] uppercase tracking-[0.3em] font-bold text-plum-grey/20 mt-4">
            AI-Powered Insights &bull; Derived from your sanctuary
          </p>
        </div>
      </div>
    </motion.div>
  );
};
