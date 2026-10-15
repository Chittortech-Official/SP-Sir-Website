import React from 'react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenInitiative?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInitiative }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-8 bg-white border-t-2 border-[#C9A227] shadow-sm"
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="page-container py-6 sm:py-7">
        {/* Center Branding - Clean White Background Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left mb-3">
          {/* Official Police Emblem */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center relative"
            style={{
              border: '2px solid #C9A227',
              background: '#07111E',
              boxShadow: '0 2px 10px rgba(201, 162, 39, 0.25)',
            }}
          >
            <img
              src="/rajasthan-police-logo.webp"
              alt="राजस्थान पुलिस प्रतीक चिह्न"
              className="w-full h-full object-cover object-center scale-[1.18]"
            />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 font-devanagari text-sm sm:text-base leading-snug tracking-tight">
              पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
            </h3>
            <p className="text-slate-600 text-xs sm:text-[12.5px] font-devanagari font-medium mt-0.5 leading-tight">
              जनसुनवाई उपलब्धता एवं आधिकारिक सूचना पोर्टल
            </p>
          </div>
        </div>

        {/* Elegant Golden Accent Divider */}
        <div 
          className="my-3.5 mx-auto max-w-md"
          style={{ 
            height: '1.5px', 
            background: 'linear-gradient(90deg, transparent 0%, #C9A227 30%, #FDE047 50%, #C9A227 70%, transparent 100%)' 
          }} 
        />

        {/* About This Initiative Button */}
        {onOpenInitiative && (
          <div className="flex justify-center mb-3">
            <button
              type="button"
              onClick={onOpenInitiative}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-amber-300 hover:border-amber-400 text-slate-800 hover:text-amber-950 font-bold text-xs sm:text-[12.5px] font-devanagari shadow-xs transition-all active:scale-95 group"
            >
              <img
                src="/chittortech_logo.png"
                alt="ChittorTech"
                className="w-4 h-4 object-contain"
              />
              <span>About This Initiative (इस डिजिटल पहल के बारे में)</span>
              <span className="text-[10px] bg-amber-500 text-white font-sans px-1.5 py-0.5 rounded group-hover:bg-amber-600 transition-colors">
                ChittorTech
              </span>
            </button>
          </div>
        )}

        {/* Attribution & Copyright in Dark/Golden Tones (Zero Login Links) */}
        <div className="text-center space-y-1 flex flex-col items-center">
          <div className="inline-flex items-center gap-2">
            <img
              src="/chittortech_logo.png"
              alt="ChittorTech Logo"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
            />
            <p className="text-xs sm:text-[13px] font-devanagari font-bold text-[#996515]">
              डिजिटल पहल: ChittorTech, चित्तौड़गढ़
            </p>
          </div>
          <p className="text-[11px] text-slate-600 font-sans font-medium">
            An Initiative by ChittorTech — For the Citizens of Chittorgarh.
          </p>
          <p className="text-[10px] text-slate-400 font-sans pt-0.5">
            © {year} Office of the Superintendent of Police, Chittorgarh (Rajasthan). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
