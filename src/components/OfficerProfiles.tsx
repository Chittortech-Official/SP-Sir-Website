import React from 'react';
import { Phone, Star } from 'lucide-react';
import type { OfficerProfile } from '../types/database';

interface OfficerProfilesProps {
  officers: OfficerProfile[];
}

const getRankBadge = (designation: string) => {
  if (designation.includes('SP') || designation.includes('अधीक्षक') && !designation.includes('अतिरिक्त')) {
    return { label: 'SP', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
  }
  if (designation.includes('Addl') || designation.includes('अतिरिक्त')) {
    return { label: 'Addl. SP', bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };
  }
  if (designation.includes('DSP') || designation.includes('उप') || designation.includes('CO')) {
    return { label: 'DSP / CO', bg: '#F0FDF4', color: '#065F46', border: '#BBF7D0' };
  }
  return { label: 'अधिकारी', bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' };
};

const getInitials = (name: string) => {
  // Extract first letter of the actual name (skip श्री / Sh.)
  const cleaned = name.replace(/^(श्री|श्रीमती|Sh\.|Smt\.)\s*/i, '').trim();
  return cleaned.charAt(0).toUpperCase();
};

export const OfficerProfiles: React.FC<OfficerProfilesProps> = ({ officers }) => {
  if (officers.length === 0) return null;

  return (
    <section className="space-y-3" aria-labelledby="officers-heading">
      <div className="text-center mb-1">
        <p className="section-eyebrow font-devanagari text-center">जिला पुलिस नेतृत्व</p>
        <h2 id="officers-heading" className="section-title font-devanagari text-center">
          पुलिस अधिकारी — संपर्क जानकारी
        </h2>
      </div>

      <div className="space-y-3">
        {officers.map((officer, index) => {
          const rankBadge = getRankBadge(officer.designation);
          const initials = getInitials(officer.name);
          const isFirst = index === 0;

          return (
            <div
              key={officer.id || index}
              className="card transition-all text-center"
              style={isFirst ? { border: '1.5px solid #FDE68A', boxShadow: '0 2px 10px rgba(201, 162, 39, 0.08)' } : {}}
            >
              <div className="card-body p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                {/* Avatar with initials - Centered */}
                <div
                  className="rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-sm flex-shrink-0"
                  style={{
                    background: isFirst
                      ? 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)'
                      : 'linear-gradient(135deg, #1D3557 0%, #2A4A7F 100%)',
                    width: isFirst ? '52px' : '46px',
                    height: isFirst ? '52px' : '46px',
                    fontSize: isFirst ? '17px' : '15px',
                    border: isFirst ? '2px solid #C9A227' : '1.5px solid #CBD5E1',
                  }}
                >
                  {initials}
                </div>

                {/* Rank Badge - Centered */}
                <div className="mb-1">
                  <span
                    className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full font-sans tracking-wide"
                    style={{ background: rankBadge.bg, color: rankBadge.color, border: `1px solid ${rankBadge.border}` }}
                  >
                    {rankBadge.label}
                  </span>
                </div>

                {/* Officer Name with Star if SP - Centered */}
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <h3
                    className="font-bold text-slate-900 font-devanagari leading-snug"
                    style={{ fontSize: isFirst ? '16px' : '14px' }}
                  >
                    {officer.name}
                  </h3>
                  {isFirst && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                </div>

                {/* Designation - Centered */}
                <p className="text-xs sm:text-[13px] text-police-800 font-semibold font-devanagari leading-snug">
                  {officer.designation}
                </p>

                {/* Description - Centered */}
                {officer.description && (
                  <p className="text-[11px] text-slate-500 font-devanagari mt-1 max-w-sm mx-auto leading-relaxed">
                    {officer.description}
                  </p>
                )}

                {/* Centered Contact Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex justify-center">
                  {(() => {
                    const phoneToDisplay =
                      officer.id === 'eaddd30b-4a41-46e6-a9ad-4fb5e61f571d' ||
                      officer.name.includes('धर्मेन्द्र') ||
                      (officer.designation.includes('SP') && !officer.designation.includes('अतिरिक्त') && !officer.designation.includes('Addl'))
                        ? '01472-240006'
                        : officer.phone;

                    return phoneToDisplay ? (
                      <a
                        href={`tel:${phoneToDisplay.split('/')[0].trim()}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold font-sans-num transition-all hover:bg-emerald-100"
                        style={{
                          color: '#065F46',
                          background: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          padding: '5px 14px',
                          borderRadius: '9999px',
                        }}
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>कार्यालय संपर्क: <strong>{phoneToDisplay}</strong></span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-devanagari">कार्यालय संपर्क उपलब्ध नहीं</span>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
