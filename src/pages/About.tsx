import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function About() {
  return (
    <main className="w-full">
      {/* SECTION 1 — PAGE HERO */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-charcoal flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop" 
            alt="Beautiful framed art on a wall" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-6 block">
              OUR STORY
            </span>
            <h1 className="text-white text-5xl md:text-6xl font-serif leading-tight mb-6">
              Born from Passion.<br />Built on Craft.
            </h1>
            <p className="text-white/75 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Welcome to Ezzi Arts & Frames, where you can trust that you are being served with the highest quality of designs to capture your precious memories and beloved artworks. Experience the joy of framing and preserving eternal moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — THE FOUNDING STORY */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-serif text-gray-50/50 z-0 select-none pointer-events-none">
          2008
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop" 
                alt="Workshop" 
                className="w-full h-auto object-cover shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-8">
                It Started with a Shared Dream
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  When Mr Aliasger Patanwala founded Ezzi Arts & Frames in 2008, he had been working in the field for nearly 2 decades, achieving an expertise that only time, honesty and dedication to the craft can extend.
                </p>
                <p>
                  Today, Ezzi Arts & Frames have became a pioneer in the framing industry. In the past two decades, we have expanded to Asia, the Gulf and Europe. We serve customers across India, the UAE and the UK, and bring a bespoke elegance into their homes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE FOUNDERS */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              THE VISIONARIES
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
              The Minds Behind the Masterpiece
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: "Aliasger Patanwala",
                title: "Founder",
                desc: "With over two decades in the framing industry, Mr Aliasger Patanwala is the heart and soul of Ezzi Arts & Frames. He brings an attention to detail that can be rivalled by only a few. His dedication to the craft has lent Ezzi Arts & Frames the excellence that it brings.",
                img: "https://zpojmqmlenivqxqcsuwc.supabase.co/storage/v1/object/public/Stalite%20Media/ezzi%20Arts/Founders/Ali-patanwala.jpg"
              },
              {
                name: "Abdulkadir Patanwala",
                title: "Director",
                desc: "Abdulkadir Patanwala is the young mind behind expanding Ezzi Arts & Frames along with his father. His grit and intelligence have been shaping Ezzi Arts & Frames into a household name thanks to his tech-savvy and adaptable mindset.",
                img: "https://zpojmqmlenivqxqcsuwc.supabase.co/storage/v1/object/public/Stalite%20Media/ezzi%20Arts/Founders/Murtuza-Ratlamwala.jpg"
              }
            ].map((founder, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white border-t-4 border-gold-light shadow-lg p-8 md:p-10"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-8 mx-auto md:mx-0">
                  <img 
                    src={founder.img} 
                    alt={founder.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-serif text-charcoal mb-2 text-center md:text-left">{founder.name}</h3>
                <p className="text-gold-light font-medium text-sm tracking-wide uppercase mb-6 text-center md:text-left">{founder.title}</p>
                <p className="text-gray-600 leading-relaxed text-center md:text-left">{founder.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE LEGACY TIMELINE */}
      <section className="py-24 bg-offwhite">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              OUR JOURNEY
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
              The Legacy Timeline
            </h2>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gold-light/30 -translate-x-1/2" />

            <div className="space-y-16">
              {[
                { year: "1950s", text: "The first photo frame manufacturers emerged in India." },
                { year: "1990s", text: "Mr Aliasger Patanwala joined the nuanced industry" },
                { year: "2008", text: "Mr Aliasger Patanwala launched Ezzi Arts & Frames with the support of his incredible wife, Nisreen Patanwala and his trustworthy companion, Mr Murtaza Ratlamwala" },
                { year: "2010s", text: "Ezzi Arts & Frames expanded all over India, and became a leading manufacturer, importer and specialist in the framing world." },
                { year: "2020s", text: "Ezzi Arts & Frames opened their doors internationally in Dubai and London" },
                { year: "2025", text: "Mr Abdulkadir Patanwala stepped in as the Director of Ezzi Arts & Frames" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gold-light border-4 border-offwhite -translate-x-1/2 z-10" />
                  
                  {/* Content Box */}
                  <div className="ml-12 md:ml-0 md:w-[45%] bg-white p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-serif text-gold-dark mb-3">{item.year}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                  
                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-[45%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT MAKES US DIFFERENT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
                OUR EDGE
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-8">
                Frames That Are Unlike Anything in the Market
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg mb-10">
                <p>
                  Our frames aren't just made for show, they're engineered to last. Every frame that you purchase at Ezzi Arts & Frames is made of sustainable materials, of superior quality, termite-resistant, and moisture-resistant.
                </p>
                <p>
                  With more than 2000+ design choices, our frames have something for everyone in store.
                </p>
                <p>
                  We have been tied up with one of the world's largest framing companies for over a decade — importing and supplying mount boards, prints, accessories, and machinery that allow us to create frames that feel truly international, while remaining proudly Indian.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {["Termite Resistant", "Moisture Resistant", "Sustainable Materials", "Global Sourcing"].map((pill, i) => (
                  <span key={i} className="px-4 py-2 border border-gold-light text-gold-dark text-sm font-medium rounded-full">
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop" alt="Frame detail" className="w-full h-48 md:h-64 object-cover rounded-sm" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=600&auto=format&fit=crop" alt="Frame detail" className="w-full h-48 md:h-64 object-cover rounded-sm mt-8" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop" alt="Frame detail" className="w-full h-48 md:h-64 object-cover rounded-sm -mt-8" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=600&auto=format&fit=crop" alt="Frame detail" className="w-full h-48 md:h-64 object-cover rounded-sm" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — STATS BAR */}
      <section className="bg-gold-light py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/30">
            {[
              { num: "2000+", label: "Design Choices" },
              { num: "15+", label: "Years of Experience" },
              { num: "10+", label: "Countries Served" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center py-6 md:py-0"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3">{stat.num}</span>
                <span className="text-white uppercase tracking-[0.15em] text-xs md:text-sm font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CTA CLOSER */}
      <section className="py-32 bg-offwhite text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
            Every Frame Holds a Story. What's Yours?
          </h2>
          <p className="text-gray-600 text-xl font-serif italic mb-10">
            Let's create something beautiful together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/#collections" 
              className="px-8 py-4 bg-gold-light text-white font-medium tracking-wide uppercase text-sm hover:bg-gold-dark transition-colors w-full sm:w-auto"
            >
              Explore Our Collections
            </Link>
            <Link 
              to="/#contact" 
              className="px-8 py-4 border border-gold-light text-gold-dark font-medium tracking-wide uppercase text-sm hover:bg-gold-light hover:text-white transition-colors w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
