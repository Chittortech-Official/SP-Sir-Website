import React from 'react';
import { PhoneCall, Lock, RefreshCw, Shield } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 shadow-xl" style={{ background: 'linear-gradient(180deg, #07111E 0%, #0F2038 100%)' }}>
      {/* ── Top utility strip ── */}
      <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="page-container flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 font-bold font-devanagari tracking-wide">राजस्थान पुलिस</span>
            <span className="text-slate-600 hidden xs:inline">·</span>
            <span className="text-slate-300 font-devanagari hidden xs:inline text-[11px]">जिला चित्तौड़गढ़</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:112"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-colors"
              style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)' }}
              aria-label="Emergency 112"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="font-sans-num tracking-wide">आपातकाल: 112</span>
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 text-xs font-devanagari transition-colors py-0.5 px-1"
              title="Staff Login"
              aria-label="Admin Login"
            >
              <Lock className="w-3 h-3" />
              <span>स्टाफ लॉगिन</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main branding row (Enlarged & Spacious) ── */}
      <div className="page-container py-3.5 sm:py-4.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo + Title group */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Official Rajasthan Police Logo - Full fill badge */}
          <div className="flex-shrink-0 relative">
            <div
              className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                border: '2.5px solid #E0B535',
                background: '#07111E',
                boxShadow: '0 0 0 2px rgba(224, 181, 53, 0.35), 0 4px 14px rgba(0, 0, 0, 0.6)',
              }}
            >
              <img
                src="/rajasthan-police-logo.webp"
                alt="राजस्थान पुलिस प्रतीक चिह्न"
                className="w-full h-full object-cover object-center"
                style={{
                  transform: 'scale(1.16)',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          </div>

          {/* Title block with generous hierarchy */}
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-amber-400 font-sans leading-none mb-1">
              RAJASTHAN POLICE · CHITTORGARH
            </p>
            <h1 className="text-[16px] sm:text-[19px] md:text-[21px] font-bold text-white font-devanagari leading-snug">
              पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
            </h1>
            <p className="text-[11px] sm:text-[12px] text-slate-300 font-devanagari mt-1 leading-normal">
              जनसुनवाई उपलब्धता · आधिकारिक सूचना पोर्टल
            </p>
          </div>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-slate-300 hover:text-white border border-slate-700 hover:border-amber-400/50 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'rgba(255, 255, 255, 0.07)' }}
            title="ताज़ा करें (Refresh)"
            aria-label="Refresh page"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        )}
      </div>

      {/* ── Premium Gold accent line ── */}
      <div style={{ height: '2.5px', background: 'linear-gradient(90deg, transparent 0%, #C9A227 25%, #FDE047 50%, #C9A227 75%, transparent 100%)' }} />
    </header>
  );
};
