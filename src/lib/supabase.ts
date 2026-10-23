import { createClient } from '@supabase/supabase-js';
import type {
  Availability,
  AvailabilitySlot,
  OfficerProfile,
  PublicNotice,
  AdminAuditLog,
  PoliceDirectoryRecord
} from '../types/database';
import { POLICE_DIRECTORY_DATA } from '../data/policeDirectory';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
    },
    realtime: {
      heartbeatIntervalMs: 15000, // Keep mobile sockets alive through mobile carrier timeouts
    }
  })
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
    phone: '01472-240006',
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
    phone: '94144-81105 / 01472-242603',
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
    start_time: 'कार्यालय समय',
    end_time: '',
    slot_status: 'confirmed',
    slot_label: 'जनसुनवाई सत्र',
    display_order: 1
  }
];

const INITIAL_AVAILABILITY: Availability = {
  id: 'avail-today',
  schedule_date: getTodayISODate(),
  status: 'available',
  timing_type: 'confirmed',
  public_message: 'आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।',
  alternative_officer_id: '2dfaca8c-369e-4d94-aee7-e04f6e9aac21',
  alternative_timing: 'कार्यालय समय',
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
  DIRECTORY: 'sp_portal_police_directory_v1',
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

// Cross-tab and live sync notifier
export const notifyAvailabilityUpdated = () => {
  try {
    if (typeof window !== 'undefined') {
      // 1. Dispatch custom event for current window
      window.dispatchEvent(new CustomEvent('sp_availability_changed', { detail: { time: Date.now() } }));

      // 2. Set dedicated localStorage sync key (reliably triggers 'storage' event across ALL open tabs/windows!)
      localStorage.setItem('sp_portal_last_sync_timestamp', Date.now().toString());

      // 3. BroadcastChannel (do NOT close immediately, allow cross-tab message delivery)
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sp_portal_sync');
        bc.postMessage({ type: 'SYNC_NOW', time: Date.now() });
        setTimeout(() => {
          try { bc.close(); } catch { }
        }, 1500);
      }

      // 4. Supabase Realtime broadcast to ALL connected citizens on any device/phone (sub-100ms)
      if (supabase) {
        const bcChannel = supabase.channel('sp-public-channel');
        bcChannel.subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            bcChannel.send({
              type: 'broadcast',
              event: 'availability_updated',
              payload: { time: Date.now() }
            });
          }
        });
      }
    }
  } catch (e) {
    console.warn('Broadcast error', e);
  }
};

