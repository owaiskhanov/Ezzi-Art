import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Image as ImageIcon, RotateCcw, ArrowLeft, Ruler, Palette, Frame, ShoppingBag, BoxSelect, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const FRAME_STYLES = [
  // Wood
  { id: 'black', name: 'Black Wood', color: '#1a1a1a', material: 'wood' },
  { id: 'walnut', name: 'Walnut Wood', color: '#4a3320', material: 'wood' },
  { id: 'natural', name: 'Natural Oak', color: '#c7b39a', material: 'wood' },
  { id: 'white', name: 'Gallery White', color: '#f5f5f5', material: 'wood' },
  { id: 'blue-wood', name: 'Blue Wood', color: '#2b4c65', texture: 'https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/Frames_temp/Blue-Frame.jpg', material: 'wood' },
  // Steel
  { id: 'gold', name: 'Vintage Gold', color: '#bfa15f', material: 'steel' },
  { id: 'silver', name: 'Brushed Silver', color: '#e0e0e0', material: 'steel' },
];

const STANDARD_SIZES = [
  { id: '8x10', name: '8" × 10"', width: 8, height: 10 },
  { id: '11x14', name: '11" × 14"', width: 11, height: 14 },
  { id: '16x20', name: '16" × 20"', width: 16, height: 20 },
  { id: '24x36', name: '24" × 36"', width: 24, height: 36 },
];

const FRAME_THICKNESS = [
  { id: 'thin', name: 'Thin (0.75")', value: '12px' },
  { id: 'standard', name: 'Standard (1.5")', value: '24px' },
  { id: 'thick', name: 'Thick (2.5")', value: '40px' },
];

const MAT_COLORS = [
  { id: 'white', name: 'Optic White', color: '#ffffff' },
  { id: 'cream', name: 'Warm Cream', color: '#fcfaf5' },
  { id: 'black', name: 'Deep Black', color: '#111111' },
];

const MAT_SIZES = [
  { id: 'none', name: 'No Mat', value: '0px' },
  { id: 'small', name: '1.5" Small', value: '24px' },
  { id: 'medium', name: '3" Medium', value: '48px' },
  { id: 'large', name: '5" Large', value: '80px' },
];

const GLASS_TYPES = [
  { id: 'standard', name: 'Standard Clear', description: 'Basic protection, slight glare.', multiplier: 1 },
  { id: 'non-glare', name: 'Non-Glare', description: 'Reduces reflections, slight matte finish.', multiplier: 1.2 },
  { id: 'uv', name: 'UV Conservation', description: '99% UV blocking to prevent fading.', multiplier: 1.5 },
  { id: 'museum', name: 'Museum Glass', description: 'Anti-reflective & 99% UV protection.', multiplier: 2.5 },
];

const WALL_COLORS = [
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'gray', name: 'Gallery Gray', color: '#e5e7eb' },
  { id: 'sage', name: 'Sage Green', color: '#b9c1b7' },
  { id: 'navy', name: 'Navy Blue', color: '#1e293b' },
];

