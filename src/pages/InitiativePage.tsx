import React from 'react';
import {
  ArrowLeft,
  Smartphone,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe2,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface InitiativePageProps {
  onBack: () => void;
  onOpenAdmin?: () => void;
}

/* ─────────────────────────────────────────────
   HIGH CONTRAST PALETTE (Dark Bold & Crisp)
   ───────────────────────────────────────────── */
const C = {
  navy:        '#0B1528',
  black:       '#000000',
  textPrimary: '#0F172A', // True dark bold slate/black
  textBody:    '#1E293B', // High-contrast readable body text
  gold:        '#B45309', // Deep authoritative gold
  goldAccent:  '#D97706', // Rich amber border
  goldLight:   '#F59E0B',
  bgPage:      '#F8FAFC',
  cardBg:      '#FFFFFF',
  badgeBg:     '#FEF3C7',
  badgeText:   '#78350F',
  badgeBorder: '#FDE68A',
} as const;

/* ─────────────────────────────────────────────
   FEATURE CARDS DATA
   ───────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: Smartphone,
    title: 'मोबाइल-फर्स्ट पोर्टल',
    desc:  'सभी स्मार्टफोन्स पर त्वरित लोड होने वाला, हल्का और पूर्णतः हिंदी भाषा में सुलभ इंटरफ़ेस।',
  },
  {
    Icon: Zap,
    title: '1-क्लिक लाइव स्थिति',
    desc:  'कार्यालय द्वारा रियल-टाइम अपडेट — समय परिवर्तन, व्यस्तता व वैकल्पिक व्यवस्था की तुरंत सूचना।',
  },
  {
    Icon: Users,
    title: 'नागरिक एवं पुलिस सहायता',
    desc:  'दूर-दराज एवं ग्रामीण क्षेत्रों के नागरिकों के समय, खर्च और अनावश्यक यात्रा श्रम की प्रत्यक्ष बचत।',
  },
  {
    Icon: Award,
    title: 'पारदर्शिता एवं जनविश्वास',
    desc:  'प्रशासनिक सूचनाओं को जनसुलभ बनाकर पुलिस-नागरिक संवाद को अधिक सशक्त एवं पारदर्शी बनाना।',
  },
  {
    Icon: Globe2,
    title: 'डिजिटल राजस्थान',
    desc:  'ई-गवर्नेंस और आधुनिक तकनीक के माध्यम से जिले में लोक-सेवा का एक सशक्त नवाचार।',
  },
] as const;

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */
export const InitiativePage: React.FC<InitiativePageProps> = ({ onBack, onOpenAdmin }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: C.bgPage }}
    >
      {/* ── Shared Official Header ── */}
      <Header />

      {/* ── Page Body ── */}
      <main className="flex-1 w-full">
        <div
          className="mx-auto w-full px-4 sm:px-6 py-5 sm:py-8"
          style={{ maxWidth: '760px' }}
        >

          {/* ── Back Navigation ── */}
          <div className="flex items-center justify-center sm:justify-between mb-5 sm:mb-6">
            <button
              type="button"
              onClick={onBack}
              className="initiative-back-btn inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                padding: '9px 18px',
                background: C.cardBg,
                border: `2px solid ${C.goldAccent}`,
                color: C.navy,
                boxShadow: '0 2px 6px rgba(11,21,40,0.08)',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                lineHeight: 1.5,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFFBEB';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = C.cardBg;
              }}
            >
              <ArrowLeft
                className="flex-shrink-0"
                style={{ width: '16px', height: '16px', color: C.goldAccent }}
              />
              <span>← मुख्य जनसुनवाई पोर्टल पर वापस जाएं</span>
            </button>

            {/* District tag */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
              style={{
                padding: '6px 14px',
                background: C.badgeBg,
                border: `1.5px solid ${C.badgeBorder}`,
                color: C.badgeText,
                fontFamily: "'Noto Sans Devanagari', sans-serif",
              }}
            >
              <MapPin style={{ width: '13px', height: '13px', color: C.goldAccent, flexShrink: 0 }} />
              चित्तौड़गढ़ डिजिटल पहल
            </span>
          </div>

          {/* ══════════════════════════════════════════════
              MAIN INITIATIVE CARD
          ══════════════════════════════════════════════ */}
          <div
            className="relative rounded-2xl sm:rounded-3xl"
            style={{
              background: C.cardBg,
              border: `2px solid ${C.goldAccent}`,
              boxShadow: '0 8px 30px rgba(15,23,42,0.12), 0 2px 6px rgba(15,23,42,0.06)',
            }}
          >
            {/* ── Top Golden Accent Line ── */}
            <div
              className="absolute inset-x-0 top-0 rounded-t-2xl sm:rounded-t-3xl"
              style={{
                height: '4px',
                background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldLight} 50%, ${C.gold} 100%)`,
              }}
              aria-hidden="true"
            />

            <div className="pt-6 sm:pt-8 pb-7 px-5 sm:px-8 space-y-0">

              {/* ── SECTION 1: Logo + Initiative Title (Centered) ── */}
              <div
                className="flex flex-col items-center text-center gap-4 pb-6 sm:pb-7"
                style={{ borderBottom: `1.5px solid #E2E8F0` }}
              >

                {/* ChittorTech Logo Container — Centered, fills & covers box fully */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-2xl overflow-hidden relative mx-auto"
                  style={{
                    width: '92px',
                    height: '92px',
                    background: '#FFFFFF',
                    border: `2.5px solid ${C.goldAccent}`,
                    boxShadow: '0 4px 14px rgba(217,119,6,0.22)',
                  }}
                >
                  <img
                    src="/chittortech_logo.png"
                    alt="ChittorTech Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.35)',
                      display: 'block',
                    }}
                    onError={e => {
                      const t = e.currentTarget;
                      if (!t.src.includes('chittortech-logo.png')) {
                        t.src = '/chittortech-logo.png';
                      }
                    }}
                  />
                </div>

                {/* Text column — Centered */}
                <div className="w-full text-center">
                  {/* Badge */}
                  <div className="flex justify-center mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full text-xs font-extrabold"
                      style={{
                        padding: '5px 14px',
                        background: C.badgeBg,
                        border: `1.5px solid ${C.badgeBorder}`,
                        color: C.badgeText,
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                      }}
                    >
                      <Sparkles style={{ width: '13px', height: '13px', color: C.goldAccent, flexShrink: 0 }} />
                      तकनीक से जनसेवा — ChittorTech Initiative
                    </span>
                  </div>

                  {/* Main heading in Dark Bold Black Centered */}
                  <h1
                    className="font-black text-center"
                    style={{
                      fontFamily: "'Noto Sans Devanagari', sans-serif",
                      fontSize: 'clamp(20px, 4.8vw, 25px)',
                      lineHeight: 1.5,
                      color: C.black,
                      marginBottom: '10px',
                    }}
                  >
                    चित्तौड़गढ़ के नागरिकों की सुविधा हेतु — एक डिजिटल पहल
                  </h1>

                  {/* Subtitle in Crisp Dark Text Centered */}
                  <p
                    className="text-center mx-auto"
                    style={{
                      fontFamily: "'Noto Sans Devanagari', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.75,
                      color: C.textPrimary,
                      fontWeight: 700,
                      maxWidth: '600px',
                      margin: 0,
                    }}
                  >
                    सार्वजनिक सूचना एवं पुलिस जनसुनवाई उपलब्धता को जन-जन तक पहुंचाने का आधुनिक प्रयास
                  </p>
                </div>
              </div>

              {/* ── SECTION 2: Mission & Assistance Statement (Centered & Spacious) ── */}
              <div
                className="py-6 sm:py-8 flex flex-col items-center text-center"
                style={{ borderBottom: `1.5px solid #E2E8F0` }}
              >
                {/* Centered Highlight banner */}
                <div className="flex justify-center w-full mb-6">
                  <div
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl text-center"
                    style={{
                      padding: '12px 18px',
                      background: C.badgeBg,
                      border: `1.5px solid ${C.goldAccent}`,
                      maxWidth: '100%',
                    }}
                  >
                    <ShieldCheck
                      className="flex-shrink-0"
                      style={{ width: '20px', height: '20px', color: C.goldAccent }}
                    />
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: '13.5px',
                        lineHeight: 1.7,
                        color: C.badgeText,
                        fontWeight: 800,
                      }}
                    >
                      नागरिक एवं पुलिस सहायता हेतु आधुनिक तकनीकी पहल — ChittorTech Initiative
                    </span>
                  </div>
                </div>

                {/* Primary description in Dark Bold Text Centered */}
                <p
                  className="text-center mx-auto"
                  style={{
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    fontSize: '15px',
                    lineHeight: 2.05,
                    letterSpacing: '0.01em',
                    color: C.black,
                    fontWeight: 600,
                    marginTop: 0,
                    marginBottom: '22px',
                    maxWidth: '680px',
                  }}
                >
                  <strong style={{ color: C.black, fontWeight: 900 }}>ChittorTech</strong>{' '}
                  का मुख्य उद्देश्य आधुनिक सूचना तकनीक के माध्यम से चित्तौड़गढ़ जिले के समस्त
                  नागरिकों एवं पुलिस प्रशासन के मध्य सूचना-पारदर्शिता को सुगम बनाना है।
                  तकनीक के माध्यम से उपयोगी प्रशासनिक व जनहितैषी जानकारी जन-जन तक पूरी सुलभता से पहुंचे।
                </p>

                {/* Secondary description in Dark Bold Text Centered */}
                <p
                  className="text-center mx-auto"
                  style={{
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    fontSize: '14.5px',
                    lineHeight: 2.05,
                    letterSpacing: '0.01em',
                    color: C.textPrimary,
                    fontWeight: 600,
                    marginTop: 0,
                    marginBottom: '8px',
                    maxWidth: '680px',
                  }}
                >
                  यह पोर्टल नागरिकों को पुलिस अधीक्षक कार्यालय आने से पूर्व जनसुनवाई का सही
                  समय, अधिकारी उपलब्धता, वैकल्पिक व्यवस्था तथा आवश्यक सार्वजनिक सूचनाएं घर
                  बैठे सीधे मोबाइल पर उपलब्ध कराता है, जिससे आमजन के बहुमूल्य समय और
                  अनावश्यक यात्रा श्रम की प्रत्यक्ष बचत होती है।
                </p>
              </div>

              {/* ── SECTION 3: Feature Cards (Centered Icons & Text) ── */}
              <div
                className="py-6 sm:py-8"
                style={{ borderBottom: `1.5px solid #E2E8F0` }}
              >
                <h2
                  className="text-center mb-6 font-black"
                  style={{
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    fontSize: '15px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: C.navy,
                    margin: '0 0 20px 0',
                  }}
                >
                  मुख्य विशेषताएं एवं जन-सुविधाएं
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FEATURES.map(({ Icon, title, desc }) => (
                    <FeatureCard key={title} Icon={Icon} title={title} desc={desc} />
                  ))}
                </div>
              </div>

              {/* ── SECTION 4: Attribution + Return Button (Centered) ── */}
              <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-5 text-center">
                {/* Attribution in Dark Bold Centered */}
                <div className="text-center">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14.5px',
                      fontWeight: 800,
                      color: C.black,
                      margin: '0 0 4px 0',
                    }}
                  >
                    ChittorTech, Chittorgarh (Rajasthan)
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12.5px',
                      color: C.textBody,
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Designed &amp; Developed by ChittorTech as a Citizen &amp; Police Assistance Initiative.
                  </p>
                </div>

                {/* Return button Centered */}
                <button
                  type="button"
                  onClick={onBack}
                  className="initiative-return-btn inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap mx-auto"
                  style={{
                    padding: '12px 26px',
                    background: C.navy,
                    color: '#FFFFFF',
                    border: `2px solid ${C.goldAccent}`,
                    boxShadow: '0 4px 14px rgba(11,21,40,0.25)',
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#1E293B';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.navy;
                  }}
                >
                  <CheckCircle2
                    className="flex-shrink-0"
                    style={{ width: '16px', height: '16px', color: C.goldLight }}
                  />
                  <span>मुख्य जनसुनवाई पोर्टल पर लौटें</span>
                  <ChevronRight
                    className="flex-shrink-0"
                    style={{ width: '15px', height: '15px', color: '#FDE047' }}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* ── Official Info strip below card in Dark Bold Text Centered ── */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center"
            style={{
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: '12px',
              color: C.black,
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock style={{ width: '13px', height: '13px', color: C.goldAccent, flexShrink: 0 }} />
              कार्यालय समय: सोमवार–शनिवार, प्रातः 10:00 – सायं 5:00 बजे
            </span>
            <span className="hidden sm:inline" aria-hidden="true" style={{ color: C.goldAccent }}>•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin style={{ width: '13px', height: '13px', color: C.goldAccent, flexShrink: 0 }} />
              कलेक्ट्रेट परिसर, चित्तौड़गढ़ (राजस्थान) — 312001
            </span>
          </div>

        </div>
      </main>

      {/* ── Shared Official Footer ── */}
      <Footer onOpenAdmin={onOpenAdmin} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARD — High Contrast & Centered
   ───────────────────────────────────────────── */
interface FeatureCardProps {
  Icon: React.FC<{ style?: React.CSSProperties; className?: string }>;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, desc }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="rounded-2xl transition-all flex flex-col items-center text-center"
      style={{
        padding: '22px 18px',
        background: hovered ? '#FFFBEB' : '#FFFFFF',
        border: `1.5px solid ${hovered ? C.goldAccent : '#CBD5E1'}`,
        boxShadow: hovered ? '0 6px 20px rgba(217,119,6,0.15)' : '0 2px 6px rgba(15,23,42,0.06)',
        cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Centered Icon box */}
      <div
        className="flex items-center justify-center rounded-xl mb-3.5 mx-auto"
        style={{
          width: '46px',
          height: '46px',
          background: '#FEF3C7',
          border: `1.5px solid ${C.goldAccent}`,
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: '22px', height: '22px', color: C.goldAccent }} />
      </div>

      {/* Centered Title */}
      <h3
        className="text-center"
        style={{
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: '15px',
          fontWeight: 800,
          lineHeight: 1.45,
          color: C.black,
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>

      {/* Centered Description */}
      <p
        className="text-center"
        style={{
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: '13px',
          lineHeight: 1.75,
          color: C.textBody,
          fontWeight: 600,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
};
