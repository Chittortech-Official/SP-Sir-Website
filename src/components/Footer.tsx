import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-4"
      style={{ background: '#0B1728', borderTop: '1px solid rgba(201,162,39,0.2)' }}
    >
      <div className="page-container py-8">
        {/* Logo & office name */}
        <div className="flex flex-col items-center text-center mb-5">
          <div
            className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mb-3"
            style={{ border: '2px solid rgba(201,162,39,0.5)', background: '#000' }}
          >
            <img
              src="/rajasthan-police-logo.webp"
              alt="राजस्थान पुलिस"
              style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
          </div>
          <h3 className="font-bold text-white font-devanagari text-sm sm:text-base">
            पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
          </h3>
          <p className="text-slate-500 text-xs font-devanagari mt-1">
            राजस्थान पुलिस · सेवार्थ कटिबद्धता
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />

        {/* ChittorTech attribution */}
        <div className="text-center space-y-1.5">
          <p className="text-slate-400 text-xs font-devanagari">
            सार्वजनिक जनसुनवाई उपलब्धता एवं आधिकारिक नागरिक सूचना पोर्टल
          </p>
          <p className="text-[11px] font-devanagari" style={{ color: '#E0B535' }}>
            डिजिटल पहल: ChittorTech, चित्तौड़गढ़
          </p>
          <p className="text-[10px] text-slate-600 font-sans mt-2">
            © {year} Rajasthan Police · Chittorgarh District · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
