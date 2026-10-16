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
      <div className="page-container pt-6 pb-24 sm:pt-8 sm:pb-28">
        {/* Center Branding - Clean White Background Style with good spacing */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left mb-4 mt-1">
          {/* Official Police Emblem */}
          <div
            className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center relative"
            style={{
              width: '46px',
              height: '46px',
              minWidth: '46px',
              minHeight: '46px',
              maxWidth: '46px',
              maxHeight: '46px',
              border: '2px solid #C9A227',
              background: '#07111E',
              boxShadow: '0 2px 8px rgba(201, 162, 39, 0.25)',
            }}
          >
            <img
              src="/rajasthan-police-logo.webp"
              alt="राजस्थान पुलिस प्रतीक चिह्न"
              className="w-full h-full object-cover object-center scale-[1.15]"
              style={{ width: '100%', height: '100%' }}
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

        {/* Attribution & Copyright in Dark/Golden Tones */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
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

          {/* Elegant and attractive initiative button */}
          {onOpenInitiative && (
            <button
              type="button"
              onClick={onOpenInitiative}
              className="inline-flex items-center gap-1.5 px-3 py-1 my-0.5 rounded-full bg-slate-100 hover:bg-amber-50 border border-slate-300 hover:border-amber-400 text-slate-800 hover:text-amber-900 font-bold text-xs font-devanagari transition-all active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>पहल परिचय (About Initiative)</span>
            </button>
          )}

          <p className="text-[10px] text-slate-400 font-sans pt-0.5">
            © {year} Office of the Superintendent of Police, Chittorgarh (Rajasthan). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
