import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      className="sticky top-0 z-40 bg-white border-b-2 border-[#C9A227]"
      style={{
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="page-container pt-3 pb-2.5 sm:pt-4 sm:pb-3 flex flex-col items-center justify-center text-center">
        {/* Approved Official Office Logo - Compact, Strictly Sized, with Top Margin */}
        <div
          className="rounded-full overflow-hidden flex items-center justify-center relative mt-1.5 mb-2 flex-shrink-0"
          style={{
            width: '46px',
            height: '46px',
            minWidth: '46px',
            minHeight: '46px',
            maxWidth: '46px',
            maxHeight: '46px',
            border: '2px solid #C9A227',
            background: '#07111E',
            boxShadow: '0 2px 8px rgba(201, 162, 39, 0.3)',
          }}
        >
          <img
            src="/rajasthan-police-logo.webp"
            alt="राजस्थान पुलिस प्रतीक चिह्न"
            className="w-full h-full object-cover object-center scale-[1.15]"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Office Title & Subtitle - Centered with Crisp Dark Text */}
        <div className="max-w-md mx-auto">
          <h1 className="text-[15px] xs:text-[17px] sm:text-[19px] font-extrabold text-[#0E1B2E] font-devanagari leading-snug tracking-tight">
            पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
          </h1>
          <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-police-700 font-devanagari font-semibold mt-0.5 leading-tight">
            जनसुनवाई उपलब्धता एवं आधिकारिक सूचना पोर्टल
          </p>
        </div>
      </div>
    </header>
  );
};
