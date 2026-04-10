import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CreditCard, ShieldCheck, Zap, ChevronRight, Terminal, QrCode } from 'lucide-react';
import { type Studio, getSupabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { KineticBolt, KineticZap, KineticCrosshair } from './KineticIcons';

interface BookingFlowProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

const SESSIONS = [
  { id: '1', time: '06:00', label: 'DAWN_STRIKE', availability: 4 },
  { id: '2', time: '08:30', label: 'PEAK_INTENSITY', availability: 2 },
  { id: '3', time: '12:00', label: 'MIDDAY_MANIFESTO', availability: 8 },
  { id: '4', time: '17:30', label: 'EVENING_GRIT', availability: 0 },
  { id: '5', time: '19:00', label: 'NIGHT_OPERATIONS', availability: 5 },
];

export default function BookingFlow({ studio, isOpen, onClose }: BookingFlowProps) {
  const { t, locale } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'deploying' | 'granted' | 'error'>('idle');
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!selectedSession) return;
    
    setStatus('deploying');
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const session = SESSIONS.find(s => s.id === selectedSession);

    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.from('bookings').insert({
          studio_id: studio.id,
          user_id: 'demo-user', // In a real app, this would be the auth user ID
          session_time: session?.time || '00:00',
          access_code: code,
          status: 'confirmed'
        });
        if (error) throw error;
      } else {
        // Fallback for demo if Supabase is not connected
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setAccessCode(code);
      setStatus('granted');
    } catch (err) {
      console.error('Booking error:', err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-4xl bg-on-surface border-2 border-primary/30 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(172,44,0,0.3)] flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[900px]">
        
        {/* Left: Tactical Info */}
        <div className="w-full md:w-1/2 bg-surface p-8 md:p-12 space-y-8 border-b-2 md:border-b-0 md:border-r-2 border-primary/10">
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold text-primary tracking-[0.3em] uppercase">OPERATION_BOOKING // v2.4</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
              {studio.name}
            </h2>
            <p className="font-mono text-xs text-secondary uppercase tracking-widest">
              {studio.neighborhood?.name || studio.city}, {studio.province}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-on-surface/5 p-4 rounded-xl border-l-4 border-primary">
              <KineticCrosshair size={24} className="text-primary" />
              <div>
                <label className="font-headline text-[10px] font-black tracking-widest text-secondary uppercase block">RESOURCE ALLOCATION</label>
                <div className="text-xl font-black italic text-on-surface uppercase">1 SESSION CREDIT</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-on-surface/5 p-4 rounded-xl border-l-4 border-primary">
              <ShieldCheck size={24} className="text-primary" />
              <div>
                <label className="font-headline text-[10px] font-black tracking-widest text-secondary uppercase block">SECURITY PROTOCOL</label>
                <div className="text-xl font-black italic text-on-surface uppercase">ENCRYPTED STRIKE</div>
              </div>
            </div>
          </div>

          <div className="pt-8 opacity-30 hidden md:block">
            <div className="font-mono text-[8px] leading-relaxed text-secondary uppercase">
              // DATA_STREAM_START<br />
              // AUTH_TOKEN: {Math.random().toString(16).substring(2, 10)}<br />
              // LATENCY: 14ms<br />
              // ENCRYPTION: AES-256-GCM<br />
              // STATUS: WAITING_FOR_DEPLOYMENT
            </div>
          </div>
        </div>

        {/* Right: Session Selection & Action */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'deploying' ? (
              <motion.div 
                key="selection"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="font-headline text-xs font-black tracking-widest text-primary uppercase border-b border-primary/10 pb-2">
                    SELECT_SESSION_WINDOW
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                    {SESSIONS.map((session) => (
                      <button
                        key={session.id}
                        disabled={session.availability === 0 || status === 'deploying'}
                        onClick={() => setSelectedSession(session.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                          selectedSession === session.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-primary/10 hover:border-primary/30'
                        } ${session.availability === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-headline font-black italic text-lg ${
                            selectedSession === session.id ? 'bg-primary text-on-primary' : 'bg-on-surface/10 text-secondary'
                          }`}>
                            {session.time}
                          </div>
                          <div className="text-left">
                            <div className="font-headline font-black text-sm tracking-widest uppercase text-on-surface">{session.label}</div>
                            <div className="font-mono text-[9px] text-secondary uppercase tracking-widest">
                              {session.availability} SLOTS REMAINING
                            </div>
                          </div>
                        </div>
                        {selectedSession === session.id && (
                          <motion.div layoutId="check" className="text-primary">
                            <Zap size={20} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    disabled={!selectedSession || status === 'deploying'}
                    onClick={handleDeploy}
                    className="w-full kinetic-gradient text-on-primary font-headline font-black text-2xl py-6 rounded-2xl flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(172,44,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 uppercase tracking-widest"
                  >
                    {status === 'deploying' ? (
                      <>
                        <Terminal className="animate-pulse" size={28} />
                        DEPLOYING...
                      </>
                    ) : (
                      <>
                        <Zap size={28} />
                        STRIKE NOW
                      </>
                    )}
                  </button>
                  <button 
                    onClick={onClose}
                    disabled={status === 'deploying'}
                    className="w-full text-secondary font-headline font-black text-xs uppercase tracking-[0.3em] hover:text-on-surface transition-colors"
                  >
                    ABORT_OPERATION
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="granted"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-8"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="bg-primary text-on-primary p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(172,44,0,0.5)]"
                >
                  <ShieldCheck size={80} strokeWidth={3} />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="font-headline text-5xl font-black italic tracking-tighter text-primary uppercase leading-none">
                    ACCESS_GRANTED
                  </h3>
                  <p className="font-mono text-xs text-secondary uppercase tracking-widest">SESSION_SECURED // READY_FOR_DEPLOYMENT</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-2xl relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <QrCode size={160} className="text-black relative z-10" />
                  <div className="mt-4 font-mono text-xl font-black tracking-[0.5em] text-black border-t-2 border-black/10 pt-4">
                    {accessCode}
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="bg-on-surface text-surface font-headline font-black px-12 py-4 rounded-2xl uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                >
                  DISMISS_INTEL
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
