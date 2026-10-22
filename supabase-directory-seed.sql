-- ==============================================================================
-- CHITTORGARH POLICE DIRECTORY - 92 CONTACTS SEED SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

CREATE TABLE IF NOT EXISTS police_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    post TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('senior', 'circle', 'station', 'branch', 'outpost')),
    circle_name TEXT,
    location TEXT,
    std_code TEXT,
    office_phone TEXT,
    residence_phone TEXT,
    mobile TEXT,
    email TEXT,
    alt_email TEXT,
    display_order INT NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_police_dir_category ON police_directory(category);
CREATE INDEX IF NOT EXISTS idx_police_dir_circle ON police_directory(circle_name);
CREATE INDEX IF NOT EXISTS idx_police_dir_active ON police_directory(is_active, display_order);
ALTER TABLE police_directory DISABLE ROW LEVEL SECURITY;

-- Seed data: Insert only if table is currently empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM police_directory) = 0 THEN
        INSERT INTO police_directory (
            name, post, category, circle_name, location,
            std_code, office_phone, residence_phone, mobile,
            email, alt_email, display_order, is_active
        ) VALUES
        ('श्री गौरव श्रीवास्तव, I.P.S.', 'महानिरीक्षक पुलिस (IGP RANGE UDR)', 'senior', NULL, 'उदयपुर रेंज मुख्यालय', '0294', '2410816', NULL, '97993-93499', NULL, NULL, 1, true),
        ('श्री धर्मेन्द्र सिंह, I.P.S.', 'जिला पुलिस अधीक्षक (SP CHITTORGARH)', 'senior', 'चित्तौड़गढ़', 'पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़', '01472', '240006', NULL, '94604-25643', 'sp-chi-rj@nic.in', NULL, 2, true),
        ('श्री गजेन्द्र सिंह, R.P.S.', 'अतिरिक्त पुलिस अधीक्षक (Addl. SP HQ CGH)', 'senior', 'चित्तौड़गढ़', 'मुख्यालय, चित्तौड़गढ़', '01472', '242603', NULL, '94144-81105', 'asphqcgh@gmail.com', 'addlsp.chittorgarh@rajpolice.gov.in', 3, true),
        ('श्री गोपाल सिंह, R.P.S.', 'अतिरिक्त पुलिस अधीक्षक (Addl. SP RAWATBHATA)', 'senior', 'रावतभाटा', 'रावतभाटा', '01475', '235703', NULL, '94140-84372', 'asprawatbhata@gmail.com', 'addlsp.rawatbhata.chittorgarh@rajpolice.gov.in', 4, true),
        ('श्री सुगनचंद, R.P.S.', 'अतिरिक्त पुलिस अधीक्षक (Addl. SP SIUCAW)', 'senior', 'चित्तौड़गढ़', 'महिला अपराध अन्वेषण सेल (SIUCAW)', NULL, NULL, NULL, '94142-94206', 'siucawcgh@gmail.com', NULL, 5, true),
        ('श्री अशोक कुमार, R.P.S.', 'अतिरिक्त पुलिस अधीक्षक (Addl. SP Q.I.T.S. / Cell)', 'senior', 'चित्तौड़गढ़', 'क्विक इन्वेस्टिगेशन सेल (Q.I.T.S.)', NULL, NULL, NULL, '98280-38799', NULL, NULL, 6, true),
        ('श्री भूराराम, R.P.S.', 'पुलिस उप अधीक्षक, यातायात (Dy SP, Traffic)', 'senior', 'चित्तौड़गढ़', 'यातायात शाखा, चित्तौड़गढ़', NULL, NULL, NULL, '94140-94421', 'trafficcgh@gmail.com', NULL, 7, true),
        ('श्री नेमीचंद, R.P.S.', 'पुलिस उप अधीक्षक (Dy SP, SC/ST Cell)', 'senior', 'चित्तौड़गढ़', 'एससी/एसटी प्रकोष्ठ, चित्तौड़गढ़', '01472', '244885', NULL, '98291-34980', 'dyspscstcellcgh@gmail.com', NULL, 8, true),
        ('श्री रविन्द्रप्रताप सिंह, R.P.S.', 'थानाधिकारी, साइबर थाना', 'branch', 'चित्तौड़गढ़', 'साइबर पुलिस थाना, चित्तौड़गढ़', NULL, NULL, NULL, '97833-11422', 'pscybercgh@gmail.com', NULL, 9, true),
        ('श्री मोतीराम, पु.नि.', 'प्रभारी, यातायात शाखा', 'branch', 'चित्तौड़गढ़', 'यातायात शाखा, चित्तौड़गढ़', NULL, NULL, NULL, '94141-25111', NULL, NULL, 10, true),
        ('श्री सुमन कुमार, पु.नि.', 'पुलिस निरीक्षक, साइबर थाना', 'branch', 'चित्तौड़गढ़', 'साइबर पुलिस थाना, चित्तौड़गढ़', NULL, NULL, NULL, '96947-77561', 'pscybercgh@gmail.com', NULL, 11, true),
        ('नियंत्रण कक्ष (Control Room)', 'जिला पुलिस कंट्रोल रूम', 'branch', 'चित्तौड़गढ़', 'एसपी कार्यालय परिसर, चित्तौड़गढ़', '01472', '240055', NULL, '112', 'controlroomcgh@gmail.com', NULL, 12, true),
        ('डी.एस.बी. शाखा (D.S.B. Chittorgarh)', 'विशेष शाखा / आसूचना', 'branch', 'चित्तौड़गढ़', 'एसपी कार्यालय, चित्तौड़गढ़', NULL, NULL, NULL, NULL, 'dsbcgh@gmail.com', NULL, 13, true),
        ('अपराध शाखा (Crime Branch / Assistante)', 'क्राइम ब्रांच चित्तौड़गढ़', 'branch', 'चित्तौड़गढ़', 'एसपी कार्यालय, चित्तौड़गढ़', NULL, NULL, NULL, NULL, 'crimebranchcgh@gmail.com', NULL, 14, true),
        ('रिजर्व पुलिस लाइन (R.I. RPL)', 'आर.आई. पुलिस लाइन चित्तौड़गढ़', 'branch', 'चित्तौड़गढ़', 'पुलिस लाइन, चित्तौड़गढ़', NULL, NULL, NULL, NULL, 'rplcgh@gmail.com', NULL, 15, true),
        ('श्री ब्रजेश सिंह, R.P.S.', 'वृत्ताधिकारी, वृत चित्तौड़गढ़ (C.O. Chittorgarh)', 'circle', 'चित्तौड़गढ़', 'चित्तौड़गढ़ शहर वृत', '01472', '241057', NULL, '99684-44047', 'cochittorgarh@gmail.com', 'co.chittorgarh.chittorgarh@rajpolice.gov.in', 16, true),
        ('श्री दिनेश सुखवाल, R.P.S.', 'वृत्ताधिकारी, वृत ग्रामीण (C.O. Chittorgarh Rural)', 'circle', 'ग्रामीण (चित्तौड़गढ़)', 'चित्तौड़गढ़ ग्रामीण वृत', '01472', '294200', NULL, '94143-29303', 'cogramincgh@gmail.com', NULL, 17, true),
        ('श्री उदय सिंह, R.P.S.', 'वृत्ताधिकारी, वृत गंगरार (C.O. Gangrar)', 'circle', 'गंगरार', 'गंगरार वृत कार्यालय', '01471', '220157', NULL, '82900-05711', 'dyspgangrar@gmail.com', 'co.gangrar.chittorgarh@rajpolice.gov.in', 18, true),
        ('श्री विनोद लखेरा, R.P.S.', 'वृत्ताधिकारी, वृत भदेसर (C.O. Bhadesar)', 'circle', 'भदेसर', 'भदेसर वृत कार्यालय', '01470', '243327', NULL, '94143-24256', 'co.bha.cgh@gmail.com', 'co.bhadesar.chittorgarh@rajpolice.gov.in', 19, true),
        ('श्री हरिशंकर, R.P.S.', 'वृत्ताधिकारी, वृत कपासन (C.O. Kapasan)', 'circle', 'कपासन', 'कपासन वृत कार्यालय', '01476', '230260', NULL, '98295-23522', 'dyspkapasan@gmail.com', 'co.kapasan.chittorgarh@rajpolice.gov.in', 20, true),
        ('श्री शिवप्रकाश, R.P.S.', 'वृत्ताधिकारी, वृत निम्बाहेड़ा (C.O. Nimbahera)', 'circle', 'निम्बाहेड़ा', 'निम्बाहेड़ा वृत कार्यालय', '01477', '221593', NULL, '94144-71345', 'conimbahera@gmail.com', 'co.nimbahera.chittorgarh@rajpolice.gov.in', 21, true),
        ('श्री हरीशचन्द्र सिंह, R.P.S.', 'वृत्ताधिकारी, वृत बड़ीसादड़ी (C.O. Badisadri)', 'circle', 'बड़ीसादड़ी', 'बड़ीसादड़ी वृत कार्यालय', '01473', '264040', NULL, '94600-26623', 'cobadisadri@gmail.com', 'co.badisadri.chittorgarh@rajpolice.gov.in', 22, true),
        ('श्री अंकित कुड़ी, R.P.S.', 'वृत्ताधिकारी, वृत बेगूं (C.O. Begun)', 'circle', 'बेगूं', 'बेगूं वृत कार्यालय', '01474', '294100', NULL, '81048-72969', 'cobegun@gmail.com', 'co.begun.chittorgarh@rajpolice.gov.in', 23, true),
        ('श्री शंकरलाल, R.P.S.', 'वृत्ताधिकारी, वृत रावतभाटा (C.O. Rawatbhata)', 'circle', 'रावतभाटा', 'रावतभाटा वृत कार्यालय', '01475', '235701', NULL, '81144-70989', 'corawatbhata@gmail.com', 'co.rawatbhata.chittorgarh@rajpolice.gov.in', 24, true),
        ('श्री रजनीश कुमार, पु.नि.', 'थानाधिकारी, पुलिस थाना कोतवाली (PS Kotwali)', 'station', 'चित्तौड़गढ़', 'कोतवाली, चित्तौड़गढ़', '01472', '241060', NULL, '98290-83135', 'pskotwalicgh@gmail.com', 'ps.kotwali.chittorgarh@rajpolice.gov.in', 25, true),
        ('श्री प्रेमसिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना सदर (PS Sadar)', 'station', 'चित्तौड़गढ़', 'सदर थाना, चित्तौड़गढ़', '01472', '295100', NULL, '81079-36775', 'pssadarcgh@gmail.com', 'ps.sadar.chittorgarh@rajpolice.gov.in', 26, true),
        ('रेणु कुमारी, उ.नि.', 'थानाधिकारी, महिला पुलिस थाना (PS Mahila)', 'station', 'चित्तौड़गढ़', 'महिला थाना, चित्तौड़गढ़', '01472', '250144', NULL, '99500-19011', 'pssadarcgh@gmail.com', 'ps.mahilathana.chittorgarh@rajpolice.gov.in', 27, true),
        ('श्री भरत सिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना चन्देरिया (PS Chanderiya)', 'station', 'ग्रामीण (चित्तौड़गढ़)', 'चन्देरिया, चित्तौड़गढ़', '01472', '256100', NULL, '86192-38457', 'pschanderiya@gmail.com', 'ps.chanderiya.chittorgarh@rajpolice.gov.in', 28, true),
        ('श्री प्रेम सिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना बस्सी (PS Bassi)', 'station', 'ग्रामीण (चित्तौड़गढ़)', 'बस्सी', '01472', '225035', NULL, '90011-81811', 'psbassicgh@gmail.com', 'ps.bassi.chittorgarh@rajpolice.gov.in', 29, true),
        ('श्री रामलाल, उ.नि.', 'थानाधिकारी, पुलिस थाना बिजयपुर (PS Bijaypur)', 'station', 'ग्रामीण (चित्तौड़गढ़)', 'बिजयपुर', '01472', '276206', NULL, '83027-29276', 'psbijaypur123@gmail.com', 'ps.bijaypur.chittorgarh@rajpolice.gov.in', 30, true),
        ('श्री तुलसीराम, पु.नि.', 'थानाधिकारी, पुलिस थाना गंगरार (PS Gangrar)', 'station', 'गंगरार', 'गंगरार', '01471', '220227', NULL, '90016-74740', 'psgangrar@gmail.com', 'ps.gangrar.chittorgarh@rajpolice.gov.in', 31, true),
        ('श्री गेहरीलाल, पु.नि.', 'थानाधिकारी, पुलिस थाना राशमी (PS Rashmi)', 'station', 'गंगरार', 'राशमी', '01471', '283228', NULL, '99508-79362', 'psrashmichittorgarh@gmail.com', 'ps.rashmi.chittorgarh@rajpolice.gov.in', 32, true),
        ('श्री नानालाल शर्मा, उ.नि.', 'थानाधिकारी, पुलिस थाना साड़ास (PS Sadas)', 'station', 'गंगरार', 'साड़ास', NULL, NULL, NULL, '73002-82990', 'pssadas09@gmail.com', NULL, 33, true),
        ('श्री विनोद मनरिया, पु.नि.', 'थानाधिकारी, पुलिस थाना भदेसर (PS Bhadesar)', 'station', 'भदेसर', 'भदेसर', '01470', '243227', NULL, '95712-10002', 'psbhadesar@gmail.com', 'ps.bhadesar.chittorgarh@rajpolice.gov.in', 34, true),
        ('श्री धर्मराज मीणा, उ.नि.', 'थानाधिकारी, पुलिस थाना शम्भूपुरा (PS Shambhupura)', 'station', 'भदेसर', 'शम्भूपुरा', '01472', '220023', NULL, '94607-70000', 'psshambhupura@gmail.com', 'ps.shambhupura.chittorgarh@rajpolice.gov.in', 35, true),
        ('श्री अक्षय कुमार, उ.नि.', 'थानाधिकारी, पुलिस थाना भादसोड़ा (PS Bhadsora)', 'station', 'भदेसर', 'भादसोड़ा', '01470', '245227', NULL, '82391-31745', 'psbhadsora@gmail.com', 'ps.bhadsora.chittorgarh@rajpolice.gov.in', 36, true),
        ('श्री रविन्द्र सेन, पु.नि.', 'थानाधिकारी, पुलिस थाना मण्डफिया (PS Mandafiya)', 'station', 'भदेसर', 'मण्डफिया (सांवरिया सेठ)', '01472', '242600', NULL, '99294-63301', 'psmandfiya@gmail.com', 'psmandphiya@gmail.com', 37, true),
        ('श्री सुनील शर्मा, पु.नि.', 'थानाधिकारी, पुलिस थाना कपासन (PS Kapasan)', 'station', 'कपासन', 'कपासन', '01476', '230253', NULL, '86862-10000', 'pskapasan@gmail.com', 'ps.kapasan.chittorgarh@rajpolice.gov.in', 38, true),
        ('श्री श्यामाराम, पु.नि.', 'थानाधिकारी, पुलिस थाना आकोला (PS Akola)', 'station', 'कपासन', 'आकोला', '01476', '226337', NULL, '94609-22677', 'psakola@gmail.com', 'ps.akola.chittorgarh@rajpolice.gov.in', 39, true),
        ('श्री रणजीत सिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना भूपालसागर (PS Bhopalsagar)', 'station', 'कपासन', 'भूपालसागर', '01476', '224253', NULL, '96804-52877', 'psbhopalsagar@gmail.com', 'ps.bhopalsagar.chittorgarh@rajpolice.gov.in', 40, true),
        ('श्री प्रवीण टांक, पु.नि.', 'थानाधिकारी, पुलिस थाना निम्बाहेड़ा कोतवाली (PS Nimbahera Kotwali)', 'station', 'निम्बाहेड़ा', 'निम्बाहेड़ा कोतवाली', '01477', '220037', NULL, '94141-61927', 'psnimbahera@gmail.com', 'ps.nimbahera.chittorgarh@rajpolice.gov.in', 41, true),
        ('श्री संजय शर्मा, पु.नि.', 'थानाधिकारी, पुलिस थाना सदर निम्बाहेड़ा (PS Nimbahera Sadar)', 'station', 'निम्बाहेड़ा', 'सदर निम्बाहेड़ा', '01477', '222100', NULL, '80055-10596', 'pssadarnimbahera@gmail.com', 'ps.sadar.nimbahera.chittorgarh@rajpolice.gov.in', 42, true),
        ('श्री महेन्द्र सिंह, उ.नि.', 'थानाधिकारी, पुलिस थाना कनेरा (PS Kanera)', 'station', 'निम्बाहेड़ा', 'कनेरा घाटा', '01477', '294100', NULL, '93141-11667', 'pskanera@gmail.com', 'ps.kanera.chittorgarh@rajpolice.gov.in', 43, true),
        ('श्री भगवानलाल, पु.नि.', 'थानाधिकारी, पुलिस थाना बड़ीसादड़ी (PS Badisadri)', 'station', 'बड़ीसादड़ी', 'बड़ीसादड़ी', '01473', '264253', NULL, '99282-53119', 'psbadisadri@gmail.com', 'ps.badisadri.chittorgarh@rajpolice.gov.in', 44, true),
        ('श्री भवानी शंकर, पु.नि.', 'थानाधिकारी, पुलिस थाना मंगलवाड़ (PS Mangalwar)', 'station', 'बड़ीसादड़ी', 'मंगलवाड़', '01470', '242001', NULL, '81144-28922', 'psmangalwar@gmail.com', 'ps.mangalwar.chittorgarh@rajpolice.gov.in', 45, true),
        ('श्री प्रभु सिंह, उ.नि.', 'थानाधिकारी, पुलिस थाना निकुम्भ (PS Nikumbh)', 'station', 'बड़ीसादड़ी', 'निकुम्भ', '01473', '246007', NULL, '94130-53710', 'psnikumbh@gmail.com', 'ps.nikumbh.chittorgarh@rajpolice.gov.in', 46, true),
        ('श्री ओम सिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना डूंगला (PS Dungla)', 'station', 'बड़ीसादड़ी', 'डूंगला', '01470', '294410', NULL, '94143-13628', 'psdungla@gmail.com', 'ps.dungla.chittorgarh@rajpolice.gov.in', 47, true),
        ('श्री चम्पाराम, पु.नि.', 'थानाधिकारी, पुलिस थाना बेगूं (PS Begun)', 'station', 'बेगूं', 'बेगूं', '01474', '230144', NULL, '94130-33234', 'psbegun@gmail.com', 'ps.begun.chittorgarh@rajpolice.gov.in', 48, true),
        ('श्री भूपाल सिंह, पु.नि.', 'थानाधिकारी, पुलिस थाना पारसोली (PS Parsoli)', 'station', 'बेगूं', 'पारसोली', '01474', '233427', NULL, '88909-91325', 'psparsoli@gmail.com', 'ps.parsoli.chittorgarh@rajpolice.gov.in', 49, true),
        ('श्री संजीव स्वामी, पु.नि.', 'थानाधिकारी, पुलिस थाना रावतभाटा (PS Rawatbhata)', 'station', 'रावतभाटा', 'रावतभाटा', '01475', '233372', NULL, '94141-38601', 'psrawatbhata@gmail.com', 'ps.rawatbhata.chittorgarh@rajpolice.gov.in', 50, true),
        ('श्री कमलचंद मीणा, पु.नि.', 'थानाधिकारी, पुलिस थाना भैंसरोड़गढ़ (PS Bhainsroadgarh)', 'station', 'रावतभाटा', 'भैंसरोड़गढ़', '01475', '232004', NULL, '94147-45971', 'psbhainsrodgarh@gmail.com', 'ps.bhainsrodgarh.chittorgarh@rajpolice.gov.in', 51, true),
        ('श्री उत्तम सिंह, उ.नि.', 'थानाधिकारी, पुलिस थाना जावदा (PS Jawda)', 'station', 'रावतभाटा', 'जावदा', '01475', '211777', NULL, '97993-67854', 'psjawda@gmail.com', 'ps.jawda.chittorgarh@rajpolice.gov.in', 52, true),
        ('यातायात चौकी चित्तौड़गढ़ (TOP Chittorgarh)', 'ट्रैफिक आउटपोस्ट, चित्तौड़गढ़', 'outpost', 'चित्तौड़गढ़', 'थाना कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 53, true),
        ('पुलिस चौकी किला (OP Fort)', 'आउटपोस्ट चित्तौड़गढ़ दुर्ग', 'outpost', 'चित्तौड़गढ़', 'थाना कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 54, true),
        ('पुलिस चौकी गांधीनगर (OP Gandhinagar)', 'आउटपोस्ट गांधीनगर', 'outpost', 'चित्तौड़गढ़', 'थाना कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 55, true),
        ('पुलिस चौकी मीरा नगर (OP Meera Nagar)', 'आउटपोस्ट मीरा नगर', 'outpost', 'चित्तौड़गढ़', 'थाना सदर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 56, true),
        ('पुलिस चौकी सेंथी (OP Senthi)', 'आउटपोस्ट सेंथी', 'outpost', 'चित्तौड़गढ़', 'थाना सदर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 57, true),
        ('पुलिस चौकी जिला चिकित्सालय (OP Hospital)', 'आउटपोस्ट श्री सांवलियाजी राजकीय चिकित्सालय', 'outpost', 'चित्तौड़गढ़', 'थाना सदर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 58, true),
        ('यातायात चौकी चन्देरिया (TOP Chanderiya)', 'ट्रैफिक आउटपोस्ट, चन्देरिया', 'outpost', 'ग्रामीण (चित्तौड़गढ़)', 'थाना चन्देरिया क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 59, true),
        ('पुलिस चौकी घोसुण्डा (OP Ghosunda)', 'आउटपोस्ट घोसुण्डा', 'outpost', 'ग्रामीण (चित्तौड़गढ़)', 'थाना चन्देरिया क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 60, true),
        ('पुलिस चौकी अभयपुरा (Abhaypura)', 'आउटपोस्ट अभयपुरा', 'outpost', 'ग्रामीण (चित्तौड़गढ़)', 'थाना बिजयपुर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 61, true),
        ('यातायात चौकी बस्सी (TOP Bassi)', 'ट्रैफिक आउटपोस्ट, बस्सी', 'outpost', 'ग्रामीण (चित्तौड़गढ़)', 'थाना बस्सी क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 62, true),
        ('पुलिस चौकी पुठोली (OP Putholi)', 'आउटपोस्ट पुठोली', 'outpost', 'गंगरार', 'थाना गंगरार क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 63, true),
        ('पुलिस चौकी रीको सोनियाणा (OP RIICO Soniyana)', 'आउटपोस्ट रीको सोनियाणा', 'outpost', 'गंगरार', 'थाना गंगरार क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 64, true),
        ('पुलिस चौकी पहुंना (OP Pahuna)', 'आउटपोस्ट पहुंना', 'outpost', 'गंगरार', 'थाना राशमी क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 65, true),
        ('पुलिस चौकी कन्नौज (OP Kannoj)', 'आउटपोस्ट कन्नौज', 'outpost', 'भदेसर', 'थाना भदेसर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 66, true),
        ('पुलिस चौकी चिकारड़ा (OP Chikarda)', 'आउटपोस्ट चिकारड़ा', 'outpost', 'भदेसर', 'थाना मण्डफिया क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 67, true),
        ('यातायात चौकी शम्भूपुरा (TOP Shambhupura)', 'ट्रैफिक आउटपोस्ट, शम्भूपुरा', 'outpost', 'भदेसर', 'थाना शम्भूपुरा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 68, true),
        ('पुलिस चौकी सावा (OP Sawa)', 'आउटपोस्ट सावा', 'outpost', 'भदेसर', 'थाना शम्भूपुरा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 69, true),
        ('यातायात चौकी कपासन (TOP Kapasan)', 'ट्रैफिक आउटपोस्ट, कपासन', 'outpost', 'कपासन', 'थाना कपासन क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 70, true),
        ('पुलिस चौकी मेवदा (OP Mewda)', 'आउटपोस्ट मेवदा', 'outpost', 'कपासन', 'थाना कपासन क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 71, true),
        ('पुलिस चौकी पांडोली (OP Pandoli)', 'आउटपोस्ट पांडोली', 'outpost', 'कपासन', 'थाना कपासन क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 72, true),
        ('पुलिस चौकी सिंहपुर (OP Singhpur)', 'आउटपोस्ट सिंहपुर', 'outpost', 'कपासन', 'थाना कपासन क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 73, true),
        ('पुलिस चौकी जाश्मा (OP Jashma)', 'आउटपोस्ट जाश्मा', 'outpost', 'कपासन', 'थाना भूपालसागर क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 74, true),
        ('यातायात चौकी बेगूं (TOP Begun)', 'ट्रैफिक आउटपोस्ट, बेगूं', 'outpost', 'बेगूं', 'थाना बेगूं क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 75, true),
        ('पुलिस चौकी चेची (OP Chenchi)', 'आउटपोस्ट चेची', 'outpost', 'बेगूं', 'थाना बेगूं क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 76, true),
        ('पुलिस चौकी जोगणिया माता (OP Jogniyamata)', 'आउटपोस्ट जोगणिया माता तीर्थ', 'outpost', 'बेगूं', 'थाना बेगूं क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 77, true),
        ('पुलिस चौकी नंदवई (OP Nandwai)', 'आउटपोस्ट नंदवई', 'outpost', 'बेगूं', 'थाना पारसोली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 78, true),
        ('पुलिस चौकी बिछोर (OP Bhichor)', 'आउटपोस्ट बिछोर', 'outpost', 'बेगूं', 'थाना पारसोली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 79, true),
        ('पुलिस चौकी बारोदिया (OP Barodiya)', 'आउटपोस्ट बारोदिया', 'outpost', 'रावतभाटा', 'थाना रावतभाटा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 80, true),
        ('पुलिस चौकी आर.ए.पी.पी. (OP RAPP)', 'आउटपोस्ट राजस्थान परमाणु ऊर्जा संयंत्र', 'outpost', 'रावतभाटा', 'थाना रावतभाटा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 81, true),
        ('पुलिस चौकी धांगडमऊ (OP Dhangdmau)', 'आउटपोस्ट धांगडमऊ', 'outpost', 'रावतभाटा', 'थाना भैंसरोड़गढ़ क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 82, true),
        ('पुलिस चौकी मण्डेसरा (OP Mandesra)', 'आउटपोस्ट मण्डेसरा', 'outpost', 'रावतभाटा', 'थाना भैंसरोड़गढ़ क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 83, true),
        ('यातायात चौकी निम्बाहेड़ा (TOP Nimbahera)', 'ट्रैफिक आउटपोस्ट, निम्बाहेड़ा', 'outpost', 'निम्बाहेड़ा', 'थाना निम्बाहेड़ा कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 84, true),
        ('पुलिस चौकी केलि (OP Keli)', 'आउटपोस्ट केलि', 'outpost', 'निम्बाहेड़ा', 'थाना निम्बाहेड़ा कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 85, true),
        ('पुलिस चौकी आदर्श कॉलोनी (OP Aadarsh Colony)', 'आउटपोस्ट आदर्श कॉलोनी निम्बाहेड़ा', 'outpost', 'निम्बाहेड़ा', 'थाना निम्बाहेड़ा कोतवाली क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 86, true),
        ('पुलिस चौकी बाड़ी (OP Badi)', 'आउटपोस्ट बाड़ी', 'outpost', 'निम्बाहेड़ा', 'थाना सदर निम्बाहेड़ा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 87, true),
        ('पुलिस चौकी बिनोता (OP Binota)', 'आउटपोस्ट बिनोता', 'outpost', 'निम्बाहेड़ा', 'थाना सदर निम्बाहेड़ा क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 88, true),
        ('यातायात चौकी बड़ीसादड़ी (TOP Badisadri)', 'ट्रैफिक आउटपोस्ट, बड़ीसादड़ी', 'outpost', 'बड़ीसादड़ी', 'थाना बड़ीसादड़ी क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 89, true),
        ('पुलिस चौकी बंसी (OP Bansi)', 'आउटपोस्ट बंसी', 'outpost', 'बड़ीसादड़ी', 'थाना बड़ीसादड़ी क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 90, true),
        ('यातायात चौकी मंगलवाड़ (TOP Mangalwar)', 'ट्रैफिक आउटपोस्ट, मंगलवाड़ चौराहा', 'outpost', 'बड़ीसादड़ी', 'थाना मंगलवाड़ क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 91, true),
        ('पुलिस चौकी देलवास (OP Delwas)', 'आउटपोस्ट देलवास', 'outpost', 'बड़ीसादड़ी', 'थाना डूंगला क्षेत्र', NULL, NULL, NULL, NULL, NULL, NULL, 92, true);
    END IF;
END $$;

SELECT COUNT(*) AS total_directory_contacts FROM police_directory;
