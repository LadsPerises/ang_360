import { useEffect, useRef, useState } from 'react';
import 'pannellum/build/pannellum.css';
// import pannellum JS which attaches to window
import 'pannellum/build/pannellum.js';

interface HotSpot {
  pitch: number;
  yaw: number;
  type: 'info' | 'scene' | 'custom';
  text?: string;
  cssClass?: string;
  createTooltipFunc?: (hotSpotDiv: HTMLElement, args: any) => void;
  createTooltipArgs?: any;
  clickHandlerFunc?: (event: MouseEvent, args: any) => void;
  clickHandlerArgs?: any;
}

interface PannellumViewerProps {
  image: string;
  title?: string;
  author?: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  autoLoad?: boolean;
  autoRotate?: number;
  hotSpots?: HotSpot[];
  onLoad?: () => void;
  onClick?: (pitch: number, yaw: number) => void;
}

// Extend Window interface to include pannellum
declare global {
  interface Window {
    pannellum: any;
  }
}

export default function PannellumViewer({
  image,
  title,
  author,
  pitch = 0,
  yaw = 0,
  hfov = 85,
  autoLoad = true,
  autoRotate = -2,
  hotSpots = [],
  onLoad,
  onClick
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !window.pannellum) return;

    // Destroy existing viewer if it exists
    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    // Generate a unique ID for the container if not set
    if (!containerRef.current.id) {
      containerRef.current.id = `pannellum-${Math.random().toString(36).substring(7)}`;
    }

    // Configuration object
    const config: any = {
      type: 'equirectangular',
      panorama: image,
      autoLoad,
      autoRotate,
      pitch,
      yaw,
      hfov,
      compass: false,
      showControls: false,
      hotSpots,
      dynamic: true, // Evita a geração de mipmaps desfocados no WebGL em produção
      haov: 360,
      vaov: 180,
    };

    if (title) config.title = title;
    if (author) config.author = author;

    // Initialize viewer
    try {
      viewerRef.current = window.pannellum.viewer(containerRef.current.id, config);
      
      // Hook up load event
      viewerRef.current.on('load', () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      });

      // Hook up mousedown event for editor clicks
      if (onClick) {
        viewerRef.current.on('mousedown', (e: MouseEvent) => {
          if (viewerRef.current) {
            const coords = viewerRef.current.mouseEventToCoords(e);
            if (coords) {
              onClick(coords[0], coords[1]);
            }
          }
        });
      }
    } catch (e) {
      console.error('Error initializing Pannellum:', e);
    }

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [image, autoLoad, autoRotate, pitch, yaw, hfov, hotSpots, title, author, onLoad]);

  return (
    <div className="relative w-full h-full bg-black">
      <div 
        ref={containerRef} 
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-0">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-medium tracking-widest text-sm uppercase">A carregar 360°</p>
        </div>
      )}
    </div>
  );
}
