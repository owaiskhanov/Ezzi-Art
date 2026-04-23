import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-20 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <img 
            src="https://zpojmqmlenivqxqcsuwc.supabase.co/storage/v1/object/public/Stalite%20Media/ezzi%20Arts/Logo/Ezzi%20logo.png" 
            alt="Ezzi Arts & Frames" 
            className="h-16 mb-6"
            referrerPolicy="no-referrer"
          />
          <p className="text-gray-500 text-center max-w-md font-serif italic">
            "Where every memory finds its perfect home — crafted with two decades of artistry."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-xl mb-6 text-charcoal">Quick Links</h4>
            <ul className="space-y-4 text-gray-600">
              <li><Link to="/" className="hover:text-gold-light transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gold-light transition-colors">Our Story</Link></li>
              <li><Link to="/customize" className="hover:text-gold-light transition-colors">Customize Frame</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-xl mb-6 text-charcoal">Contact Info</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-gold-light shrink-0" />
                <span>022-32171624</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-gold-light shrink-0" />
                <span>hello@ezziarts.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-xl mb-6 text-charcoal">Follow Us</h4>
            <p className="text-gray-600 mb-6 text-center md:text-left">
              Stay updated with our latest collections and framing inspirations.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ezziartsandframe/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal hover:bg-gold-light hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/EzziArtsFrames" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal hover:bg-gold-light hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal hover:bg-gold-light hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gold-light/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Ezzi Arts & Frames. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-gold-light transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
