import React from 'react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-6 border-t border-amber-400/20"
      style={{
        background: 'linear-gradient(180deg, #07111E 0%, #0A1628 100%)',
      }}
    >
      <div className="page-container py-4 sm:py-5">
        {/* Compact Center Branding */}
        <div className="flex items-center justify-center gap-3 mb-2.5">
          {/* Official Logo - compact size like header */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{
              border: '1.5px solid #E0B535',
              background: '#07111E',
              boxShadow: '0 0 0 1px rgba(224, 181, 53, 0.25)',
            }}
          >
            <img
              src="/rajasthan-police-logo.webp"
              alt="राजस्थान पुलिस"
              className="w-full h-full object-cover object-center scale-[1.18]"
            />
          </div>

          <div className="text-left">
            <h3 className="font-bold text-white font-devanagari text-xs sm:text-sm leading-tight">
              पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
            </h3>
            <p className="text-slate-400 text-[10px] sm:text-[11px] font-devanagari leading-tight mt-0.5">
              जनसुनवाई उपलब्धता एवं आधिकारिक सूचना पोर्टल
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.07)', margin: '10px 0' }} />

        {/* Compact Attribution & Links */}
        <div className="text-center space-y-1">
          <p className="text-[11px] font-devanagari font-medium text-amber-300">
            डिजिटल पहल: ChittorTech, चित्तौड़गढ़
          </p>
          <p className="text-[10px] text-slate-400 font-sans">
            An Initiative by ChittorTech — For the Citizens of Chittorgarh.
          </p>

          {/* Copyright & Discreet Admin Link */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] text-slate-500 font-sans">
            <span>© {year} SP Office, Chittorgarh</span>
            <span>·</span>
            {onOpenAdmin ? (
              <button
                onClick={onOpenAdmin}
                className="text-slate-400 hover:text-amber-300 transition-colors underline font-devanagari"
                title="अधिकृत स्टाफ लॉगिन"
              >
                अधिकृत स्टाफ लॉगिन
              </button>
            ) : (
              <a
                href="#admin"
                className="text-slate-400 hover:text-amber-300 transition-colors underline font-devanagari"
              >
                अधिकृत स्टाफ लॉगिन
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
