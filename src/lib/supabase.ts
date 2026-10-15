import { createClient } from '@supabase/supabase-js';
import type { 
  Availability, 
  AvailabilitySlot, 
  OfficerProfile, 
  PublicNotice, 
  AdminAuditLog 
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check valid UUID
export const isValidUUID = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Official Real Officer Profiles for Chittorgarh District (with real Supabase UUIDs)
const INITIAL_OFFICERS: OfficerProfile[] = [
  {
    id: 'eaddd30b-4a41-46e6-a9ad-4fb5e61f571d',
    name: 'श्री धर्मेन्द्र सिंह (IPS)',
    designation: 'पुलिस अधीक्षक (SP), चित्तौड़गढ़',
    phone: '01472-295797',
    email: 'sp.chittorgarh@rajpolice.gov.in',
    photo_url: undefined,
    description: 'कार्यालय पुलिस अधीक्षक, जिला चित्तौड़गढ़ (राजस्थान)',
    is_active: true,
    display_order: 1
  },
  {
    id: '2dfaca8c-369e-4d94-aee7-e04f6e9aac21',
    name: 'श्री गजेन्द्र सिंह जोधा (RPS)',
    designation: 'अतिरिक्त पुलिस अधीक्षक (Addl. SP)',
    phone: '01472-240222',
    email: undefined,
    photo_url: undefined,
    description: 'कार्यालय अतिरिक्त पुलिस अधीक्षक, चित्तौड़गढ़',
    is_active: true,
    display_order: 2
  },
  {
    id: 'd0c2d2c1-2e62-4917-b976-58ade3523849',
    name: 'श्री करण सिंह (RPS)',
    designation: 'वृत्ताधिकारी / उप अधीक्षक (CO City)',
    phone: '01472-241044',
    email: undefined,
    photo_url: undefined,
    description: 'वृत्त कार्यालय, चित्तौड़गढ़ शहर',
    is_active: true,
    display_order: 3
  }
];

export const getTodayISODate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_SLOTS: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    availability_id: 'avail-today',
    start_time: '10:30 AM',
    end_time: '01:00 PM',
    slot_status: 'confirmed',
    slot_label: 'प्रातः कालीन सत्र',
    display_order: 1
  },
  {
    id: 'slot-2',
    availability_id: 'avail-today',
    start_time: '03:30 PM',
    end_time: '05:30 PM',
    slot_status: 'confirmed',
    slot_label: 'सायं कालीन सत्र',
    display_order: 2
  }
];

const INITIAL_AVAILABILITY: Availability = {
  id: 'avail-today',
  schedule_date: getTodayISODate(),
  status: 'available',
  timing_type: 'confirmed',
  public_message: 'आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।',
  alternative_officer_id: '2dfaca8c-369e-4d94-aee7-e04f6e9aac21',
  alternative_timing: 'दोपहर 12:00 बजे से 01:00 बजे तक',
  published: true,
  updated_at: new Date().toISOString(),
  updated_by: 'PA, SP Office'
};

const INITIAL_NOTICES: PublicNotice[] = [
  {
    id: 'not-1',
    title: 'जनसुनवाई हेतु आवश्यक निर्देश',
    message: 'नागरिकों से अनुरोध है कि जनसुनवाई में आते समय अपने परिवाद/शिकायत की 2 प्रतियां तथा अपना पहचान पत्र अवश्य साथ लाएं।',
    published: true,
    priority: 'normal',
    publish_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// Local Storage Keys
const STORAGE_KEYS = {
  AVAILABILITY: 'sp_portal_availability_v2',
  SLOTS: 'sp_portal_slots_v2',
  OFFICERS: 'sp_portal_officers_v2',
  NOTICES: 'sp_portal_notices_v2',
  AUDIT: 'sp_portal_audit_logs_v2',
};

const getStored = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
};

// Cross-tab broadcast notifier
export const notifyAvailabilityUpdated = () => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sp_availability_changed', { detail: { time: Date.now() } }));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sp_portal_sync');
        bc.postMessage({ type: 'SYNC_NOW', time: Date.now() });
        bc.close();
      }
    }
  } catch (e) {
    console.warn('Broadcast error', e);
  }
};

