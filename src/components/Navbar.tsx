import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  
  // If we are at the top of the home page or about page, the navbar might need to be transparent
  // but since both have dark overlays at the top, transparent with white text works well.
  const isTransparent = !isScrolled;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Collections", path: "/#collections" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent py-6"
          : "bg-white shadow-md py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 z-50">
          <img 
            src="https://zpojmqmlenivqxqcsuwc.supabase.co/storage/v1/object/public/Stalite%20Media/ezzi%20Arts/Logo/Ezzi%20logo.png" 
            alt="Ezzi Arts & Frames" 
            className={cn("h-10 transition-all", isTransparent ? "brightness-0 invert" : "")}
            referrerPolicy="no-referrer"
          />
          <span className={cn(
            "font-serif font-bold text-xl tracking-wide transition-colors",
            isTransparent ? "text-white" : "text-charcoal"
          )}>
            EZZI ARTS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold-light",
                isTransparent ? "text-white/90" : "text-charcoal/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/#contact"
            className={cn(
              "px-5 py-2 text-sm font-medium tracking-wide uppercase transition-all border",
              isTransparent 
                ? "border-white text-white hover:bg-white hover:text-charcoal" 
                : "border-gold-light text-gold-light hover:bg-gold-light hover:text-white"
            )}
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={cn("w-6 h-6", isMobileMenuOpen ? "text-charcoal" : (isTransparent ? "text-white" : "text-charcoal"))} />
          ) : (
            <Menu className={cn("w-6 h-6", isTransparent ? "text-white" : "text-charcoal")} />
          )}
        </button>

        {/* Mobile Nav */}
        <div className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-charcoal hover:text-gold-light transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
