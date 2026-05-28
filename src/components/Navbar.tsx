import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loginWithGoogle, logout } = useAuth();

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
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent ? "bg-transparent py-6" : "bg-white shadow-md py-4",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 z-50">
          <img
            src="https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/Logo/logo.svg"
            alt="Ezzi Arts & Frames"
            className={cn(
              "h-10 transition-all",
              isTransparent ? "brightness-0 invert" : "",
            )}
            referrerPolicy="no-referrer"
          />
          <span
            className={cn(
              "font-serif font-bold text-xl tracking-wide transition-colors",
              isTransparent ? "text-white" : "text-charcoal",
            )}
          >
            EZZI ARTS & FRAMES
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
                isTransparent ? "text-white/90" : "text-charcoal/80",
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/customize"
            className={cn(
              "px-5 py-2 text-sm font-medium tracking-wide uppercase transition-all border",
              isTransparent
                ? "border-white text-white hover:bg-white hover:text-charcoal"
                : "border-gold-light text-gold-light hover:bg-gold-light hover:text-white",
            )}
          >
            Customize
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full border border-gray-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border",
                    isTransparent
                      ? "border-white text-white"
                      : "border-charcoal text-charcoal",
                  )}
                >
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <button
                onClick={logout}
                className={cn(
                  "p-2 transition-colors",
                  isTransparent
                    ? "text-white hover:text-red-400"
                    : "text-charcoal hover:text-red-600",
                )}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold-light",
                isTransparent ? "text-white/90" : "text-charcoal/80",
              )}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={cn(
                "w-6 h-6",
                isMobileMenuOpen
                  ? "text-charcoal"
                  : isTransparent
                    ? "text-white"
                    : "text-charcoal",
              )}
            />
          ) : (
            <Menu
              className={cn(
                "w-6 h-6",
                isTransparent ? "text-white" : "text-charcoal",
              )}
            />
          )}
        </button>

        {/* Mobile Nav */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
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
          {user ? (
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border border-gray-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-charcoal text-charcoal">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
                <span className="text-xl font-serif text-charcoal">
                  {user.displayName || "Welcome"}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xl font-serif text-red-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                loginWithGoogle();
                setIsMobileMenuOpen(false);
              }}
              className="text-2xl font-serif text-charcoal hover:text-gold-light transition-colors mt-8"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
