-- ==============================================================================
-- CHITTORGARH SP OFFICE - PUBLIC AVAILABILITY PORTAL
-- DATABASE SETUP SCRIPT v2 — Run in Supabase SQL Editor
-- ==============================================================================
-- This script is idempotent (safe to run multiple times).
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run

-- ── 1. officer_profiles ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS officer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    photo_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. availability ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_date DATE NOT NULL UNIQUE,
    -- Values: 'available' | 'unavailable' | 'confirmation_pending' | 'time_changed'
    status TEXT NOT NULL DEFAULT 'confirmation_pending',
    -- Values: 'confirmed' | 'tentative'
    timing_type TEXT NOT NULL DEFAULT 'tentative',
    public_message TEXT,
    alternative_officer_id UUID REFERENCES officer_profiles(id) ON DELETE SET NULL,
    alternative_timing TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT DEFAULT 'कार्यालय अधीक्षक'
);

-- ── 3. availability_slots ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    -- Values: 'confirmed' | 'tentative' | 'cancelled'
    slot_status TEXT NOT NULL DEFAULT 'confirmed',
    slot_label TEXT,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. public_notices ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT true,
    -- Values: 'high' | 'normal' | 'low'
    priority TEXT NOT NULL DEFAULT 'normal',
    publish_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. admin_audit_logs ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user TEXT NOT NULL,
    action TEXT NOT NULL,
    record_type TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. Row Level Security (RLS) Configuration ──────────────────────────────
-- Enable RLS so only authenticated admins can write/delete, while public can only read published data.
ALTER TABLE officer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 Public Read Policies (Citizen view)
CREATE POLICY "Public can view officers" ON officer_profiles
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public can view availability" ON availability
    FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY "Public can view slots" ON availability_slots
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view notices" ON public_notices
    FOR SELECT TO anon, authenticated USING (published = true);

-- 6.2 Authenticated Admin Policies (Police officers can create/update/delete)
CREATE POLICY "Admins can manage officers" ON officer_profiles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage availability" ON availability
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage slots" ON availability_slots
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage notices" ON public_notices
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage audit logs" ON admin_audit_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 6.1 Enable Supabase Realtime (Instant Live Updates without Refresh) ────────
-- Run this so database updates broadcast to all mobile/web users within 1-2 seconds
ALTER PUBLICATION supabase_realtime ADD TABLE availability;
ALTER PUBLICATION supabase_realtime ADD TABLE availability_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public_notices;

-- ── 7. Indexes for performance ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(schedule_date);
CREATE INDEX IF NOT EXISTS idx_availability_published ON availability(published);
CREATE INDEX IF NOT EXISTS idx_slots_avail_id ON availability_slots(availability_id);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public_notices(published);
CREATE INDEX IF NOT EXISTS idx_officers_active ON officer_profiles(is_active, display_order);

-- ── 8. Seed initial data (only if tables are empty) ──────────────────────────
DO $$
DECLARE
    sp_id UUID;
    addl_sp_id UUID;
    dsp_id UUID;
    avail_id UUID;
    today_date DATE := CURRENT_DATE;
    officer_count INT;
    avail_count INT;
BEGIN
    SELECT COUNT(*) INTO officer_count FROM officer_profiles;
    SELECT COUNT(*) INTO avail_count FROM availability;

    IF officer_count = 0 THEN
        sp_id := gen_random_uuid();
        addl_sp_id := gen_random_uuid();
        dsp_id := gen_random_uuid();

        INSERT INTO officer_profiles (id, name, designation, phone, description, is_active, display_order)
        VALUES
          (sp_id,      'श्री धर्मेन्द्र सिंह (IPS)',     'पुलिस अधीक्षक (SP), चित्तौड़गढ़',         '01472-240006', 'कार्यालय पुलिस अधीक्षक, जिला चित्तौड़गढ़ (राजस्थान)', true, 1),
          (addl_sp_id, 'श्री गजेन्द्र सिंह जोधा (RPS)', 'अतिरिक्त पुलिस अधीक्षक (Addl. SP)',       '01472-240222', 'कार्यालय अतिरिक्त पुलिस अधीक्षक, चित्तौड़गढ़',     true, 2),
          (dsp_id,     'श्री करण सिंह (RPS)',            'वृत्ताधिकारी / उप अधीक्षक (CO City)',     '01472-241044', 'वृत्त कार्यालय, चित्तौड़गढ़ शहर',                  true, 3);

        IF avail_count = 0 THEN
            avail_id := gen_random_uuid();

            INSERT INTO availability (id, schedule_date, status, timing_type, public_message, alternative_officer_id, alternative_timing, published, updated_by)
            VALUES (
                avail_id,
                today_date,
                'available',
                'confirmed',
                'आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।',
                addl_sp_id,
                'दोपहर 12:00 बजे से 01:00 बजे तक',
                true,
                'PA, SP Office'
            );

            INSERT INTO availability_slots (availability_id, start_time, end_time, slot_status, slot_label, display_order)
            VALUES
                (avail_id, '10:30 AM', '01:00 PM', 'confirmed', 'प्रातःकालीन सत्र', 1),
                (avail_id, '03:30 PM', '05:30 PM', 'confirmed', 'सायंकालीन सत्र',  2);
        END IF;

        INSERT INTO public_notices (title, message, published, priority, publish_at, expires_at)
        VALUES (
            'जनसुनवाई हेतु आवश्यक निर्देश',
            'नागरिकों से अनुरोध है कि जनसुनवाई में आते समय अपने परिवाद/शिकायत की 2 प्रतियां तथा अपना पहचान पत्र अवश्य साथ लाएं।',
            true, 'normal', NOW(), NOW() + INTERVAL '30 days'
        );
    END IF;
END $$;

-- ── Verify tables exist ───────────────────────────────────────────────────────
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('officer_profiles', 'availability', 'availability_slots', 'public_notices', 'admin_audit_logs')
ORDER BY table_name;
