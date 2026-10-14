import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      className="sticky top-0 z-40 shadow-lg border-b border-white/10"
      style={{ background: 'linear-gradient(180deg, #07111E 0%, #0F2038 100%)' }}
    >
      <div className="page-container py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4">
        {/* Approved Official Office Logo - Full-bleed circular fit */}
        <div
          className="flex-shrink-0 w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center relative"
          style={{
            border: '2px solid #E0B535',
            background: '#07111E',
            boxShadow: '0 0 0 1px rgba(224, 181, 53, 0.3), 0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          <img
            src="/rajasthan-police-logo.webp"
            alt="राजस्थान पुलिस प्रतीक चिह्न"
            className="w-full h-full object-cover object-center scale-[1.18]"
          />
        </div>

        {/* Office Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-[14px] xs:text-[16px] sm:text-[19px] md:text-[21px] font-bold text-white font-devanagari leading-snug tracking-tight">
            पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
          </h1>
          <p className="text-[10px] xs:text-[11px] sm:text-[12px] text-amber-300/90 font-devanagari font-medium mt-0.5 leading-tight">
            जनसुनवाई उपलब्धता एवं आधिकारिक सूचना पोर्टल
          </p>
        </div>
      </div>

      {/* Subtle Gold Accent Line */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #C9A227 30%, #FDE047 50%, #C9A227 70%, transparent 100%)',
        }}
      />
    </header>
  );
};
