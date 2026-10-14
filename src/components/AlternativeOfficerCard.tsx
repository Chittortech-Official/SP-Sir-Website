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
  timing,
  isSpUnavailable = false,
}) => {
  // Don't show anything if SP is available and no alternative is designated
  if (!officer && !isSpUnavailable) return null;

  // SP unavailable but no alternative officer confirmed
  if (!officer && isSpUnavailable) {
    return (
      <div
        className="rounded-2xl p-4 sm:p-5 flex items-start gap-3"
        style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#FEF3C7' }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-amber-900 font-devanagari mb-1">
            वैकल्पिक जनसुनवाई अधिकारी की सूचना
          </h3>
          <p className="text-xs text-amber-800 font-devanagari leading-relaxed">
            वैकल्पिक जनसुनवाई अधिकारी की जानकारी अभी कार्यालय द्वारा अद्यतन नहीं की गई है। कृपया आधिकारिक पुष्टि के लिए संपर्क करें।
          </p>
          <a
            href="tel:01472240055"
            className="inline-flex items-center gap-1.5 mt-2.5 text-amber-900 font-semibold text-xs font-devanagari"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            कंट्रोल रूम: 01472-240055
          </a>
        </div>
      </div>
    );
  }

  if (!officer) return null;

  return (
    <div className="card">
      {/* Card header */}
      <div className="card-header">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 font-devanagari">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>अधिकृत वैकल्पिक जनसुनवाई अधिकारी</span>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-devanagari"
          style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}
        >
          कार्यवाहक व्यवस्था
        </span>
      </div>

      {/* Card body */}
      <div className="card-body">
        <div className="flex items-center gap-4">
          {/* Placeholder avatar (not a real person photo) */}
          <div
            className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #1D3557 0%, #2A4A7F 100%)', minWidth: '56px' }}
          >
            {officer.name ? officer.name.charAt(0) : 'अ'}
          </div>

          {/* Officer info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 font-devanagari leading-tight truncate">
              {officer.name}
            </h3>
            <p className="text-xs text-slate-600 font-devanagari mt-0.5 leading-snug">
              {officer.designation}
            </p>
          </div>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap gap-2 mt-4">
          {timing && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-devanagari"
              style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0C4A6E' }}
            >
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>समय: <strong>{timing}</strong></span>
            </div>
          )}
          {officer.phone && (
            <a
              href={`tel:${officer.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-devanagari transition-all"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#065F46' }}
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>दूरभाष: {officer.phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
