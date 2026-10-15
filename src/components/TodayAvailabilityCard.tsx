import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Info,
  Clock4,
  BadgeCheck,
  Timer
} from 'lucide-react';
import type { Availability, AvailabilitySlot } from '../types/database';
import { getTodayHindiDate, formatHindiDateTime, getStatusConfig } from '../utils/dateHindi';

interface TodayAvailabilityCardProps {
  availability: Availability;
  slots: AvailabilitySlot[];
}

const STATUS_LABELS: Record<string, string> = {
  available: 'जनसुनवाई के लिए उपलब्ध',
  unavailable: 'जनसुनवाई के लिए उपलब्ध नहीं',
  confirmation_pending: 'समय की पुष्टि बाकी है',
  time_changed: 'जनसुनवाई के समय में बदलाव',
};

export const TodayAvailabilityCard: React.FC<TodayAvailabilityCardProps> = ({
  availability,
  slots,
}) => {
  const statusCfg = getStatusConfig(availability.status);
  const todayHindi = getTodayHindiDate();
  const lastUpdated = formatHindiDateTime(availability.updated_at);
  const statusLabel = STATUS_LABELS[availability.status] || STATUS_LABELS.confirmation_pending;

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
      icon: <Clock4 className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FCD34D' }} />,
      accentBg: '#F8FAFC',
      accentBorder: '#E2E8F0',
      accentText: '#1E293B',
      headerBg: 'linear-gradient(135deg, #0A192F 0%, #172D4D 55%, #1F3A60 100%)',
    },
  };

  const meta = statusMeta[availability.status] || statusMeta.confirmation_pending;

  const slotStatusBadge = (slot_status: string) => {
    if (slot_status === 'cancelled')
      return <span style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-devanagari whitespace-nowrap">रद्द</span>;
    if (slot_status === 'tentative')
      return <span style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1' }} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-devanagari whitespace-nowrap">निर्धारण बाकी</span>;
    return <span style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-devanagari whitespace-nowrap">पुष्ट ✓</span>;
  };

  return (
    <section aria-label="आज की जनसुनवाई स्थिति" className="card">
      {/* ── Colored status header band ── */}
      <div style={{ background: meta.headerBg, padding: '16px 20px' }}>
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div
            className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {meta.icon}
          </div>

          {/* Status text */}
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-devanagari"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                आज की स्थिति
              </span>
              {availability.timing_type === 'confirmed' ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.2)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.3)' }}>
                  <BadgeCheck className="w-3 h-3" /> पुष्ट समय
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.2)', color: '#FDE68A', border: '1px solid rgba(253,230,138,0.3)' }}>
                  <Timer className="w-3 h-3" /> प्रस्तावित समय
                </span>
              )}
            </div>

            <h2 className="text-white font-bold font-devanagari leading-snug"
              style={{ fontSize: 'clamp(15px, 4.5vw, 20px)' }}>
              {statusLabel}
            </h2>
            <p className="text-slate-300 font-devanagari mt-1 leading-relaxed" style={{ fontSize: '11px' }}>
              {statusCfg.subText}
            </p>
          </div>
        </div>
      </div>

      {/* ── Date & verified row ── */}
      <div
        className="flex items-center justify-between px-5 py-2.5 text-xs"
        style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
      >
        <div className="flex items-center gap-1.5 font-devanagari font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>{todayHindi}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span
            className="live-dot w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: statusCfg.dotColor }}
          />
          <span className="font-devanagari text-[10px] font-medium">कार्यालय द्वारा सत्यापित</span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="card-body">
        {/* Public message */}
        {availability.public_message && (
          <div
            className="flex items-start gap-3 p-3.5 rounded-xl mb-5 text-xs sm:text-sm font-devanagari leading-relaxed"
            style={{ background: meta.accentBg, border: `1px solid ${meta.accentBorder}`, color: meta.accentText }}
          >
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-80" />
            <div>
              <strong className="font-semibold mr-1">कार्यालय संदेश:</strong>
              {availability.public_message}
            </div>
          </div>
        )}

        {/* Time Slots */}
        {availability.status !== 'unavailable' && slots.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Clock4 className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                आज के जनसुनवाई सत्र
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot, index) => (
                <div
                  key={slot.id || index}
                  className="rounded-xl p-3.5 flex items-center justify-between"
                  style={{
                    background: slot.slot_status === 'cancelled' ? '#FEF2F2' : slot.slot_status === 'tentative' ? '#F8FAFC' : '#F0FDF4',
                    border: `1px solid ${slot.slot_status === 'cancelled' ? '#FECACA' : slot.slot_status === 'tentative' ? '#E2E8F0' : '#BBF7D0'}`,
                  }}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 font-devanagari block mb-0.5">
                      {slot.slot_label || `सत्र ${index + 1}`}
                    </span>
                    <strong
                      className="font-sans-num font-bold text-slate-900"
                      style={{
                        fontSize: '14px',
                        textDecoration: slot.slot_status === 'cancelled' ? 'line-through' : 'none',
                        opacity: slot.slot_status === 'cancelled' ? 0.5 : 1,
                      }}
                    >
                      {slot.start_time} — {slot.end_time}
                    </strong>
                  </div>
                  {slotStatusBadge(slot.slot_status)}
                </div>
              ))}
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

        {/* Last updated */}
        <div
          className="flex items-center justify-between mt-4 pt-3.5 font-devanagari"
          style={{ borderTop: '1px solid #F1F5F9' }}
        >
          <span className="text-[10px] text-slate-400">
            अंतिम अद्यतन: <span className="text-slate-600 font-medium">{lastUpdated}</span>
          </span>
          <span className="text-[10px] text-slate-400">चित्तौड़गढ़ पुलिस</span>
        </div>
      </div>
    </section>
  );
};
