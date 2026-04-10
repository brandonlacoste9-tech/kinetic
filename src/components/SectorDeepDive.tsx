import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Target, Shield, BarChart3, Info, AlertTriangle } from 'lucide-react';
import { useStudios } from '../hooks/useStudios';
import { useLanguage } from '../contexts/LanguageContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { KineticBolt, KineticZap, KineticCrosshair } from './KineticIcons';

interface SectorDeepDiveProps {
  neighborhoodName: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

export default function SectorDeepDive({ neighborhoodName, isOpen, onClose, onOpenLeaderboard }: SectorDeepDiveProps) {
  const { studios } = useStudios();
  const { t, locale } = useLanguage();
  const { isContested, entries } = useLeaderboard(neighborhoodName);

  const sectorStudios = useMemo(() => {
    return studios.filter(s => s.neighborhood?.name === neighborhoodName || s.city === neighborhoodName);
  }, [studios, neighborhoodName]);

  const stats = useMemo(() => {
    if (sectorStudios.length === 0) return null;
    
    const avgRating = sectorStudios.reduce((acc, s) => acc + (s.rating || 0), 0) / sectorStudios.length;
    const totalAmenities = sectorStudios.reduce((acc, s) => acc + (s.amenities?.length || 0), 0);
    const intensityScore = Math.min(100, 60 + (sectorStudios.length * 5) + (totalAmenities * 2));
    
    // Find "Top Dog" from leaderboard entries if available, otherwise fallback to studio rating
    const topDog = entries.length > 0 ? entries[0].operatorName : "NONE";

    return {
      avgRating: avgRating.toFixed(1),
      intensityScore,
      studioCount: sectorStudios.length,
      topDog,
      sovereignty: isContested ? "CONTESTED" : (intensityScore > 85 ? "HIGH" : intensityScore > 70 ? "STABLE" : "LOW")
    };
  }, [sectorStudios, isContested, entries]);

  const localizeNeighborhood = (name: string) => {
    if (locale !== 'joual') return name;
    const mapping: Record<string, string> = {
      'Plateau': "L'Plateau",
      'Le Plateau-Mont-Royal': "L'Plateau",
      'Hochelaga-Maisonneuve': 'Hochelaga',
      'Ville-Marie': 'Centre-Ville',
    };
    return mapping[name] || name;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-on-surface z-[160] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto no-scrollbar border-l-2 border-primary/20"
          >
            {/* Header */}
            <div className="relative h-64 bg-surface overflow-hidden flex items-end p-8">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(172,44,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(172,44,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 bg-on-surface text-surface p-3 rounded-xl hover:bg-primary hover:text-on-primary transition-colors z-20"
              >
                <X size={24} />
              </button>
              
              <div className="relative z-10">
                <span className="font-mono text-[10px] font-bold text-primary tracking-[0.3em] uppercase mb-2 block">
                  SECTOR_SPEC_SHEET // v1.0
                </span>
                <h2 className="font-headline text-5xl md:text-6xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
                  {localizeNeighborhood(neighborhoodName)}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-12">
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatBlock 
                  label="INTENSITY" 
                  value={`${stats?.intensityScore || 0}%`} 
                  icon={<KineticZap size={20} className="text-primary" />}
                  subValue={stats?.sovereignty || "UNKNOWN"}
                  subLabel="SOVEREIGNTY"
                  isAlert={stats?.sovereignty === "CONTESTED"}
                />
                <StatBlock 
                  label="STATIONS" 
                  value={stats?.studioCount || 0} 
                  icon={<Target size={20} className="text-primary" />}
                  subValue={stats?.avgRating || "0.0"}
                  subLabel="AVG_RATING"
                />
              </div>

              {/* Vibe Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-2">
                  <Info size={18} className="text-primary" />
                  <h3 className="font-headline text-xs font-black tracking-widest text-on-surface uppercase">
                    {locale === 'joual' ? "L'VIBE DU COIN" : "SECTOR VIBE"}
                  </h3>
                </div>
                <p className="font-body text-lg text-secondary leading-relaxed italic">
                  {locale === 'joual' 
                    ? "C'est icitte que le gros fer se fait brasser. Un quartier de crinqués où la sueur pis la détermination font la loi. Pas de flafla, juste de l'intensité pure."
                    : "This sector is defined by raw determination and industrial grit. A high concentration of elite boxes makes it a primary target for high-performance training."}
                </p>
              </div>

              {/* Top Dog Section */}
              <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-headline text-[10px] font-black tracking-widest text-primary uppercase">TOP DOG // ALPHA STATION</label>
                  <Shield size={16} className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline text-2xl font-black italic text-on-surface uppercase">{stats?.topDog || "NONE"}</h4>
                  <p className="font-mono text-[10px] text-secondary uppercase tracking-widest">HOLDING SECTOR DOMINANCE</p>
                </div>
                <button 
                  onClick={onOpenLeaderboard}
                  className="w-full mt-4 bg-on-surface text-surface font-headline font-black text-xs py-3 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                >
                  {locale === 'joual' ? "VOIR LE CLASSEMENT" : "VIEW SECTOR RANKINGS"}
                </button>
              </div>

              {/* Equipment Density Chart (Simulated) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-2">
                  <BarChart3 size={18} className="text-primary" />
                  <h3 className="font-headline text-xs font-black tracking-widest text-on-surface uppercase">EQUIPMENT_DENSITY</h3>
                </div>
                <div className="space-y-4">
                  <DensityBar label="IRON / FREE WEIGHTS" percentage={85} />
                  <DensityBar label="HIIT / TACTICAL" percentage={70} />
                  <DensityBar label="RECOVERY / CRYO" percentage={45} />
                  <DensityBar label="COMBAT / BOXING" percentage={60} />
                </div>
              </div>

              {/* Footer Coordinates */}
              <div className="pt-8 border-t border-primary/10 flex justify-between font-mono text-[9px] text-secondary font-bold uppercase">
                <span>SECTOR_ID: {neighborhoodName.toUpperCase().replace(/\s/g, '_')}</span>
                <span>COORD_REF: 45.5017N / 73.5673W</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatBlock({ label, value, icon, subValue, subLabel, isAlert }: { 
  label: string, 
  value: string | number, 
  icon: React.ReactNode,
  subValue: string,
  subLabel: string,
  isAlert?: boolean
}) {
  return (
    <div className={`p-6 rounded-2xl space-y-4 transition-all ${isAlert ? 'bg-primary/10 border-2 border-primary animate-pulse' : 'bg-surface-container-low'}`}>
      <div className="flex justify-between items-start">
        <label className={`font-headline text-[10px] font-black tracking-widest uppercase ${isAlert ? 'text-primary' : 'text-secondary'}`}>{label}</label>
        {isAlert ? <AlertTriangle size={20} className="text-primary" /> : icon}
      </div>
      <div className="space-y-1">
        <div className={`text-4xl font-black italic ${isAlert ? 'text-primary' : 'text-on-surface'}`}>{value}</div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isAlert ? 'text-primary' : 'text-primary'}`}>{subLabel}:</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isAlert ? 'text-primary' : 'text-on-surface'}`}>{subValue}</span>
        </div>
      </div>
    </div>
  );
}

function DensityBar({ label, percentage }: { label: string, percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between font-mono text-[9px] font-bold text-secondary uppercase tracking-widest">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full kinetic-gradient"
        />
      </div>
    </div>
  );
}
