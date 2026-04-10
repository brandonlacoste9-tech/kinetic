import { motion } from "motion/react";
import { MapPin, ArrowRight, Crosshair } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Hero({ onNearbySearch, isSearchingNearby }: { onNearbySearch?: () => void, isSearchingNearby?: boolean }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center px-6 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover grayscale opacity-20" 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070" 
          alt="Gym Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-headline text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-on-surface mb-6"
          dangerouslySetInnerHTML={{ __html: t.hero.title }}
        />
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-xl md:text-2xl text-secondary max-w-xl mb-10 leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative max-w-2xl group"
        >
          <div className="absolute -inset-1 kinetic-gradient rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-surface-container-high rounded-full px-6 py-4 shadow-xl">
            <MapPin className="text-on-surface-variant mr-4 w-5 h-5" />
            <input 
              className="bg-transparent border-none focus:outline-none w-full text-on-surface font-medium placeholder:text-on-surface-variant" 
              placeholder={t.hero.searchPlaceholder}
              type="text" 
            />
            <button 
              onClick={onNearbySearch}
              className={`mr-2 p-2 rounded-full transition-colors ${isSearchingNearby ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-highest text-on-surface-variant'}`}
              title="Search near me"
            >
              <Crosshair className={`w-5 h-5 ${isSearchingNearby ? 'animate-pulse' : ''}`} />
            </button>
            <button className="kinetic-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full flex items-center gap-2 transform transition hover:scale-105 active:scale-95 whitespace-nowrap uppercase">
              {t.hero.searchBtn}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
