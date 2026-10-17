import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Scale,
  Sparkles,
  Phone,
  FileWarning,
  QrCode,
  Briefcase,
  Video,
  Monitor,
  Coins,
  Smartphone,
  UserX,
  Image as ImageIcon,
  Home,
  Building,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import {
  SAFETY_TOPICS,
  type SafetyCategory,
  type SafetyLanguage,
  type SafetyTopic,
} from '../data/safetyHubData';

interface SafetyHubPageProps {
  onOpenAdmin?: () => void;
  onOpenInitiative?: () => void;
}

export const SafetyHubPage: React.FC<SafetyHubPageProps> = ({
  onOpenAdmin,
  onOpenInitiative,
}) => {
  const [lang, setLang] = useState<SafetyLanguage>('hi');
  const [activeCategory, setActiveCategory] = useState<SafetyCategory>('cyber');
  const [expandedId, setExpandedId] = useState<string | null>('digital-arrest');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredTopics = SAFETY_TOPICS.filter(
    (topic) => topic.category === activeCategory
  );

  const getTopicIcon = (iconName: SafetyTopic['iconName']) => {
    const props = { className: 'w-5 h-5 flex-shrink-0' };
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'FileWarning':
        return <FileWarning {...props} />;
      case 'QrCode':
        return <QrCode {...props} />;
      case 'Briefcase':
        return <Briefcase {...props} />;
      case 'Video':
        return <Video {...props} />;
      case 'Monitor':
        return <Monitor {...props} />;
      case 'Coins':
        return <Coins {...props} />;
      case 'Smartphone':
        return <Smartphone {...props} />;
      case 'UserX':
        return <UserX {...props} />;
      case 'Image':
        return <ImageIcon {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Building':
        return <Building {...props} />;
      case 'AlertCircle':
        return <AlertCircle {...props} />;
      default:
        return <ShieldAlert {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F4F8' }}>
      {/* ── Official Header ── */}
      <Header />

      {/* ── Hero Band with Language Switcher ── */}
      <div
        style={{
          background: 'linear-gradient(160deg, #091322 0%, #152A4A 60%, #1D3557 100%)',
          paddingTop: '20px',
          paddingBottom: '22px',
        }}
        className="text-white relative"
      >
        <div className="page-container text-center flex flex-col items-center">
          {/* Language Toggle Pill */}
          <div className="flex items-center justify-center gap-1.5 mb-3 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15">
            <Languages className="w-3.5 h-3.5 text-amber-300 ml-1.5" />
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-full text-xs font-semibold font-devanagari transition-all ${
                lang === 'hi'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold font-sans transition-all ${
                lang === 'en'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* District Police Initiative Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-blue-900/60 border border-blue-400/30 text-blue-200 mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>
              {lang === 'hi'
                ? 'चित्तौड़गढ़ पुलिस जन-सुरक्षा पहल'
                : 'Chittorgarh Police Citizen Protection Cell'}
            </span>
          </div>

          {/* Main Title */}
          <h2
            className={`font-extrabold text-white leading-tight mb-1.5 ${
              lang === 'hi' ? 'font-devanagari' : 'font-sans'
            }`}
            style={{ fontSize: 'clamp(21px, 5.5vw, 27px)' }}
          >
            {lang === 'hi' ? (
              <>
                नागरिक सुरक्षा एवं <span style={{ color: '#F1C40F' }}>जागरूकता केंद्र</span>
              </>
            ) : (
              <>
                Citizen Safety & <span style={{ color: '#F1C40F' }}>Awareness Hub</span>
              </>
            )}
          </h2>

          <p
            className={`text-slate-300 text-xs sm:text-sm max-w-md ${
              lang === 'hi' ? 'font-devanagari' : 'font-sans'
            }`}
          >
            {lang === 'hi'
              ? 'साइबर ठगी से बचाव, आवश्यक सावधानियां एवं महिला गरिमा व कानूनी अधिकार'
              : 'Fraud prevention protocols, trap warnings, and statutory women safety safeguards'}
          </p>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="flex-1 pt-4 sm:pt-6">
        <div className="page-container pb-14 space-y-5">
          {/* ── 1. Top Emergency Action Strip (Always Accessible) ── */}
          <section aria-label="Emergency Helplines">
            <div className="text-center mb-2.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-sans">
                {lang === 'hi' ? 'तत्काल आपातकालीन सहायता' : 'Immediate Emergency Assistance'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* 1930 Cyber Fraud */}
              <a
                href="tel:1930"
                className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-black text-red-700 leading-none font-sans">
                  1930
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-red-900 mt-1 leading-tight">
                  {lang === 'hi' ? 'साइबर फ्रॉड' : 'Cyber Fraud'}
                </div>
                <div className="text-[9px] text-red-600 mt-0.5 hidden xs:block">
                  {lang === 'hi' ? 'गोल्डन ऑवर' : 'Golden Hour'}
                </div>
              </a>

              {/* 1090 Women Garima */}
              <a
                href="tel:1090"
                className="bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-black text-pink-700 leading-none font-sans">
                  1090
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-pink-900 mt-1 leading-tight">
                  {lang === 'hi' ? 'महिला गरिमा' : 'Women Help'}
                </div>
                <div className="text-[9px] text-pink-600 mt-0.5 hidden xs:block">
                  {lang === 'hi' ? '24x7 हेल्पलाइन' : 'Toll-Free 24x7'}
                </div>
              </a>

              {/* 112 Police Emergency */}
              <a
                href="tel:112"
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-black text-blue-800 leading-none font-sans">
                  112
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-blue-950 mt-1 leading-tight">
                  {lang === 'hi' ? 'पुलिस आपातकाल' : 'Police SOS'}
                </div>
                <div className="text-[9px] text-blue-600 mt-0.5 hidden xs:block">
                  {lang === 'hi' ? 'तत्काल वैन' : 'Immediate ERV'}
                </div>
              </a>
            </div>
          </section>

          {/* ── 2. Category Switcher Tabs (Cyber vs Women Safety) ── */}
          <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1.5 shadow-inner">
            <button
              onClick={() => {
                setActiveCategory('cyber');
                setExpandedId('digital-arrest');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeCategory === 'cyber'
                  ? 'bg-red-700 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'hi' ? 'साइबर अपराध से बचाव' : 'Cyber Crime Defense'}</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('women');
                setExpandedId('stalking-harassment');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeCategory === 'women'
                  ? 'bg-pink-700 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'hi' ? 'महिला सुरक्षा एवं अधिकार' : 'Women Safety & Rights'}</span>
            </button>
          </div>

          {/* ── 3. District Dedicated Units Highlight Card ── */}
          {activeCategory === 'cyber' ? (
            <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 font-devanagari">
                    {lang === 'hi'
                      ? 'साइबर पुलिस थाना, चित्तौड़गढ़ (एसपी कार्यालय परिसर)'
                      : 'District Cyber Police Station, Chittorgarh (SP Office Campus)'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-devanagari mt-0.5">
                    {lang === 'hi'
                      ? 'थानाधिकारी: श्री रविन्द्रप्रताप सिंह, R.P.S. | ईमेल: pscybercgh@gmail.com'
                      : 'SHO: Sh. Ravindra Pratap Singh, R.P.S. | Email: pscybercgh@gmail.com'}
                  </p>
                </div>
              </div>
              <a
                href="tel:9783311422"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>97833-11422</span>
              </a>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 font-devanagari">
                    {lang === 'hi'
                      ? 'महिला अपराध अन्वेषण सेल (SIUCAW), चित्तौड़गढ़'
                      : 'Special Investigation Unit for Crime Against Women (SIUCAW)'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-devanagari mt-0.5">
                    {lang === 'hi'
                      ? 'प्रभारी: अतिरिक्त पुलिस अधीक्षक (Addl. SP SIUCAW), चित्तौड़गढ़'
                      : 'In-Charge: Additional Superintendent of Police, Chittorgarh'}
                  </p>
                </div>
              </div>
              <a
                href="tel:9414294206"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-sm transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>94142-94206</span>
              </a>
            </div>
          )}

          {/* ── 4. Interactive Click-to-Expand Accordions ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {activeCategory === 'cyber'
                  ? lang === 'hi'
                    ? 'प्रमुख साइबर ट्रैप एवं बचाव (क्लिक कर विस्तार से पढ़ें)'
                    : 'Major Cyber Traps & Defenses (Click to expand)'
                  : lang === 'hi'
                  ? 'महिला सुरक्षा मार्गदर्शिका एवं कानूनी अधिकार'
                  : 'Women Safety Protocols & Statutory Rights'}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                {filteredTopics.length} {lang === 'hi' ? 'विषय' : 'Topics'}
              </span>
            </div>

            {filteredTopics.map((topic) => {
              const isExpanded = expandedId === topic.id;

              return (
                <div
                  key={topic.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                    isExpanded
                      ? activeCategory === 'cyber'
                        ? 'border-red-300 ring-2 ring-red-100 shadow-md'
                        : 'border-pink-300 ring-2 ring-pink-100 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Accordion Header (Click to Toggle) */}
                  <button
                    onClick={() => toggleExpand(topic.id)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-start justify-between gap-3 transition-colors hover:bg-slate-50/70"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                          activeCategory === 'cyber'
                            ? isExpanded
                              ? 'bg-red-600 text-white'
                              : 'bg-red-50 text-red-600'
                            : isExpanded
                            ? 'bg-pink-600 text-white'
                            : 'bg-pink-50 text-pink-600'
                        }`}
                      >
                        {getTopicIcon(topic.iconName)}
                      </div>

                      <div>
                        {/* Badge */}
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                            topic.severity === 'critical'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {topic.badge[lang]}
                        </span>

                        {/* Title */}
                        <h4
                          className={`font-extrabold text-sm sm:text-base text-slate-900 leading-snug ${
                            lang === 'hi' ? 'font-devanagari' : 'font-sans'
                          }`}
                        >
                          {topic.title[lang]}
                        </h4>

                        {/* Subtitle / Teaser */}
                        <p
                          className={`text-xs text-slate-500 mt-0.5 leading-relaxed ${
                            lang === 'hi' ? 'font-devanagari' : 'font-sans'
                          }`}
                        >
                          {topic.summary[lang]}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-slate-100 text-slate-700'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Body (Expanded Content) */}
                  {isExpanded && (
                    <div className="px-3.5 pb-4 pt-1 sm:px-5 sm:pb-5 space-y-4 border-t border-slate-100">
                      {/* 1. Modus Operandi (How they trap you) */}
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 sm:p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 mb-1">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>
                            {lang === 'hi'
                              ? 'कैसे फंसाते हैं (अपराध का तरीका):'
                              : 'Modus Operandi (How They Trap You):'}
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${
                            lang === 'hi' ? 'font-devanagari' : 'font-sans'
                          }`}
                        >
                          {topic.trapModus[lang]}
                        </p>
                      </div>

                      {/* 2. Strict Don'ts */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-1.5">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>
                            {lang === 'hi'
                              ? 'क्या कभी न करें (Strict Don’ts):'
                              : 'What You Must NEVER Do:'}
                          </span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {topic.strictDonts[lang].map((item, idx) => (
                            <li
                              key={idx}
                              className={`text-xs sm:text-sm text-slate-700 flex items-start gap-2 ${
                                lang === 'hi' ? 'font-devanagari' : 'font-sans'
                              }`}
                            >
                              <span className="text-red-500 font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 3. Legal Truth & Defense */}
                      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 sm:p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1.5">
                          <Scale className="w-4 h-4 text-blue-600" />
                          <span>
                            {lang === 'hi'
                              ? 'सच्चाई एवं कानूनी अधिकार:'
                              : 'Statutory Safeguards & Reality:'}
                          </span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {topic.legalTruthOrDos[lang].map((item, idx) => (
                            <li
                              key={idx}
                              className={`text-xs sm:text-sm text-slate-700 flex items-start gap-2 ${
                                lang === 'hi' ? 'font-devanagari' : 'font-sans'
                              }`}
                            >
                              <span className="text-blue-500 font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 4. Immediate Recovery Steps */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            {lang === 'hi'
                              ? 'यदि ऐसा हो जाए तो तुरंत क्या करें:'
                              : 'Immediate Recovery & Action Steps:'}
                          </span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {topic.recoverySteps[lang].map((item, idx) => (
                            <li
                              key={idx}
                              className={`text-xs sm:text-sm text-slate-700 flex items-start gap-2 ${
                                lang === 'hi' ? 'font-devanagari' : 'font-sans'
                              }`}
                            >
                              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 5. 1-Tap Action Call Button */}
                      {topic.actionCall && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          {topic.actionCall.phone ? (
                            <a
                              href={`tel:${topic.actionCall.phone}`}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
                                activeCategory === 'cyber'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-pink-600 hover:bg-pink-700'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{topic.actionCall.label[lang]}</span>
                            </a>
                          ) : topic.actionCall.url ? (
                            <a
                              href={topic.actionCall.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-all active:scale-95"
                            >
                              <span>{topic.actionCall.label[lang]}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── 5. Bottom Golden Rule Advisory Card ── */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 text-center space-y-2">
            <h4 className="font-extrabold text-sm sm:text-base text-amber-400 font-devanagari">
              {lang === 'hi'
                ? 'स्मरण रहे: सतर्कता ही सबसे बड़ा बचाव है'
                : 'Golden Rule: Constant Awareness is Your Strongest Shield'}
            </h4>
            <p className="text-xs text-slate-300 max-w-lg mx-auto font-devanagari leading-relaxed">
              {lang === 'hi'
                ? 'चित्तौड़गढ़ पुलिस सदैव आपके सहयोग व सुरक्षा के लिए तत्पर है। किसी भी संदिग्ध गतिविधि की तत्काल सूचना दें। आपकी पहचान पूर्णतः गोपनीय रखी जाएगी।'
                : 'Chittorgarh Police stands dedicated to your defense. Report any suspicious scam or harassment immediately. Your identity remains 100% protected by law.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Official Footer ── */}
      <Footer onOpenAdmin={onOpenAdmin} onOpenInitiative={onOpenInitiative} />
    </div>
  );
};
