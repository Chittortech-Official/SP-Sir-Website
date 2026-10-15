import React from 'react';
import { FileText, Calendar, AlertCircle, Clock, Shield } from 'lucide-react';
import type { PublicNotice } from '../types/database';
import { formatHindiDateTime } from '../utils/dateHindi';

interface PublicNoticesProps {
  notices: PublicNotice[];
}

const priorityStyles: Record<string, { bg: string; border: string; badgeClass: string; badgeLabel: string; icon: React.ReactNode; topBar: string }> = {
  high: {
    bg: '#ffffff',
    border: '#FECACA',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    badgeLabel: 'अत्यावश्यक',
    icon: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />,
    topBar: '#EF4444',
  },
  normal: {
    bg: '#ffffff',
    border: '#E2E8F0',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    badgeLabel: 'आधिकारिक सूचना',
    icon: <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />,
    topBar: '#3B82F6',
  },
  low: {
    bg: '#F8FAFC',
    border: '#E2E8F0',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300',
    badgeLabel: 'सामान्य सूचना',
    icon: <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />,
    topBar: '#94A3B8',
  },
};

export const PublicNotices: React.FC<PublicNoticesProps> = ({ notices }) => {
  const activeNotices = notices.filter(n => {
    if (!n.published) return false;
    if (n.expires_at && new Date(n.expires_at) < new Date()) return false;
    return true;
  });

  if (activeNotices.length === 0) return null;

  return (
    <section className="space-y-3" aria-labelledby="notices-heading">
      <div className="text-center mb-1">
        <p className="section-eyebrow font-devanagari text-center">सूचना पट्ट</p>
        <h2 id="notices-heading" className="section-title font-devanagari text-center">
          सार्वजनिक सूचनाएँ
        </h2>
      </div>

      <div className="space-y-3.5">
        {activeNotices.map(notice => {
          const pStyle = priorityStyles[notice.priority || 'normal'] || priorityStyles.normal;
          const publishTime = formatHindiDateTime(notice.publish_at || notice.created_at);
          const expiryTime = notice.expires_at ? formatHindiDateTime(notice.expires_at) : null;

          return (
            <article
              key={notice.id}
              className="rounded-2xl overflow-hidden transition-all bg-white"
              style={{
                border: `1px solid ${pStyle.border}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Colored top indicator line */}
              <div style={{ height: '3px', background: pStyle.topBar }} />

              <div className="p-4 sm:p-5">
                {/* Header row: Icon, Title, and Priority Badge */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                    {pStyle.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2.5 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 font-devanagari leading-snug">
                        {notice.title}
                      </h3>
                      <span
                        className={`flex-shrink-0 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full font-devanagari whitespace-nowrap ${pStyle.badgeClass}`}
                      >
                        {pStyle.badgeLabel}
                      </span>
                    </div>

                    {/* Notice Message Body */}
                    <p className="text-xs sm:text-[13px] text-slate-700 font-devanagari mt-2 leading-relaxed">
                      {notice.message}
                    </p>
                  </div>
                </div>

                {/* Structured Metadata Row - Perfectly Aligned and Clean */}
                {/* Centered Structured Metadata Row */}
                <div 
                  className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600 font-devanagari text-center"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>प्रकाशन: <strong className="font-semibold text-slate-800">{publishTime}</strong></span>
                  </div>

                  {expiryTime && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>वैध: <strong className="font-semibold text-slate-800">{expiryTime}</strong></span>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-police-800 bg-amber-50/80 border border-amber-200/70 px-3 py-1 rounded-full whitespace-nowrap">
                    <Shield className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>कार्यालय पुलिस अधीक्षक</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
