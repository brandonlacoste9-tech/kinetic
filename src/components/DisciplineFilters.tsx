import { motion } from "motion/react";

const disciplines = ["ALL", "HIIT", "YOGA", "CROSSFIT", "BOXING", "BARBERSHOP", "TANNING", "WHOLEFOODS", "RECOVERY", "PILATES"];

export default function DisciplineFilters() {
  return (
    <section className="bg-surface-container-low py-12 px-6">
      <div className="max-w-screen-2xl mx-auto overflow-x-auto no-scrollbar flex items-center gap-4">
        <span className="font-headline text-xs font-bold tracking-widest text-primary mr-4 whitespace-nowrap">DISCIPLINES</span>
        {disciplines.map((discipline, i) => (
          <motion.button
            key={discipline}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-md font-headline text-sm font-bold transition-all ${
              discipline === "ALL" 
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                : "bg-secondary-container text-on-secondary-container hover:bg-primary/10"
            }`}
          >
            {discipline}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
