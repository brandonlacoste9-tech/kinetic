import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Zap, Activity, ShieldAlert } from "lucide-react";

interface TickerItem {
  id: string;
  text: string;
  type: 'new' | 'manifesto' | 'alert';
}

export default function LiveIntensityFeed() {
  const { t, locale } = useLanguage();
  const [items, setItems] = useState<TickerItem[]>([
    { id: '1', text: "KINETIC BRUTALISM v1.0.4 DEPLOYED", type: 'alert' },
    { id: '2', text: "PLATEAU SECTOR: HIGH ACTIVITY", type: 'new' },
    { id: '3', text: "GRIFFINTOWN: NEW BOX LISTED", type: 'manifesto' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sectors = ['PLATEAU', 'GRIFFINTOWN', 'HOCHELAGA', 'MILE END', 'CENTRE-VILLE'];
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const text = locale === 'joual' 
        ? `NOUVEAU ROI DU FER DANS ${sector}` 
        : `NEW KING OF IRON IN ${sector} SECTOR`;
      
      const newItem: TickerItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: text.toUpperCase(),
        type: 'alert'
      };
      setItems(prev => [newItem, ...prev.slice(0, 5)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [locale]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Listen for new studios
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'studios',
        },
        (payload) => {
          const newStudio = payload.new as any;
          const newItem: TickerItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: `${t.ticker.newStudio}: ${newStudio.name.toUpperCase()}`,
            type: 'new'
          };
          setItems(prev => [newItem, ...prev.slice(0, 10)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [t]);

  return (
    <div className="fixed bottom-0 w-full z-[100] bg-on-surface border-t border-primary/20 overflow-hidden h-12 flex items-center">
      {/* Live Indicator */}
      <div className="shrink-0 h-full bg-primary px-4 flex items-center gap-2 z-10 shadow-[8px_0_16px_rgba(0,0,0,0.5)]">
        <div className="w-2 h-2 bg-on-primary rounded-full animate-pulse" />
        <span className="font-headline text-[10px] font-black tracking-[0.2em] text-on-primary whitespace-nowrap">
          {t.ticker.live}
        </span>
      </div>

      {/* Scrolling Content */}
      <div className="flex-1 relative overflow-hidden h-full flex items-center">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-12 whitespace-nowrap px-12"
        >
          {/* Double the items for seamless loop */}
          {[...items, ...items].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-4">
              <span className="text-primary opacity-50">
                {item.type === 'new' ? <Zap size={14} /> : item.type === 'alert' ? <ShieldAlert size={14} /> : <Activity size={14} />}
              </span>
              <span className="font-mono text-[11px] font-bold text-surface tracking-widest uppercase">
                {item.text}
              </span>
              <span className="text-primary/20 font-black">//</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Timestamp */}
      <div className="shrink-0 h-full bg-on-surface px-6 flex items-center border-l border-primary/10 hidden md:flex">
        <span className="font-mono text-[10px] font-bold text-primary/60">
          {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })} UTC
        </span>
      </div>
    </div>
  );
}