export function Customize() {
  const [activeTab, setActiveTab] = useState<'size' | 'frame' | 'mat' | 'glass' | 'wall'>('size');
  const [frameMaterialTab, setFrameMaterialTab] = useState<'wood' | 'steel'>('wood');
  
  // Customization State
  const [image, setImage] = useState<string | null>(null);
  const [artWidth, setArtWidth] = useState<number>(8);
  const [artHeight, setArtHeight] = useState<number>(10);
  
  const [frameStyle, setFrameStyle] = useState(FRAME_STYLES[0]);
  const [frameThickness, setFrameThickness] = useState(FRAME_THICKNESS[1]);
  const [matColor, setMatColor] = useState(MAT_COLORS[0]);
  const [matSize, setMatSize] = useState(MAT_SIZES[2]);
  const [glassType, setGlassType] = useState(GLASS_TYPES[0]);
  const [wallColor, setWallColor] = useState(WALL_COLORS[1]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('frameStudioState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.image) setImage(parsed.image);
        if (parsed.artWidth) setArtWidth(parsed.artWidth);
        if (parsed.artHeight) setArtHeight(parsed.artHeight);
        if (parsed.frameStyle) setFrameStyle(parsed.frameStyle);
        if (parsed.frameThickness) setFrameThickness(parsed.frameThickness);
        if (parsed.matColor) setMatColor(parsed.matColor);
        if (parsed.matSize) setMatSize(parsed.matSize);
        if (parsed.glassType) setGlassType(parsed.glassType);
        if (parsed.wallColor) setWallColor(parsed.wallColor);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state = {
      image,
      artWidth,
      artHeight,
      frameStyle,
      frameThickness,
      matColor,
      matSize,
      glassType,
      wallColor,
    };
    try {
      localStorage.setItem('frameStudioState', JSON.stringify(state));
    } catch (e) {
      console.warn("Storage quota exceeded. Image might be too large to save.", e);
      // Fallback: save without image if quota is exceeded
      const stateWithoutImage = { ...state, image: null };
      try {
        localStorage.setItem('frameStudioState', JSON.stringify(stateWithoutImage));
      } catch (err) {
        console.error("Failed to save state to localStorage", err);
      }
    }
  }, [image, artWidth, artHeight, frameStyle, frameThickness, matColor, matSize, glassType, wallColor]);

  // Price Calculation
  const estimatedPrice = useMemo(() => {
    const area = artWidth * artHeight;
    const basePrice = 30; // Base handling fee
    
    let frameRate = 0.5; // per sq inch
    if (frameThickness.id === 'standard') frameRate = 0.8;
    if (frameThickness.id === 'thick') frameRate = 1.2;
    if (frameStyle.id === 'gold' || frameStyle.id === 'silver') frameRate *= 1.3;

    let matRate = 0;
    if (matSize.id === 'small') matRate = 0.2;
    if (matSize.id === 'medium') matRate = 0.3;
    if (matSize.id === 'large') matRate = 0.5;

    const glassRate = 0.4 * glassType.multiplier;

    let total = basePrice + (area * frameRate) + (area * matRate) + (area * glassRate);
    return Math.max(30, Math.round(total));
  }, [artWidth, artHeight, frameThickness, frameStyle, matSize, glassType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setImage(null);
    setArtWidth(8);
    setArtHeight(10);
    setFrameStyle(FRAME_STYLES[0]);
    setFrameThickness(FRAME_THICKNESS[1]);
    setMatColor(MAT_COLORS[0]);
    setMatSize(MAT_SIZES[2]);
    setGlassType(GLASS_TYPES[0]);
    setWallColor(WALL_COLORS[1]);
    localStorage.removeItem('frameStudioState');
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I would like to place an order for a custom frame.\n\n` +
    `Details:\n` +
    `- Art Size: ${artWidth}" x ${artHeight}"\n` +
    `- Frame Style: ${frameStyle.name} (${frameThickness.name})\n` +
    `- Matting: ${matSize.id === 'none' ? 'None' : `${matSize.name} - ${matColor.name}`}\n` +
    `- Glass: ${glassType.name}\n` +
    `\nEstimated Total: $${estimatedPrice}\n\n` +
    `*(Please attach your artwork/photo to this chat)*\n\n` +
    `Please confirm the next steps to proceed with payment.`
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-charcoal transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif text-charcoal font-semibold">Frame Studio</h1>
            <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Place Your Order</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors px-3 py-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Preview Area (Left) */}
        <div 
          className="flex-1 relative flex items-center justify-center p-8 lg:p-12 transition-colors duration-500 overflow-hidden min-h-[50vh] lg:min-h-0"
          style={{ backgroundColor: wallColor.color }}
        >
          {/* Subtle Wall Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stucco.png")' }}></div>
          
          <AnimatePresence mode="wait">
            {image ? (
              <motion.div 
                key="frame-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative shadow-2xl transition-all duration-300 max-w-full max-h-full flex items-center justify-center shrink-0"
                style={{ 
                  backgroundColor: frameStyle.color,
                  backgroundImage: frameStyle.texture ? `url(${frameStyle.texture})` : undefined,
                  backgroundSize: 'cover',
                  padding: frameThickness.value,
                  // Add subtle inner and outer shadows to the frame
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(0,0,0,0.5)'
                }}
              >
                {/* Wood Grain Texture Overlay for Frame */}
                {frameStyle.material === 'wood' && !frameStyle.texture && (
                   <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
                )}

                <div 
                  className="relative transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: matColor.color,
                    padding: matSize.value,
                    // Inner shadow on mat simulating depth
                    boxShadow: 'inset 0px 4px 15px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {/* Subtle Mat Texture */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                       style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />

                  {/* Glass Reflection effect if Museum/Standard isn't selected */}
                  {glassType.id !== 'museum' && glassType.id !== 'non-glare' && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none z-10" />
                  )}

                  <div 
                    className="relative bg-white overflow-hidden flex items-center justify-center shrink-0"
                    style={{
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  >
                    <img 
                      src={image} 
                      alt="Your Art" 
                      className="object-contain max-w-full max-h-[50vh] lg:max-h-[60vh] align-bottom"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center max-w-md w-full bg-white/80 backdrop-blur-sm p-12 rounded-xl shadow-xl border border-white/20 relative z-10"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif text-charcoal mb-3">See Your Art Framed</h2>
                <p className="text-gray-500 mb-8 font-light text-center">
                  Upload a photo of your artwork or picture to visualize how it looks with our premium frames and matting.
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-charcoal text-white px-8 py-3.5 rounded-none font-medium tracking-wide hover:bg-charcoal/90 transition-all shadow-md hover:shadow-lg flex items-center gap-3 w-full justify-center"
                >
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Area (Right) */}
        <div className="w-full lg:w-[450px] bg-white border-l border-gray-200 flex flex-col h-[50vh] lg:h-auto overflow-y-auto z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] shrink-0">
          
          {/* Active Image Status */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">Artwork Overview</h3>
                  <p className="text-xs text-gray-500 mt-1">{image ? 'Custom image loaded' : 'No image selected'}</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded text-charcoal hover:bg-gray-50 transition-colors shadow-sm focus:outline-none"
                >
                  {image ? 'Change Art' : 'Upload Art'}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
             </div>
          </div>

          {/* Navigation Tabs (Scrollable) */}
          <div className="flex overflow-x-auto border-b border-gray-200 sticky top-0 bg-white z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button 
              onClick={() => setActiveTab('size')}
              className={cn(
                "px-5 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'size' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <BoxSelect className="w-4 h-4" /> Size
            </button>
            <button 
              onClick={() => setActiveTab('frame')}
              className={cn(
                "px-5 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'frame' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Frame className="w-4 h-4" /> Frame
            </button>
            <button 
              onClick={() => setActiveTab('mat')}
              className={cn(
                "px-5 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'mat' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Ruler className="w-4 h-4" /> Matting
            </button>
            <button 
              onClick={() => setActiveTab('glass')}
              className={cn(
                "px-5 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'glass' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Droplets className="w-4 h-4" /> Glass
            </button>
            <button 
              onClick={() => setActiveTab('wall')}
              className={cn(
                "px-5 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'wall' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Palette className="w-4 h-4" /> Wall
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              
              {/* SIZE TAB */}
              {activeTab === 'size' && (
                <motion.div 
                  key="tab-size"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Standard Sizes</h3>
                    <p className="text-sm text-gray-500 mb-6 font-light">Select from our ready-to-hang standard market sizes.</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {STANDARD_SIZES.map(size => (
                        <button
                          key={size.id}
                          onClick={() => {
                            setArtWidth(size.width);
                            setArtHeight(size.height);
                          }}
                          className={cn(
                            "flex flex-col items-center p-4 border transition-all rounded",
                            artWidth === size.width && artHeight === size.height 
                              ? "border-charcoal bg-gray-50 ring-1 ring-charcoal/20" 
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className={cn("text-lg font-medium", artWidth === size.width && artHeight === size.height ? "text-charcoal" : "text-gray-700")}>
                            {size.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FRAME TAB */}
              {activeTab === 'frame' && (
                <motion.div 
                  key="tab-frame"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Frame Style */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Frame Material & Style</h3>
                    
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                      <button
                        onClick={() => setFrameMaterialTab('wood')}
                        className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", frameMaterialTab === 'wood' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                      >
                        Wood Frames
                      </button>
                      <button
                        onClick={() => setFrameMaterialTab('steel')}
                        className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", frameMaterialTab === 'steel' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                      >
                        Steel Frames
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {FRAME_STYLES.filter(s => s.material === frameMaterialTab).map(style => (
                        <button
                          key={style.id}
                          onClick={() => setFrameStyle(style)}
                          className={cn(
                            "flex flex-col items-center p-3 border rounded-lg transition-all",
                            frameStyle.id === style.id ? "border-charcoal bg-gray-50 ring-1 ring-charcoal/20" : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div 
                            className={cn("w-full aspect-video rounded mb-2 shadow-inner border border-gray-100", 
                              style.texture ? "bg-cover bg-center" : ""
                            )} 
                            style={{ 
                              backgroundColor: style.color,
                              backgroundImage: style.texture ? `url(${style.texture})` : undefined
                            }}
                          />
                          <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Thickness */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Thickness</h3>
                    <div className="flex flex-col gap-2">
                      {FRAME_THICKNESS.map(thick => (
                        <button
                          key={thick.id}
                          onClick={() => setFrameThickness(thick)}
                          className={cn(
                            "flex items-center justify-between p-3 border transition-all rounded",
                            frameThickness.id === thick.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 text-charcoal bg-white"
                          )}
                        >
                          <span className="text-sm font-medium text-inherit">{thick.name}</span>
                          <div className={cn("bg-current opacity-20")} style={{ height: thick.value, width: '20px' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MAT TAB */}
              {activeTab === 'mat' && (
                <motion.div 
                  key="tab-mat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Mat Size */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Mat Size</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {MAT_SIZES.map(size => (
                        <button
                          key={size.id}
                          onClick={() => setMatSize(size)}
                          className={cn(
                            "p-4 border text-center transition-all rounded",
                            matSize.id === size.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className="text-sm font-medium block">{size.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mat Color */}
                  {matSize.id !== 'none' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Mat Color</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {MAT_COLORS.map(color => (
                          <button
                            key={color.id}
                            onClick={() => setMatColor(color)}
                            className={cn(
                              "flex flex-col items-center p-3 border rounded-lg transition-all",
                              matColor.id === color.id ? "border-charcoal bg-gray-50 ring-1 ring-charcoal/20" : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div 
                              className="w-full aspect-square rounded-full mb-2 shadow-sm border border-gray-200" 
                              style={{ backgroundColor: color.color }}
                            />
                            <span className="text-xs font-medium text-gray-700">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* GLASS TAB */}
              {activeTab === 'glass' && (
                <motion.div 
                  key="tab-glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Glass Options</h3>
                    <div className="flex flex-col gap-3">
                      {GLASS_TYPES.map(g => (
                        <button
                          key={g.id}
                          onClick={() => setGlassType(g)}
                          className={cn(
                            "flex flex-col text-left p-4 border transition-all rounded",
                            glassType.id === g.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className="text-sm font-semibold">{g.name}</span>
                          <span className={cn("text-xs mt-1", glassType.id === g.id ? "text-white/80" : "text-gray-500")}>{g.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* WALL TAB */}
              {activeTab === 'wall' && (
                <motion.div 
                  key="tab-wall"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Preview Background</h3>
                    <p className="text-sm text-gray-500 mb-4 font-light">Change the background color to visualize how the frame will look on your wall.</p>
                    <div className="space-y-3">
                      {WALL_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setWallColor(color)}
                          className={cn(
                            "w-full flex items-center gap-4 p-3 border transition-all rounded",
                            wallColor.id === color.id ? "border-charcoal bg-gray-50" : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div 
                            className="w-10 h-10 rounded-full shadow-inner border border-gray-200" 
                            style={{ backgroundColor: color.color }}
                          />
                          <span className={cn("text-sm font-medium", wallColor.id === color.id ? "text-charcoal" : "text-gray-600")}>
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Details Summary Footer */}
          <div className="p-5 bg-white border-t border-gray-200 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-30">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated Total</h4>
                <div className="text-3xl font-serif text-charcoal font-medium">${estimatedPrice}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{artWidth} × {artHeight} in</div>
                <div className="text-xs text-gray-500">{frameStyle.name} • {glassType.name}</div>
              </div>
            </div>
            
            <a 
              href={`https://wa.me/919819708112?text=${whatsappMessage}`} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (image) {
                  alert("Please remember to attach your uploaded image to the WhatsApp chat so we can print and frame it!");
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-3.5 rounded-none font-medium tracking-wide hover:bg-charcoal/90 transition-all shadow-md group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Place Custom Order
            </a>
            <p className="text-[10px] text-gray-400 text-center mt-3 tracking-wide">
              Secure checkout via WhatsApp link. Free shipping over $150.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
