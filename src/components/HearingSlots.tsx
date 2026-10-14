import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';
import type { AvailabilitySlot, TimingType } from '../types/database';

interface HearingSlotsProps {
  slots: AvailabilitySlot[];
  timingType: TimingType;
  isUnavailable?: boolean;
}

export const HearingSlots: React.FC<HearingSlotsProps> = ({ slots, timingType, isUnavailable }) => {
  if (isUnavailable) return null;

  return (
    <section className="space-y-3" aria-labelledby="slots-heading">
      {/* Section heading */}
      <div className="flex items-end justify-between">
        <div>
          <p className="section-eyebrow font-devanagari">समय सारिणी</p>
          <h2 id="slots-heading" className="section-title font-devanagari">दैनिक जनसुनवाई सत्र</h2>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full font-devanagari flex items-center gap-1 flex-shrink-0 mb-1"
          style={
            timingType === 'confirmed'
              ? { background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }
              : { background: '#FFFBEB', color: '#78350F', border: '1px solid #FDE68A' }
          }
        >
          {timingType === 'confirmed' ? '✓ पुष्ट' : '⏳ प्रस्तावित'}
        </span>
      </div>

      {slots.length === 0 ? (
        <div
          className="p-5 rounded-2xl text-center text-sm text-slate-500 font-devanagari"
          style={{ background: '#ffffff', border: '1px dashed #CBD5E1' }}
        >
          आज के लिए कोई विशेष सत्र दर्ज नहीं। कृपया स्वागत पटल से संपर्क करें।
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((slot, index) => {
            const isCancelled = slot.slot_status === 'cancelled';
            const isTentative = slot.slot_status === 'tentative';

            const cardStyle = isCancelled
              ? { background: '#FEF2F2', border: '1px solid #FECACA' }
              : isTentative
              ? { background: '#FFFBEB', border: '1px solid #FDE68A' }
              : { background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' };

            return (
              <div
                key={slot.id || index}
                className="rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all"
                style={cardStyle}
              >
                {/* Icon bubble */}
                <div
                  className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: isCancelled ? '#FEE2E2' : isTentative ? '#FEF3C7' : '#EFF6FF',
                  }}
                >
                  {isCancelled ? (
                    <CalendarDays className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Clock className="w-5 h-5" style={{ color: isTentative ? '#D97706' : '#2563EB' }} />
                  )}
                </div>

                {/* Time info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-500 font-devanagari block mb-0.5">
                    {slot.slot_label || `सत्र ${index + 1}`}
                  </span>
                  <p
                    className="font-bold font-sans-num text-slate-900"
                    style={{
                      fontSize: '15px',
                      textDecoration: isCancelled ? 'line-through' : 'none',
                      opacity: isCancelled ? 0.5 : 1,
                    }}
                  >
                    {slot.start_time} — {slot.end_time}
                  </p>
                  <p className="text-[10px] font-devanagari mt-0.5"
                    style={{ color: isCancelled ? '#DC2626' : isTentative ? '#D97706' : '#059669' }}>
                    {isCancelled ? 'यह सत्र निरस्त किया गया है' : isTentative ? 'प्रस्तावित (संशोधन संभव)' : 'नियमित जनसुनवाई सत्र'}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full font-devanagari"
                  style={
                    isCancelled
                      ? { background: '#FEE2E2', color: '#991B1B' }
                      : isTentative
                      ? { background: '#FEF3C7', color: '#92400E' }
                      : { background: '#D1FAE5', color: '#065F46' }
                  }
                >
                  {isCancelled ? 'रद्द' : isTentative ? 'प्रस्तावित' : 'पुष्ट'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
