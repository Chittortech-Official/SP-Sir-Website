import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TodayAvailabilityCard } from '../components/TodayAvailabilityCard';
import { AlternativeOfficerCard } from '../components/AlternativeOfficerCard';
import { HearingSlots } from '../components/HearingSlots';
import { OfficerProfiles } from '../components/OfficerProfiles';
import { PublicNotices } from '../components/PublicNotices';
import { OfficeInfo } from '../components/OfficeInfo';
import { Footer } from '../components/Footer';
import { DataService, supabase } from '../lib/supabase';
import type { Availability, AvailabilitySlot, OfficerProfile, PublicNotice } from '../types/database';
import { AlertTriangle, RefreshCw, Calendar } from 'lucide-react';
import { getTodayHindiDate } from '../utils/dateHindi';

interface PublicPortalProps {
  onOpenAdmin: () => void;
  onOpenInitiative?: () => void;
  onOpenDirectory?: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  onOpenAdmin,
  onOpenInitiative,
}) => {
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [alternativeOfficer, setAlternativeOfficer] = useState<OfficerProfile | undefined>();
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [notices, setNotices] = useState<PublicNotice[]>([]);

  const loadData = async (showInitialLoader = false) => {
    if (showInitialLoader) setLoading(true);
    setDataError(null);

    try {
      const [availRes, officersRes, noticesRes] = await Promise.all([
        DataService.getTodayAvailability(),
        DataService.getOfficers(),
        DataService.getPublicNotices(),
      ]);

      setAvailability(availRes.availability);
      setSlots(availRes.slots);
      setAlternativeOfficer(availRes.alternativeOfficer);
      setOfficers(officersRes);
      setNotices(noticesRes);
    } catch (err: unknown) {
      console.error('Failed to load data', err);
      setDataError('नवीनतम जनसुनवाई स्थिति लोड करने में विलंब हो रहा है। डेटा स्थानीय संग्रह से प्रदर्शित किया जा रहा है।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    loadData(true);

    // Instant local sync via CustomEvent & Storage
    const handleInstantSync = () => {
      loadData(false);
    };
    window.addEventListener('sp_availability_changed', handleInstantSync);
    window.addEventListener('storage', handleInstantSync);

    // BroadcastChannel for instant cross-tab sync
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('sp_portal_sync');
      bc.onmessage = () => {
        loadData(false);
      };
    }

    // Supabase Realtime subscription: ONLY for real-time dynamic tables (availability, slots, notices)
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel('public-portal-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => {
          loadData(false);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_slots' }, () => {
          loadData(false);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'public_notices' }, () => {
          loadData(false);
        })
        .subscribe();
    }

    // Light fallback: Refresh only when citizen returns/focuses the tab
    const handleTabActive = () => {
      if (document.visibilityState === 'visible') {
        loadData(false);
      }
    };

    document.addEventListener('visibilitychange', handleTabActive);
    window.addEventListener('focus', handleTabActive);

    // Clean up listeners
    return () => {
      window.removeEventListener('sp_availability_changed', handleInstantSync);
      window.removeEventListener('storage', handleInstantSync);
      if (bc) bc.close();
      if (channel && supabase) supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', handleTabActive);
      window.removeEventListener('focus', handleTabActive);
    };
  }, []);

  const todayHindi = getTodayHindiDate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F4F8' }}>
      {/* ── Redesigned Streamlined Header ── */}
      <Header />

      {/* ── Hero Band ── */}
      <div
        style={{
          background: 'linear-gradient(160deg, #0B1728 0%, #1D3557 60%, #2A4A7F 100%)',
          paddingTop: '20px',
          paddingBottom: '22px',
        }}
      >
        <div className="page-container text-center flex flex-col items-center">
          {/* Today's date pill - Centered */}
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <div
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11.5px] font-devanagari font-semibold"
              style={{ background: 'rgba(201,162,39,0.18)', border: '1px solid rgba(201,162,39,0.4)', color: '#FDE047' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayHindi}</span>
            </div>
          </div>

          {/* Main tagline - Centered */}
          <h2
            className="font-devanagari font-extrabold text-white leading-tight mb-2 text-center"
            style={{ fontSize: 'clamp(20px, 5.5vw, 26px)' }}
          >
            आमजन में विश्वास,<br />
            <span style={{ color: '#E0B535' }}>जनसुनवाई में सुविधा</span>
          </h2>
          <p className="font-devanagari text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto text-center">
            जनसुनवाई की जानकारी, अब आसानी से — चित्तौड़गढ़ के नागरिकों हेतु ChittorTech की एक डिजिटल पहल।
          </p>
        </div>
      </div>

      {/* ── Availability & Public Information Content (Placed cleanly BELOW blue hero) ── */}
      <div className="flex-1 pt-4 sm:pt-6">
        <div className="page-container pb-12">

          {/* Connection status notice */}
          {dataError && (
            <div
              className="mb-4 p-3.5 rounded-2xl flex items-start gap-3 text-xs font-devanagari animate-fade-in"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#78350F' }}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">सत्यापन सूचना: </strong>
                {dataError}
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center animate-fade-in">
              <div
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-sm text-slate-500 font-devanagari">
                  आधिकारिक जनसुनवाई स्थिति लोड हो रही है...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* 1. Availability Hero Card (Highest Prominence) */}
              {availability && (
                <div className="animate-fade-in-up stagger-1">
                  <TodayAvailabilityCard availability={availability} slots={slots} />
                </div>
              )}

              {/* 2. Alternative Officer (when SP unavailable or designated) */}
              {availability && (
                <div className="animate-fade-in-up stagger-2">
                  <AlternativeOfficerCard
                    officer={alternativeOfficer}
                    timing={availability.alternative_timing}
                    isSpUnavailable={availability.status === 'unavailable'}
                  />
                </div>
              )}

              {/* 3. Hearing Slots */}
              {availability && (
                <div className="animate-fade-in-up stagger-3">
                  <HearingSlots
                    slots={slots}
                    timingType={availability.timing_type}
                    isUnavailable={availability.status === 'unavailable'}
                  />
                </div>
              )}

              {/* 4. Public Notices */}
              <div className="animate-fade-in-up stagger-4">
                <PublicNotices notices={notices} />
              </div>

              {/* 5. Officer Profiles */}
              <div className="animate-fade-in-up stagger-5">
                <OfficerProfiles officers={officers} />
              </div>

              {/* 6. Office Info & Emergency */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.40s' }}>
                <OfficeInfo />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Premium Compact Footer with Initiative Page Navigation ── */}
      <Footer
        onOpenAdmin={onOpenAdmin}
        onOpenInitiative={onOpenInitiative}
      />
    </div>
  );
};
