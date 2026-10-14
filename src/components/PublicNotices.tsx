import React from 'react';
import { FileText, Calendar, AlertCircle, Clock } from 'lucide-react';
import type { PublicNotice } from '../types/database';
import { formatHindiDateTime } from '../utils/dateHindi';

interface PublicNoticesProps {
  notices: PublicNotice[];
}

const priorityStyles: Record<string, { bg: string; border: string; badgeClass: string; badgeLabel: string; icon: React.ReactNode }> = {
  high: {
    bg: '#FEF2F2',
    border: '#FECACA',
    badgeClass: 'notice-badge-high',
    badgeLabel: 'अत्यावश्यक',
    icon: <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />,
  },
  normal: {
    bg: '#ffffff',
    border: '#E2E8F0',
    badgeClass: 'notice-badge-normal',
    badgeLabel: 'सूचना',
    icon: <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />,
  },
  low: {
    bg: '#F8FAFC',
    border: '#E2E8F0',
    badgeClass: 'notice-badge-low',
    badgeLabel: 'सामान्य',
    icon: <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />,
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
      <div>
        <p className="section-eyebrow font-devanagari">सूचना पट्ट</p>
        <h2 id="notices-heading" className="section-title font-devanagari">सार्वजनिक सूचनाएँ</h2>
      </div>

      <div className="space-y-3">
        {activeNotices.map(notice => {
          const pStyle = priorityStyles[notice.priority || 'normal'] || priorityStyles.normal;
          return (
            <div
              key={notice.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: pStyle.bg,
                border: `1px solid ${pStyle.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {/* Priority top bar */}
              {notice.priority === 'high' && (
                <div style={{ height: '3px', background: 'linear-gradient(90deg, #EF4444, #DC2626)' }} />
              )}

              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  {pStyle.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 font-devanagari leading-snug">
                        {notice.title}
                      </h3>
                      <span
                        className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full font-devanagari ${pStyle.badgeClass}`}
                      >
                        {pStyle.badgeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-devanagari mt-1.5 leading-relaxed">
                      {notice.message}
                    </p>
                  </div>
                </div>

                {/* Footer row */}
                <div
                  className="flex items-center justify-between mt-3 pt-2.5 text-[10px] text-slate-400 font-devanagari"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>प्रकाशन: {formatHindiDateTime(notice.publish_at || notice.created_at)}</span>
                  </div>
                  {notice.expires_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>वैध: {formatHindiDateTime(notice.expires_at)}</span>
                    </div>
                  )}
                  <span>एसपी कार्यालय</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
