import React from 'react';
import { Phone, Building2, Star } from 'lucide-react';
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
      <div>
        <p className="section-eyebrow font-devanagari">जिला पुलिस नेतृत्व</p>
        <h2 id="officers-heading" className="section-title font-devanagari">
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
              className="card transition-all"
              style={isFirst ? { border: '1px solid #FDE68A' } : {}}
            >
              <div className="card-body">
                <div className="flex items-start gap-3.5">
                  {/* Avatar with initials */}
                  <div
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-base"
                    style={{
                      background: isFirst
                        ? 'linear-gradient(135deg, #78350F 0%, #B45309 100%)'
                        : 'linear-gradient(135deg, #1D3557 0%, #2A4A7F 100%)',
                      minWidth: isFirst ? '56px' : '48px',
                      minHeight: isFirst ? '56px' : '48px',
                      fontSize: isFirst ? '18px' : '15px',
                    }}
                  >
                    {initials}
                  </div>

                  {/* Officer details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 font-devanagari leading-snug"
                            style={{ fontSize: isFirst ? '15px' : '13px' }}>
                            {officer.name}
                          </h3>
                          {isFirst && <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" />}
                        </div>
                        <p className="text-xs text-slate-600 font-devanagari mt-0.5 leading-snug">
                          {officer.designation}
                        </p>
                        {officer.description && (
                          <p className="text-[10px] text-slate-400 font-devanagari mt-1 leading-relaxed">
                            {officer.description}
                          </p>
                        )}
                      </div>

                      {/* Rank badge */}
                      <span
                        className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans"
                        style={{ background: rankBadge.bg, color: rankBadge.color, border: `1px solid ${rankBadge.border}` }}
                      >
                        {rankBadge.label}
                      </span>
                    </div>

                    {/* Contact row */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5" style={{ borderTop: '1px solid #F1F5F9' }}>
                      <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-[10px] text-slate-400 font-devanagari flex-1">कार्यालय संपर्क</span>
                      {officer.phone ? (
                        <a
                          href={`tel:${officer.phone}`}
                          className="flex items-center gap-1.5 text-xs font-semibold font-sans-num transition-all"
                          style={{ color: '#065F46', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 10px', borderRadius: '8px' }}
                        >
                          <Phone className="w-3 h-3" />
                          {officer.phone}
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-devanagari">उपलब्ध नहीं</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
