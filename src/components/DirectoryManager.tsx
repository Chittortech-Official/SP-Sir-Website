import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Trash2,
  Edit2,
  Phone,
  Mail,
  RefreshCw,
  X,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { DataService, isSupabaseConfigured } from '../lib/supabase';
import type { PoliceDirectoryRecord, DirectoryCategory } from '../types/database';
import { POLICE_CIRCLES, POLICE_DIRECTORY_DATA } from '../data/policeDirectory';
import { ActionFeedbackModal } from './ActionFeedbackModal';
import type { ModalType } from './AdminDashboard';

interface DirectoryManagerProps {
  onContactsUpdated?: () => void;
}

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'teal' | 'emerald' | 'rose' | 'blue' | 'navy';
  isLoading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const DirectoryManager: React.FC<DirectoryManagerProps> = ({ onContactsUpdated }) => {
  const [contacts, setContacts] = useState<PoliceDirectoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('सभी वृत');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal State for feedback & confirmations
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
  });

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Add / Edit Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formPost, setFormPost] = useState('');
  const [formCategory, setFormCategory] = useState<DirectoryCategory>('station');
  const [formCircle, setFormCircle] = useState('चित्तौड़गढ़');
  const [formLocation, setFormLocation] = useState('');
  const [formStdCode, setFormStdCode] = useState('01472');
  const [formOfficePhone, setFormOfficePhone] = useState('');
  const [formResPhone, setFormResPhone] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(100);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getPoliceDirectory(true);
      setContacts(data);
    } catch (err) {
      console.error('Error loading directory contacts', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Form to Add
  const handleOpenAdd = () => {
    setFormMode('add');
    setCurrentEditId(null);
    setFormName('');
    setFormPost('');
    setFormCategory('station');
    setFormCircle('चित्तौड़गढ़');
    setFormLocation('');
    setFormStdCode('01472');
    setFormOfficePhone('');
    setFormResPhone('');
    setFormMobile('');
    setFormEmail('');
    setFormDisplayOrder(contacts.length + 1);
    setFormIsActive(true);
    setIsFormOpen(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (c: PoliceDirectoryRecord) => {
    setFormMode('edit');
    setCurrentEditId(c.id);
    setFormName(c.name);
    setFormPost(c.post);
    setFormCategory(c.category);
    setFormCircle(c.circle_name || (c as any).circleName || 'चित्तौड़गढ़');
    setFormLocation(c.location || '');
    setFormStdCode(c.std_code || (c as any).stdCode || '01472');
    setFormOfficePhone(c.office_phone || (c as any).officePhone || '');
    setFormResPhone(c.residence_phone || (c as any).residencePhone || '');
    setFormMobile(c.mobile || '');
    setFormEmail(c.email || '');
    setFormDisplayOrder(c.display_order ?? 100);
    setFormIsActive(c.is_active ?? true);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentEditId(null);
  };

  // Submit Form (Add or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPost.trim()) {
      alert('कृपया अधिकारी/थाने का नाम और पद अवश्य भरें।');
      return;
    }

    setFormSubmitting(true);

    try {
      if (formMode === 'add') {
        const res = await DataService.createPoliceContact({
          name: formName.trim(),
          post: formPost.trim(),
          category: formCategory,
          circle_name: formCircle || null,
          location: formLocation.trim() || null,
          std_code: formStdCode.trim() || null,
          office_phone: formOfficePhone.trim() || null,
          residence_phone: formResPhone.trim() || null,
          mobile: formMobile.trim() || null,
          email: formEmail.trim() || null,
          display_order: Number(formDisplayOrder) || 100,
          is_active: formIsActive,
        });

        if (res.success) {
          handleCloseForm();
          await loadContacts();
          onContactsUpdated?.();
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'संपर्क जोड़ा गया',
            message: `"${formName}" की जानकारी सफलतापूर्वक डेटाबेस में सुरक्षित कर दी गई है।`,
            confirmText: 'ठीक है',
            onClose: closeModal,
          });
        } else {
          alert('त्रुटि: ' + (res.error || 'सहेजने में असमर्थ'));
        }
      } else if (formMode === 'edit' && currentEditId) {
        const res = await DataService.updatePoliceContact(currentEditId, {
          name: formName.trim(),
          post: formPost.trim(),
          category: formCategory,
          circle_name: formCircle || null,
          location: formLocation.trim() || null,
          std_code: formStdCode.trim() || null,
          office_phone: formOfficePhone.trim() || null,
          residence_phone: formResPhone.trim() || null,
          mobile: formMobile.trim() || null,
          email: formEmail.trim() || null,
          display_order: Number(formDisplayOrder) || 100,
          is_active: formIsActive,
        });

        if (res.success) {
          handleCloseForm();
          await loadContacts();
          onContactsUpdated?.();
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'सफलतापूर्वक अपडेट हुआ',
            message: `"${formName}" की अद्यतन जानकारी सुरक्षित कर दी गई है।`,
            confirmText: 'ठीक है',
            onClose: closeModal,
          });
        } else {
          alert('त्रुटि: ' + (res.error || 'अपडेट करने में असमर्थ'));
        }
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Active State
  const handleToggleActive = async (c: PoliceDirectoryRecord) => {
    const newStatus = !c.is_active;
    await DataService.updatePoliceContact(c.id, { is_active: newStatus });
    setContacts((prev) =>
      prev.map((item) => (item.id === c.id ? { ...item, is_active: newStatus } : item))
    );
    onContactsUpdated?.();
  };

  // Delete Contact with Modal
  const triggerDeleteModal = (c: PoliceDirectoryRecord) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'क्या आप इस संपर्क को हटाना चाहते हैं?',
      message: `क्या आप वास्तव में "${c.name} (${c.post})" को निर्देशिका से हमेशा के लिए हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`,
      confirmText: 'हाँ, हटाएं',
      cancelText: 'रद्द करें',
      confirmColor: 'rose',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState((prev) => ({ ...prev, isLoading: true }));
        await DataService.deletePoliceContact(c.id);
        await loadContacts();
        onContactsUpdated?.();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'संपर्क हटाया गया',
          message: `संपर्क को निर्देशिका से सफलतापूर्वक हटा दिया गया है।`,
          confirmText: 'ठीक है',
          onClose: closeModal,
        });
      },
    });
  };

  // Seed Default Contacts with Clean Replace (No duplicates)
  const handleSyncDefaults = async () => {
    const defaultCount = POLICE_DIRECTORY_DATA.length;
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: `${defaultCount} डिफ़ॉल्ट संपर्क री-स्टोर करें?`,
      message:
        contacts.length > 0
          ? `डेटाबेस में अभी ${contacts.length} संपर्क मौजूद हैं। यह क्रिया पुराने डेटा को साफ़ करके सभी ${defaultCount} आधिकारिक संपर्क नए सिरे से री-स्टोर करेगी (कोई डुप्लिकेट नहीं बनेगा)। क्या आप आगे बढ़ना चाहते हैं?`
          : `यह क्रिया आपके Supabase डेटाबेस में सभी ${defaultCount} आधिकारिक थानों व अधिकारियों की सूची लोड कर देगी। क्या आप आगे बढ़ना चाहते हैं?`,
      confirmText: 'हाँ, री-स्टोर करें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState((prev) => ({ ...prev, isLoading: true }));
        setIsSyncing(true);
        const res = await DataService.seedDefaultPoliceDirectory();
        setIsSyncing(false);
        if (res.success) {
          await loadContacts();
          onContactsUpdated?.();
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'डेटा सिंक संपन्न!',
            message: `कुल ${res.count} आधिकारिक संपर्क Supabase डेटाबेस में सफलतापूर्वक लोड हो चुके हैं।`,
            confirmText: 'ठीक है',
            onClose: closeModal,
          });
        } else {
          setModalState({
            isOpen: true,
            type: 'danger',
            title: 'सिंक करने में समस्या आई',
            message: res.error || 'डेटाबेस में संपर्क लोड करते समय त्रुटि हुई।',
            confirmText: 'ठीक है',
            onClose: closeModal,
          });
        }
      },
    });
  };

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    const rawQ = searchQuery.trim().toLowerCase();
    const digitsOnlyQ = rawQ.replace(/[^0-9]/g, '');

    return contacts.filter((c) => {
      const circle = c.circle_name || (c as any).circleName;
      const officePh = c.office_phone || (c as any).officePhone;
      const std = c.std_code || (c as any).stdCode;

      // Exclude outposts and branches/cells completely
      if (c.category === 'outpost' || c.category === 'branch') return false;

      // Circle filter
      if (selectedCircle !== 'सभी वृत' && circle !== selectedCircle) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (!rawQ) return true;

      const searchable = [
        c.name,
        c.post,
        circle || '',
        c.location || '',
        c.mobile || '',
        officePh || '',
        std || '',
        c.email || '',
      ]
        .join(' ')
        .toLowerCase();

      if (searchable.includes(rawQ)) return true;

      if (digitsOnlyQ.length >= 3) {
        const mobDigits = (c.mobile || '').replace(/[^0-9]/g, '');
        const offDigits = `${std || ''}${officePh || ''}`.replace(/[^0-9]/g, '');
        if (mobDigits.includes(digitsOnlyQ) || offDigits.includes(digitsOnlyQ)) {
          return true;
        }
      }

      return false;
    });
  }, [contacts, searchQuery, selectedCircle, selectedCategory]);

  return (
    <div className="space-y-5">
      {/* ── Guide Box ── */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 rounded-2xl p-4 sm:p-5 border border-blue-200 text-slate-800 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm shadow-xs">
            🏢
          </div>
          <div className="flex-1 text-xs font-devanagari space-y-1.5">
            <div className="font-extrabold text-sm text-blue-950 flex items-center justify-between flex-wrap gap-2">
              <span>थाना एवं संपर्क निर्देशिका प्रबंधन (Directory Management)</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-full border border-blue-200">
                {isSupabaseConfigured ? '🟢 Supabase लाइव कनेक्टेड' : '🟡 लोकल स्टोरेज मोड'}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              <strong>उद्देश्य:</strong> जिले के सभी 52 थानों, वृत्ताधिकारियों व पुलिस अधीक्षक कार्यालय के दूरभाष व ईमेल को अद्यतन रखने हेतु। अधिकारी के तबादले या नंबर बदलने पर यहाँ सीधे एडिट करें — बदलाव तुरंत सार्वजनिक पोर्टल पर लाइव हो जाएगा।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11.5px]">
              <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                <strong className="text-blue-900 block mb-0.5">1. खोजें या फ़िल्टर करें:</strong>
                वृत या श्रेणी चुनें अथवा अधिकारी/थाने का नाम या नंबर लिखकर तुरंत खोजें।
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                <strong className="text-blue-900 block mb-0.5">2. एडिट / नया जोड़ें:</strong>
                किसी भी संपर्क के सामने 'एडिट' दबाकर नाम, मोबाइल व ईमेल अपडेट करें।
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                <strong className="text-blue-900 block mb-0.5">3. 1-क्लिक डेटाबेस सिंक:</strong>
                यदि टेबल खाली है तो '47 संपर्क री-स्टोर करें' बटन से पूरा डेटा स्वतः भरें।
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Bar: Search, Filters, and Action Buttons ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Title & Count */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-devanagari flex items-center gap-2">
              <Building2 className="w-4 h-4 text-police-700" />
              <span>कुल पंजीकृत संपर्क ({contacts.length}):</span>
            </h3>
            <p className="text-xs text-slate-500 font-devanagari mt-0.5">
              फ़िल्टर के अनुसार: <strong className="text-blue-900">{filteredContacts.length}</strong> संपर्क प्रदर्शित
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sync Default Contacts Button */}
            <button
              type="button"
              onClick={handleSyncDefaults}
              disabled={isSyncing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 font-devanagari transition-all cursor-pointer"
              title="यदि डेटाबेस खाली हो तो 47 संपर्कों को री-स्टोर करें"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>47 डिफ़ॉल्ट री-स्टोर करें</span>
            </button>

            {/* + Add New Contact Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया संपर्क जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, पद, थाना या मोबाइल खोजें..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl text-xs font-devanagari text-slate-800 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Circle Dropdown */}
          <div>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl text-xs font-devanagari font-semibold text-slate-700 focus:outline-none"
            >
              <option value="सभी वृत">📍 सभी वृत (All Circles)</option>
              {POLICE_CIRCLES.filter((c) => c !== 'सभी वृत (All Circles)').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl text-xs font-devanagari font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">👮 सभी श्रेणियां (All Posts)</option>
              <option value="senior">⭐ वरिष्ठ अधिकारी (SP / Addl SP)</option>
              <option value="circle">🎯 वृत्ताधिकारी (CO)</option>
              <option value="station">🏢 थानाधिकारी (SHO)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Contact Add/Edit Modal Form ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-devanagari flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>
                  {formMode === 'add' ? 'नया पुलिस संपर्क जोड़ें' : 'पुलिस संपर्क संपादित करें (Edit Contact)'}
                </span>
              </h3>
              <button
                onClick={handleCloseForm}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs font-devanagari">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    अधिकारी का नाम अथवा पद (Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="उदा. श्री चम्पालाल, पु.नि. अथवा पुलिस नियंत्रण कक्ष"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Post */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    पदनाम / थाना (Designation / Unit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPost}
                    onChange={(e) => setFormPost(e.target.value)}
                    placeholder="उदा. थानाधिकारी, पुलिस थाना बेगूं (PS Begun)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category) *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as DirectoryCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  >
                    <option value="senior">वरिष्ठ अधिकारी (Senior)</option>
                    <option value="circle">वृत्ताधिकारी - CO (Circle)</option>
                    <option value="station">थानाधिकारी - SHO (Station)</option>
                  </select>
                </div>

                {/* Circle */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">वृत (Circle)</label>
                  <select
                    value={formCircle}
                    onChange={(e) => setFormCircle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  >
                    {POLICE_CIRCLES.filter((c) => c !== 'सभी वृत (All Circles)').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile (CUG) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाइल CUG नंबर</label>
                  <input
                    type="text"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="उदा. 94130-33234"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Office Phone & STD Code */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">STD कोड</label>
                    <input
                      type="text"
                      value={formStdCode}
                      onChange={(e) => setFormStdCode(e.target.value)}
                      placeholder="01472"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">कार्यालय फोन</label>
                    <input
                      type="text"
                      value={formOfficePhone}
                      onChange={(e) => setFormOfficePhone(e.target.value)}
                      placeholder="उदा. 240006"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Residence Phone */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">निवास फोन (यदि हो)</label>
                  <input
                    type="text"
                    value={formResPhone}
                    onChange={(e) => setFormResPhone(e.target.value)}
                    placeholder="उदा. 297017"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्थान / क्षेत्र विवरण</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="उदा. थाना बेगूं क्षेत्र"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Official Email */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">आधिकारिक ईमेल (Email)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="psbegun@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Order & Active */}
                <div className="grid grid-cols-2 gap-3 sm:col-span-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">क्रम संख्या (Sort Order)</label>
                    <input
                      type="number"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="formActive"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="formActive" className="font-bold text-slate-700 cursor-pointer">
                      सार्वजनिक पोर्टल पर सक्रिय रखें
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{formSubmitting ? 'सुरक्षित हो रहा है...' : 'सुरक्षित करें (Save)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Contacts List Display ── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm text-slate-500 font-devanagari text-sm">
            डेटाबेस से संपर्क लोड हो रहे हैं...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
            <p className="text-slate-700 font-bold font-devanagari text-sm">
              कोई संपर्क नहीं मिला
            </p>
            <p className="text-xs text-slate-500 font-devanagari">
              कृपया अलग शब्द खोजें अथवा फ़िल्टर रीसेट करें।
            </p>
          </div>
        ) : (
          filteredContacts.map((c, index) => {
            const circle = c.circle_name || (c as any).circleName;
            const officePh = c.office_phone || (c as any).officePhone;
            const std = c.std_code || (c as any).stdCode;

            return (
              <div
                key={c.id || index}
                className={`bg-white rounded-2xl p-4 border transition-all ${
                  c.is_active ? 'border-slate-200 hover:border-slate-300 shadow-sm' : 'border-slate-200 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Left: Contact Info */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 font-devanagari">
                        {c.name}
                      </h4>
                      {circle && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-devanagari">
                          {circle}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-devanagari bg-blue-50 text-blue-800 border border-blue-200">
                        {c.category === 'senior'
                          ? 'वरिष्ठ अधिकारी'
                          : c.category === 'circle'
                          ? 'वृत्ताधिकारी'
                          : c.category === 'station'
                          ? 'थानाधिकारी'
                          : c.category === 'outpost'
                          ? 'चौकी'
                          : 'शाखा'}
                      </span>
                      {!c.is_active && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-devanagari bg-rose-100 text-rose-800 border border-rose-200">
                          अक्रिय (Hidden)
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-blue-900 font-devanagari">
                      {c.post}
                    </p>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px] font-devanagari text-slate-600">
                      {c.mobile && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-700">{c.mobile}</span>
                          <span className="text-[9px] text-slate-400">(CUG)</span>
                        </div>
                      )}

                      {officePh && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>
                            {std ? `${std}-` : ''}{officePh}
                          </span>
                          <span className="text-[9px] text-slate-400">(कार्यालय)</span>
                        </div>
                      )}

                      {c.email && (
                        <div className="flex items-center gap-1.5 font-mono truncate">
                          <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      className={`p-2 rounded-xl text-xs font-devanagari font-bold border transition-colors cursor-pointer ${
                        c.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                      title={c.is_active ? 'सार्वजनिक रूप से सक्रिय' : 'अक्रिय (छुपा हुआ)'}
                    >
                      {c.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(c)}
                      className="flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                      title="संपादित करें"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>एडिट</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => triggerDeleteModal(c)}
                      className="flex items-center gap-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएं</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation & Feedback Modal */}
      <ActionFeedbackModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        confirmColor={modalState.confirmColor}
        isLoading={modalState.isLoading}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        onClose={modalState.onClose}
      />
    </div>
  );
};
