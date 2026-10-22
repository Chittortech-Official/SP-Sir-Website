import React from 'react';
import { Clock } from 'lucide-react';
import type { AvailabilitySlot, TimingType } from '../types/database';

interface HearingSlotsProps {
  slots?: AvailabilitySlot[];
  timingType?: TimingType;
  isUnavailable?: boolean;
}

export const HearingSlots: React.FC<HearingSlotsProps> = ({ slots: _slots, timingType = 'confirmed', isUnavailable }) => {
  if (isUnavailable) return null;

  return (
    <section className="space-y-3" aria-labelledby="slots-heading">
      {/* Section heading - Centered */}
      <div className="text-center flex flex-col items-center justify-center mb-1">
        <p className="section-eyebrow font-devanagari text-center">समय सारिणी</p>
        <div className="flex items-center justify-center gap-2 mt-0.5 flex-wrap">
          <h2 id="slots-heading" className="section-title font-devanagari text-center">
            दैनिक जनसुनवाई सत्र
          </h2>
          <span
            className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full font-devanagari inline-flex items-center gap-1"
            style={
              timingType === 'confirmed'
                ? { background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }
                : { background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1' }
            }
          >
            {timingType === 'confirmed' ? '✓ पुष्ट समय' : 'समय पुष्टि प्रक्रियाधीन'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all"
          style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          {/* Icon bubble */}
          <div
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{ background: '#EFF6FF' }}
          >
            <Clock className="w-5 h-5 text-blue-600" />
          </div>

          {/* Time info */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-500 font-devanagari block mb-0.5">
              नियमित जनसुनवाई
            </span>
            <p
              className="font-bold font-devanagari text-slate-900 whitespace-nowrap"
              style={{ fontSize: '15px' }}
            >
              कार्यालय समय
            </p>
            <p className="text-[10.5px] font-devanagari mt-0.5 leading-tight text-emerald-700">
              आधिकारिक कार्यालय कार्यदिवस व कार्य समय अनुसार
            </p>
          </div>

          {/* Status badge */}
          <span
            className="flex-shrink-0 text-[10.5px] font-bold px-2.5 py-1 rounded-full font-devanagari whitespace-nowrap"
            style={{ background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}
          >
            पुष्ट ✓
          </span>
        </div>
      </div>
    </section>
  );
};
