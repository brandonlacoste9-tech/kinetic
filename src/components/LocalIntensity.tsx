import { motion } from "motion/react";
import { Map as MapIcon, ShieldCheck, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LocalIntensity({ onSelectSector }: { onSelectSector?: (sector: string) => void }) {
  const { t } = useLanguage();

  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-12 -left-12 w-64 h-64 kinetic-gradient opacity-10 rounded-full blur-3xl"></div>
          <h2 
            className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter text-on-surface mb-8 uppercase"
            dangerouslySetInnerHTML={{ __html: t.localIntensity.title }}
          />
          <p className="font-body text-xl text-secondary leading-relaxed mb-12">
            {t.localIntensity.subtitle}
          </p>
          
          <div className="space-y-6">
            <FeatureItem 
              icon={<MapIcon className="text-primary w-8 h-8" />}
              title={t.localIntensity.searchTitle}
              desc={t.localIntensity.searchDesc}
              borderColor="border-primary"
            />
            <FeatureItem 
              icon={<ShieldCheck className="text-secondary w-8 h-8" />}
              title={t.localIntensity.verifiedTitle}
              desc={t.localIntensity.verifiedDesc}
              borderColor="border-secondary"
            />
          </div>
        </div>

        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=2070" 
            alt="City Map Visual"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-full animate-pulse opacity-50"></div>
              <div className="absolute inset-0 w-8 h-8 bg-primary rounded-full m-2 border-4 border-surface shadow-lg"></div>
            </div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            onClick={() => onSelectSector && onSelectSector("Griffintown")}
            className="absolute bottom-10 left-10 right-10 glass-nav bg-white/20 p-6 rounded-2xl border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-bold font-headline tracking-widest uppercase">{t.localIntensity.activeNearYou}</p>
                <h4 className="text-white text-2xl font-bold font-headline mt-1">GRIFFINTOWN, MTL</h4>
              </div>
              <ArrowUpRight className="text-white w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, desc, borderColor }: { icon: ReactNode, title: string, desc: string, borderColor: string }) {
  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className={`bg-surface-container-lowest p-6 rounded-xl flex gap-6 items-center border-l-4 ${borderColor} shadow-sm`}
    >
      <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-headline font-bold text-lg">{title}</h4>
        <p className="text-sm text-secondary">{desc}</p>
      </div>
    </motion.div>
  );
}
