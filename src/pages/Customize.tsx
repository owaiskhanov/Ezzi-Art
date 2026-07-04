import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Upload, Image as ImageIcon, RotateCcw, ArrowLeft, Ruler, Palette, Frame, ShoppingBag, BoxSelect, Droplets, Camera, Wand2, Info, Columns, ZoomIn, ZoomOut, Maximize, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/auth-context";

function ImageWithSkeleton({ src, alt, className, style, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div className={`relative ${className}`} style={{ ...style, overflow: 'hidden' }}>
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover relative z-10`}
          {...props}
        />
      )}
    </div>
  );
}

const FRAMING_TYPES = [
  { id: 'standard', name: 'Standard Frame', desc: 'Classic framed print with glass' },
  { id: 'floater', name: 'Canvas Floater', desc: 'Canvas with a 1/4" float gap' },
  { id: 'wrap', name: 'Gallery Wrap', desc: 'Frameless stretched canvas' },
  { id: 'shadowbox', name: 'Shadowbox', desc: 'Deep set art for 3D effect' },
];

const FRAME_STYLES = [
  // Wood
  { id: 'black', name: 'Black Wood', color: '#1a1a1a', material: 'wood' },
  { id: 'walnut', name: 'Walnut Wood', color: '#4a3320', material: 'wood' },
  { id: 'natural', name: 'Natural Oak', color: '#c7b39a', material: 'wood' },
  { id: 'white', name: 'Gallery White', color: '#f5f5f5', material: 'wood' },
  { id: 'blue-wood', name: 'Blue Wood', color: '#2b4c65', material: 'wood' },
  { id: 'red-wood', name: 'Red Wood', color: '#8b4513', texture: 'https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/Frames_temp/Seemless-Red-wood.jpg', material: 'wood' },
  // Plastic
  { id: 'brushed-gold', name: 'Brushed Gold', color: '#db9d1e', material: 'plastic', thumbnail: 'https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/public/EzziArt/Frames_temp/Brushed-Gold-Texture.jpg' },
  { id: 'silver', name: 'Brushed Silver', color: '#c0c0c0', material: 'plastic' },
  { id: 'bronze', name: 'Brushed Bronze', color: '#cd7f32', material: 'plastic' },
  { id: 'rusted', name: 'Rusted Iron', color: '#8c4b31', material: 'plastic' },
  { id: 'withered-cream', name: 'Withered Cream', color: '#f0ebd8', material: 'plastic' },
  { id: 'withered-mint', name: 'Withered Mint', color: '#dbe7e4', material: 'plastic' },
  { id: 'withered-grey', name: 'Withered Grey', color: '#e0e0e0', material: 'plastic' },
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'size' | 'frame' | 'mat' | 'glass' | 'wall'>('size');
  const [frameMaterialTab, setFrameMaterialTab] = useState<'wood' | 'plastic'>('wood');
  
  // Customization State
  const [image, setImage] = useState<string | null>(null);
  const [artWidth, setArtWidth] = useState<number>(8);
  const [artHeight, setArtHeight] = useState<number>(10);
  const [printMedium, setPrintMedium] = useState(PRINT_MEDIA[1]);
  const [framingType, setFramingType] = useState(FRAMING_TYPES[0]);
  
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

  const [compareConfig, setCompareConfig] = useState<any>(null);

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
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 3D Rotation State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Zoom State
  const [userZoom, setUserZoom] = useState(1);
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.5;

  const handleZoomIn = () => setUserZoom(z => Math.min(MAX_ZOOM, z + 0.25));
  const handleZoomOut = () => setUserZoom(z => Math.max(MIN_ZOOM, z - 0.25));
  const handleZoomReset = () => setUserZoom(1);

  // Wheel zoom
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setUserZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.01)));
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

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
        if (parsed.artWidth) setArtWidth(parsed.artWidth);
        if (parsed.artHeight) setArtHeight(parsed.artHeight);
        if (parsed.printMedium) setPrintMedium(parsed.printMedium);
        if (parsed.framingType) setFramingType(parsed.framingType);
        if (parsed.frameStyle) setFrameStyle(parsed.frameStyle);
        if (parsed.frameThickness) setFrameThickness(parsed.frameThickness);
        if (parsed.matStyle) setMatStyle(parsed.matStyle);
        if (parsed.matProfile) setMatProfile(parsed.matProfile);
        if (parsed.matColor) setMatColor(parsed.matColor);
        if (parsed.innerMatColor) setInnerMatColor(parsed.innerMatColor);
        if (parsed.matSize) setMatSize(parsed.matSize);
        if (parsed.glassType) setGlassType(parsed.glassType);
        if (parsed.wallColor) setWallColor(parsed.wallColor);
        if (parsed.lighting) setLighting(parsed.lighting);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state = {
      artWidth,
      artHeight,
      printMedium,
      framingType,
      frameStyle,
      frameThickness,
      matStyle,
      matProfile,
      matColor,
      innerMatColor,
      matSize,
      glassType,
      wallColor,
      lighting
    };
    try {
      localStorage.setItem('frameStudioState', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state to localStorage", e);
    }
  }, [artWidth, artHeight, printMedium, framingType, frameStyle, frameThickness, matStyle, matProfile, matColor, innerMatColor, matSize, glassType, wallColor, lighting]);

  // Price Calculation
  const priceBreakdown = useMemo(() => {
    const area = artWidth * artHeight;
    const basePrice = 30; // Base handling fee
    
    let frameRate = 0.5; // per sq inch
    if (framingType.id === 'wrap') {
      frameRate = 0.3;
    } else {
      if (frameThickness.id === 'standard') frameRate = 0.8;
      if (frameThickness.id === 'thick') frameRate = 1.2;
      if (frameStyle.id === 'gold' || frameStyle.id === 'silver') frameRate *= 1.3;
    }

    let matRate = 0;
    if (framingType.id !== 'wrap' && framingType.id !== 'floater') {
      if (matSize.id === 'small') matRate = 0.2;
      if (matSize.id === 'medium') matRate = 0.3;
      if (matSize.id === 'large') matRate = 0.5;
    }

    const glassRate = framingType.id === 'wrap' ? 0 : 0.4 * glassType.multiplier;

    const framePrice = Math.round(area * frameRate);
    const matPrice = Math.round(area * matRate);
    const glassPrice = Math.round(area * glassRate);
    const total = basePrice + framePrice + matPrice + glassPrice;

    return {
      base: basePrice,
      frame: Math.round(framePrice),
      mat: Math.round(matPrice),
      glass: Math.round(glassPrice),
      total: Math.max(30, Math.round(total))
    };
  }, [artWidth, artHeight, frameThickness, frameStyle, matSize, glassType, framingType]);

  const estimatedPrice = priceBreakdown.total;

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
    if (e.target) {
      e.target.value = '';
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
    if (e.target) {
      e.target.value = '';
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

  const handlePlaceOrder = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // We let the link open in a new tab by not preventing default
    if (image) {
      alert("Please remember to attach your uploaded image to the WhatsApp chat so we can print and frame it!");
    }
    
    // Attempt to notify user via email
    let userEmail = user?.email;
    if (!userEmail) {
      const emailPrompt = window.prompt("Enter your email address to receive an order summary:");
      if (emailPrompt) {
        userEmail = emailPrompt;
      }
    }

    if (userEmail) {
      try {
        await fetch('/api/order-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            orderDetails: {
              width: artWidth,
              height: artHeight,
              frameName: frameStyle.name,
              framingTypeName: framingType.name,
              matName: matSize.name,
              glassName: glassType.name,
              estimatedPrice
            }
          })
        });
      } catch (err) {
        console.error("Could not send email notification.", err);
      }
    }
  };

  const frameScale = useMemo(() => {
    const area = artWidth * artHeight;
    return Math.min(1.05, Math.max(0.65, 0.65 + (area / 3000)));
  }, [artWidth, artHeight]);

  const stateAsConfig = { image, artWidth, artHeight, printMedium, framingType, frameStyle, frameThickness, matStyle, matProfile, matColor, innerMatColor, matSize, glassType };
  const configsToRender = compareConfig ? [
    { ...stateAsConfig, id: "current", label: "Current Configuration" },
    { ...compareConfig, id: "compare", label: "Comparison" }
  ] : [ { ...stateAsConfig, id: "current" } ];

  const renderFrameElement = (config: any) => {
    if (!config || !config.framingType || !config.frameStyle || !config.frameThickness || !config.glassType || !config.printMedium || !config.matColor || !config.matSize || !config.innerMatColor) return null;
    
    const isWrap = config.framingType.id === 'wrap';
    const isFloater = config.framingType.id === 'floater';
    const isShadowbox = config.framingType.id === 'shadowbox';

    return (
      <div 
        key={config.id}
        className="relative shadow-2xl inline-flex items-center justify-center shrink-0 z-10"
        style={{ 
          backgroundColor: isWrap ? 'transparent' : config.frameStyle.color,
          backgroundImage: (!isWrap && config.frameStyle.texture) ? `url(${config.frameStyle.texture})` : undefined,
          backgroundSize: 'cover',
          padding: isWrap ? '0px' : config.frameThickness.value,
          boxShadow: isWrap ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : (isShadowbox ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 30px 40px rgba(0,0,0,0.8)' : '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 3px 15px rgba(0,0,0,0.6)'),
          transformStyle: 'preserve-3d'
        }}
      >
        {compareConfig && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-charcoal shadow-sm border border-black/5 whitespace-nowrap z-50">
            {config.label}
          </div>
        )}
        
        {!isWrap && (
          <>
            {config.frameStyle.material === 'wood' && !config.frameStyle.texture && (
               <>
                 <div className="absolute inset-0 opacity-100 pointer-events-none mix-blend-color-burn" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', transform: 'translateZ(1px)' }} />
                 <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', backgroundSize: '200px 200px', transform: 'translateZ(1px)' }} />
               </>
            )}
            {config.frameStyle.id.startsWith('withered-') && (
               <>
                 <div className="absolute inset-0 pointer-events-none opacity-80" 
                      style={{ backgroundColor: '#5c4033', WebkitMaskImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', WebkitMaskSize: '150px 150px', maskImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', maskSize: '150px 150px', transform: 'translateZ(1px)' }} />
                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', transform: 'translateZ(1px)' }} />
               </>
            )}
            {['brushed-gold', 'silver', 'bronze'].includes(config.frameStyle.id) && (
               <>
                 <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")', backgroundSize: '200px 200px', transform: 'translateZ(1px)' }} />
                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png")', backgroundSize: '150px 150px', transform: 'translateZ(1px)' }} />
                 <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" 
                      style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px, transparent 5px, transparent 9px, rgba(255,255,255,0.5) 9px, rgba(255,255,255,0.5) 10px, transparent 10px, transparent 15px)', transform: 'translateZ(1px)' }} />
               </>
            )}
            {['brushed-gold', 'silver', 'bronze'].includes(config.frameStyle.id) && (
               <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-90" 
                    style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0) 70%, rgba(255,255,255,1) 85%, rgba(255,255,255,0) 100%)', transform: 'translateZ(2px)' }} />
            )}
            {config.frameStyle.id === 'rusted' && (
               <>
                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-90" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rusty-metal.png")', transform: 'translateZ(1px)' }} />
                 <div className="absolute inset-0 pointer-events-none mix-blend-color-burn opacity-80" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', transform: 'translateZ(1px)' }} />
               </>
            )}
          </>
        )}

        <div 
          className="relative shrink-0 inline-flex"
          style={{
            backgroundColor: isWrap ? 'transparent' : (isFloater ? '#1a1a1a' : config.matColor.color),
            padding: isWrap ? '0px' : (isFloater ? '12px' : config.matSize.value),
            paddingBottom: (!isWrap && !isFloater && config.matSize.id !== 'none' && config.matProfile === 'bottom-weighted') ? `calc(${config.matSize.value} + 30px)` : (isWrap ? '0px' : (isFloater ? '12px' : config.matSize.value)),
            boxShadow: isWrap ? 'none' : (isFloater ? 'inset 0 4px 15px rgba(0,0,0,0.8)' : (isShadowbox ? 'inset 0px 10px 30px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.5)' : 'inset 0px 4px 15px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.5)')),
            transform: isWrap ? 'translateZ(10px)' : (isShadowbox ? 'translateZ(20px)' : 'translateZ(10px)'),
            transformStyle: 'preserve-3d'
          }}
        >
          {(!isWrap && !isFloater) && (
            <>
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                   style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />
              {config.matStyle === 'double' && config.matSize.id !== 'none' && (
                 <div className="absolute inset-0 z-10 pointer-events-none" 
                      style={{ 
                         border: `12px solid ${config.innerMatColor.color}`,
                         margin: Math.max(0, parseInt(config.matSize.value) - 12) + 'px',
                         marginBottom: config.matProfile === 'bottom-weighted' ? Math.max(0, parseInt(config.matSize.value) - 12 + 30) + 'px' : Math.max(0, parseInt(config.matSize.value) - 12) + 'px',
                         boxShadow: 'inset 0px 4px 15px rgba(0,0,0,0.2)',
                         transform: 'translateZ(1px)'
                      }}>
                     <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply" 
                          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />
                 </div>
              )}
            </>
          )}

          {(!isWrap && config.glassType.id !== 'museum' && config.glassType.id !== 'non-glare') && (
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none z-10" 
                  style={{ transform: 'translateZ(15px)' }}/>
          )}

          <div 
            className="relative bg-white overflow-hidden shrink-0"
            style={{
              boxShadow: isWrap ? 'inset 0 0 20px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.2)' : 'inset 0 0 10px rgba(0,0,0,0.1), 0 4px 15px rgba(0,0,0,0.3)',
              transform: isWrap ? 'translateZ(5px)' : (isFloater ? 'translateZ(10px)' : 'translateZ(5px)')
            }}
          >
            {isWrap && (
               <div className="absolute inset-0 opacity-30 bg-gradient-to-l from-black/60 via-transparent to-white/20 pointer-events-none mix-blend-multiply border border-black/10 z-20" />
            )}
            {config.printMedium.id === 'canvas' && (
               <div className="absolute inset-0 opacity-[0.2] mix-blend-multiply pointer-events-none z-10" 
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/woven-light.png")' }} />
            )}
            <ImageWithSkeleton 
              src={config.image} 
              alt="Your Art" 
              className={cn("block", compareConfig ? "h-[15vh] md:h-[20vh] lg:h-[35vh] xl:h-[40vh]" : "h-[20vh] md:h-[25vh] lg:h-[45vh] xl:h-[50vh]")}
              style={{
                aspectRatio: `${config.artWidth} / ${config.artHeight}`,
                width: 'auto',
                maxWidth: compareConfig ? 'calc(50vw - 80px)' : 'calc(100vw - 120px)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Preview Area (Left) */}
        <div 
          ref={previewContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("relative flex items-center justify-center p-4 lg:p-12 overflow-hidden shrink-0 transition-all duration-300", 
            isPanelMinimized ? "flex-1" : "h-[45vh] md:h-[50vh] lg:h-auto lg:flex-1 flex-none"
          )}
          style={{ 
            backgroundColor: isARMode ? 'transparent' : wallColor.color,
            backgroundImage: customWallImage && !isARMode ? `url(${customWallImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-color 0.5s ease',
            perspective: '1200px'
          }}
        >
          {/* Back Home Button */}
          <Link 
            to="/" 
            className="absolute top-4 left-4 lg:top-6 lg:left-6 z-[60] flex items-center justify-center p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 text-charcoal hover:bg-white hover:scale-105 transition-all text-sm focus:outline-none group"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-charcoal" />
          </Link>

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
                key="frames-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: frameScale * userZoom }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.4 },
                  scale: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className={cn("relative inline-flex items-center justify-center shrink-0 w-full", compareConfig ? "flex-col md:flex-row gap-8 md:gap-16 lg:gap-24" : "")}
                style={{ 
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d'
                }}
              >
                {configsToRender.map((c) => renderFrameElement(c))}
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

          {/* Zoom Controls */}
          {image && !isARMode && (
            <div className="absolute bottom-6 right-6 flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 p-1.5 z-30">
              <button 
                onClick={handleZoomOut}
                className="p-2 text-gray-500 hover:text-charcoal hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                disabled={userZoom <= MIN_ZOOM}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1.5"></div>
              <button 
                onClick={handleZoomReset}
                className="px-3 text-xs font-medium text-gray-600 hover:text-charcoal transition-colors uppercase tracking-wider"
                title="Reset Zoom"
              >
                {Math.round(userZoom * 100)}%
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1.5"></div>
              <button 
                onClick={handleZoomIn}
                className="p-2 text-gray-500 hover:text-charcoal hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                disabled={userZoom >= MAX_ZOOM}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Controls Area (Right) */}
        <div className={cn("w-full lg:w-[450px] bg-white border-l border-gray-200 flex flex-col lg:flex-none overflow-hidden z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] shrink-0 transition-all duration-300",
          isPanelMinimized ? "flex-none lg:h-full" : "flex-1 lg:h-full"
        )}>
          
          {/* Active Image Status */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
             <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <h3 className="text-sm font-semibold text-charcoal">Artwork Overview</h3>
                   <button 
                     onClick={handleReset} 
                     className="text-gray-400 hover:text-charcoal p-1 rounded-full hover:bg-gray-200 transition-colors"
                     title="Reset all choices"
                   >
                     <RotateCcw className="w-3 h-3" />
                   </button>
                 </div>
                 
                 <div className="flex items-center gap-2 lg:hidden">
                   <button 
                     onClick={() => setIsPanelMinimized(!isPanelMinimized)}
                     className="p-1 text-gray-500 hover:text-charcoal hover:bg-gray-200 rounded transition-colors"
                     title={isPanelMinimized ? "Expand Panel" : "Minimize Panel"}
                   >
                     {isPanelMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                   </button>
                 </div>
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex flex-wrap items-center gap-2">
                   <button
                     onClick={() => {
                       triggerHaptic();
                       if (compareConfig) {
                         setCompareConfig(null);
                       } else {
                         setCompareConfig(stateAsConfig);
                       }
                     }}
                     className={cn("p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium", compareConfig ? "bg-charcoal text-white" : "bg-purple-50 text-purple-600 hover:bg-purple-100")}
                     title="Compare Configurations"
                   >
                     <Columns className="w-3.5 h-3.5" />
                     <span className="hidden sm:inline">{compareConfig ? 'Comparing' : 'Compare'}</span>
                   </button>
                   <button
                     onClick={toggleARMode}
                     className={cn("p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium", isARMode ? "bg-charcoal text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100")}
                     title="View in AR"
                   >
                     <Camera className="w-3.5 h-3.5" />
                     <span className="hidden sm:inline">{isARMode ? 'AR On' : 'AR View'}</span>
                   </button>
                 </div>
                 
                 <div className="flex items-center gap-2 relative">
                   <p className="text-xs text-gray-500 hidden sm:block absolute right-[110%] w-max whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                     {image ? 'Custom image loaded' : 'No image selected'}
                   </p>
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded text-charcoal hover:bg-gray-50 transition-colors shadow-sm focus:outline-none shrink-0 border-b-2"
                     style={{ borderBottomColor: image ? '#4ade80' : '#e5e7eb' }}
                   >
                     {image ? 'Change Art' : 'Upload Art'}
                   </button>
                 </div>
               </div>
               
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
          <div className={cn("overflow-x-auto border-b border-gray-200 bg-white z-10 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", isPanelMinimized ? "hidden lg:flex" : "flex")}>
            <button 
              onClick={() => setActiveTab('size')}
              className={cn(
                "px-4 py-3 lg:px-5 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'size' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <BoxSelect className="w-4 h-4" /> Size
            </button>
            <button 
              onClick={() => setActiveTab('frame')}
              className={cn(
                "px-4 py-3 lg:px-5 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'frame' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Frame className="w-4 h-4" /> Frame
            </button>
            {framingType.id !== 'wrap' && framingType.id !== 'floater' && (
              <button 
                onClick={() => setActiveTab('mat')}
                className={cn(
                  "px-4 py-3 lg:px-5 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'mat' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <Ruler className="w-4 h-4" /> Matting
              </button>
            )}
            {framingType.id !== 'wrap' && (
              <button 
                onClick={() => setActiveTab('glass')}
                className={cn(
                  "px-4 py-3 lg:px-5 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'glass' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <Droplets className="w-4 h-4" /> Glass
              </button>
            )}
            <button 
              onClick={() => setActiveTab('wall')}
              className={cn(
                "px-4 py-3 lg:px-5 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === 'wall' ? "border-charcoal text-charcoal" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <Palette className="w-4 h-4" /> Wall
            </button>
          </div>

          {/* Tab Content */}
          <div className={cn("p-4 md:p-6 pb-24 lg:pb-6 flex-1 overflow-y-auto min-h-0 bg-gray-50/30", isPanelMinimized ? "hidden lg:block" : "block")}>
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
                            <span className="text-xs lg:text-sm font-medium">{medium.name}</span>
                            <span className={cn("text-[10px] lg:text-xs mt-1", printMedium.id === medium.id ? "text-white/80" : "text-gray-500")}>{medium.desc}</span>
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
                  {/* Framing Type */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Mounting Style</h3>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {FRAMING_TYPES.map(type => (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={type.id}
                          onClick={() => {
                            triggerHaptic();
                            setFramingType(type);
                            if (type.id === 'wrap' || type.id === 'floater') {
                              setPrintMedium(PRINT_MEDIA[3]); // Canvas
                              setMatSize(MAT_SIZES[0]); // No mat
                              if (type.id === 'wrap') {
                                setGlassType(GLASS_TYPES[0]); // Actually no glass, just visual fallback
                              }
                            }
                          }}
                          className={cn(
                            "flex flex-col text-left p-3 border transition-all rounded",
                            framingType.id === type.id ? "border-charcoal bg-charcoal text-white" : "border-gray-200 hover:border-gray-300 bg-white"
                          )}
                        >
                          <span className="text-xs lg:text-sm font-medium">{type.name}</span>
                          <span className={cn("text-[10px] lg:text-xs mt-1", framingType.id === type.id ? "text-white/80" : "text-gray-500")}>{type.desc}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Style */}
                  {framingType.id !== 'wrap' && (
                  <>
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
                        onClick={() => setFrameMaterialTab('plastic')}
                        className={cn("flex-1 text-xs font-medium py-2 rounded-md transition-all", frameMaterialTab === 'plastic' ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-gray-700")}
                      >
                        Plastic Frames
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
                            className={cn("relative w-full aspect-video rounded mb-2 shadow-inner border border-gray-100 overflow-hidden", 
                              (style.texture || (style as any).thumbnail) ? "bg-cover bg-center" : ""
                            )} 
                            style={{ 
                              backgroundColor: style.color,
                              backgroundImage: (style as any).thumbnail ? `url(${(style as any).thumbnail})` : (style.texture ? `url(${style.texture})` : undefined)
                            }}
                          >
                            {!(style as any).thumbnail && style.material === 'wood' && !style.texture && (
                               <>
                                 <div className="absolute inset-0 opacity-100 pointer-events-none mix-blend-color-burn" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
                                 <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', backgroundSize: '200px 200px' }} />
                               </>
                            )}
                            {!(style as any).thumbnail && style.id.startsWith('withered-') && (
                               <>
                                 <div className="absolute inset-0 pointer-events-none opacity-80" 
                                      style={{ backgroundColor: '#5c4033', WebkitMaskImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', WebkitMaskSize: '150px 150px', maskImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', maskSize: '150px 150px' }} />
                                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
                               </>
                            )}
                            {!(style as any).thumbnail && ['brushed-gold', 'silver', 'bronze'].includes(style.id) && (
                               <>
                                 <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")', backgroundSize: '200px 200px' }} />
                                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png")', backgroundSize: '150px 150px' }} />
                                 <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" 
                                      style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px, transparent 5px, transparent 9px, rgba(255,255,255,0.5) 9px, rgba(255,255,255,0.5) 10px, transparent 10px, transparent 15px)' }} />
                               </>
                            )}
                            {!(style as any).thumbnail && style.id === 'rusted' && (
                               <>
                                 <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-90" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rusty-metal.png")' }} />
                                 <div className="absolute inset-0 pointer-events-none mix-blend-color-burn opacity-80" 
                                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
                               </>
                            )}

                            {(style as any).thumbnail && (
                              <div 
                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                                title="Actual Frame"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxImage((style as any).thumbnail);
                                }}
                              >
                                <Plus className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
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
                  </>
                  )}
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
                          <span className="text-xs lg:text-sm font-medium block">{size.name}</span>
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
                          <span className="text-xs lg:text-sm font-semibold">{g.name}</span>
                          <span className={cn("text-[10px] lg:text-xs mt-1", glassType.id === g.id ? "text-white/80" : "text-gray-500")}>{g.description}</span>
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
          <div className={cn("lg:hidden fixed left-4 md:left-6 z-40 transition-all duration-300", 
            isPanelMinimized ? "bottom-[130px] md:bottom-[140px]" : "bottom-6"
          )}>
            <button 
              onClick={() => setIsMobileCartOpen(true)}
              className="bg-charcoal text-white p-3.5 md:p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
            </button>
          </div>

          {/* Details Summary Footer (Desktop) */}
          <div className="hidden lg:block p-4 lg:p-5 bg-white border-t border-gray-200 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-30 shrink-0">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1 group relative cursor-help w-max">
                  Estimated Total
                  <Info className="w-3.5 h-3.5" />
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-charcoal text-white text-xs rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                    <div className="flex justify-between mb-1"><span>Base & Handling:</span><span>${priceBreakdown.base}</span></div>
                    <div className="flex justify-between mb-1"><span>Frame ({frameStyle.name}):</span><span>${priceBreakdown.frame}</span></div>
                    {framingType.id !== 'wrap' && framingType.id !== 'floater' && matSize.id !== 'none' && (
                      <div className="flex justify-between mb-1"><span>Mat ({matSize.name}):</span><span>${priceBreakdown.mat}</span></div>
                    )}
                    {framingType.id !== 'wrap' && (
                      <div className="flex justify-between font-medium pt-1 mt-1 border-t border-gray-600"><span>Glass ({glassType.name}):</span><span>${priceBreakdown.glass}</span></div>
                    )}
                  </div>
                </h4>
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
              onClick={handlePlaceOrder}
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
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1 group relative cursor-help w-max">
                        Estimated Total
                        <Info className="w-3.5 h-3.5" />
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-charcoal text-white text-xs rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                          <div className="flex justify-between mb-1"><span>Base & Handling:</span><span>${priceBreakdown.base}</span></div>
                          <div className="flex justify-between mb-1"><span>Frame ({frameStyle.name}):</span><span>${priceBreakdown.frame}</span></div>
                          {framingType.id !== 'wrap' && framingType.id !== 'floater' && matSize.id !== 'none' && (
                            <div className="flex justify-between mb-1"><span>Mat ({matSize.name}):</span><span>${priceBreakdown.mat}</span></div>
                          )}
                          {framingType.id !== 'wrap' && (
                            <div className="flex justify-between font-medium pt-1 mt-1 border-t border-gray-600"><span>Glass ({glassType.name}):</span><span>${priceBreakdown.glass}</span></div>
                          )}
                        </div>
                      </h4>
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
                    onClick={(e) => {
                      setIsMobileCartOpen(false);
                      handlePlaceOrder(e);
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

      {/* Lightbox for Texture/Thumbnail Previews */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <img 
                src={lightboxImage} 
                alt="Actual Frame Texture" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
