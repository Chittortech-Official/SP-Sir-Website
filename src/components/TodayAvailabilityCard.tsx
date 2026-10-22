import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Clock4,
} from 'lucide-react';
import type { Availability, AvailabilitySlot } from '../types/database';
import { getStatusConfig } from '../utils/dateHindi';

interface TodayAvailabilityCardProps {
  availability: Availability;
  slots: AvailabilitySlot[];
}

const STATUS_LABELS: Record<string, string> = {
  available: 'जनसुनवाई के लिए उपलब्ध',
  unavailable: 'जनसुनवाई के लिए उपलब्ध नहीं',
  confirmation_pending: 'जनसुनवाई के लिए उपलब्ध',
  time_changed: 'जनसुनवाई के लिए उपलब्ध',
};

export const TodayAvailabilityCard: React.FC<TodayAvailabilityCardProps> = ({
  availability,
  slots: _slots,
}) => {
  const statusCfg = getStatusConfig(availability.status);
  const statusLabel = STATUS_LABELS[availability.status] || 'जनसुनवाई के लिए उपलब्ध';

  const statusMeta: Record<string, { icon: React.ReactNode; accentBg: string; accentBorder: string; accentText: string; headerBg: string }> = {
    available: {
      icon: <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#059669' }} />,
      accentBg: '#ECFDF5',
      accentBorder: '#6EE7B7',
      accentText: '#065F46',
      headerBg: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0B1728 100%)',
    },
    unavailable: {
      icon: <XCircle className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#DC2626' }} />,
      accentBg: '#FEF2F2',
      accentBorder: '#FCA5A5',
      accentText: '#7F1D1D',
      headerBg: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #0B1728 100%)',
    },
    time_changed: {
      icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#2563EB' }} />,
      accentBg: '#EFF6FF',
      accentBorder: '#93C5FD',
      accentText: '#1E3A8A',
      headerBg: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #0B1728 100%)',
    },
    confirmation_pending: {
      icon: <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#059669' }} />,
      accentBg: '#ECFDF5',
      accentBorder: '#6EE7B7',
      accentText: '#065F46',
      headerBg: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0B1728 100%)',
    },
  };

  const meta = statusMeta[availability.status] || statusMeta.available;

  return (
    <section aria-label="आज की जनसुनवाई स्थिति" className="card">
      {/* ── Colored status header band ── */}
      <div style={{ background: meta.headerBg, padding: '20px' }}>
        <div className="flex flex-col items-center justify-center text-center gap-3">
          {/* Status icon */}
          <div
            className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {meta.icon}
          </div>

          {/* Status text */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Status badge */}
            <div className="flex items-center justify-center mb-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-devanagari"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                आज की स्थिति
              </span>
            </div>

            <h2 className="text-white font-bold font-devanagari leading-snug text-center"
              style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
              {statusLabel}
            </h2>
            <p className="text-slate-300 font-devanagari mt-1 leading-relaxed text-center" style={{ fontSize: '12px' }}>
              {statusCfg.subText}
            </p>
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="card-body">
        {/* Office Hours Hearing Session - Fully Centered */}
        {availability.status !== 'unavailable' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2.5">
              <Clock4 className="w-4 h-4 text-amber-700" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-devanagari">
                आज का जनसुनवाई सत्र
              </span>
            </div>

            <div
              className="rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5"
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
              }}
            >
              <span className="text-[11px] text-slate-500 font-devanagari block">
                जनसुनवाई समय
              </span>
              <strong
                className="font-bold text-slate-900 font-devanagari text-base sm:text-lg"
              >
                कार्यालय समय
              </strong>
              <span
                style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }}
                className="text-[11px] font-bold px-3 py-0.5 rounded-full font-devanagari whitespace-nowrap mt-0.5"
              >
                पुष्ट ✓
              </span>
            </div>
          </div>
        )}

        {/* No slots message when unavailable */}
        {availability.status === 'unavailable' && (
          <div
            className="rounded-xl p-4 text-center text-sm font-devanagari text-slate-600"
            style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1' }}
          >
            आज जनसुनवाई उपलब्ध नहीं है। कल पुनः जांच करें।
          </div>
        )}
      </div>
    </section>
  );
};
