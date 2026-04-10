import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KineticCrosshair, KineticZap, KineticActivity, KineticShieldAlert } from './KineticIcons';
import { scrapeGymInfo } from '../lib/firecrawl';
import { processGymIntel, KineticIntel } from '../lib/gemini';
import { Loader2, Terminal, ChevronRight, CheckCircle2 } from 'lucide-react';

interface IntelScannerProps {
  url: string;
  onComplete: (intel: KineticIntel) => void;
  onClose: () => void;
}

export default function IntelScanner({ url, onComplete, onClose }: IntelScannerProps) {
  const [status, setStatus] = useState<'idle' | 'scraping' | 'processing' | 'complete' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [intel, setIntel] = useState<KineticIntel | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const runScan = async () => {
    setStatus('scraping');
    addLog(`INITIATING SCAN: ${url}`);
    addLog("CONNECTING TO FIRECRAWL EDGE NODES...");

    const scraped = await scrapeGymInfo(url);
    if (!scraped || !scraped.manifesto_raw) {
      setStatus('error');
      addLog("ERROR: DATA INGESTION FAILED. TARGET UNREACHABLE.");
      return;
    }

    addLog("INGESTION SUCCESSFUL. RAW DATA BUFFERED.");
    addLog("INITIATING KINETIC NEURAL PROCESSING...");
    setStatus('processing');

    const processed = await processGymIntel(scraped.manifesto_raw);
    if (!processed) {
      setStatus('error');
      addLog("ERROR: NEURAL MAPPING FAILED. VOID DETECTED.");
      return;
    }

    setIntel(processed);
    setStatus('complete');
    addLog("SCAN COMPLETE. KINETIC INTEL SECURED.");
    addLog(`INTENSITY SCORE: ${processed.intensity_score}%`);
  };

  useEffect(() => {
    runScan();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="w-full max-w-2xl bg-on-surface border-2 border-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(172,44,0,0.2)]">
        {/* Header */}
        <div className="bg-primary p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <KineticCrosshair size={24} className="text-on-primary animate-spin" />
            <h2 className="font-headline text-2xl font-black italic tracking-tighter text-on-primary uppercase">
              INTEL SCANNER v1.0
            </h2>
          </div>
          <div className="font-mono text-[10px] font-bold text-on-primary/60 tracking-widest">
            STATUS: {status.toUpperCase()}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-8 space-y-6">
          <div className="bg-black rounded-xl p-6 h-64 overflow-y-auto font-mono text-xs text-primary space-y-2 no-scrollbar border border-primary/10">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex gap-2"
              >
                <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
            {status !== 'complete' && status !== 'error' && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="w-2 h-4 bg-primary" />
                <span>PROCESSING...</span>
              </div>
            )}
          </div>

          {/* Results Preview */}
          <AnimatePresence>
            {intel && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-6 border-t border-primary/10 pt-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-primary">
                    <label className="font-headline text-[10px] font-black tracking-widest text-primary uppercase block mb-2">JOUAL TAGLINE</label>
                    <p className="font-headline text-lg font-black italic text-on-surface">"{intel.joual_tagline}"</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-primary">
                    <label className="font-headline text-[10px] font-black tracking-widest text-primary uppercase block mb-2">INTENSITY</label>
                    <div className="flex items-center gap-2">
                      <KineticZap size={18} className="text-primary" />
                      <span className="text-3xl font-black italic text-on-surface">{intel.intensity_score}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl">
                  <label className="font-headline text-[10px] font-black tracking-widest text-primary uppercase block mb-2">MANIFESTO PREVIEW</label>
                  <p className="text-sm font-medium text-secondary italic leading-relaxed">
                    {intel.manifesto}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => onComplete(intel)}
                    className="flex-1 kinetic-gradient text-on-primary font-headline font-black py-4 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest hover:scale-[1.02] transition-transform"
                  >
                    <CheckCircle2 size={20} />
                    APPLY INTEL
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 border-2 border-primary/30 text-primary font-headline font-black py-4 rounded-xl uppercase tracking-widest hover:bg-primary/5 transition-colors"
                  >
                    ABORT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'error' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center space-y-4"
            >
              <KineticShieldAlert size={48} className="text-red-500 mx-auto" />
              <p className="font-headline font-black text-red-500 uppercase tracking-widest">CRITICAL SYSTEM FAILURE</p>
              <button 
                onClick={onClose}
                className="bg-red-500 text-white font-headline font-black px-8 py-3 rounded-xl uppercase tracking-widest"
              >
                CLOSE TERMINAL
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
