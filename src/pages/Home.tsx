import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ShieldCheck, Star, BugOff, Palette, Droplets, HeartHandshake, Play, VolumeX, Volume2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { ContactMap } from "../components/ContactMap";

function AnimatedCounter({ value, suffix = "", format = true }: { value: number, suffix?: string, format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            const formatted = format ? Math.floor(v).toLocaleString('en-IN') : Math.floor(v);
            ref.current.textContent = `${formatted}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, suffix, format]);

  return <span ref={ref}>0{suffix}</span>;
}

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

function ImageWithSkeleton({ src, alt, className, style, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`} style={style}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-gray-200/20 backdrop-blur-md rounded-inherit"
          />
        )}
      </AnimatePresence>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}

function UGCVideoCard({ video }: { video: { id: number, url: string, handle: string, title: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[9/16] shadow-2xl"
      onClick={toggleMute}
    >
      <div className="absolute inset-0 bg-gray-900">
        <video 
          ref={videoRef}
          src={video.url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
        />
      </div>
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
      
      {/* Sound Toggle Button (Glass) */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 z-20 overflow-hidden">
         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
         {isMuted ? (
           <VolumeX className="w-4 h-4 text-white relative z-10" />
         ) : (
           <Volume2 className="w-4 h-4 text-white relative z-10" />
         )}
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <p className="text-white font-medium text-sm">{video.title}</p>
          <p className="text-white/60 text-xs mt-1">{video.handle}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(heroScroll, [0, 1], ["0%", "60%"]);
  const textY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const statsRef = useRef(null);
  const { scrollYProgress: statsScroll } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"]
  });
  const statsY = useTransform(statsScroll, [0, 1], ["-20%", "20%"]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    { name: "Ronak", text: "We ordered 18 frames for a corporate event and were very pleased with the expedited, on-time delivery. So many layout options, such immediate responses. Truly impressive." },
    { name: "Rahul", text: "I needed urgent dispatch for a client's room — the team delivered on time, and the quality of the frame was genuinely top-notch. Highly recommend." },
    { name: "Ajay", text: "The wooden frame I bought is worth every penny. Better quality than a branded photo studio — and the suggestions they made for my home were spot on." },
  ];

  const handleTestimonialScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const scrollWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      if (scrollWidth > 0) {
        const index = Math.round((scrollLeft / scrollWidth) * (testimonials.length - 1));
        setActiveTestimonial(index);
      }
    }
  };

  const scrollToTestimonial = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const targetScroll = (index / (testimonials.length - 1)) * scrollWidth;
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

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
            <ImageWithSkeleton 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2000&auto=format&fit=crop" 
              alt="Beautifully framed image in elegant interior" 
              className="w-full h-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
        
        {/* Gradients & Textures */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <motion.div 
          className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center mt-20"
          style={{ y: textY }}
        >
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
              <span className="italic font-light text-white/90">Moments</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Where every memory finds the perfect frame, crafted with two decades of dedication and artistry precision
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link 
                to="/customize" 
                className="px-10 py-4 bg-gold-light text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-gold-dark transition-all duration-500 w-full sm:w-auto shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)]"
              >
                Customize Your Frame
              </Link>
              <Link 
                to="/#contact" 
                className="px-10 py-4 border border-white/50 text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-white hover:text-charcoal transition-all duration-500 w-full sm:w-auto backdrop-blur-sm"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

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
              Leading the <br className="hidden md:block" />
              <span className="italic text-gray-500 font-light">Framing Industry</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12 font-light">
              Founded in 2008 by Mr. Aliasger Patanwala. Ezzi Arts & Frames was built on one belief: that the moments you love most deserve to live in something beautiful, durable, and lasting. Since then, we've become one of India's most trusted names in premium framing. Today we are leading photoframe manufacturers across Asia, the Gulf and The UK.
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
              { icon: Palette, title: "Wide Array of Designs", desc: "Over 100+ curated styles across every aesthetic and taste.", hideOnMobile: true },
              { icon: Droplets, title: "Moisture Resistant", desc: "Advanced sealing ensures your frames stay flawless year-round.", hideOnMobile: true },
              { icon: HeartHandshake, title: "Exceptional Service", desc: "A dedicated team that stands by you, from selection to installation.", hideOnMobile: true },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`bg-white p-10 border border-gray-100 hover:border-gold-light/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden ${feature.hideOnMobile ? 'hidden md:block' : ''}`}
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

      {/* SECTION 4 — UGC VIDEOS / SOCIAL PROOF */}
      <section className="py-24 relative bg-charcoal">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #4a5d4e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d4af37 0%, transparent 40%)',
              backgroundSize: '200% 200%',
              filter: 'blur(60px)'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.span variants={fadeInUp} className="text-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-4 block">
              In The Wild
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-serif text-white mb-6">
              UGC <span className="italic font-light text-white/90">Content</span>
            </motion.h2>
          </motion.div>

          {/* Mobile View: Vertical Sticky Stack */}
          <div className="md:hidden relative px-4 pb-[20vh] pt-8">
            <div className="flex flex-col gap-[80vh]">
              {[
                { id: 1, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/Beautiful%20frames,%20premium%20mouldings,%20timeless%20artwork,%20looks%20like%20your%20walls%20just%20found%20their%20pe.mp4", handle: "@abdul kadeer", title: "Call me maybe" },
                { id: 2, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/From%20artwork%20and%20photos%20abd.mp4", handle: "@abdul kadeer", title: "Call me 10 things you should do" },
                { id: 3, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/These%20frames%20Just%20a%20small.mp4", handle: "@ezziartsandframe", title: "Light up the frame" },
                { id: 4, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/When%20the%20boss%20is%20watching.mp4", handle: "@ezziartsandframe", title: "Behind the scenes" },
              ].map((video, idx) => (
                <div 
                  key={video.id} 
                  className="sticky top-[12vh] w-full max-w-[320px] mx-auto rounded-2xl shadow-2xl"
                  style={{ 
                    zIndex: idx + 10
                  }}
                >
                  <UGCVideoCard video={video} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop View: Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/Beautiful%20frames,%20premium%20mouldings,%20timeless%20artwork,%20looks%20like%20your%20walls%20just%20found%20their%20pe.mp4", handle: "@abdul kadeer", title: "Call me maybe" },
              { id: 2, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/From%20artwork%20and%20photos%20abd.mp4", handle: "@abdul kadeer", title: "Call me 10 things you should do" },
              { id: 3, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/These%20frames%20Just%20a%20small.mp4", handle: "@ezziartsandframe", title: "Light up the frame" },
              { id: 4, url: "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/UGC/When%20the%20boss%20is%20watching.mp4", handle: "@ezziartsandframe", title: "Behind the scenes" },
            ].map((video) => (
              <UGCVideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — STATS BAR */}
      <section ref={statsRef} className="relative py-24 bg-charcoal overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ y: statsY }}
        >
          <ImageWithSkeleton 
            src="https://images.unsplash.com/photo-1582561424760-0321d6cb28cb?q=80&w=2000&auto=format&fit=crop" 
            alt="Workshop background" 
            className="w-full h-full grayscale scale-125"
            referrerPolicy="no-referrer"
          />
        </motion.div>
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
              { value: 97000, suffix: "+", label: "Frames Sold" },
              { value: 100, suffix: "+", label: "Design Options" },
              { value: 15, suffix: "+", label: "Years of Experience" },
              { value: 50, suffix: "+", label: "Product Innovations" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center text-center py-8 md:py-0"
              >
                <span className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 drop-shadow-lg">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
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

          <div 
            ref={scrollContainerRef}
            onScroll={handleTestimonialScroll}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 -mx-6 px-6 md:px-[10vw] gap-8"
          >
            {testimonials.map((testimonial, idx) => (
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

          {/* Carousel Indicators */}
          <div className="flex justify-center items-center gap-3 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx 
                    ? "bg-gold-light scale-125" 
                    : "bg-gray-300 hover:bg-gold-light/50"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <a 
              href="https://www.google.com/search?q=ezzi+arts+anf+rame&oq=ezzi+arts+anf+rame+&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg5MggIAhAAGBYYHjIHCAMQABjvBTIHCAQQABjvBTIHCAUQABjvBTIGCAYQRRhA0gEINDUyNWowajeoAgCwAgE&sourceid=chrome&ie=UTF-8&source=chrome.ob#lrd=0x3be7cf35eeacb535:0x944a35717935e199,1,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white border border-gray-200 text-charcoal px-8 py-4 text-sm font-medium tracking-wide uppercase hover:border-gold-light hover:text-gold-light transition-colors shadow-sm"
            >
              <span>Read more reviews on Google</span>
              <Star className="w-4 h-4 fill-current" />
            </a>
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
              <span key={idx} className="text-2xl md:text-3xl font-serif text-gray-400 hover:text-gold-dark hover:font-bold transition-all duration-300 px-8 cursor-default">
                {client}
              </span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-24 py-4">
            {[
              "Reliance Industries", "Abbott Laboratories", "AkzoNobel", "Taj Hotels (IHCL)", 
              "Centaur Pharmaceuticals", "Koye Pharma", "Fabtech Life Engineering", "Glapha Labs"
            ].map((client, idx) => (
              <span key={idx} className="text-2xl md:text-3xl font-serif text-gray-400 hover:text-gold-dark hover:font-bold transition-all duration-300 px-8 cursor-default">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — CONTACT & LOCATION */}
      <section id="contact" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contact Information */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <div className="mb-12">
                <span className="text-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-4 block">
                  VISIT OUR STUDIO
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
                  Come Experience The Craft
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We invite you to our Mumbai studio to explore our premium collection of mouldings, archival mats, and museum-quality glass. Our experts are ready to guide you through the perfect framing choices.
                </p>
              </div>

              <div className="space-y-8">
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-offwhite flex items-center justify-center text-gold-light shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-charcoal mb-2">Location</h4>
                    <p className="text-gray-600 leading-relaxed">
                      S No 811/A, Shop No 5, Opposite Alankar Theater,<br />
                      Gol Deval, Mumbai, Maharashtra 400004
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-offwhite flex items-center justify-center text-gold-light shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-charcoal mb-2">Opening Hours</h4>
                    <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-offwhite flex items-center justify-center text-gold-light shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-charcoal mb-2">Contact</h4>
                    <p className="text-gray-600 mb-1">022-32171624</p>
                    <p className="text-gray-600">hello@ezziarts.com</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Map Container */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 h-full w-full rounded-2xl overflow-hidden shadow-2xl relative"
            >
               <ContactMap />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA BANNER */}
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
              Looking for an unforgettable <br className="hidden md:block" />
              <span className="text-gold-light italic">framing experience</span>
            </motion.h2>
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
