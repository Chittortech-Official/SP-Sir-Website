import React, { useEffect } from 'react';
import { X, Smartphone, Zap, Users, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface ChittorTechModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChittorTechModal: React.FC<ChittorTechModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-xl w-full rounded-3xl overflow-hidden relative shadow-2xl border border-amber-500/40 text-left animate-fade-in-up"
        style={{
          background: 'linear-gradient(155deg, #091322 0%, #112240 50%, #1B355A 100%)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Golden Top Accent Bar */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #C9A227 25%, #FDE047 50%, #C9A227 75%, transparent 100%)',
          }}
        />

        {/* Close Button in Corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4">
          {/* ── Brand Header Row ── */}
          <div className="flex items-start gap-3.5 pr-8">
            {/* Logo Container */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-white p-2"
              style={{
                border: '2px solid rgba(224, 181, 53, 0.7)',
                boxShadow: '0 4px 16px rgba(201, 162, 39, 0.35)',
              }}
            >
              <img
                src="/chittortech_logo.png"
                alt="ChittorTech Official Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/chittortech-logo.png';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[10.5px] font-extrabold tracking-wider uppercase font-sans flex items-center gap-1"
                  style={{ color: '#FDE047' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  CHITTORTECH INITIATIVE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="text-[10px] text-amber-200/90 font-devanagari font-medium">
                  तकनीक से जनसेवा
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-devanagari leading-snug tracking-tight mt-0.5">
                चित्तौड़गढ़ के नागरिकों की सुविधा हेतु — एक डिजिटल पहल
              </h2>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full font-devanagari"
            style={{
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.35)',
              color: '#FDE047',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>नागरिक एवं पुलिस सहायता हेतु तकनीकी पहल</span>
          </div>

          {/* ── Mission Description ── */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-devanagari text-xs sm:text-sm leading-relaxed">
            <strong className="text-white font-semibold">ChittorTech</strong> का मुख्य उद्देश्य आधुनिक सूचना तकनीक के माध्यम से चित्तौड़गढ़ के नागरिकों तक प्रशासनिक व उपयोगी सार्वजनिक जानकारी को पारदर्शी व सरल तरीके से पहुँचाना है। 
            <p className="mt-2 text-slate-300">
              यह पोर्टल नागरिकों को पुलिस अधीक्षक कार्यालय आने से पूर्व जनसुनवाई का पुष्ट समय, अधिकारी उपलब्धता एवं आकस्मिक सूचना ज्ञात करने में सहायता करता है, जिससे आमजन के बहुमूल्य समय और यात्रा श्रम की बचत होती है।
            </p>
          </div>

          {/* ── 3 Feature Highlights ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-400/20 text-amber-300">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs font-devanagari leading-tight">
                  मोबाइल-फर्स्ट
                </h4>
                <p className="text-[10.5px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                  सभी फोन पर सुलभ
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-400/20 text-amber-300">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs font-devanagari leading-tight">
                  1-क्लिक लाइव स्थिति
                </h4>
                <p className="text-[10.5px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                  कार्यालय द्वारा अद्यतन
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-400/20 text-amber-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs font-devanagari leading-tight">
                  नागरिक केंद्रित
                </h4>
                <p className="text-[10.5px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                  समय व श्रम की बचत
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar & Close Action ── */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-white font-bold text-xs font-devanagari">
                ChittorTech, चित्तौड़गढ़ (राजस्थान)
              </p>
              <p className="text-slate-400 text-[10px] font-sans">
                Designed & Developed as a Public Digital Service Initiative.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#007074] hover:bg-[#005B5E] text-white font-bold text-xs font-devanagari transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>समझ गया / बंद करें (Close)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
