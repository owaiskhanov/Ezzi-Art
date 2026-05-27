import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Customize } from "./pages/Customize";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function Layout() {
  const location = useLocation();
  const isCustomizePage = location.pathname === '/customize';

  return (
    <div className={isCustomizePage ? "flex flex-col font-sans text-charcoal bg-white overflow-hidden fixed inset-0 w-full h-[100dvh]" : "min-h-screen flex flex-col font-sans text-charcoal bg-white"}>
      {!isCustomizePage && <Navbar />}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </div>
      {!isCustomizePage && <Footer />}
      {!isCustomizePage && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}
