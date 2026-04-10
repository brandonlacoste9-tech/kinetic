import { motion } from "motion/react";
import { useAmenities } from "../hooks/useStudios";
import { useLanguage } from "../contexts/LanguageContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { 
  KineticBolt, 
  KineticDumbbell, 
  KineticWind, 
  KineticWaves, 
  KineticFlame, 
  KineticZap 
} from "./KineticIcons";
import { useRef } from "react";

interface AmenityFilterProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
  'bolt': KineticBolt,
  'dumbbell': KineticDumbbell,
  'wind': KineticWind,
  'waves': KineticWaves,
  'flame': KineticFlame,
  'zap': KineticZap,
};

export default function AmenityFilter({ selectedIds, onToggle }: AmenityFilterProps) {
  const { amenities, loading } = useAmenities();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (loading || amenities.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-on-surface py-4 border-y border-outline-variant/10 sticky top-20 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center gap-6">
        <div className="shrink-0 flex items-center gap-3 border-r border-outline-variant/20 pr-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-headline text-[10px] font-black tracking-[0.2em] text-surface uppercase">
            {t.grid.filters}
          </span>
        </div>

        <div className="relative flex-1 flex items-center overflow-hidden">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 z-10 bg-gradient-to-r from-on-surface to-transparent p-2 text-surface hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-8 scroll-smooth"
          >
            <button
              onClick={() => selectedIds.forEach(id => onToggle(id))}
              className={`shrink-0 px-6 py-2 rounded-full font-headline text-xs font-bold tracking-widest transition-all border-2 ${
                selectedIds.length === 0 
                  ? 'bg-primary border-primary text-on-primary' 
                  : 'bg-transparent border-outline-variant/30 text-surface/60 hover:border-surface/40'
              }`}
            >
              {t.grid.allGear}
            </button>

            {amenities.map((amenity) => {
              const isSelected = selectedIds.includes(amenity.id);
              const Icon = ICON_MAP[amenity.icon_name] || KineticBolt;

              return (
                <motion.button
                  key={amenity.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggle(amenity.id)}
                  className={`shrink-0 flex items-center gap-2 px-6 py-2 rounded-full font-headline text-xs font-bold tracking-widest transition-all border-2 ${
                    isSelected 
                      ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20' 
                      : 'bg-transparent border-outline-variant/30 text-surface/60 hover:border-surface/40 hover:text-surface'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-on-primary' : 'text-primary'} />
                  {amenity.name.toUpperCase()}
                </motion.button>
              );
            })}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 z-10 bg-gradient-to-l from-on-surface to-transparent p-2 text-surface hover:text-primary transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
