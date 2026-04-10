import { motion } from "motion/react";
import { useLanguage, Locale } from "../contexts/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  const locales: Locale[] = ['en', 'fr', 'joual'];

  return (
    <div className="flex bg-surface-container-high p-1 rounded-xl border-2 border-outline-variant/20">
      {locales.map((l) => (
        <motion.button
          key={l}
          onClick={() => setLocale(l)}
          className={`relative px-4 py-1 rounded-lg font-headline text-[10px] font-black tracking-widest transition-colors uppercase ${
            locale === l ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {locale === l && (
            <motion.div
              layoutId="active-locale"
              className="absolute inset-0 bg-primary rounded-lg z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{l}</span>
        </motion.button>
      ))}
    </div>
  );
}
