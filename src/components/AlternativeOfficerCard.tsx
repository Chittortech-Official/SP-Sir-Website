import React from 'react';
import { UserCheck, Phone, Clock, AlertTriangle, PhoneCall } from 'lucide-react';
import type { OfficerProfile } from '../types/database';

interface AlternativeOfficerCardProps {
  officer?: OfficerProfile | null;
  timing?: string;
  isSpUnavailable?: boolean;
}

export const AlternativeOfficerCard: React.FC<AlternativeOfficerCardProps> = ({
  officer,
  timing: _timing,
  isSpUnavailable = false,
}) => {
  // Don't show anything if SP is available and no alternative is designated
  if (!officer && !isSpUnavailable) return null;

  // SP unavailable but no alternative officer confirmed
  if (!officer && isSpUnavailable) {
    return (
      <div
        className="rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-3"
        style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#FEF3C7' }}
        >
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base text-amber-900 font-devanagari mb-1 leading-relaxed">
            वैकल्पिक जनसुनवाई अधिकारी की सूचना
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 font-devanagari leading-relaxed max-w-md mx-auto">
            वैकल्पिक जनसुनवाई अधिकारी की जानकारी अभी कार्यालय द्वारा अद्यतन नहीं की गई है। कृपया आधिकारिक पुष्टि के लिए संपर्क करें।
          </p>
          <div className="mt-3 flex justify-center">
            <a
              href="tel:01472240088"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 font-semibold text-xs font-devanagari shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>कंट्रोल रूम: 01472-240088</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!officer) return null;

  const initial = officer.name 
    ? officer.name.replace(/^(श्री|श्रीमती|Sh\.|Smt\.)\s*/i, '').trim().charAt(0) 
    : 'अ';

  return (
    <div className="card text-center" style={{ border: '1px solid #BAE6FD' }}>
      {/* Centered Card header */}
      <div 
        className="card-header flex flex-col sm:flex-row items-center justify-center gap-2 text-center py-3"
        style={{ background: '#F0F9FF', borderBottom: '1px solid #BAE6FD' }}
      >
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-900 font-devanagari leading-normal">
          <UserCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span>अधिकृत वैकल्पिक जनसुनवाई अधिकारी</span>
        </div>
        <span
          className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full font-devanagari whitespace-nowrap leading-normal"
          style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}
        >
          कार्यवाहक व्यवस्था
        </span>
      </div>

      {/* Centered Card body */}
      <div className="card-body p-4 sm:p-5 flex flex-col items-center justify-center text-center">
        {/* Officer Avatar with initial */}
        <div
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-sm flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1D3557 0%, #2A4A7F 100%)',
            width: '52px',
            height: '52px',
            fontSize: '18px',
            border: '2px solid #93C5FD',
          }}
        >
          {initial}
        </div>

        {/* Officer name & designation - Centered with safe Devanagari line-height */}
        <h3 className="font-bold text-base sm:text-[17px] text-slate-900 font-devanagari leading-relaxed">
          {officer.name}
        </h3>
        <p className="text-xs sm:text-[13px] text-police-800 font-semibold font-devanagari mt-0.5 leading-relaxed">
          {officer.designation}
        </p>

        {/* Centered Timing and Phone details */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 pt-3 border-t border-slate-100 w-full text-center">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-devanagari leading-normal whitespace-nowrap shadow-sm"
            style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0C4A6E' }}
          >
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
            <span>समय: <strong className="font-semibold text-slate-900">कार्यालय समय</strong></span>
          </div>
          {officer.phone && (
            <a
              href={`tel:${officer.phone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-devanagari transition-all hover:bg-emerald-100 leading-normal whitespace-nowrap shadow-sm"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#065F46' }}
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
              <span>दूरभाष: <strong className="font-sans-num">{officer.phone}</strong></span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
