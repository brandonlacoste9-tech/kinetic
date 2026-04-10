import { motion, AnimatePresence } from "motion/react";
import React, { ReactNode, useState } from "react";
import { X, MapPin, ArrowRight, ExternalLink, Terminal } from "lucide-react";
import { 
  KineticBolt, 
  KineticDumbbell, 
  KineticWind, 
  KineticWaves, 
  KineticFlame, 
  KineticZap,
  KineticCrosshair,
  KineticScissors,
  KineticSun,
  KineticLeaf
} from "./KineticIcons";
import { type Studio } from "../lib/supabase";
import IntelScanner from "./IntelScanner";
import BookingFlow from "./BookingFlow";
import { KineticIntel } from "../lib/gemini";

interface StudioDetailProps {
  studio: Studio;
  onClose: () => void;
  onSelectSector?: (sector: string) => void;
}

import { useLanguage } from "../contexts/LanguageContext";

const ICON_MAP: Record<string, any> = {
  'bolt': KineticBolt,
  'dumbbell': KineticDumbbell,
  'wind': KineticWind,
  'waves': KineticWaves,
  'flame': KineticFlame,
  'zap': KineticZap,
  'scissors': KineticScissors,
  'sun': KineticSun,
  'leaf': KineticLeaf,
};

export default function StudioDetail({ studio, onClose, onSelectSector }: StudioDetailProps) {
  const { t } = useLanguage();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [enrichedIntel, setEnrichedIntel] = useState<KineticIntel | null>(null);

  const handleIntelComplete = (intel: KineticIntel) => {
    setEnrichedIntel(intel);
    setIsScannerOpen(false);
  };

  const displayManifesto = enrichedIntel?.manifesto || studio.description || "This space is built for those who refuse to settle. We provide the iron, the atmosphere, and the community. You provide the intensity. No excuses, just results.";
  const displayJoualTagline = enrichedIntel?.joual_tagline || studio.translations?.find(t => t.locale === 'joual')?.tagline || "C'est icitte que ça s'passe.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-on-surface overflow-y-auto no-scrollbar"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-[120] bg-surface text-on-surface p-4 rounded-2xl shadow-2xl hover:bg-primary hover:text-on-primary transition-colors"
      >
        <X size={32} />
      </button>

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.img
          layoutId={`image-${studio.id}`}
          src={studio.image_url || "https://picsum.photos/seed/gym/1920/1080"}
          className="w-full h-full object-cover grayscale brightness-50"
          alt={studio.name}
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl"
          >
            <span 
              onClick={() => onSelectSector && onSelectSector(studio.neighborhood?.name || studio.city)}
              className="bg-primary text-on-primary px-4 py-2 rounded-md text-xs font-bold tracking-[0.3em] font-headline uppercase mb-6 inline-block cursor-pointer hover:bg-on-primary hover:text-primary transition-colors"
            >
              {studio.neighborhood?.name || studio.city}, {studio.province}
            </span>
            <motion.h1 
              layoutId={`name-${studio.id}`}
              className="font-headline text-7xl md:text-[12rem] font-black italic tracking-tighter text-surface leading-[0.8] uppercase mb-8"
            >
              {studio.name}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Manifesto Content */}
      <section className="bg-surface min-h-screen p-8 md:p-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Taglines & Description */}
          <div className="lg:col-span-8 space-y-24">
            
              {/* Tri-lingual Taglines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TaglineBlock 
                  label="ENGLISH" 
                  text={studio.translations?.find(t => t.locale === 'en')?.tagline || "Elite performance culture."} 
                />
                <TaglineBlock 
                  label="FRANÇAIS" 
                  text={studio.translations?.find(t => t.locale === 'fr')?.tagline || "L'excellence en mouvement."} 
                />
                <TaglineBlock 
                  label="JOUAL" 
                  highlight
                  text={displayJoualTagline} 
                />
              </div>

              {/* Main Description */}
              <div className="space-y-8">
                <h2 className="font-headline text-4xl font-black italic tracking-tighter text-on-surface uppercase">{t.detail.manifesto}</h2>
                <p className="font-body text-2xl md:text-3xl text-secondary leading-relaxed max-w-4xl">
                  {displayManifesto}
                </p>
              </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {studio.amenities?.map((a, i) => {
                const Icon = ICON_MAP[a.amenity.icon_name] || KineticBolt;
                return (
                  <AmenityCard key={i} icon={<Icon />} label={a.amenity.name} />
                );
              })}
              {!studio.amenities?.length && (
                <>
                  <AmenityCard icon={<KineticBolt />} label="HIIT" />
                  <AmenityCard icon={<KineticDumbbell />} label="WEIGHTS" />
                  <AmenityCard icon={<KineticWind />} label="RECOVERY" />
                  <AmenityCard icon={<KineticBolt />} label="BOXING" />
                </>
              )}
            </div>
          </div>

          {/* Right Column: CTA & Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-low p-8 rounded-3xl space-y-8 sticky top-32">
              <div className="space-y-2">
                <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant uppercase">{t.detail.location}</label>
                <p className="font-body text-xl font-bold text-on-surface flex items-start gap-2">
                  <MapPin className="shrink-0 mt-1 text-primary" size={20} />
                  {studio.address}<br />
                  {studio.city}, {studio.province}
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant uppercase">{t.detail.rating}</label>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black italic text-primary">{studio.rating || "5.0"}</span>
                  <span 
                    className="text-sm font-bold text-secondary uppercase tracking-widest leading-tight"
                    dangerouslySetInnerHTML={{ __html: t.detail.status.split(' ').join('<br />') }}
                  />
                </div>
              </div>

              {studio.dist_meters !== undefined && (
                <div className="space-y-2">
                  <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant uppercase">PROXIMITY</label>
                  <div className="flex items-center gap-2 text-primary font-mono font-bold">
                    <KineticCrosshair size={18} className="animate-pulse" />
                    <span className="text-2xl">{(studio.dist_meters / 1000).toFixed(2)}</span>
                    <span className="text-xs uppercase tracking-widest">{t.grid.away}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-8">
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full bg-on-surface text-surface font-headline font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-primary hover:text-on-primary transition-all uppercase group"
                >
                  <Terminal size={24} className="group-hover:animate-pulse" />
                  SCAN FOR INTEL
                </button>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full kinetic-gradient text-on-primary font-headline font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-primary/40 transform transition hover:scale-[1.02] active:scale-[0.98] uppercase"
                >
                  {t.detail.book}
                  <ArrowRight size={24} />
                </button>
                <button className="w-full border-4 border-on-surface text-on-surface font-headline font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-on-surface hover:text-surface transition-colors uppercase">
                  {t.detail.website}
                  <ExternalLink size={24} />
                </button>
              </div>

              <AnimatePresence>
                {isScannerOpen && (
                  <IntelScanner 
                    url={studio.image_url ? "https://www.google.com/search?q=" + encodeURIComponent(studio.name + " gym montreal") : "https://www.google.com"} 
                    onComplete={handleIntelComplete}
                    onClose={() => setIsScannerOpen(false)}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isBookingOpen && (
                  <BookingFlow 
                    studio={studio}
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function TaglineBlock({ label, text, highlight = false }: { label: string, text: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border-l-4 ${highlight ? 'bg-primary/5 border-primary' : 'bg-surface-container-low border-outline-variant/30'}`}>
      <span className={`font-headline text-[10px] font-black tracking-widest uppercase mb-4 block ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}>
        {label}
      </span>
      <p className={`font-headline text-xl font-black italic leading-tight ${highlight ? 'text-primary' : 'text-on-surface'}`}>
        "{text}"
      </p>
    </div>
  );
}

function AmenityCard({ icon, label }: { icon: ReactNode, label: string; key?: React.Key }) {
  return (
    <div className="bg-surface-container-highest p-6 rounded-2xl flex flex-col items-center justify-center gap-3 text-on-surface hover:bg-primary hover:text-on-primary transition-all cursor-default border-b-4 border-r-4 border-black/10 active:border-0 active:translate-y-1 active:translate-x-1">
      <div className="opacity-50 group-hover:opacity-100">{icon}</div>
      <span className="font-headline text-[10px] font-black tracking-widest uppercase text-center">{label}</span>
    </div>
  );
}
