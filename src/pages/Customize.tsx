import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Upload, Image as ImageIcon, RotateCcw, ArrowLeft, Ruler, Palette, Frame, ShoppingBag, BoxSelect, Droplets, Camera, Wand2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const Hotspot = ({ top, left, title, description }: { top: string, left: string, title: string, description: string }) => (
  <div className="absolute z-50 group" style={{ top, left, transform: 'translate(-50%, -50%) translateZ(25px)' }}>
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-charcoal/80 text-white flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md cursor-help animate-pulse">
      <Info className="w-3 h-3 md:w-3.5 md:h-3.5" />
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-charcoal text-white text-xs p-3 rounded shadow-xl w-48 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-white/80 font-light">{description}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal"></div>
    </div>
  </div>
);

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

const PRINT_MEDIA = [
  { id: 'photo', name: 'Photo Paper', desc: 'Slightly glossy, vibrant colors.' },
  { id: 'matte', name: 'Premium Matte', desc: 'Smooth, non-reflective finish.' },
  { id: 'fine-art', name: 'Fine Art Archival', desc: 'Textured cotton rag paper.' },
  { id: 'canvas', name: 'Rolled Canvas', desc: 'Classic woven canvas texture.' },
];

const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(15);
  }
};

export function Customize() {
  const [activeTab, setActiveTab] = useState<'size' | 'frame' | 'mat' | 'glass' | 'wall'>('size');
  const [frameMaterialTab, setFrameMaterialTab] = useState<'wood' | 'steel'>('wood');
  
  // Customization State
  const [image, setImage] = useState<string | null>(null);
  const [artWidth, setArtWidth] = useState<number>(8);
  const [artHeight, setArtHeight] = useState<number>(10);
  const [printMedium, setPrintMedium] = useState(PRINT_MEDIA[1]);
  
  const [frameStyle, setFrameStyle] = useState(FRAME_STYLES[0]);
  const [frameThickness, setFrameThickness] = useState(FRAME_THICKNESS[1]);
  const [matStyle, setMatStyle] = useState<'single' | 'double'>('single');
  const [matProfile, setMatProfile] = useState<'even' | 'bottom-weighted'>('even');
  const [matColor, setMatColor] = useState(MAT_COLORS[0]);
  const [innerMatColor, setInnerMatColor] = useState(MAT_COLORS[2]);
  const [matSize, setMatSize] = useState(MAT_SIZES[2]);
  const [glassType, setGlassType] = useState(GLASS_TYPES[0]);
  const [wallColor, setWallColor] = useState(WALL_COLORS[1]);
  const [customWallImage, setCustomWallImage] = useState<string | null>(null);
  const [lighting, setLighting] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // AR State
  const [isARMode, setIsARMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Smart Resize State
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number | null>(null);

  // Mobile Cart State
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // 3D Rotation State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleARMode = async () => {
    if (isARMode) {
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsARMode(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(s);
        setIsARMode(true);
      } catch (err) {
        alert("Camera permission denied or not available. Please allow camera access to use AR mode.");
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isARMode]);

  useEffect(() => {
    return () => {
      // Clean up camera on unmount
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('frameStudioState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.image) setImage(parsed.image);
        if (parsed.artWidth) setArtWidth(parsed.artWidth);
        if (parsed.artHeight) setArtHeight(parsed.artHeight);
        if (parsed.printMedium) setPrintMedium(parsed.printMedium);
        if (parsed.frameStyle) setFrameStyle(parsed.frameStyle);
        if (parsed.frameThickness) setFrameThickness(parsed.frameThickness);
        if (parsed.matStyle) setMatStyle(parsed.matStyle);
        if (parsed.matProfile) setMatProfile(parsed.matProfile);
        if (parsed.matColor) setMatColor(parsed.matColor);
        if (parsed.innerMatColor) setInnerMatColor(parsed.innerMatColor);
        if (parsed.matSize) setMatSize(parsed.matSize);
        if (parsed.glassType) setGlassType(parsed.glassType);
        if (parsed.wallColor) setWallColor(parsed.wallColor);
        if (parsed.customWallImage) setCustomWallImage(parsed.customWallImage);
        if (parsed.lighting) setLighting(parsed.lighting);
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
      printMedium,
      frameStyle,
      frameThickness,
      matStyle,
      matProfile,
      matColor,
      innerMatColor,
      matSize,
      glassType,
      wallColor,
      customWallImage,
      lighting
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
  }, [image, artWidth, artHeight, printMedium, frameStyle, frameThickness, matStyle, matProfile, matColor, innerMatColor, matSize, glassType, wallColor, customWallImage, lighting]);

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
        const result = reader.result as string;
        setImage(result);
        const img = new Image();
        img.onload = () => {
          setNaturalAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomWallImage(reader.result as string);
        setWallColor({ id: 'custom', name: 'Custom Room', color: 'transparent' });
      };
      reader.readAsDataURL(file);
    }
  };

  const applySmartResize = () => {
    if (!naturalAspectRatio) return;
    const newHeight = Math.round(artWidth / naturalAspectRatio);
    setArtHeight(Math.max(4, newHeight));
  };

  const handleReset = () => {
    setImage(null);
    setArtWidth(8);
    setArtHeight(10);
    setPrintMedium(PRINT_MEDIA[1]);
    setFrameStyle(FRAME_STYLES[0]);
    setFrameThickness(FRAME_THICKNESS[1]);
    setMatStyle('single');
    setMatProfile('even');
    setMatColor(MAT_COLORS[0]);
    setInnerMatColor(MAT_COLORS[2]);
    setMatSize(MAT_SIZES[2]);
    setGlassType(GLASS_TYPES[0]);
    setWallColor(WALL_COLORS[1]);
    setCustomWallImage(null);
    setLighting(100);
    localStorage.removeItem('frameStudioState');
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I would like to place an order for a custom frame.\n\n` +
    `Details:\n` +
    `- Art Size: ${artWidth}" x ${artHeight}"\n` +
    `- Print Medium: ${printMedium.name}\n` +
    `- Frame Style: ${frameStyle.name} (${frameThickness.name})\n` +
    `- Matting: ${matSize.id === 'none' ? 'None' : `${matSize.name} - ${matColor.name}${matStyle === 'double' ? ` (Double Mat w/ ${innerMatColor.name})` : ''} (${matProfile})`}\n` +
    `- Glass: ${glassType.name}\n` +
    `\nEstimated Total: $${estimatedPrice}\n\n` +
    `*(Please attach your artwork/photo to this chat)*\n\n` +
    `Please confirm the next steps to proceed with payment.`
  );

  const frameScale = useMemo(() => {
    const area = artWidth * artHeight;
    return Math.min(1.05, Math.max(0.65, 0.65 + (area / 3000)));
  }, [artWidth, artHeight]);

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Preview Area (Left) */}
        <div 
          ref={previewContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-[40vh] md:h-[45vh] lg:h-auto lg:flex-1 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden shrink-0"
          style={{ 
            backgroundColor: isARMode ? 'transparent' : wallColor.color,
            backgroundImage: customWallImage && !isARMode ? `url(${customWallImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-color 0.5s ease',
            perspective: '1200px'
          }}
        >
          {/* Dynamic Lighting Overlay */}
          {!isARMode && (
            <div 
              className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 mix-blend-multiply" 
              style={{ backgroundColor: 'rgba(0,0,0,1)', opacity: 1 - (lighting / 100) }} 
            />
          )}

          {/* AR Video Background */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={cn(
              "absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700",
              isARMode ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Subtle Wall Texture Overlay (Only if not AR & no custom wall) */}
          {!customWallImage && (
            <div className={cn("absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none transition-opacity", isARMode ? "opacity-0" : "opacity-[0.03]")}
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stucco.png")' }}></div>
          )}
          
          <AnimatePresence mode="wait">
            {image ? (
              <motion.div 
                key="frame-preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: frameScale }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="relative shadow-2xl inline-flex items-center justify-center shrink-0 z-10"
                style={{ 
                  rotateX,
                  rotateY,
                  backgroundColor: frameStyle.color,
                  backgroundImage: frameStyle.texture ? `url(${frameStyle.texture})` : undefined,
                  backgroundSize: 'cover',
                  padding: frameThickness.value,
                  // Add subtle inner and outer shadows to the frame
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 3px 15px rgba(0,0,0,0.6)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <Hotspot 
                  top="-10px" 
                  left="50%" 
                  title={`${frameStyle.name} Frame`} 
                  description={frameStyle.material === 'wood' ? 'Premium hand-finished wood. Durable and timeless.' : 'Sleek, modern steel profile. Minimalist and sturdy.'}
                />
                
                <Hotspot 
                  top="50%" 
                  left="50%" 
                  title={`${glassType.name}`} 
                  description={glassType.description}
                />

                {/* Wood Grain Texture Overlay for Frame */}
                {frameStyle.material === 'wood' && !frameStyle.texture && (
                   <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', transform: 'translateZ(1px)' }} />
                )}

                <div 
                  className="relative shrink-0 inline-flex"
                  style={{
                    backgroundColor: matColor.color,
                    padding: matSize.value,
                    paddingBottom: matSize.id !== 'none' && matProfile === 'bottom-weighted' ? `calc(${matSize.value} + 30px)` : matSize.value,
                    // Inner shadow on mat simulating depth
                    boxShadow: 'inset 0px 4px 15px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.5)',
                    transform: 'translateZ(10px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Subtle Mat Texture */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                       style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />

                  {matStyle === 'double' && matSize.id !== 'none' && (
                     <div className="absolute inset-0 z-10 pointer-events-none" 
                          style={{ 
                             border: `12px solid ${innerMatColor.color}`,
                             margin: Math.max(0, parseInt(matSize.value) - 12) + 'px',
                             marginBottom: matProfile === 'bottom-weighted' ? Math.max(0, parseInt(matSize.value) - 12 + 30) + 'px' : Math.max(0, parseInt(matSize.value) - 12) + 'px',
                             boxShadow: 'inset 0px 4px 15px rgba(0,0,0,0.2)',
                             transform: 'translateZ(1px)' // Pop inner mat out slightly
                          }}>
                         <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply" 
                              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />
                     </div>
                  )}

                  {/* Glass Reflection effect if Museum/Standard isn't selected */}
                  {glassType.id !== 'museum' && glassType.id !== 'non-glare' && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none z-10" 
                          style={{ transform: 'translateZ(15px)' }}/>
                  )}

                  <div 
                    className="relative bg-white overflow-hidden shrink-0"
                    style={{
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 15px rgba(0,0,0,0.3)',
                      transform: 'translateZ(5px)'
                    }}
                  >
                    <img 
                      src={image} 
                      alt="Your Art" 
                      className="block object-cover h-[20vh] md:h-[25vh] lg:h-[45vh] xl:h-[50vh]"
                      style={{
                        aspectRatio: `${artWidth} / ${artHeight}`,
                        width: 'auto',
                        maxWidth: 'calc(100vw - 120px)'
                      }}
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
        <div className="w-full lg:w-[450px] bg-white border-l border-gray-200 flex flex-col flex-1 lg:flex-none lg:h-full overflow-hidden z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] shrink-0">
          
          {/* Active Image Status */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
             <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-charcoal">Artwork Overview</h3>
                    <button 
                      onClick={handleReset} 
                      className="text-gray-400 hover:text-charcoal p-1 rounded-full hover:bg-gray-200 transition-colors"
                      title="Reset all choices"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={toggleARMode}
                      className={cn("p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium ml-2", isARMode ? "bg-charcoal text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100")}
                      title="View in AR"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {isARMode ? 'AR On' : 'AR View'}
                    </button>
                  </div>
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
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white z-10 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
          <div className="p-4 md:p-6 pb-24 lg:pb-6 flex-1 overflow-y-auto min-h-0 bg-gray-50/30">
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
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Custom Size</h3>
                        {naturalAspectRatio && image && (
                          <button 
                            onClick={applySmartResize}
                            className="flex items-center gap-1.5 text-xs font-semibold text-charcoal bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            Smart Crop
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Width (in)</label>
                          <input 
                            type="number" 
                            min="4" max="60"
                            value={artWidth}
                            onChange={(e) => setArtWidth(Math.max(4, Number(e.target.value)))}
                            className="w-full border border-gray-200 rounded p-3 text-center focus:outline-none focus:ring-1 focus:ring-charcoal focus:border-charcoal transition-all text-lg font-medium"
                          />
                        </div>
                        <div className="text-gray-300 font-light text-2xl mt-6">×</div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Height (in)</label>
                          <input 
                            type="number" 
                            min="4" max="60"
                            value={artHeight}
                            onChange={(e) => setArtHeight(Math.max(4, Number(e.target.value)))}
                            className="w-full border border-gray-200 rounded p-3 text-center focus:outline-none focus:ring-1 focus:ring-charcoal focus:border-charcoal transition-all text-lg font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Standard Sizes</h3>
                      <p className="text-sm text-gray-500 mb-6 font-light">Select from our ready-to-hang standard market sizes.</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {STANDARD_SIZES.map(size => (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            key={size.id}
                            onClick={() => {
                              triggerHaptic();
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
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Print Medium</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {PRINT_MEDIA.map(medium => (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            key={medium.id}
                            onClick={() => {
                              triggerHaptic();
                              setPrintMedium(medium);
                            }}
                            className={cn(
                              "flex flex-col text-left p-3 border transition-all rounded",
                              printMedium.id === medium.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                            )}
                          >
                            <span className="text-sm font-medium">{medium.name}</span>
                            <span className={cn("text-xs mt-1", printMedium.id === medium.id ? "text-white/80" : "text-gray-500")}>{medium.desc}</span>
                          </motion.button>
                        ))}
                      </div>
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
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={style.id}
                          onClick={() => {
                            triggerHaptic();
                            setFrameStyle(style);
                          }}
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
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Thickness */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Thickness</h3>
                    <div className="flex flex-col gap-2">
                      {FRAME_THICKNESS.map(thick => (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={thick.id}
                          onClick={() => {
                            triggerHaptic();
                            setFrameThickness(thick);
                          }}
                          className={cn(
                            "flex items-center justify-between p-3 border transition-all rounded",
                            frameThickness.id === thick.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 text-charcoal bg-white"
                          )}
                        >
                          <span className="text-sm font-medium text-inherit">{thick.name}</span>
                          <div className={cn("bg-current opacity-20")} style={{ height: thick.value, width: '20px' }} />
                        </motion.button>
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
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {MAT_SIZES.map(size => (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={size.id}
                          onClick={() => {
                            triggerHaptic();
                            setMatSize(size);
                          }}
                          className={cn(
                            "p-4 border text-center transition-all rounded",
                            matSize.id === size.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className="text-sm font-medium block">{size.name}</span>
                        </motion.button>
                      ))}
                    </div>

                    {matSize.id !== 'none' && (
                      <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Mat Style</h3>
                        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                          <button
                            onClick={() => { triggerHaptic(); setMatStyle('single'); }}
                            className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", matStyle === 'single' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                          >
                            Single Mat
                          </button>
                          <button
                            onClick={() => { triggerHaptic(); setMatStyle('double'); }}
                            className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", matStyle === 'double' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                          >
                            Double Mat
                          </button>
                        </div>
                        
                        <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Mat Profile</h3>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                          <button
                            onClick={() => { triggerHaptic(); setMatProfile('even'); }}
                            className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", matProfile === 'even' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                          >
                            Even Borders
                          </button>
                          <button
                            onClick={() => { triggerHaptic(); setMatProfile('bottom-weighted'); }}
                            className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", matProfile === 'bottom-weighted' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                          >
                            Bottom Weighted
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Mat Colors */}
                    {matSize.id !== 'none' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">{matStyle === 'double' ? 'Outer Mat Color' : 'Mat Color'}</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {MAT_COLORS.map(color => (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                key={color.id}
                                onClick={() => {
                                  triggerHaptic();
                                  setMatColor(color);
                                }}
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
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {matStyle === 'double' && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Inner Accent Mat</h3>
                            <div className="grid grid-cols-3 gap-3">
                              {MAT_COLORS.map(color => (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  key={`inner-${color.id}`}
                                  onClick={() => {
                                    triggerHaptic();
                                    setInnerMatColor(color);
                                  }}
                                  className={cn(
                                    "flex flex-col items-center p-3 border rounded-lg transition-all",
                                    innerMatColor.id === color.id ? "border-charcoal bg-gray-50 ring-1 ring-charcoal/20" : "border-gray-200 hover:border-gray-300"
                                  )}
                                >
                                  <div 
                                    className="w-full aspect-square rounded-full mb-2 shadow-sm border border-gray-200" 
                                    style={{ backgroundColor: color.color }}
                                  />
                                  <span className="text-xs font-medium text-gray-700">{color.name}</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
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
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={g.id}
                          onClick={() => {
                            triggerHaptic();
                            setGlassType(g);
                          }}
                          className={cn(
                            "flex flex-col text-left p-4 border transition-all rounded",
                            glassType.id === g.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className="text-sm font-semibold">{g.name}</span>
                          <span className={cn("text-xs mt-1", glassType.id === g.id ? "text-white/80" : "text-gray-500")}>{g.description}</span>
                        </motion.button>
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

                    <div className="mb-6">
                      <button 
                        onClick={() => wallInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-charcoal hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                      >
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Upload Room Photo</span>
                        <span className="text-xs text-gray-400">See the frame on your actual wall</span>
                      </button>
                      <input 
                        type="file" 
                        ref={wallInputRef} 
                        onChange={handleWallUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="space-y-3 mb-8">
                      {WALL_COLORS.map(color => (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={color.id}
                          onClick={() => {
                            triggerHaptic();
                            setCustomWallImage(null);
                            setWallColor(color);
                          }}
                          className={cn(
                            "w-full flex items-center gap-4 p-3 border transition-all rounded",
                            wallColor.id === color.id && !customWallImage ? "border-charcoal bg-gray-50" : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div 
                            className="w-10 h-10 rounded-full shadow-inner border border-gray-200" 
                            style={{ backgroundColor: color.color }}
                          />
                          <span className={cn("text-sm font-medium", wallColor.id === color.id && !customWallImage ? "text-charcoal" : "text-gray-600")}>
                            {color.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                        <span>Dynamic Lighting</span>
                        <span className="text-gray-400 font-light lowercase normal-case">{lighting}%</span>
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 font-light">Adjust the virtual room lighting to match your space.</p>
                      <input 
                        type="range" 
                        min="20" max="100" 
                        value={lighting} 
                        onChange={(e) => setLighting(Number(e.target.value))} 
                        className="w-full accent-charcoal appearance-none h-1.5 rounded-full bg-gray-200 cursor-pointer" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Floating Mobile Cart Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button 
              onClick={() => setIsMobileCartOpen(true)}
              className="bg-charcoal text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
            </button>
          </div>

          {/* Details Summary Footer (Desktop) */}
          <div className="hidden lg:block p-4 lg:p-5 bg-white border-t border-gray-200 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-30 shrink-0">
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

          {/* Mobile Cart Bottom Sheet */}
          <AnimatePresence>
            {isMobileCartOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileCartOpen(false)}
                  className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 lg:hidden"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6 lg:hidden"
                >
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                  
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated Total</h4>
                      <div className="text-4xl font-serif text-charcoal font-medium">${estimatedPrice}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-charcoal">{artWidth} × {artHeight} in</p>
                      <p className="text-sm text-gray-500 mt-0.5">{frameStyle.name}</p>
                      <p className="text-sm text-gray-500">{glassType.name}</p>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/919819708112?text=${whatsappMessage}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setIsMobileCartOpen(false);
                      if (image) {
                        alert("Please remember to attach your uploaded image to the WhatsApp chat so we can print and frame it!");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-4 rounded-xl font-medium tracking-wide hover:bg-charcoal/90 transition-all shadow-md group text-lg"
                  >
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Place Custom Order
                  </a>
                  <p className="text-center text-xs text-gray-400 mt-4 tracking-wide">
                    Secure checkout via WhatsApp link. Free shipping over $150.
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