export const DataService = {
  async getOfficers(): Promise<OfficerProfile[]> {
    const sanitize = (list: OfficerProfile[]): OfficerProfile[] => {
      return list.map(o => {
        if (
          o.id === 'eaddd30b-4a41-46e6-a9ad-4fb5e61f571d' ||
          o.name.includes('धर्मेन्द्र') ||
          (o.designation.includes('SP') && !o.designation.includes('अतिरिक्त') && !o.designation.includes('Addl'))
        ) {
          return { ...o, phone: '01472-240006' };
        }
        return o;
      });
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('officer_profiles')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const sanitized = sanitize(data);
          setStored(STORAGE_KEYS.OFFICERS, sanitized);
          // Also asynchronously update Supabase DB table officer_profiles with new number
          void supabase
            .from('officer_profiles')
            .update({ phone: '01472-240006' })
            .ilike('name', '%धर्मेन्द्र%');
          return sanitized;
        }
      } catch (e) {
        console.warn('Supabase getOfficers failed, using fallback', e);
      }
    }
    const localOfficers = getStored<OfficerProfile[]>(STORAGE_KEYS.OFFICERS, INITIAL_OFFICERS);
    const updated = sanitize(localOfficers);
    setStored(STORAGE_KEYS.OFFICERS, updated);
    return updated;
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
          const altOfficer = officers.find(o => o.id === availData.alternative_officer_id);
          const finalSlots = INITIAL_SLOTS;

          const status = (availData.status === 'confirmation_pending' || !availData.status)
            ? 'available'
            : availData.status;
          const publicMsg = availData.public_message?.includes('पुष्ट होना प्रतीक्षित')
            ? 'आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।'
            : availData.public_message;

          const cleanAvailData: Availability = {
            ...availData,
            status,
            public_message: publicMsg,
            alternative_timing: 'कार्यालय समय'
          };

          setStored(STORAGE_KEYS.AVAILABILITY, cleanAvailData);
          setStored(STORAGE_KEYS.SLOTS, finalSlots);

          return {
            availability: cleanAvailData,
            slots: finalSlots,
            alternativeOfficer: altOfficer
          };
        }
      } catch (e) {
        console.warn('Supabase getTodayAvailability failed, using fallback', e);
      }
    }

    const rawAvailability = getStored<Availability>(STORAGE_KEYS.AVAILABILITY, {
      ...INITIAL_AVAILABILITY,
      schedule_date: today
    });
    const status = (rawAvailability.status === 'confirmation_pending' || !rawAvailability.status)
      ? 'available'
      : rawAvailability.status;
    const publicMsg = rawAvailability.public_message?.includes('पुष्ट होना प्रतीक्षित')
      ? 'आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।'
      : rawAvailability.public_message;

    const availability: Availability = {
      ...rawAvailability,
      schedule_date: today,
      status,
      public_message: publicMsg,
      alternative_timing: 'कार्यालय समय'
    };
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
          // Update updatedRecord with new UUID id
          updatedRecord.id = upsertData.id;
          setStored(STORAGE_KEYS.AVAILABILITY, updatedRecord);
        }
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
        if (notice.id && isValidUUID(notice.id)) {
          await supabase.from('public_notices').update({
            title: notice.title,
            message: notice.message,
            published: notice.published,
            priority: notice.priority,
            publish_at: notice.publish_at || new Date().toISOString(),
            expires_at: notice.expires_at || null,
            updated_at: new Date().toISOString()
          }).eq('id', notice.id);
        } else {
          await supabase.from('public_notices').insert({
            title: notice.title,
            message: notice.message,
            published: notice.published,
            priority: notice.priority,
            publish_at: notice.publish_at || new Date().toISOString(),
            expires_at: notice.expires_at || null
          });
        }
      } catch (err) {
        console.error('Supabase notice save error', err);
      }
    }

    // Trigger instant real-time sync across public portal
    notifyAvailabilityUpdated();
    return true;
  },

  async deleteNotice(id: string): Promise<boolean> {
    const currentNotices = await this.getPublicNotices();
    const updated = currentNotices.filter(n => n.id !== id);
    setStored(STORAGE_KEYS.NOTICES, updated);

    if (supabase && isValidUUID(id)) {
      try {
        await supabase.from('public_notices').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }

    // Trigger instant real-time sync across public portal
    notifyAvailabilityUpdated();
    return true;
  },

  async addOfficer(officer: Omit<OfficerProfile, 'id'>): Promise<{ success: boolean; data?: OfficerProfile; error?: string }> {
    let newOfficer: OfficerProfile;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('officer_profiles').insert({
          name: officer.name,
          designation: officer.designation,
          phone: officer.phone,
          email: officer.email || null,
          photo_url: officer.photo_url || null,
          description: officer.description || null,
          is_active: officer.is_active ?? true,
          display_order: officer.display_order || 1
        }).select().single();

        if (error) throw error;
        newOfficer = data;
      } catch (err: any) {
        console.warn('Supabase addOfficer failed, saving locally', err);
        newOfficer = {
          id: 'off-' + Date.now(),
          ...officer
        };
      }
    } else {
      newOfficer = {
        id: 'off-' + Date.now(),
        ...officer
      };
    }

    const currentOfficers = await this.getOfficers();
    const updated = [...currentOfficers, newOfficer];
    setStored(STORAGE_KEYS.OFFICERS, updated);
    return { success: true, data: newOfficer };
  },

  async updateOfficer(officer: OfficerProfile): Promise<{ success: boolean; error?: string }> {
    const currentOfficers = await this.getOfficers();
    const updated = currentOfficers.map(o => o.id === officer.id ? { ...o, ...officer } : o);
    setStored(STORAGE_KEYS.OFFICERS, updated);

    if (supabase && isValidUUID(officer.id)) {
      try {
        const { error } = await supabase.from('officer_profiles').update({
          name: officer.name,
          designation: officer.designation,
          phone: officer.phone,
          email: officer.email || null,
          photo_url: officer.photo_url || null,
          description: officer.description || null,
          is_active: officer.is_active,
          display_order: officer.display_order,
          updated_at: new Date().toISOString()
        }).eq('id', officer.id);

        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase updateOfficer error', err);
      }
    }

    return { success: true };
  },

  async deleteOfficer(id: string): Promise<boolean> {
    const currentOfficers = await this.getOfficers();
    const updated = currentOfficers.filter(o => o.id !== id);
    setStored(STORAGE_KEYS.OFFICERS, updated);

    if (supabase && isValidUUID(id)) {
      try {
        await supabase.from('officer_profiles').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteOfficer error', e);
      }
    }

    return true;
  },

  async saveOfficers(officersList: OfficerProfile[]): Promise<{ success: boolean; error?: string }> {
    setStored(STORAGE_KEYS.OFFICERS, officersList);

    if (supabase) {
      try {
        for (const officer of officersList) {
          if (officer.id && isValidUUID(officer.id)) {
            await supabase.from('officer_profiles').upsert({
              id: officer.id,
              name: officer.name,
              designation: officer.designation,
              phone: officer.phone,
              email: officer.email || null,
              photo_url: officer.photo_url || null,
              description: officer.description || null,
              is_active: officer.is_active ?? true,
              display_order: officer.display_order || 1,
              updated_at: new Date().toISOString()
            });
          }
        }
      } catch (err: any) {
        console.error('Supabase saveOfficers error', err);
      }
    }

    return { success: true };
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    return [];
  },

  // ── Police Directory Database Methods ──
  async getPoliceDirectory(includeInactive: boolean = false): Promise<PoliceDirectoryRecord[]> {
    const sanitizeDir = (list: PoliceDirectoryRecord[]): PoliceDirectoryRecord[] => {
      return list
        .filter(item => item.category !== 'outpost' && item.category !== 'branch')
        .map(item => {
          if (item.name.includes('नियंत्रण') || item.name.includes('डी.एस.बी')) {
            return {
              ...item,
              location: null
            };
          }
          if (item.name.includes('धर्मेन्द्र') || item.post.includes('SP CHITTORGARH')) {
            return {
              ...item,
              name: 'श्री धर्मेन्द्र सिंह, I.P.S.',
              mobile: '94604-25643'
            };
          }
          return item;
        });
    };

    if (supabase) {
      try {
        let query = supabase
          .from('police_directory')
          .select('*')
          .neq('category', 'outpost')
          .neq('category', 'branch')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (!includeInactive) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const sanitized = sanitizeDir(data as PoliceDirectoryRecord[]);
          setStored(STORAGE_KEYS.DIRECTORY, sanitized);
          void supabase
            .from('police_directory')
            .update({ mobile: '94604-25643', name: 'श्री धर्मेन्द्र सिंह, I.P.S.' })
            .ilike('post', '%SP CHITTORGARH%');
          return sanitized;
        }
      } catch (err) {
        console.warn('Supabase getPoliceDirectory error, using local fallback', err);
      }
    }

    // LocalStorage or fallback from POLICE_DIRECTORY_DATA
    const cached = getStored<PoliceDirectoryRecord[] | null>(STORAGE_KEYS.DIRECTORY, null);
    if (cached && cached.length > 0) {
      const sanitized = sanitizeDir(cached);
      return includeInactive ? sanitized : sanitized.filter(c => c.is_active);
    }

    // Default static mapping of all 52 contacts (excluding outposts)
    const defaultRecords: PoliceDirectoryRecord[] = sanitizeDir(POLICE_DIRECTORY_DATA.map((item, idx) => ({
      id: item.id,
      name: item.name,
      post: item.post,
      category: item.category,
      circle_name: item.circleName || null,
      location: item.location || null,
      std_code: item.stdCode || null,
      office_phone: item.officePhone || null,
      residence_phone: item.residencePhone || null,
      mobile: item.mobile || null,
      email: item.email || null,
      display_order: idx + 1,
      is_active: true,
    })));

    return defaultRecords;
  },

  async createPoliceContact(contact: Omit<PoliceDirectoryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; contact?: PoliceDirectoryRecord; error?: string }> {
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `dir-${Date.now()}`;
    const newRecord: PoliceDirectoryRecord = {
      ...contact,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('police_directory')
          .insert({
            name: contact.name,
            post: contact.post,
            category: contact.category,
            circle_name: contact.circle_name || null,
            location: contact.location || null,
            std_code: contact.std_code || null,
            office_phone: contact.office_phone || null,
            residence_phone: contact.residence_phone || null,
            mobile: contact.mobile || null,
            email: contact.email || null,
            display_order: contact.display_order ?? 100,
            is_active: contact.is_active ?? true
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          notifyAvailabilityUpdated();
          return { success: true, contact: data as PoliceDirectoryRecord };
        }
      } catch (err: any) {
        console.error('Supabase createPoliceContact error', err);
        return { success: false, error: err.message };
      }
    }

    // Fallback to local storage
    const current = await this.getPoliceDirectory(true);
    setStored(STORAGE_KEYS.DIRECTORY, [newRecord, ...current]);
    notifyAvailabilityUpdated();
    return { success: true, contact: newRecord };
  },

  async updatePoliceContact(id: string, updates: Partial<PoliceDirectoryRecord>): Promise<{ success: boolean; error?: string }> {
    if (supabase && isValidUUID(id)) {
      try {
        const payload: any = {
          ...updates,
          updated_at: new Date().toISOString()
        };
        delete payload.id;
        delete payload.created_at;
        delete payload.alt_email;

        const { error } = await supabase
          .from('police_directory')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase updatePoliceContact error', err);
        return { success: false, error: err.message };
      }
    }

    const current = await this.getPoliceDirectory(true);
    const updated = current.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c);
    setStored(STORAGE_KEYS.DIRECTORY, updated);
    notifyAvailabilityUpdated();
    return { success: true };
  },

  async deletePoliceContact(id: string): Promise<boolean> {
    if (supabase && isValidUUID(id)) {
      try {
        const { error } = await supabase
          .from('police_directory')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase deletePoliceContact error', err);
      }
    }

    const current = await this.getPoliceDirectory(true);
    const updated = current.filter(c => c.id !== id);
    setStored(STORAGE_KEYS.DIRECTORY, updated);
    notifyAvailabilityUpdated();
    return true;
  },

  async seedDefaultPoliceDirectory(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!supabase) {
      return { success: false, count: 0, error: 'Supabase client is not connected' };
    }

    try {
      const recordsToInsert = POLICE_DIRECTORY_DATA.map((item, idx) => ({
        name: item.name,
        post: item.post,
        category: item.category,
        circle_name: item.circleName || null,
        location: item.location || null,
        std_code: item.stdCode || null,
        office_phone: item.officePhone || null,
        residence_phone: item.residencePhone || null,
        mobile: item.mobile || null,
        email: item.email || null,
        display_order: idx + 1,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('police_directory')
        .insert(recordsToInsert)
        .select();

      if (error) throw error;
      notifyAvailabilityUpdated();
      return { success: true, count: data?.length || recordsToInsert.length };
    } catch (err: any) {
      console.error('Seed directory error', err);
      return { success: false, count: 0, error: err.message };
    }
  }
};
