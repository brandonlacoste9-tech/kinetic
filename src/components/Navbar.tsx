import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { KineticCrosshair } from "./KineticIcons";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function Navbar({ onOpenRadar, onOpenDashboard }: { onOpenRadar?: () => void, onOpenDashboard?: () => void }) {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <nav className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Menu className="text-primary cursor-pointer w-6 h-6" />
          <span className="text-2xl font-black italic tracking-tighter text-primary font-headline">
            KINETIC
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={onOpenRadar}
            className="flex items-center gap-2 font-headline text-[10px] font-black tracking-[0.2em] text-primary hover:text-primary/80 transition-colors group"
          >
            <KineticCrosshair size={14} className="group-hover:animate-spin" />
            {t.radar.toggle}
          </button>
          <a className="font-headline text-[10px] font-black tracking-[0.2em] text-primary hover:text-primary/80 transition-colors" href="#">{t.nav.studios}</a>
          <a className="font-headline text-[10px] font-black tracking-[0.2em] text-on-surface hover:text-primary transition-colors" href="#">{t.nav.neighborhoods}</a>
          <LanguageToggle />
        </div>

        <motion.div 
          onClick={onOpenDashboard}
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary-container cursor-pointer"
        >
          <img 
            alt="User Profile" 
            src="https://picsum.photos/seed/fitness-user/100/100" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </nav>
    </header>
  );
}
