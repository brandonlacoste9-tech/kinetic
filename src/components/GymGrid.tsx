import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
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
import { useStudios } from "../hooks/useStudios";
import { type Studio } from "../lib/supabase";

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

export default function GymGrid({ searchOptions, onSelectStudio, onSelectSector }: { 
  searchOptions: { featuredOnly?: boolean; nearby?: { lat: number; lng: number; radius: number } },
  onSelectStudio: (studio: Studio) => void,
  onSelectSector?: (sector: string) => void
}) {
  const { studios, loading, error } = useStudios(searchOptions);
  const { t, locale } = useLanguage();

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (error || studios.length === 0) {
    // Fallback to static data if Supabase is not configured or empty
    return <StaticGymGrid />;
  }

  return (
    <section className="py-24 px-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface uppercase">{t.grid.title}</h2>
          <p className="text-secondary font-medium max-w-md mt-4">{t.grid.subtitle}</p>
        </div>
        <a className="font-headline font-bold text-primary underline underline-offset-8 decoration-2 hover:text-primary-container transition-colors" href="#">{t.grid.viewAll}</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {studios.map((studio, index) => {
          const isLarge = index % 4 === 0;
          const isVertical = index % 4 === 1;
          const isSquare = index % 4 === 2;
          const isHorizontal = index % 4 === 3;

          const colSpan = isLarge ? "md:col-span-7" : isVertical ? "md:col-span-5" : isSquare ? "md:col-span-4" : "md:col-span-8";
          const height = isVertical ? "h-[500px]" : (isSquare || isHorizontal) ? "h-[400px]" : "h-full";

          return (
            <div key={studio.id} className={`${colSpan} group`}>
              <motion.div 
                layoutId={`card-${studio.id}`}
                onClick={() => onSelectStudio(studio)}
                whileHover={{ y: -8 }}
                className={`relative ${height} rounded-xl overflow-hidden bg-surface-container-lowest transition-all shadow-sm hover:shadow-xl cursor-pointer ${isHorizontal ? 'flex flex-col md:flex-row' : ''}`}
              >
                {/* Image Handling */}
                <div className={`${isHorizontal ? 'w-full md:w-1/2 h-full' : 'w-full h-2/3'} overflow-hidden relative`}>
                  {/* Distance Readout */}
                  {studio.dist_meters !== undefined && (
                    <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary px-3 py-1 rounded-md font-mono text-[10px] font-bold tracking-tighter shadow-2xl flex items-center gap-2">
                      <KineticCrosshair size={12} className="animate-pulse" />
                      {(studio.dist_meters / 1000).toFixed(1)} {t.grid.away}
                    </div>
                  )}
                  <motion.img 
                    layoutId={`image-${studio.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={studio.image_url || "https://picsum.photos/seed/gym/800/600"} 
                    alt={studio.name}
                    referrerPolicy="no-referrer"
                  />
                  {isVertical && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>}
                </div>

                {/* Content Handling */}
                <div className={`${isHorizontal ? 'w-full md:w-1/2 h-full p-8 flex flex-col justify-center' : 'p-8'} ${isVertical ? 'absolute bottom-0 left-0 text-white' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectSector) onSelectSector(studio.neighborhood?.name || studio.city);
                        }}
                        className={`${isVertical ? 'bg-primary/80 backdrop-blur-sm text-white' : 'bg-surface-container-high text-on-surface-variant'} px-3 py-1 rounded-md text-[10px] font-bold tracking-widest font-headline uppercase cursor-pointer hover:bg-primary hover:text-on-primary transition-colors`}
                      >
                        {studio.neighborhood?.name || studio.city}, {studio.province}
                      </span>
                      <motion.h3 
                        layoutId={`name-${studio.id}`}
                        className={`font-headline ${isLarge || isVertical ? 'text-3xl' : 'text-2xl'} font-black mt-2 uppercase`}
                      >
                        {studio.name}
                      </motion.h3>
                      {studio.translations?.find(tr => tr.locale === locale)?.tagline && (
                        <p className={`mt-2 ${isVertical ? 'text-white/80' : 'text-secondary'} text-sm font-medium italic`}>
                          "{studio.translations.find(tr => tr.locale === locale)?.tagline}"
                        </p>
                      )}
                    </div>
                    {!isVertical && studio.rating && (
                      <div className="bg-primary-container text-on-primary-container w-12 h-12 flex items-center justify-center rounded-full font-bold italic shrink-0">
                        {studio.rating}
                      </div>
                    )}
                  </div>

                  <div className={`mt-6 flex flex-wrap gap-4 text-sm ${isVertical ? 'text-white/80' : 'text-secondary'} font-medium`}>
                    {studio.amenities?.map((a, i) => {
                      const Icon = ICON_MAP[a.amenity.icon_name] || KineticBolt;
                      return (
                        <span key={i} className="flex items-center gap-1">
                          <Icon size={14} /> {a.amenity.name}
                        </span>
                      );
                    })}
                    {!studio.amenities?.length && !isVertical && (
                      <>
                        <span className="flex items-center gap-1"><KineticBolt size={14} /> HIIT</span>
                        <span className="flex items-center gap-1"><KineticDumbbell size={14} /> WEIGHTS</span>
                      </>
                    )}
                  </div>

                  {isSquare && (
                    <button className="mt-6 w-full border border-outline-variant/30 py-3 rounded-full font-headline font-bold text-sm hover:bg-surface-container-low transition-colors uppercase">
                      {t.grid.viewStudio}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StaticGymGrid() {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface uppercase">{t.grid.title}</h2>
          <p className="text-secondary font-medium max-w-md mt-4">{t.grid.subtitle}</p>
        </div>
        <a className="font-headline font-bold text-primary underline underline-offset-8 decoration-2 hover:text-primary-container transition-colors" href="#">{t.grid.viewAll}</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Large Feature: Toronto */}
        <div className="md:col-span-7 group">
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative h-full rounded-xl overflow-hidden bg-surface-container-lowest transition-all shadow-sm hover:shadow-xl"
          >
            <img 
              className="w-full h-2/3 object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2070" 
              alt="Metro Strength Lab"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary px-3 py-1 rounded-md font-mono text-[10px] font-bold tracking-tighter shadow-2xl flex items-center gap-2">
              <KineticCrosshair size={12} className="animate-pulse" />
              1.2 {t.grid.away}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-md text-[10px] font-bold tracking-widest font-headline uppercase">TORONTO, ON</span>
                  <h3 className="font-headline text-3xl font-black mt-2">METRO STRENGTH LAB</h3>
                </div>
                <div className="bg-primary-container text-on-primary-container w-12 h-12 flex items-center justify-center rounded-full font-bold italic">4.9</div>
              </div>
              <div className="mt-6 flex gap-4 text-sm text-secondary font-medium">
                <span className="flex items-center gap-1"><KineticBolt size={14} /> HIIT</span>
                <span className="flex items-center gap-1"><KineticDumbbell size={14} /> WEIGHTS</span>
                <span className="flex items-center gap-1"><KineticWind size={14} /> RECOVERY</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vertical Feature: Vancouver */}
        <div className="md:col-span-5 group">
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative h-[500px] rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl"
          >
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=2070" 
              alt="Zenith Flow Studio"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary px-3 py-1 rounded-md font-mono text-[10px] font-bold tracking-tighter shadow-2xl flex items-center gap-2">
              <KineticCrosshair size={12} className="animate-pulse" />
              2.4 {t.grid.away}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <span className="bg-primary/80 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] font-bold tracking-widest font-headline uppercase">VANCOUVER, BC</span>
              <h3 className="font-headline text-3xl font-black mt-2">ZENITH FLOW STUDIO</h3>
              <p className="mt-2 text-white/80 text-sm font-medium">Elevated yoga and movement with panoramic Pacific views.</p>
            </div>
          </motion.div>
        </div>

        {/* Square Feature: Montreal */}
        <div className="md:col-span-4 group">
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative h-[400px] rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl"
          >
            <img 
              className="w-full h-1/2 object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070" 
              alt="L'Usine CrossFit"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary px-3 py-1 rounded-md font-mono text-[10px] font-bold tracking-tighter shadow-2xl flex items-center gap-2">
              <KineticCrosshair size={12} className="animate-pulse" />
              0.8 {t.grid.away}
            </div>
            <div className="p-8">
              <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-md text-[10px] font-bold tracking-widest font-headline uppercase">MONTREAL, QC</span>
              <h3 className="font-headline text-2xl font-black mt-2 uppercase">L'Usine CrossFit</h3>
              <button className="mt-6 w-full border border-outline-variant/30 py-3 rounded-full font-headline font-bold text-sm hover:bg-surface-container-low transition-colors">VIEW STUDIO</button>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Feature: Calgary */}
        <div className="md:col-span-8 group">
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative h-[400px] rounded-xl overflow-hidden bg-surface-container-lowest flex flex-col md:flex-row shadow-sm hover:shadow-xl"
          >
            <div className="w-full md:w-1/2 h-full p-8 flex flex-col justify-center">
              <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-md text-[10px] font-bold tracking-widest font-headline uppercase">CALGARY, AB</span>
              <h3 className="font-headline text-3xl font-black mt-2 leading-tight">SUMMIT ATHLETIC<br />CLUB</h3>
              <p className="mt-4 text-secondary text-sm">Where the Rockies meet high-performance training technology.</p>
              <div className="mt-8">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold font-headline">OPEN 24/7</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-full overflow-hidden relative">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=2069" 
                alt="Summit Athletic Club"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 z-20 bg-primary text-on-primary px-3 py-1 rounded-md font-mono text-[10px] font-bold tracking-tighter shadow-2xl flex items-center gap-2">
                <KineticCrosshair size={12} className="animate-pulse" />
                3.1 {t.grid.away}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
