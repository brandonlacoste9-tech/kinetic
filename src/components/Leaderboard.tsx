import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Crown, Zap, Target, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useLanguage } from '../contexts/LanguageContext';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  sector?: string | null;
}

export default function Leaderboard({ isOpen, onClose, sector }: LeaderboardProps) {
  const { entries, loading, isContested } = useLeaderboard(sector || undefined);
  const { t, locale } = useLanguage();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-4xl bg-on-surface border-4 border-primary rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(172,44,0,0.4)] flex flex-col h-[90vh] relative">
        {/* Industrial Rivets */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-primary/30 border border-primary/50 z-50" />
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-primary/30 border border-primary/50 z-50" />
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-primary/30 border border-primary/50 z-50" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-primary/30 border border-primary/50 z-50" />

        {/* Header: The Scoreboard Plate */}
        <header className="bg-primary p-8 md:p-12 flex justify-between items-center relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <Trophy className="text-on-primary" size={32} />
              <span className="font-mono text-[10px] font-bold text-on-primary/60 tracking-[0.4em] uppercase">
                {sector ? `SECTOR_DOMINANCE // ${sector.toUpperCase()}` : "CITY_WIDE_HIERARCHY // v4.0"}
              </span>
            </div>
            <h2 className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter text-on-primary uppercase leading-none">
              {t.leaderboard.title}
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <p className="font-headline text-sm font-bold text-on-primary/80 uppercase tracking-widest">
                {t.leaderboard.subtitle}
              </p>
              {isContested && (
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-black text-primary px-3 py-1 rounded-md font-mono text-[10px] font-black tracking-widest border border-primary"
                >
                  CONTESTED_SECTOR
                </motion.div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="relative z-10 bg-on-primary text-primary p-4 rounded-2xl hover:scale-110 transition-transform shadow-2xl"
          >
            <X size={32} />
          </button>
        </header>

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 space-y-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-50">
              <Zap className="text-primary animate-pulse" size={64} />
              <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">CALCULATING_HIERARCHY...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 font-headline text-[10px] font-black text-secondary tracking-widest uppercase border-b border-primary/10 pb-4">
                <div className="col-span-1">{t.leaderboard.rank}</div>
                <div className="col-span-6">{t.leaderboard.operator}</div>
                <div className="col-span-3 text-right">{t.leaderboard.intensity}</div>
                <div className="col-span-2 text-right">{t.leaderboard.sovereign}</div>
              </div>

              {entries.map((entry, i) => (
                <motion.div
                  key={entry.operatorName}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`grid grid-cols-12 gap-4 items-center p-6 rounded-2xl border-2 transition-all group relative ${
                    entry.isCurrentUser 
                      ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(172,44,0,0.2)]' 
                      : 'bg-surface-container-low border-transparent hover:border-primary/20'
                  }`}
                >
                  {/* User Rank Highlight */}
                  {entry.isCurrentUser && (
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-2xl border-2 border-primary/30 animate-pulse" />
                  )}

                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-2">
                    <span className={`font-headline text-3xl font-black italic ${i < 3 ? 'text-primary' : 'text-secondary'}`}>
                      {entry.rank}
                    </span>
                  </div>

                  {/* Operator */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20 bg-on-surface/5">
                      <img 
                        src={`https://picsum.photos/seed/${entry.operatorName}/100/100`} 
                        alt={entry.operatorName} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-headline text-xl font-black italic uppercase ${entry.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
                          {entry.operatorName}
                        </span>
                        {entry.sovereignSector && (
                          <Crown size={16} className="text-[#d4af37] animate-bounce" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[9px] text-secondary/60 uppercase tracking-widest">BASE: {entry.homeBase}</span>
                        <Target size={10} className="text-primary/40" />
                      </div>
                    </div>
                  </div>

                  {/* Intensity */}
                  <div className="col-span-3 text-right">
                    <div className="font-headline text-2xl font-black italic text-on-surface">
                      {(entry.intensityScore / 100).toFixed(1)}
                    </div>
                    <div className="font-mono text-[9px] text-secondary uppercase tracking-widest">
                      {entry.sessions} SESSIONS
                    </div>
                  </div>

                  {/* Sovereign Sector */}
                  <div className="col-span-2 text-right">
                    {entry.sovereignSector ? (
                      <div className="flex flex-col items-end">
                        <span className="font-headline text-[10px] font-black text-primary uppercase tracking-widest">
                          {entry.sovereignSector}
                        </span>
                        <Target size={14} className="text-primary mt-1" />
                      </div>
                    ) : (
                      <span className="font-mono text-[10px] text-secondary/30 uppercase tracking-widest">NONE</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Tactical Ticker */}
        <footer className="bg-on-surface-variant/5 p-6 border-t border-primary/10">
          <div className="flex justify-between items-center font-mono text-[9px] font-bold text-secondary uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              <span>LAST_UPDATE: {new Date().toLocaleTimeString()}</span>
            </div>
            <span>TOTAL_OPERATORS_ACTIVE: 1,428</span>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
