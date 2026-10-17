import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDisplayTimeMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDisplayTimeMs = 1400,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Start fade-out animation after minDisplayTimeMs
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDisplayTimeMs);

    // Complete removal after transition finishes (600ms transition)
    const removeTimer = setTimeout(() => {
      setIsMounted(false);
      onFinish?.();
    }, minDisplayTimeMs + 650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDisplayTimeMs, onFinish]);

  if (!isMounted) return null;

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsMounted(false);
          onFinish?.();
        }, 300);
      }}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center px-4 transition-all duration-700 ease-out select-none cursor-pointer ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0F223D 0%, #07111E 70%, #040A12 100%)',
      }}
      aria-label="Loading Portal"
    >
      {/* Background Subtle Security Shield Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center animate-fade-in">
        {/* Rajasthan Police Official Crest Badge with Royal Gold Accent */}
        <div className="relative mb-5">
          {/* Subtle Outer Glow */}
          <div
            className="absolute -inset-2 rounded-full blur-md opacity-40 animate-pulse"
            style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)' }}
          />

          <div
            className="relative rounded-full overflow-hidden flex items-center justify-center"
            style={{
              width: '78px',
              height: '78px',
              border: '2.5px solid #C9A227',
              background: '#07111E',
              boxShadow: '0 0 25px rgba(201, 162, 39, 0.35), inset 0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            <img
              src="/rajasthan-police-logo.webp"
              alt="राजस्थान पुलिस"
              className="w-full h-full object-cover object-center scale-110"
            />
          </div>
        </div>

        {/* Office Heading */}
        <h1 className="text-xl sm:text-2xl font-black text-white font-devanagari tracking-tight leading-snug drop-shadow-md">
          पुलिस अधीक्षक कार्यालय
        </h1>

        {/* District & State */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs sm:text-sm font-extrabold tracking-widest font-devanagari uppercase"
            style={{ color: '#E0B535', textShadow: '0 0 10px rgba(224, 181, 53, 0.4)' }}
          >
            चित्तौड़गढ़ • राजस्थान
          </span>
        </div>

        {/* Official Motto */}
        <p className="text-[11.5px] sm:text-xs text-slate-300 font-devanagari mt-2.5 tracking-wide opacity-90">
          आमजन में विश्वास, अपराधियों में भय
        </p>

        {/* Sleek Golden Accent Loading Bar */}
        <div className="w-32 sm:w-40 h-0.5 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 rounded-full animate-shimmer"
            style={{
              width: '60%',
              animation: 'shimmerSlide 1.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Embedded Animation Keyframe */}
      <style>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};
