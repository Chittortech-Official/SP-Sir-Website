import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Mail,
  Building2,
  Shield,
  MapPin,
  X,
  PhoneCall,
  Check,
  Copy,
  Info,
  Radio,
  Globe2,
  ArrowUp,
  Send,
  ChevronDown,
} from 'lucide-react';
import { POLICE_DIRECTORY_DATA, POLICE_CIRCLES } from '../data/policeDirectory';
import { DataService } from '../lib/supabase';
import type { PoliceDirectoryRecord } from '../types/database';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface DirectoryPageProps {
  onOpenAdmin?: () => void;
  onOpenInitiative?: () => void;
}

type CategoryFilter = 'all' | 'senior' | 'circle' | 'station' | 'branch' | 'outpost';

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  onOpenAdmin,
  onOpenInitiative,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string>('सभी वृत');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [contactsList, setContactsList] = useState<PoliceDirectoryRecord[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live fetch from Supabase with cross-tab sync
  useEffect(() => {
    let isMounted = true;
    const fetchContacts = async () => {
      try {
        const live = await DataService.getPoliceDirectory();
        if (isMounted && live && live.length > 0) {
          setContactsList(live);
        }
      } catch (err) {
        console.warn('Live directory fetch error', err);
      }
    };

    fetchContacts();

    const handleSync = () => {
      fetchContacts();
    };

    window.addEventListener('sp_availability_changed', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('sp_availability_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Monitor scroll for scroll-to-top button and footer proximity
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 250);

      const scrollBottom = window.innerHeight + scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      // When within footer zone (~340px from bottom), shift button to right corner
      setIsAtFooter(documentHeight - scrollBottom < 340);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTopAndFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 350);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCircle('सभी वृत');
    setSelectedCategory('all');
    setVisibleCount(10);
  };

  const sourceData = useMemo(() => {
    return contactsList.length > 0
      ? contactsList
      : (POLICE_DIRECTORY_DATA as unknown as PoliceDirectoryRecord[]);
  }, [contactsList]);

  const filteredContacts = useMemo(() => {
    const rawQ = searchQuery.trim().toLowerCase();
    const digitsOnlyQ = rawQ.replace(/[^0-9]/g, '');

    return sourceData.filter((item) => {
      const circle = item.circle_name || (item as any).circleName;
      const altMail = item.alt_email || (item as any).altEmail;
      const officePh = item.office_phone || (item as any).officePhone;
      const std = item.std_code || (item as any).stdCode;
      const resPh = item.residence_phone || (item as any).residencePhone;

      // 1. Circle dropdown filter
      if (
        selectedCircle !== 'सभी वृत' &&
        circle !== selectedCircle
      ) {
        return false;
      }

      // 2. Category / Post dropdown filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'senior' && item.category !== 'senior') return false;
        if (selectedCategory === 'circle' && item.category !== 'circle') return false;
        if (selectedCategory === 'station' && item.category !== 'station') return false;
        if (selectedCategory === 'branch' && item.category !== 'branch') return false;
        if (selectedCategory === 'outpost' && item.category !== 'outpost') return false;
      }

      // 3. Free text & phone number search filter
      if (!rawQ) return true;

      // Text search across name, post, circle, location, emails
      const searchableString = [
        item.name,
        item.post,
        circle || '',
        item.location || '',
        item.email || '',
        altMail || '',
        item.mobile || '',
        officePh || '',
        std || '',
      ]
        .join(' ')
        .toLowerCase();

      if (searchableString.includes(rawQ)) return true;

      // Digits-only search (matches mobile or landline without hyphens or spaces)
      if (digitsOnlyQ.length >= 3) {
        const itemMobileDigits = (item.mobile || '').replace(/[^0-9]/g, '');
        const itemOfficeDigits = `${std || ''}${officePh || ''}`.replace(/[^0-9]/g, '');
        const itemResDigits = `${std || ''}${resPh || ''}`.replace(/[^0-9]/g, '');

        if (
          itemMobileDigits.includes(digitsOnlyQ) ||
          itemOfficeDigits.includes(digitsOnlyQ) ||
          itemResDigits.includes(digitsOnlyQ)
        ) {
          return true;
        }
      }

      return false;
    });
  }, [sourceData, searchQuery, selectedCircle, selectedCategory]);

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedCircle !== 'सभी वृत' ||
    selectedCategory !== 'all';

  const displayedContacts = useMemo(() => {
    if (isAnyFilterActive) {
      return filteredContacts;
    }
    return filteredContacts.slice(0, visibleCount);
  }, [filteredContacts, isAnyFilterActive, visibleCount]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-3 sm:py-4 space-y-3.5">
        {/* Compact, Crisp Page Banner */}
        <div className="bg-gradient-to-br from-[#0B1728] via-[#10223D] to-[#1B365D] text-white rounded-2xl p-4 sm:p-5 shadow-md border border-blue-900/40 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-devanagari text-white leading-tight">
                चित्तौड़गढ़ जिला पुलिस संपर्क निर्देशिका
              </h1>
            </div>
          </div>

          <p className="text-[11.5px] sm:text-xs text-slate-300 font-devanagari leading-relaxed">
            पुलिस अधीक्षक (SP), अति. पुलिस अधीक्षक (Addl. SP), वृत्ताधिकारी (CO), थानाधिकारी (SHO) एवं पुलिस कर्मियों के सीधे संपर्क नंबर व आधिकारिक ईमेल।
          </p>

          {/* Emergency Helplines Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-center font-devanagari">
            <a
              href="tel:112"
              className="bg-red-600/95 hover:bg-red-600 text-white py-1.5 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition active:scale-95 shadow-xs"
            >
              <span className="text-[9px] text-red-200">आपातकालीन सेवा</span>
              <span className="text-xs sm:text-sm font-black flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 fill-white" /> 112
              </span>
            </a>
            <a
              href="tel:01472240088"
              className="bg-blue-800/95 hover:bg-blue-700 text-white py-1.5 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition active:scale-95 shadow-xs"
            >
              <span className="text-[9px] text-blue-200">कंट्रोल रूम</span>
              <span className="text-[11px] sm:text-xs font-bold flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3" /> 240088
              </span>
            </a>
            <a
              href="tel:1930"
              className="bg-amber-600/95 hover:bg-amber-600 text-white py-1.5 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition active:scale-95 shadow-xs"
            >
              <span className="text-[9px] text-amber-100">साइबर हेल्प</span>
              <span className="text-xs sm:text-sm font-black flex items-center gap-1 font-mono">
                <Globe2 className="w-3 h-3" /> 1930
              </span>
            </a>
          </div>
        </div>

        {/* Search & Filter Card (Clean document flow, non-sticky) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm space-y-3">
          {/* Main Free-Text Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-700">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="अधिकारी का नाम, पद, थाना या मोबाइल नंबर खोजें..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 font-devanagari text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="सर्च साफ़ करें"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Symmetrical 2-Dropdown Row: Circle & Category side-by-side */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-devanagari">
            {/* 1. Circle Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-700" />
                <span>वृत (Circle)</span>
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="w-full py-2 px-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-devanagari font-semibold text-slate-800 focus:outline-none transition shadow-2xs cursor-pointer"
              >
                <option value="सभी वृत">सभी वृत</option>
                {POLICE_CIRCLES.filter((c) => c !== 'सभी वृत (All Circles)').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Category / Designation Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-600" />
                <span>पद / श्रेणी (Category)</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                className="w-full py-2 px-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-devanagari font-semibold text-slate-800 focus:outline-none transition shadow-2xs cursor-pointer"
              >
                <option value="all">सभी पद</option>
                <option value="senior">वरिष्ठ अधिकारी</option>
                <option value="circle">वृत्ताधिकारी (CO)</option>
                <option value="station">थानाधिकारी (SHO)</option>
                <option value="outpost">पुलिस चौकियां</option>
                <option value="branch">शाखाएं व सेल</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-devanagari px-1">
          <span>
            {isAnyFilterActive ? (
              <>खोज परिणाम: <strong className="text-blue-900 font-bold">{filteredContacts.length}</strong> संपर्क मिले</>
            ) : (
              <>आधिकारिक संपर्क सूची</>
            )}
          </span>
          {isAnyFilterActive && (
            <button
              onClick={resetAllFilters}
              className="text-blue-700 hover:text-blue-900 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> फ़िल्टर रीसेट करें
            </button>
          )}
        </div>

        {/* Contact Cards List */}
        <div className="space-y-3">
          {filteredContacts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-slate-800 font-bold font-devanagari text-base">
                कोई संपर्क नहीं मिला
              </p>
              <p className="text-xs text-slate-500 font-devanagari max-w-sm mx-auto">
                कृपया अलग शब्द, थाना अथवा अधिकारी का नाम या मोबाइल नंबर लिखकर खोजें।
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold font-devanagari hover:bg-blue-800 transition shadow-sm cursor-pointer"
              >
                फ़िल्टर साफ़ करें व सभी देखें
              </button>
            </div>
          ) : (
            displayedContacts.map((contact) => {
              const officePh = contact.office_phone || (contact as any).officePhone;
              const std = contact.std_code || (contact as any).stdCode;
              const circle = contact.circle_name || (contact as any).circleName;

              const cleanOfficePhone = officePh?.replace(/[^0-9]/g, '');
              const cleanStdCode = std?.replace(/[^0-9]/g, '');
              const landlineDial = cleanStdCode && cleanOfficePhone ? `${cleanStdCode}${cleanOfficePhone}` : cleanOfficePhone;

              return (
                <div
                  key={contact.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Category Accent Stripe */}
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      contact.category === 'senior'
                        ? 'bg-amber-500'
                        : contact.category === 'circle'
                        ? 'bg-blue-600'
                        : contact.category === 'station'
                        ? 'bg-indigo-600'
                        : contact.category === 'branch'
                        ? 'bg-cyan-600'
                        : 'bg-emerald-500'
                    }`}
                  />

                  <div className="pl-2 space-y-2.5">
                    {/* Header: Name, Post & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-sm sm:text-base font-bold text-slate-900 font-devanagari">
                            {contact.name}
                          </h2>
                          {contact.category === 'senior' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold rounded-md font-devanagari">
                              वरिष्ठ अधिकारी
                            </span>
                          )}
                          {contact.category === 'circle' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold rounded-md font-devanagari">
                              वृत्ताधिकारी (CO)
                            </span>
                          )}
                          {contact.category === 'station' && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-bold rounded-md font-devanagari">
                              थानाधिकारी (SHO)
                            </span>
                          )}
                          {contact.category === 'outpost' && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold rounded-md font-devanagari">
                              पुलिस चौकी
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-blue-900 font-devanagari">
                          {contact.post}
                        </p>
                      </div>

                      {circle && (
                        <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-lg font-devanagari border border-slate-200">
                          वृत: {circle}
                        </span>
                      )}
                    </div>

                    {/* Location Info */}
                    {contact.location && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 font-devanagari">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{contact.location}</span>
                      </p>
                    )}

                    {/* Phone Numbers Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-xs font-devanagari">
                      {/* Mobile or WhatsApp */}
                      {(() => {
                        const isSpDharmendra = contact.name.includes('धर्मेन्द्र') || contact.post.includes('SP CHITTORGARH');
                        const mobileLabel = isSpDharmendra ? 'व्हाट्सएप (WhatsApp)' : 'मोबाइल (CUG)';
                        const displayMobile = isSpDharmendra ? '94604-25643' : contact.mobile;
                        const cleanNum = displayMobile ? displayMobile.replace(/[^0-9]/g, '') : '';

                        if (!displayMobile) return null;

                        return (
                          <div className="flex items-center justify-between p-2 bg-slate-50/90 rounded-xl border border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                                <Phone className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <p className="text-[10px] text-slate-500 font-medium leading-none font-devanagari">
                                  {mobileLabel}
                                </p>
                                <p className="font-bold text-slate-800 tracking-wide font-mono text-xs mt-0.5">
                                  {displayMobile}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => copyToClipboard(displayMobile || '', `mob-${contact.id}`)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                                title="नंबर कॉपी करें"
                                aria-label="नंबर कॉपी करें"
                              >
                                {copiedId === `mob-${contact.id}` ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              {isSpDharmendra ? (
                                <a
                                  href={`https://wa.me/91${cleanNum}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 shadow-xs cursor-pointer font-bold text-xs"
                                  title="व्हाट्सएप चैट खोलें"
                                  aria-label="व्हाट्सएप चैट खोलें"
                                >
                                  💬
                                </a>
                              ) : (
                                <a
                                  href={`tel:${cleanNum}`}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 shadow-xs cursor-pointer"
                                  title="कॉल करें"
                                  aria-label="कॉल करें"
                                >
                                  <PhoneCall className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Office Landline */}
                      {officePh && (
                        <div className="flex items-center justify-between p-2 bg-slate-50/90 rounded-xl border border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                              <Building2 className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <p className="text-[10px] text-slate-500 font-medium leading-none">
                                कार्यालय {std ? `(STD: ${std})` : ''}
                              </p>
                              <p className="font-bold text-slate-800 tracking-wide font-mono text-xs mt-0.5">
                                {std ? `${std}-` : ''}{officePh}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${std ? std + '-' : ''}${officePh}`,
                                  `off-${contact.id}`
                                )
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
                              title="कार्यालय फोन कॉपी करें"
                              aria-label="कार्यालय फोन कॉपी करें"
                            >
                              {copiedId === `off-${contact.id}` ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            {landlineDial && (
                              <a
                                href={`tel:${landlineDial}`}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white transition-all active:scale-95 shadow-xs cursor-pointer"
                                title="डायल करें"
                                aria-label="कार्यालय फोन डायल करें"
                              >
                                <PhoneCall className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* REDESIGNED EMAIL DISPLAY: Clean, Readable, Never Truncated */}
                    {contact.email && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {/* Primary Email */}
                        <div className="bg-slate-50 hover:bg-blue-50/50 rounded-xl p-2.5 border border-slate-200/70 transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 font-devanagari">
                              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>ईमेल (Official Email)</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => copyToClipboard(contact.email || '', `mail-${contact.id}`)}
                                className="w-7 h-7 rounded-md flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-blue-700 border border-slate-200 transition shadow-2xs cursor-pointer"
                                title="ईमेल कॉपी करें"
                                aria-label="ईमेल कॉपी करें"
                              >
                                {copiedId === `mail-${contact.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <a
                                href={`mailto:${contact.email}`}
                                className="w-7 h-7 rounded-md flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition active:scale-95 cursor-pointer"
                                title="ईमेल भेजें"
                                aria-label="ईमेल भेजें"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                          <p className="text-xs font-mono font-semibold text-slate-800 break-all select-all pl-5 leading-relaxed">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Show More Button (Loads contacts in batches of 10 for clean page browsing) */}
        {!isAnyFilterActive && visibleCount < filteredContacts.length && (
          <div className="pt-1 pb-1 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-50 text-blue-900 font-devanagari font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-xs hover:shadow-sm transition active:scale-[0.99] cursor-pointer"
            >
              <span>और संपर्क देखें (Show More)</span>
              <ChevronDown className="w-4 h-4 text-blue-800" />
            </button>
          </div>
        )}

        {/* Note / Disclaimer Card */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs font-devanagari text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">नागरिक सूचना एवं सहायता</p>
            <p className="text-amber-800 leading-relaxed text-[11px] sm:text-xs">
              यह संपर्क विवरण पुलिस अधीक्षक कार्यालय अभिलेख के अनुसार अद्यतन है। किसी भी तात्कालिक आपात स्थिति में तुरंत डायल <strong>112</strong> अथवा पुलिस नियंत्रण कक्ष <strong>01472-240055</strong> पर कॉल करें।
            </p>
          </div>
        </div>
      </main>

      {/* Sleek Floating Scroll-to-Top Button (Centered on page, shifts to Right corner at footer) */}
      {showScrollTop && (
        <button
          onClick={scrollToTopAndFocusSearch}
          className={`fixed bottom-20 z-40 bg-slate-900/95 hover:bg-slate-950 text-white px-3.5 py-2 rounded-full shadow-xl border border-slate-700/60 flex items-center gap-1.5 text-xs font-bold font-devanagari transition-all duration-300 active:scale-95 backdrop-blur-md cursor-pointer ${
            isAtFooter
              ? 'right-4 sm:right-6 left-auto translate-x-0'
              : 'left-1/2 -translate-x-1/2 right-auto'
          }`}
          aria-label="पेज के ऊपर जाएं"
        >
          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          <span>ऊपर जाएं</span>
        </button>
      )}

      <Footer onOpenAdmin={onOpenAdmin} onOpenInitiative={onOpenInitiative} />
    </div>
  );
};
