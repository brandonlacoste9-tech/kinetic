import { Home, Search, Map as MapIcon, User } from "lucide-react";
import { motion } from "motion/react";
import { ReactNode } from "react";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-lg rounded-t-3xl shadow-[0px_-12px_32px_rgba(78,33,33,0.08)] border-t border-outline-variant/15">
      <NavItem icon={<Home size={20} />} label="HOME" active />
      <NavItem icon={<Search size={20} />} label="SEARCH" />
      <NavItem icon={<MapIcon size={20} />} label="MAP" />
      <NavItem icon={<User size={20} />} label="PROFILE" />
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center justify-center px-5 py-1.5 rounded-xl transition-all cursor-pointer ${
        active ? "bg-primary-container text-on-primary-container" : "text-on-surface"
      }`}
    >
      {icon}
      <span className="font-headline text-[10px] font-bold tracking-widest uppercase mt-1">{label}</span>
    </motion.div>
  );
}
