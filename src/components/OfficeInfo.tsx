import React from 'react';
import { MapPin, ExternalLink, PhoneCall, ShieldAlert, Globe, Radio } from 'lucide-react';

interface EmergencyNumber {
  number: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    number: '112',
    label: 'पुलिस आपातकाल',
    href: 'tel:112',
    icon: <ShieldAlert className="w-4 h-4" />,
    highlight: true,
  },
  {
    number: '1090',
    label: 'महिला हेल्पलाइन',
    href: 'tel:1090',
    icon: <PhoneCall className="w-4 h-4" />,
  },
  {
    number: '1930',
    label: 'साइबर अपराध',
    href: 'tel:1930',
    icon: <Globe className="w-4 h-4" />,
  },
  {
    number: '01472-240055',
    label: 'कंट्रोल रूम',
    href: 'tel:01472240055',
    icon: <Radio className="w-4 h-4" />,
  },
];

const CITIZEN_GUIDELINES = [
  'जनसुनवाई कक्ष में उपस्थित होते समय अपनी लिखित शिकायत/परिवाद की <strong>2 सुपाठ्य प्रतियां</strong> साथ रखें।',
  'पहचान के सत्यापन हेतु मूल <strong>आधार कार्ड अथवा सरकारी पहचान पत्र</strong> साथ लाएं।',
  'यदि पूर्व में किसी थाने/चौकी में रिपोर्ट दर्ज कराई गई हो, तो उसकी <strong>रसीद/FIR प्रति</strong> अवश्य संलग्न करें।',
];

export const OfficeInfo: React.FC = () => {
  return (
    <section className="space-y-4" aria-labelledby="office-info-heading">
      {/* Section heading */}
      <div>
        <p className="section-eyebrow font-devanagari">नागरिक जानकारी</p>
        <h2 id="office-info-heading" className="section-title font-devanagari">
          आवश्यक निर्देश एवं संपर्क
        </h2>
      </div>

      {/* Citizen Guidelines */}
      <div className="card">
        <div className="card-header">
          <span className="text-xs font-bold text-slate-700 font-devanagari">
            जनसुनवाई में आने वाले नागरिकों हेतु आवश्यक निर्देश
          </span>
        </div>
        <div className="card-body">
          <ul className="space-y-3">
            {CITIZEN_GUIDELINES.map((guide, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                  style={{ background: '#1D3557', minWidth: '20px' }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-xs sm:text-sm text-slate-600 font-devanagari leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: guide }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div>
        <h3
          className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 font-devanagari"
          style={{ letterSpacing: '0.1em' }}
        >
          आपातकालीन सहायता नंबर
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EMERGENCY_NUMBERS.map(({ number, label, href, icon, highlight }) => (
            <a
              key={number}
              href={href}
              className="emergency-card"
              style={
                highlight
                  ? { border: '1.5px solid #FCA5A5', background: '#FEF2F2' }
                  : {}
              }
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                style={{
                  background: highlight ? '#FEE2E2' : '#EFF6FF',
                  color: highlight ? '#DC2626' : '#2563EB',
                }}
              >
                {icon}
              </div>
              <div
                className="font-bold font-sans-num leading-none"
                style={{ fontSize: number.length > 5 ? '11px' : '16px', color: highlight ? '#DC2626' : '#0F172A' }}
              >
                {number}
              </div>
              <div className="text-[10px] text-slate-500 font-devanagari mt-1 leading-tight text-center">
                {label}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Office Address */}
      <div
        className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}
          >
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 font-devanagari">कार्यालय पता</h4>
            <p className="text-xs text-slate-600 font-devanagari mt-0.5 leading-relaxed">
              पुलिस अधीक्षक कार्यालय, कलेक्ट्रेट परिसर, चित्तौड़गढ़ (राजस्थान) — 312001
            </p>
          </div>
        </div>

        <a
          href="https://maps.google.com/?q=SP+Office+Chittorgarh+Rajasthan"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary self-stretch sm:self-auto justify-center whitespace-nowrap"
        >
          <span className="font-devanagari">मानचित्र देखें</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
        </a>
      </div>
    </section>
  );
};
