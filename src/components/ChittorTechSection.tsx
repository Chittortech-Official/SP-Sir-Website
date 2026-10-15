import React from 'react';
import { Smartphone, Zap, Users, ShieldCheck, Sparkles } from 'lucide-react';

export const ChittorTechSection: React.FC = () => {

  return (
    <section
      className="rounded-3xl overflow-hidden relative"
      aria-labelledby="chittortech-heading"
      style={{
        background: 'linear-gradient(150deg, #091322 0%, #112240 50%, #1B355A 100%)',
        border: '1.5px solid rgba(201, 162, 39, 0.35)',
        boxShadow: '0 8px 30px rgba(9, 19, 34, 0.25)',
      }}
    >
      {/* Radiant Golden Top Accent Bar */}
      <div 
        style={{ 
          height: '3px', 
          background: 'linear-gradient(90deg, transparent 0%, #C9A227 25%, #FDE047 50%, #C9A227 75%, transparent 100%)' 
        }} 
      />

      <div className="p-5 sm:p-7">
        {/* ── Top Header Row with Strong ChittorTech Branding ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {/* ChittorTech Logo Container */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-transform hover:scale-105 bg-white p-2"
              style={{
                border: '2px solid rgba(224, 181, 53, 0.6)',
                boxShadow: '0 4px 16px rgba(201, 162, 39, 0.3)',
              }}
            >
              <img
                src="/chittortech_logo.png"
                alt="ChittorTech Official Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to alternate file name if needed
                  (e.target as HTMLImageElement).src = '/chittortech-logo.png';
                }}
              />
            </div>

            {/* Title & Tag */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span 
                  className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase font-sans flex items-center gap-1"
                  style={{ color: '#FDE047' }}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  CHITTORTECH INITIATIVE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="text-[10.5px] text-amber-200/90 font-devanagari font-medium">
                  तकनीक से जनसेवा
                </span>
              </div>
              <h2
                id="chittortech-heading"
                className="text-base sm:text-lg font-bold text-white font-devanagari leading-snug tracking-tight mt-0.5"
              >
                चित्तौड़गढ़ के नागरिकों की सुविधा हेतु — एक डिजिटल पहल
              </h2>
            </div>
          </div>

          <div
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full font-devanagari flex-shrink-0"
            style={{
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.35)',
              color: '#FDE047',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>नागरिक एवं पुलिस सहायता पहल</span>
          </div>
        </div>

        {/* ── Mission Description ── */}
        <p className="text-slate-300 font-devanagari text-xs sm:text-[13.5px] leading-relaxed mb-5">
          <strong className="text-white font-semibold">ChittorTech</strong> का मुख्य उद्देश्य आधुनिक सूचना तकनीक के माध्यम से चित्तौड़गढ़ के नागरिकों तक उपयोगी प्रशासनिक व सार्वजनिक जानकारी को पारदर्शी व सरल तरीके से पहुँचाना है। यह पोर्टल नागरिकों को पुलिस अधीक्षक कार्यालय आने से पूर्व जनसुनवाई का पुष्ट समय व अधिकारी उपलब्धता ज्ञात करने में सहायता करता है, जिससे आमजन के बहुमूल्य समय और यात्रा श्रम की बचत होती है।
        </p>

        {/* ── 3 Prominent Feature Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Feature 1 */}
          <div
            className="p-3.5 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#FDE047' }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-xs sm:text-[13px] font-devanagari leading-tight truncate">
                मोबाइल-फर्स्ट पोर्टल
              </h3>
              <p className="text-[11px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                सभी फोन पर त्वरित सुलभ
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            className="p-3.5 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#FDE047' }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-xs sm:text-[13px] font-devanagari leading-tight truncate">
                1-क्लिक लाइव स्थिति
              </h3>
              <p className="text-[11px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                कार्यालय द्वारा तुरंत अद्यतन
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            className="p-3.5 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201, 162, 39, 0.15)', color: '#FDE047' }}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-xs sm:text-[13px] font-devanagari leading-tight truncate">
                नागरिक सुविधा केंद्र
              </h3>
              <p className="text-[11px] text-slate-400 font-devanagari mt-0.5 leading-tight">
                समय व यात्रा श्रम की बचत
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Attribution Bar ── */}
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3.5"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div>
            <p className="text-white font-extrabold text-xs sm:text-sm font-devanagari">
              ChittorTech, चित्तौड़गढ़ (राजस्थान)
            </p>
            <p className="text-slate-400 text-[10.5px] mt-0.5 font-sans">
              Designed & Developed as a Public Digital Service initiative for the district.
            </p>
          </div>

          <div
            className="text-[10.5px] font-bold px-3 py-1 rounded-full font-devanagari"
            style={{
              background: 'linear-gradient(90deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.05) 100%)',
              border: '1px solid rgba(201,162,39,0.4)',
              color: '#FDE047',
            }}
          >
            चित्तौड़गढ़ तकनीकी गौरव
          </div>
        </div>
      </div>
    </section>
  );
};
