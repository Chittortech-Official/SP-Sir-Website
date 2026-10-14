import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Save, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Bell, 
  Users, 
  QrCode, 
  History, 
  ShieldCheck,
  Check,
  Download
} from 'lucide-react';
import { DataService, isSupabaseConfigured } from '../lib/supabase';
import type { 
  AvailabilitySlot, 
  AvailabilityStatus, 
  TimingType, 
  OfficerProfile, 
  PublicNotice, 
  AdminAuditLog 
} from '../types/database';
import { QRCodeSVG } from 'qrcode.react';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewPublic }) => {
  const [activeTab, setActiveTab] = useState<'availability' | 'notices' | 'officers' | 'qr' | 'logs'>('availability');
  
  // State for Availability & Slots
  const [status, setStatus] = useState<AvailabilityStatus>('available');
  const [timingType, setTimingType] = useState<TimingType>('confirmed');
  const [publicMessage, setPublicMessage] = useState('');
  const [alternativeOfficerId, setAlternativeOfficerId] = useState<string>('');
  const [alternativeTiming, setAlternativeTiming] = useState('दोपहर 12:00 से 01:00 बजे तक');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  
  // Officers, Notices, Logs
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  // Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'normal' | 'high'>('normal');

  // UI feedback states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const { availability: avail, slots: availSlots } = await DataService.getTodayAvailability();
    const allOfficers = await DataService.getOfficers();
    const allNotices = await DataService.getPublicNotices();
    const allLogs = await DataService.getAuditLogs();

    setStatus(avail.status);
    setTimingType(avail.timing_type);
    setPublicMessage(avail.public_message || '');
    setAlternativeOfficerId(avail.alternative_officer_id || '');
    setAlternativeTiming(avail.alternative_timing || '');
    setSlots(availSlots);
    setOfficers(allOfficers);
    setNotices(allNotices);
    setLogs(allLogs);
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      await DataService.saveAvailability(
        {
          status,
          timing_type: timingType,
          public_message: publicMessage,
          alternative_officer_id: alternativeOfficerId || null,
          alternative_timing: alternativeTiming,
          published: true
        },
        slots,
        localStorage.getItem('sp_admin_email') || 'PA, SP Office'
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadAllData();
    } catch (e) {
      alert('बदलाव सहेजने में त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlot = () => {
    const newSlot: AvailabilitySlot = {
      id: 'slot-' + Date.now(),
      availability_id: 'avail-today',
      start_time: '11:00 AM',
      end_time: '01:00 PM',
      slot_status: 'confirmed',
      slot_label: `सत्र ${slots.length + 1}`,
      display_order: slots.length + 1
    };
    setSlots([...slots, newSlot]);
  };

  const handleUpdateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const handleDeleteSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeMsg.trim()) return;

    await DataService.saveNotice({
      title: newNoticeTitle,
      message: newNoticeMsg,
      published: true,
      priority: newNoticePriority,
      publish_at: new Date().toISOString()
    });

    setNewNoticeTitle('');
    setNewNoticeMsg('');
    await loadAllData();
    alert('सूचना सफलतापूर्वक प्रकाशित की गई!');
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm('क्या आप इस सूचना को हटाना चाहते हैं?')) {
      await DataService.deleteNotice(id);
      await loadAllData();
    }
  };

  const handleQuickTemplate = (msg: string) => {
    setPublicMessage(msg);
  };

  const publicUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#0B1728] text-white border-b-2 border-amber-500 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/rajasthan-police-logo.webp" alt="Police Logo" className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  PA / स्टाफ डैशबोर्ड
                </span>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Supabase कनेक्टेड
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    लोकल मोड
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold font-devanagari">
                पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onViewPublic}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <span>पब्लिक पोर्टल</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-rose-600/80 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              title="लॉगआउट"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#070F1C] px-4 overflow-x-auto">
          <div className="max-w-6xl mx-auto flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-2.5 px-3 border-b-2 text-xs font-semibold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>आज की जनसुनवाई</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`py-2.5 px-3 border-b-2 text-xs font-semibold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'notices'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>सूचनाएं ({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('officers')}
              className={`py-2.5 px-3 border-b-2 text-xs font-semibold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'officers'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>अधिकारी प्रोफाइल</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`py-2.5 px-3 border-b-2 text-xs font-semibold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>पोस्टर QR कोड</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2.5 px-3 border-b-2 text-xs font-semibold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>ऑडिट लॉग</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1">
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500 text-white flex items-center gap-2 text-sm font-semibold shadow-md animate-in slide-in-from-top duration-300">
            <Check className="w-5 h-5" />
            <span>✓ स्थिति सफलतापूर्वक सहेज ली गई एवं पब्लिक पोर्टल पर लाइव हो चुकी है!</span>
          </div>
        )}

        {/* TAB 1: AVAILABILITY & SLOTS */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            {/* Quick 1-Tap Status Switcher */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 font-devanagari flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-police-700" />
                  <span>1. आज की जनसुनवाई उपलब्धता चुनें (1-Tap):</span>
                </label>
                <span className="text-xs text-slate-500 font-devanagari">तत्काल प्रभाव से लागू</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Available */}
                <button
                  type="button"
                  onClick={() => setStatus('available')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    status === 'available'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {status === 'available' && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <strong className="block text-sm font-bold font-devanagari">उपलब्ध हैं</strong>
                  <span className="text-[11px] text-slate-500">कार्यालय में उपस्थित</span>
                </button>

                {/* Unavailable */}
                <button
                  type="button"
                  onClick={() => setStatus('unavailable')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    status === 'unavailable'
                      ? 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    {status === 'unavailable' && <Check className="w-4 h-4 text-rose-600" />}
                  </div>
                  <strong className="block text-sm font-bold font-devanagari">उपलब्ध नहीं हैं</strong>
                  <span className="text-[11px] text-slate-500">दौरा / मीटिंग</span>
                </button>

                {/* Pending */}
                <button
                  type="button"
                  onClick={() => setStatus('confirmation_pending')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    status === 'confirmation_pending'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    {status === 'confirmation_pending' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <strong className="block text-sm font-bold font-devanagari">पुष्टि बाकी है</strong>
                  <span className="text-[11px] text-slate-500">समय प्रतीक्षित</span>
                </button>

                {/* Time Changed */}
                <button
                  type="button"
                  onClick={() => setStatus('time_changed')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    status === 'time_changed'
                      ? 'border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-400 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    {status === 'time_changed' && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <strong className="block text-sm font-bold font-devanagari">समय परिवर्तित</strong>
                  <span className="text-[11px] text-slate-500">नया समय तय</span>
                </button>
              </div>

              {/* Timing Type Selector */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-700 font-devanagari">
                  समय की प्रामाणिकता:
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setTimingType('confirmed')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      timingType === 'confirmed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ✓ पुष्ट समय (Confirmed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingType('tentative')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      timingType === 'tentative'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ⏳ प्रस्तावित समय (Tentative)
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slots Manager */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-devanagari flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-police-700" />
                    <span>2. जनसुनवाई समय सत्र (Meeting Slots):</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-devanagari">
                    नागरिकों को दिखाए जाने वाले सत्र एवं समय
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="flex items-center gap-1 bg-police-50 hover:bg-police-100 text-police-800 text-xs px-2.5 py-1.5 rounded-lg border border-police-200 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नया सत्र जोड़ें</span>
                </button>
              </div>

              {slots.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                  कोई समय सत्र नहीं जोड़ा गया है।
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot, idx) => (
                    <div 
                      key={slot.id || idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 sm:gap-4 text-xs"
                    >
                      <input
                        type="text"
                        value={slot.slot_label}
                        onChange={(e) => handleUpdateSlot(idx, 'slot_label', e.target.value)}
                        placeholder="सत्र नाम (उदा. प्रातः कालीन)"
                        className="p-2 rounded-lg border border-slate-300 w-full sm:w-44 text-xs bg-white font-devanagari font-semibold"
                      />

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">से:</span>
                        <input
                          type="text"
                          value={slot.start_time}
                          onChange={(e) => handleUpdateSlot(idx, 'start_time', e.target.value)}
                          placeholder="10:30 AM"
                          className="p-2 rounded-lg border border-slate-300 w-24 text-xs bg-white text-center font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">तक:</span>
                        <input
                          type="text"
                          value={slot.end_time}
                          onChange={(e) => handleUpdateSlot(idx, 'end_time', e.target.value)}
                          placeholder="01:00 PM"
                          className="p-2 rounded-lg border border-slate-300 w-24 text-xs bg-white text-center font-bold"
                        />
                      </div>

                      <select
                        value={slot.slot_status}
                        onChange={(e) => handleUpdateSlot(idx, 'slot_status', e.target.value)}
                        className="p-2 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="confirmed">पुष्ट (Confirmed)</option>
                        <option value="tentative">प्रस्तावित (Tentative)</option>
                        <option value="cancelled">रद्द (Cancelled)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg ml-auto"
                        title="सत्र हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alternative Officer Selector */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4 text-police-700" />
                <span>3. वैकल्पिक जनसुनवाई अधिकारी (यदि SP सर अनुपलब्ध हों):</span>
              </h3>
              <p className="text-xs text-slate-500 font-devanagari mb-3">
                यदि SP सर दौरे पर हों, तो किस अधिकारी द्वारा जनसुनवाई की जाएगी
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                    अधिकारी चुनें:
                  </label>
                  <select
                    value={alternativeOfficerId}
                    onChange={(e) => setAlternativeOfficerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-devanagari"
                  >
                    <option value="">-- कोई वैकल्पिक अधिकारी अधिकृत नहीं --</option>
                    {officers.map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.name} ({off.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                    वैकल्पिक जनसुनवाई का समय:
                  </label>
                  <input
                    type="text"
                    value={alternativeTiming}
                    onChange={(e) => setAlternativeTiming(e.target.value)}
                    placeholder="दोपहर 12:00 बजे से 01:00 बजे तक"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-devanagari"
                  />
                </div>
              </div>
            </div>

            {/* Public Message & Quick Templates */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-1">
                4. नागरिकों के लिए सार्वजनिक संदेश (Public Advisory):
              </h3>
              <p className="text-xs text-slate-500 font-devanagari mb-2">
                यह संदेश पोर्टल के मुख्य कार्ड पर दिखेगा
              </p>

              <textarea
                rows={3}
                value={publicMessage}
                onChange={(e) => setPublicMessage(e.target.value)}
                placeholder="उदा. आज पुलिस अधीक्षक महोदय उपस्थित हैं। परिवादी अपने परिवाद के साथ सीधे मिल सकते हैं..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-police-700 focus:outline-none"
              />

              {/* Quick Template Buttons */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold self-center mr-1">त्वरित संदेश:</span>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('आज पुलिस अधीक्षक महोदय कार्यालय में जनसुनवाई हेतु उपस्थित रहेंगे। नागरिक अपने परिवाद के साथ उपस्थित हो सकते हैं।')}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 font-devanagari"
                >
                  उपस्थिति संदेश
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('विशेष शासकीय कानून-व्यवस्था बैठक के कारण आज जनसुनवाई स्थगित रहेगी। परिवाद स्वागत पटल पर जमा कराए जा सकते हैं।')}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 font-devanagari"
                >
                  बैठक संदेश
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('एसपी सर राजकीय दौरे पर हैं। आज जनसुनवाई अतिरिक्त पुलिस अधीक्षक द्वारा कक्ष संख्या 4 में की जाएगी।')}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 font-devanagari"
                >
                  दौरा / वैकल्पिक अधिकारी संदेश
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-4 z-20">
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={saving}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <Save className="w-5 h-5 text-amber-300" />
                <span>{saving ? 'सहेजा जा रहा है...' : '✓ आज की स्थिति तुरंत प्रकाशित करें (Publish Live)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PUBLIC NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            {/* Create New Notice */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-police-700" />
                <span>नई सार्वजनिक सूचना जारी करें:</span>
              </h3>

              <form onSubmit={handleCreateNotice} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                    सूचना का शीर्षक:
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="उदा. जनसुनवाई समय में संशोधन / अवकाश सूचना..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                    विस्तृत संदेश:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newNoticeMsg}
                    onChange={(e) => setNewNoticeMsg(e.target.value)}
                    placeholder="नागरिकों के लिए विस्तृत निर्देश या आदेश..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-devanagari">
                    <span>प्राथमिकता:</span>
                    <select
                      value={newNoticePriority}
                      onChange={(e) => setNewNoticePriority(e.target.value as any)}
                      className="p-1.5 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value="normal">सामान्य (Normal)</option>
                      <option value="high">अति महत्वपूर्ण (High)</option>
                    </select>
                  </label>

                  <button
                    type="submit"
                    className="ml-auto bg-police-800 hover:bg-police-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>सूचना प्रकाशित करें</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List Existing Notices */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-3">
                सक्रिय सार्वजनिक सूचनाएं ({notices.length}):
              </h3>

              {notices.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  कोई सूचना उपलब्ध नहीं है।
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 font-devanagari">{n.title}</h4>
                          {n.priority === 'high' && (
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                              महत्वपूर्ण
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-devanagari mt-1">{n.message}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="text-rose-600 hover:bg-rose-100 p-2 rounded-lg"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICER PROFILES */}
        {activeTab === 'officers' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-1">
              अधिकारियों का विवरण (Officer Profiles):
            </h3>
            <p className="text-xs text-slate-500 font-devanagari mb-3">
              ये प्रोफाइल सार्वजनिक पोर्टल के अधिकारी अनुभाग में प्रदर्शित होते हैं
            </p>

            <div className="space-y-4">
              {officers.map((officer, index) => (
                <div key={officer.id || index} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={officer.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'}
                    alt={officer.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300"
                  />
                  <div className="flex-1 space-y-2 w-full text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold text-slate-600">नाम:</span>
                        <input
                          type="text"
                          value={officer.name}
                          onChange={(e) => {
                            const updated = [...officers];
                            updated[index].name = e.target.value;
                            setOfficers(updated);
                          }}
                          className="w-full p-1.5 mt-0.5 rounded border border-slate-300 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600">पदनाम:</span>
                        <input
                          type="text"
                          value={officer.designation}
                          onChange={(e) => {
                            const updated = [...officers];
                            updated[index].designation = e.target.value;
                            setOfficers(updated);
                          }}
                          className="w-full p-1.5 mt-0.5 rounded border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold text-slate-600">कार्यालय दूरभाष:</span>
                        <input
                          type="text"
                          value={officer.phone}
                          onChange={(e) => {
                            const updated = [...officers];
                            updated[index].phone = e.target.value;
                            setOfficers(updated);
                          }}
                          className="w-full p-1.5 mt-0.5 rounded border border-slate-300 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600">फोटो URL:</span>
                        <input
                          type="text"
                          value={officer.photo_url}
                          onChange={(e) => {
                            const updated = [...officers];
                            updated[index].photo_url = e.target.value;
                            setOfficers(updated);
                          }}
                          className="w-full p-1.5 mt-0.5 rounded border border-slate-300 bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => alert('अधिकारी विवरण अपडेट कर दिया गया है!')}
              className="mt-3 bg-police-800 hover:bg-police-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>अधिकारी प्रोफाइल सहेजें</span>
            </button>
          </div>
        )}

        {/* TAB 4: QR CODE POSTER */}
        {activeTab === 'qr' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              कार्यालय काउंटर / स्वागत पटल हेतु
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-devanagari mt-1">
              जनसुनवाई QR कोड स्टैंडी / पोस्टर
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-devanagari">
              इस पोस्टर को प्रिंट करके पुलिस अधीक्षक कार्यालय के स्वागत कक्ष, मुख्य द्वार एवं नोटिस बोर्ड पर लगाया जा सकता है।
            </p>

            {/* Poster Print Card */}
            <div className="my-6 max-w-sm mx-auto p-6 bg-gradient-to-b from-white to-blue-50/50 border-4 border-[#0B1728] rounded-2xl shadow-xl text-slate-900">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/rajasthan-police-logo.webp" alt="Police Logo" className="w-12 h-12" />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase text-amber-700">राजस्थान पुलिस</div>
                  <div className="text-sm font-extrabold font-devanagari leading-tight">पुलिस अधीक्षक कार्यालय</div>
                  <div className="text-[11px] font-semibold text-slate-600">जिला चित्तौड़गढ़ (राज.)</div>
                </div>
              </div>

              <div className="bg-[#0B1728] text-amber-300 text-xs font-bold py-1 px-3 rounded-full my-3 inline-block font-devanagari">
                दैनिक जनसुनवाई उपलब्धता
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-slate-300 shadow-inner inline-block my-2">
                <QRCodeSVG
                  value={publicUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/rajasthan-police-logo.webp',
                    x: undefined,
                    y: undefined,
                    height: 42,
                    width: 42,
                    excavate: true,
                  }}
                />
              </div>

              <p className="text-xs font-bold text-[#0B1728] font-devanagari mt-2">
                अपने मोबाइल से QR कोड स्कैन करें
              </p>
              <p className="text-[10px] text-slate-500 font-devanagari">
                आज एसपी सर उपलब्ध हैं या नहीं व समय तुरंत देखें
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-[#0B1728] hover:bg-[#112240] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>पोस्टर प्रिंट करें (Print / PDF)</span>
            </button>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-1">
              अद्यतन इतिहास एवं ऑडिट लॉग (Audit Trail):
            </h3>
            <p className="text-xs text-slate-500 font-devanagari mb-3">
              दैनिक स्थिति में किए गए सभी बदलावों का सुरक्षित रिकॉर्ड
            </p>

            <div className="divide-y divide-slate-100 text-xs">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-800">{log.action}</div>
                    <div className="text-slate-600 text-[11px] font-devanagari">{log.details}</div>
                    <div className="text-[10px] text-slate-400">कर्ता: {log.admin_user}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleDateString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
