import { MapPin, Navigation } from "lucide-react";

export function ContactMap() {
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Ezzi+Arts+and+Frames,+Gol+Deval,+Mumbai";

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative group overflow-hidden bg-charcoal">
      {/* Abstract Map Texture Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-50"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200")',
          filter: 'grayscale(100%) contrast(120%)'
        }}
      />
      
      {/* Sleek Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

      {/* Location Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Pin */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gold-light/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center shadow-xl relative z-10 border border-gold-light/30">
            <MapPin className="w-7 h-7 text-gold-light" />
          </div>
        </div>

        {/* Location Title */}
        <h3 className="text-white font-serif text-2xl lg:text-3xl mb-2 drop-shadow-lg">
          Ezzi Arts & Frames
        </h3>
        <p className="text-white/60 text-sm mb-10 max-w-xs drop-shadow-md">
          S No 811/A, Shop No 5, Opposite Alankar Theater, Mumbai
        </p>

        {/* Get Directions Button */}
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-charcoal px-8 py-4 text-sm font-medium tracking-[0.1em] uppercase shadow-2xl hover:bg-gold-light hover:text-white transition-all duration-300 group/btn"
        >
          <Navigation className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );
}