export const DataService = {
  async getOfficers(): Promise<OfficerProfile[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('officer_profiles')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.OFFICERS, data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getOfficers failed, using fallback', e);
      }
    }
    return getStored<OfficerProfile[]>(STORAGE_KEYS.OFFICERS, INITIAL_OFFICERS);
  },

  async getTodayAvailability(): Promise<{ availability: Availability; slots: AvailabilitySlot[]; alternativeOfficer?: OfficerProfile }> {
    const officers = await this.getOfficers();
    const today = getTodayISODate();

    if (supabase) {
      try {
        // Try getting today's record
        let { data: availData, error: availError } = await supabase
          .from('availability')
          .select('*')
          .eq('schedule_date', today)
          .maybeSingle();

        // If today has no entry yet, get latest published entry
        if (!availData) {
          const { data: latestData } = await supabase
            .from('availability')
            .select('*')
            .order('schedule_date', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (latestData) {
            availData = {
              ...latestData,
              schedule_date: today
            };
          }
        }

        if (!availError && availData) {
          const { data: slotsData } = await supabase
            .from('availability_slots')
            .select('*')
            .eq('availability_id', availData.id)
            .order('display_order', { ascending: true });

          const altOfficer = officers.find(o => o.id === availData.alternative_officer_id);

          const finalSlots = (slotsData && slotsData.length > 0) ? slotsData : INITIAL_SLOTS;

          setStored(STORAGE_KEYS.AVAILABILITY, availData);
          setStored(STORAGE_KEYS.SLOTS, finalSlots);

          return {
            availability: availData,
            slots: finalSlots,
            alternativeOfficer: altOfficer
          };
        }
      } catch (e) {
        console.warn('Supabase getTodayAvailability failed, using fallback', e);
      }
    }

    const availability = getStored<Availability>(STORAGE_KEYS.AVAILABILITY, {
      ...INITIAL_AVAILABILITY,
      schedule_date: today
    });
    const slots = getStored<AvailabilitySlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    const alternativeOfficer = officers.find(o => o.id === availability.alternative_officer_id);

    return { availability, slots, alternativeOfficer };
  },

  async getPublicNotices(): Promise<PublicNotice[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('public_notices')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.NOTICES, data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getPublicNotices failed, using fallback', e);
      }
    }
    return getStored<PublicNotice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  },

  async saveAvailability(
    availability: Partial<Availability>, 
    slots: AvailabilitySlot[],
    adminName: string = 'PA, SP Office'
  ): Promise<{ success: boolean; error?: string }> {
    const today = getTodayISODate();
    const cleanAlternativeOfficerId: string | null = (availability.alternative_officer_id && isValidUUID(availability.alternative_officer_id))
      ? availability.alternative_officer_id 
      : null;

    const updatedRecord: Availability = {
      id: availability.id || 'avail-today',
      schedule_date: availability.schedule_date || today,
      status: availability.status || 'available',
      timing_type: availability.timing_type || 'confirmed',
      public_message: availability.public_message || '',
      alternative_officer_id: cleanAlternativeOfficerId,
      alternative_timing: availability.alternative_timing || '',
      published: true,
      updated_at: new Date().toISOString(),
      updated_by: adminName
    };

    // Store in localStorage immediately
    setStored(STORAGE_KEYS.AVAILABILITY, updatedRecord);
    setStored(STORAGE_KEYS.SLOTS, slots);

    // Save to Supabase
    if (supabase) {
      try {
        const { data: upsertData, error: upsertError } = await supabase
          .from('availability')
          .upsert({
            schedule_date: updatedRecord.schedule_date,
            status: updatedRecord.status,
            timing_type: updatedRecord.timing_type,
            public_message: updatedRecord.public_message,
            alternative_officer_id: cleanAlternativeOfficerId,
            alternative_timing: updatedRecord.alternative_timing,
            published: true,
            updated_at: updatedRecord.updated_at,
            updated_by: updatedRecord.updated_by
          }, { onConflict: 'schedule_date' })
          .select()
          .single();

        if (upsertError) {
          console.error('Supabase availability upsert error:', upsertError);
          notifyAvailabilityUpdated();
          return { success: false, error: upsertError.message };
        }

        if (upsertData) {
          // Update slots
          await supabase.from('availability_slots').delete().eq('availability_id', upsertData.id);
          
          if (slots.length > 0) {
            const slotsToInsert = slots.map((s, idx) => ({
              availability_id: upsertData.id,
              start_time: s.start_time,
              end_time: s.end_time,
              slot_status: s.slot_status,
              slot_label: s.slot_label,
              display_order: idx + 1
            }));
            await supabase.from('availability_slots').insert(slotsToInsert);
          }

          // Update updatedRecord with new UUID id
          updatedRecord.id = upsertData.id;
          setStored(STORAGE_KEYS.AVAILABILITY, updatedRecord);
        }

        // Add audit log
        await supabase.from('admin_audit_logs').insert({
          admin_user: adminName,
          action: 'UPDATE_AVAILABILITY',
          record_type: 'availability',
          details: `स्थिति: ${updatedRecord.status}, संदेश: ${updatedRecord.public_message}`
        });

      } catch (err: any) {
        console.error('Supabase write error:', err);
        notifyAvailabilityUpdated();
        return { success: false, error: err?.message || 'Database error' };
      }
    }

    // Trigger instant cross-tab update
    notifyAvailabilityUpdated();
    return { success: true };
  },

  async saveNotice(notice: Omit<PublicNotice, 'id' | 'created_at'> & { id?: string }): Promise<boolean> {
    const currentNotices = await this.getPublicNotices();
    let updatedNotices: PublicNotice[];

    if (notice.id) {
      updatedNotices = currentNotices.map(n => n.id === notice.id ? { ...n, ...notice, updated_at: new Date().toISOString() } : n);
    } else {
      const newNotice: PublicNotice = {
        id: 'not-' + Date.now(),
        ...notice,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      updatedNotices = [newNotice, ...currentNotices];
    }

    setStored(STORAGE_KEYS.NOTICES, updatedNotices);

    if (supabase) {
      try {
        if (notice.id && !notice.id.startsWith('not-')) {
          await supabase.from('public_notices').update(notice).eq('id', notice.id);
        } else {
          await supabase.from('public_notices').insert({
            title: notice.title,
            message: notice.message,
            published: notice.published,
            priority: notice.priority,
            publish_at: notice.publish_at || new Date().toISOString(),
            expires_at: notice.expires_at
          });
        }
      } catch (err) {
        console.error('Supabase notice save error', err);
      }
    }

    return true;
  },

  async deleteNotice(id: string): Promise<boolean> {
    const currentNotices = await this.getPublicNotices();
    const updated = currentNotices.filter(n => n.id !== id);
    setStored(STORAGE_KEYS.NOTICES, updated);

    if (supabase && !id.startsWith('not-')) {
      try {
        await supabase.from('public_notices').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    if (supabase) {
      try {
        const { data } = await supabase
          .from('admin_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (data && data.length > 0) return data;
      } catch {
        // ignore
      }
    }
    return getStored<AdminAuditLog[]>(STORAGE_KEYS.AUDIT, [
      {
        id: 'log-1',
        admin_user: 'PA, SP Office',
        action: 'UPDATE_AVAILABILITY',
        record_type: 'availability',
        details: 'स्थिति: उपलब्ध (10:30 AM - 1:00 PM, 3:30 PM - 5:30 PM)',
        created_at: new Date().toISOString()
      }
    ]);
  }
};
