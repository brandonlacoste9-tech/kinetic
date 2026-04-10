import { motion } from "motion/react";

export default function CTA() {
  return (
    <section className="py-24 px-6 max-w-screen-xl mx-auto text-center">
      <motion.h2 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="font-headline text-5xl md:text-8xl font-black italic tracking-tight text-on-surface leading-[0.8] mb-8"
      >
        OWN A STUDIO?
      </motion.h2>
      <p className="font-body text-xl text-secondary mb-12 max-w-2xl mx-auto">
        Put your space in front of Canada's most dedicated athletes. Join the Kinetic network today.
      </p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="kinetic-gradient text-on-primary font-headline font-extrabold text-lg px-12 py-5 rounded-full shadow-2xl shadow-primary/40"
      >
        LIST YOUR GYM
      </motion.button>
    </section>
  );
}
