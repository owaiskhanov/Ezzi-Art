import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ShieldCheck, Star, BugOff, Palette, Droplets, HeartHandshake } from "lucide-react";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(heroScroll, [0, 1], [1, 0]);

  return (
    <main className="w-full bg-offwhite">
      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-charcoal flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2000&auto=format&fit=crop" 
              alt="Beautifully framed image in elegant interior" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
        
        {/* Gradients & Textures */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center mt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.span variants={fadeInUp} className="text-gold-light text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-8 block">
              EST. 2008 — MUMBAI, INDIA
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-white text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 tracking-tight drop-shadow-lg">
              Framing Your Best <br className="hidden md:block" />
              <span className="italic font-light text-white/90">Moments & Legacy</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Where every memory finds its perfect home — crafted with two decades of artistry and uncompromising precision.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link 
                to="/#collections" 
                className="px-10 py-4 bg-gold-light text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-gold-dark transition-all duration-500 w-full sm:w-auto shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)]"
              >
                Explore Our Frames
              </Link>
              <Link 
                to="/#contact" 
                className="px-10 py-4 border border-white/50 text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-white hover:text-charcoal transition-all duration-500 w-full sm:w-auto backdrop-blur-sm"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-gold-light to-gold-light z-20"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 128, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
        />
      </section>

      {/* SECTION 2 — BRAND INTRO STRIP */}
      <section className="py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-light/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-6 block">
              ABOUT THE BRAND
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif text-charcoal mb-10 leading-tight">
              Leaders in India's <br className="hidden md:block" />
              <span className="italic text-gray-500 font-light">Framing Industry</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12 font-light">
              Founded in 2008 by Ali Patanwala and Murtuza Ratlamwala — two craftsmen with over two decades of combined experience — Ezzi Arts & Frames was built on one belief: that the moments you love most deserve to live in something beautiful, durable, and lasting. Since then, we've become one of India's most trusted names in premium framing.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/about" 
                className="group inline-flex items-center text-charcoal font-medium uppercase tracking-[0.15em] text-xs pb-2 border-b border-gold-light/50 hover:border-gold-light transition-colors"
              >
                Read Our Story 
                <span className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — WHY CHOOSE EZZI (USP Grid) */}
      <section className="py-32 bg-offwhite relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: ShieldCheck, title: "Durable Products", desc: "Built to outlast generations with uncompromising structural integrity." },
              { icon: Star, title: "Superior Quality", desc: "Premium materials and flawless finishes for a museum-grade look." },
              { icon: BugOff, title: "Termite Resistant", desc: "Specially treated and crafted to withstand India's unique climate." },
              { icon: Palette, title: "Wide Array of Designs", desc: "Over 100+ curated styles across every aesthetic and taste." },
              { icon: Droplets, title: "Moisture Resistant", desc: "Advanced sealing ensures your frames stay flawless year-round." },
              { icon: HeartHandshake, title: "Exceptional Service", desc: "A dedicated team that stands by you, from selection to installation." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-10 border border-gray-100 hover:border-gold-light/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-light to-gold-dark transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                <feature.icon className="w-10 h-10 text-gold-light mb-8 group-hover:scale-110 group-hover:text-gold-dark transition-all duration-500" strokeWidth={1} />
                <h3 className="text-xl font-serif font-bold text-charcoal mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — PRODUCT COLLECTIONS (Editorial Gallery) */}
      <section id="collections" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-6 block">
              OUR COLLECTIONS
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-charcoal mb-8">
              A Frame for Every Story
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              From intimate home portraits to grand corporate gifting — our collections span every occasion and aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {[
              { title: "Ezzi Frames", tag: "Premium. Artistic. Timeless.", img: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-8" },
              { title: "Alif Frames", tag: "Elegance in every edge.", img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop", span: "md:col-span-4" },
              { title: "Aqa Maula Frames", tag: "Crafted with reverence.", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop", span: "md:col-span-5" },
              { title: "Corporate & Gifting", tag: "Make every occasion memorable.", img: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-7" },
            ].map((collection, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
                className={`relative h-[450px] md:h-[600px] group overflow-hidden cursor-pointer ${collection.span}`}
              >
                <img 
                  src={collection.img} 
                  alt={collection.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-3 drop-shadow-md">{collection.title}</h3>
                  <p className="text-gold-light italic font-serif text-lg mb-8 drop-shadow-md">{collection.tag}</p>
                  <span className="text-white font-medium uppercase tracking-[0.2em] text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 flex items-center">
                    Explore Collection <span className="text-gold-light ml-3 text-lg leading-none">→</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — STATS BAR */}
      <section className="relative py-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1610505466021-48293774889c?q=80&w=2000&auto=format&fit=crop" 
            alt="Workshop background" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gold-dark/90 mix-blend-multiply" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/20"
          >
            {[
              { num: "1 Lakh+", label: "Frames Sold" },
              { num: "100+", label: "Design Options" },
              { num: "15+", label: "Years of Experience" },
              { num: "50+", label: "Product Innovations" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center text-center py-8 md:py-0"
              >
                <span className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 drop-shadow-lg">{stat.num}</span>
                <span className="text-white/90 uppercase tracking-[0.2em] text-xs font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <section id="testimonials" className="py-32 bg-offwhite overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-offwhite to-transparent z-10 pointer-events-none hidden md:block" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-offwhite to-transparent z-10 pointer-events-none hidden md:block" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="text-center mb-20">
            <span className="text-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-6 block">
              WHAT CLIENTS SAY
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
              Trusted by Thousands Across India
            </h2>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 -mx-6 px-6 md:px-[10vw] gap-8">
            {[
              { name: "Ronak", text: "We ordered 18 frames for a corporate event and were very pleased with the expedited, on-time delivery. So many layout options, such immediate responses. Truly impressive." },
              { name: "Rahul", text: "I needed urgent dispatch for a client's room — the team delivered on time, and the quality of the frame was genuinely top-notch. Highly recommend." },
              { name: "Ajay", text: "The wooden frame I bought is worth every penny. Better quality than a branded photo studio — and the suggestions they made for my home were spot on." },
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="min-w-[85vw] md:min-w-[500px] snap-center bg-white p-12 relative shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50"
              >
                <span className="absolute top-8 left-8 text-8xl font-serif text-gold-light/10 leading-none select-none">"</span>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 relative z-10 pt-6 font-light italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-charcoal flex items-center justify-center text-gold-light font-serif font-bold text-2xl">
                    {testimonial.name[0]}
                  </div>
                  <span className="font-serif font-bold text-charcoal text-xl tracking-wide">— {testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CLIENT LOGOS */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <span className="text-gray-400 text-xs font-medium tracking-[0.3em] uppercase">
            TRUSTED BY INDIA'S FINEST
          </span>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="animate-marquee whitespace-nowrap flex items-center gap-24 py-4">
            {[
              "Reliance Industries", "Abbott Laboratories", "AkzoNobel", "Taj Hotels (IHCL)", 
              "Centaur Pharmaceuticals", "Koye Pharma", "Fabtech Life Engineering", "Glapha Labs"
            ].map((client, idx) => (
              <span key={idx} className="text-2xl md:text-3xl font-serif text-gray-300 group-hover:text-charcoal transition-colors duration-700 px-8">
                {client}
              </span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-24 py-4">
            {[
              "Reliance Industries", "Abbott Laboratories", "AkzoNobel", "Taj Hotels (IHCL)", 
              "Centaur Pharmaceuticals", "Koye Pharma", "Fabtech Life Engineering", "Glapha Labs"
            ].map((client, idx) => (
              <span key={idx} className="text-2xl md:text-3xl font-serif text-gray-300 group-hover:text-charcoal transition-colors duration-700 px-8">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA BANNER */}
      <section className="py-40 bg-charcoal relative overflow-hidden flex items-center justify-center">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
              Looking for a First-Class <br className="hidden md:block" />
              <span className="text-gold-light italic">Framing Experience?</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/70 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto">
              High-quality, designer picture frames crafted to inspire. Let's bring your vision to life.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/#contact" 
                className="inline-block px-12 py-5 bg-gold-light text-white font-medium tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-charcoal transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
