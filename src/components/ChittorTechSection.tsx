import React from 'react';
import { Zap, Users, Smartphone } from 'lucide-react';

export const ChittorTechSection: React.FC = () => {
  return (
    <section
      className="rounded-2xl overflow-hidden"
      aria-labelledby="chittortech-heading"
      style={{
        background: 'linear-gradient(160deg, #0B1728 0%, #112240 60%, #1D3557 100%)',
        border: '1px solid rgba(201,162,39,0.25)',
        boxShadow: '0 4px 20px rgba(11,23,40,0.15)',
      }}
    >
      {/* Gold top accent */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227, #E0B535, #C9A227, transparent)' }} />

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span
              className="text-[10px] font-bold tracking-wider uppercase font-sans mb-1 block"
              style={{ color: '#E0B535' }}
            >
              CHITTORTECH · INITIATIVE
            </span>
            <h2
              id="chittortech-heading"
              className="font-bold text-white font-devanagari leading-snug"
              style={{ fontSize: 'clamp(14px, 4vw, 17px)' }}
            >
              चित्तौड़गढ़ के नागरिकों की सुविधा के लिए<br />एक डिजिटल पहल
            </h2>
          </div>

          {/* CT Logo mark */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.35)',
              letterSpacing: '-0.5px',
            }}
          >
            <span style={{ color: '#E0B535', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>CT</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 font-devanagari leading-relaxed mb-5 text-xs sm:text-sm">
          ChittorTech का उद्देश्य तकनीक के माध्यम से नागरिकों तक उपयोगी सार्वजनिक जानकारी को सरल तरीके से पहुँचाना है। यह पोर्टल नागरिकों को जनसुनवाई के प्रकाशित समय और उपलब्धता संबंधी जानकारी प्राप्त करने में सहायता करता है, जिससे वे कार्यालय आने से पहले अपनी यात्रा की योजना बना सकें।
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { icon: <Smartphone className="w-3 h-3" />, label: 'मोबाइल-फर्स्ट पोर्टल' },
            { icon: <Users className="w-3 h-3" />, label: 'नागरिक केंद्रित' },
            { icon: <Zap className="w-3 h-3" />, label: 'रीयल-टाइम जानकारी' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-devanagari font-medium"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#CBD5E1',
              }}
            >
              <span style={{ color: '#E0B535' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Attribution footer */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-white font-bold text-xs font-devanagari">
              ChittorTech, चित्तौड़गढ़
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5 font-sans">
              An Initiative by ChittorTech — For the Citizens of Chittorgarh.
            </p>
          </div>
          <span
            className="text-[10px] font-medium px-2.5 py-1 rounded-full font-devanagari"
            style={{
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.3)',
              color: '#E0B535',
            }}
          >
            तकनीकी पहल
          </span>
        </div>
      </div>
    </section>
  );
};
