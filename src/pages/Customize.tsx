import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Customize() {
  return (
    <main className="w-full min-h-screen bg-charcoal relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=2000&auto=format&fit=crop" 
          alt="Customize Frame Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
      </div>

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-gold-light text-sm font-medium tracking-[0.3em] uppercase mb-6 block">
          Interactive Design Studio
        </span>
        <h1 className="text-white text-5xl md:text-7xl font-serif leading-tight mb-8">
          Customize Your <br className="hidden md:block"/>
          <span className="italic text-gray-400 font-light">Frame</span>
        </h1>
        
        <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          We are building an immersive experience that lets you upload your art, mix and match premium frames, test matting options, and see the final piece before it is handcrafted.
        </p>

        <div className="inline-flex flex-col items-center justify-center">
          <div className="w-16 h-[1px] bg-gold-light mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase opacity-90 drop-shadow-lg">
            Coming Soon
          </h2>
          <div className="w-16 h-[1px] bg-gold-light mt-8" />
        </div>

        <div className="mt-16">
          <Link 
            to="/" 
            className="inline-flex items-center text-gold-light font-medium uppercase tracking-[0.15em] text-xs pb-2 border-b border-gold-light/30 hover:border-gold-light transition-colors"
          >
            <span className="mr-3 transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
