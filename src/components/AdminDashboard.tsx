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
  Check, 
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
  UserCheck,
  Edit2,
  UserPlus,
  X,
  Phone
} from 'lucide-react';
import { DataService, isSupabaseConfigured, getTodayISODate } from '../lib/supabase';
import type { 
  Availability,
  AvailabilitySlot, 
  AvailabilityStatus, 
  TimingType, 
  OfficerProfile, 
  PublicNotice 
} from '../types/database';
import { getTodayHindiDate } from '../utils/dateHindi';
import { ActionFeedbackModal } from './ActionFeedbackModal';
export type ModalType = 'confirm' | 'success' | 'danger' | 'info';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublic: () => void;
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

const STATUS_LABELS: Record<AvailabilityStatus, { title: string; subtitle: string; color: string; bg: string; border: string }> = {
  available: {
    title: 'उपलब्ध हैं',
    subtitle: 'कार्यालय में जनसुनवाई करेंगे',
    color: '#065F46',
    bg: '#ECFDF5',
    border: '#10B981',
  },
  unavailable: {
    title: 'उपलब्ध नहीं हैं',
    subtitle: 'शासकीय दौरा / आवश्यक बैठक',
    color: '#991B1B',
    bg: '#FEF2F2',
    border: '#EF4444',
  },
  confirmation_pending: {
    title: 'पुष्टि बाकी है',
    subtitle: 'समय अभी तय होना बाकी है',
    color: '#92400E',
    bg: '#FFFBEB',
    border: '#F59E0B',
  },
  time_changed: {
    title: 'समय परिवर्तित',
    subtitle: 'नए समय पर जनसुनवाई होगी',
    color: '#1E40AF',
    bg: '#EFF6FF',
    border: '#3B82F6',
  },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewPublic }) => {
  const [activeTab, setActiveTab] = useState<'availability' | 'notices' | 'officers'>('availability');
  
  // Current Live State from Database
  const [liveAvailability, setLiveAvailability] = useState<Availability | null>(null);

  // Form State for Availability & Slots
  const [status, setStatus] = useState<AvailabilityStatus>('available');
  const [timingType, setTimingType] = useState<TimingType>('confirmed');
  const [publicMessage, setPublicMessage] = useState('');
  const [alternativeOfficerId, setAlternativeOfficerId] = useState<string>('');
  const [alternativeTiming, setAlternativeTiming] = useState('दोपहर 12:00 बजे से 01:00 बजे तक');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  
  // Unsaved changes tracker
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Officers & Notices
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [notices, setNotices] = useState<PublicNotice[]>([]);

  // Notice Form State (New)
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'normal' | 'high'>('normal');

  // Notice Edit State
  const [editingNotice, setEditingNotice] = useState<PublicNotice | null>(null);
  const [editNoticeTitle, setEditNoticeTitle] = useState('');
  const [editNoticeMsg, setEditNoticeMsg] = useState('');
  const [editNoticePriority, setEditNoticePriority] = useState<'normal' | 'high'>('normal');

  // Officer Add & Edit State
  const [isAddingOfficer, setIsAddingOfficer] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerDesignation, setNewOfficerDesignation] = useState('');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');
  const [newOfficerDescription, setNewOfficerDescription] = useState('');
  const [newOfficerOrder, setNewOfficerOrder] = useState<number>(1);

  const [editingOfficer, setEditingOfficer] = useState<OfficerProfile | null>(null);
  const [editOfficerName, setEditOfficerName] = useState('');
  const [editOfficerDesignation, setEditOfficerDesignation] = useState('');
  const [editOfficerPhone, setEditOfficerPhone] = useState('');
  const [editOfficerDescription, setEditOfficerDescription] = useState('');
  const [editOfficerOrder, setEditOfficerOrder] = useState<number>(1);

  // UI feedback states
  const [saving, setSaving] = useState(false);

  // ── Two-Step Confirmation / Success Modal State ──
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const { availability: avail, slots: availSlots } = await DataService.getTodayAvailability();
      const allOfficers = await DataService.getOfficers();
      const allNotices = await DataService.getPublicNotices();

      setLiveAvailability(avail);
      setStatus(avail.status);
      setTimingType(avail.timing_type);
      setPublicMessage(avail.public_message || '');
      setAlternativeOfficerId(avail.alternative_officer_id || '');
      setAlternativeTiming(avail.alternative_timing || 'दोपहर 12:00 बजे से 01:00 बजे तक');
      setSlots(availSlots);
      setOfficers(allOfficers);
      setNotices(allNotices);
      setHasUnsavedChanges(false);
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  // Smart Status Change Handler with automatic preset messages
  const handleSelectStatus = (newStatus: AvailabilityStatus) => {
    setStatus(newStatus);
    setHasUnsavedChanges(true);

    if (newStatus === 'available') {
      setPublicMessage('आज पुलिस अधीक्षक महोदय कार्यालय में उपस्थित हैं। परिवादी जनसुनवाई कक्ष में उपस्थित होकर अपनी समस्या प्रस्तुत कर सकते हैं।');
      setTimingType('confirmed');
      if (slots.length === 0) {
        applySlotsPreset('standard');
      }
    } else if (newStatus === 'unavailable') {
      setPublicMessage('आज पुलिस अधीक्षक महोदय शासकीय कार्य / दौरे पर होने के कारण कार्यालय में जनसुनवाई हेतु उपलब्ध नहीं रहेंगे।');
      // Default to Additional SP if available
      const addlSp = officers.find(o => o.designation.includes('अतिरिक्त') || o.designation.includes('Addl'));
      if (addlSp && !alternativeOfficerId) {
        setAlternativeOfficerId(addlSp.id);
      }
    } else if (newStatus === 'confirmation_pending') {
      setPublicMessage('आज की जनसुनवाई का समय पुष्ट होना प्रतीक्षित है। शीघ्र ही अद्यतन जानकारी पोर्टल पर दी जाएगी।');
      setTimingType('tentative');
    } else if (newStatus === 'time_changed') {
      setPublicMessage('आज जनसुनवाई के समय में संशोधन किया गया है। कृपया नीचे दिए गए नए सत्र समय का अवलोकन करें।');
    }
  };

  // Preset slots for 1-click convenience
  const applySlotsPreset = (type: 'standard' | 'morning' | 'evening' | 'none') => {
    setHasUnsavedChanges(true);
    if (type === 'standard') {
      setSlots([
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
      ]);
    } else if (type === 'morning') {
      setSlots([
        {
          id: 'slot-1',
          availability_id: 'avail-today',
          start_time: '10:30 AM',
          end_time: '01:30 PM',
          slot_status: 'confirmed',
          slot_label: 'प्रातः कालीन सत्र',
          display_order: 1
        }
      ]);
    } else if (type === 'evening') {
      setSlots([
        {
          id: 'slot-1',
          availability_id: 'avail-today',
          start_time: '03:30 PM',
          end_time: '05:30 PM',
          slot_status: 'confirmed',
          slot_label: 'सायं कालीन सत्र',
          display_order: 1
        }
      ]);
    } else if (type === 'none') {
      setSlots([]);
    }
  };

  // ── ACTION 1: Publish Availability with Confirmation & Success Modal ──
  const triggerSaveAvailabilityModal = () => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'आज की स्थिति लाइव प्रकाशित करें?',
      message: `क्या आप आज की जनसुनवाई स्थिति को "${STATUS_LABELS[status].title}" के रूप में सार्वजनिक पोर्टल पर तुरंत लाइव प्रकाशित करना चाहते हैं? यह सभी नागरिकों को तुरंत दिखाई देगा।`,
      confirmText: 'हाँ, तुरंत लाइव करें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        setSaving(true);

        const result = await DataService.saveAvailability(
          {
            schedule_date: getTodayISODate(),
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

        setSaving(false);

        if (result && !result.success) {
          setModalState({
            isOpen: true,
            type: 'danger',
            title: 'सहेजने में समस्या आई',
            message: result.error || 'डेटाबेस में स्थिति सहेजते समय त्रुटि हुई।',
            confirmText: 'ठीक है',
            onClose: closeModal,
          });
        } else {
          setHasUnsavedChanges(false);
          await loadAllData();
          // Show AMPLR-style Success Modal
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Updated!',
            message: 'आज की जनसुनवाई स्थिति और समय सत्र सार्वजनिक पोर्टल पर लाइव हो चुके हैं।',
            confirmText: 'OK',
            onClose: closeModal,
          });
        }
      }
    });
  };

  const handleAddSlot = () => {
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  // ── ACTION 2: Delete Slot with Confirmation Modal ──
  const triggerDeleteSlotModal = (index: number) => {
    const targetSlot = slots[index];
    const slotDesc = targetSlot ? `${targetSlot.slot_label || 'सत्र'} (${targetSlot.start_time} - ${targetSlot.end_time})` : 'यह सत्र';

    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'समय सत्र हटाएं?',
      message: `क्या आप "${slotDesc}" को आज की जनसुनवाई अनुसूची से हटाना चाहते हैं?`,
      confirmText: 'हाँ, हटाएं',
      cancelText: 'रद्द करें',
      confirmColor: 'rose',
      onCancel: closeModal,
      onConfirm: () => {
        setHasUnsavedChanges(true);
        setSlots(slots.filter((_, i) => i !== index));
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'सत्र हटा दिया गया!',
          message: 'समय सत्र सफलतापूर्वक सूची से हटा दिया गया है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 3: Create Notice with Confirmation & Success Modal ──
  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeMsg.trim()) return;

    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'सार्वजनिक सूचना प्रकाशित करें?',
      message: `"${newNoticeTitle}" को पोर्टल के नोटिस बोर्ड पर तुरंत प्रकाशित किया जाएगा। क्या आप इसे जारी करना चाहते हैं?`,
      confirmText: 'हाँ, प्रकाशित करें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
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

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'सार्वजनिक सूचना पोर्टल पर सफलतापूर्वक जारी कर दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 3.1: Start & Cancel Notice Editing ──
  const handleStartEditNotice = (notice: PublicNotice) => {
    setEditingNotice(notice);
    setEditNoticeTitle(notice.title);
    setEditNoticeMsg(notice.message);
    setEditNoticePriority(notice.priority as any);
  };

  const handleCancelEditNotice = () => {
    setEditingNotice(null);
    setEditNoticeTitle('');
    setEditNoticeMsg('');
  };

  // ── ACTION 3.2: Save Edited Notice ──
  const handleSaveEditNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice || !editNoticeTitle.trim() || !editNoticeMsg.trim()) return;

    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'सार्वजनिक सूचना संशोधित करें?',
      message: `क्या आप "${editNoticeTitle}" में किए गए बदलावों को सार्वजनिक पोर्टल पर तुरंत लाइव अपडेट करना चाहते हैं?`,
      confirmText: 'हाँ, अपडेट करें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.saveNotice({
          id: editingNotice.id,
          title: editNoticeTitle.trim(),
          message: editNoticeMsg.trim(),
          published: true,
          priority: editNoticePriority,
          publish_at: editingNotice.publish_at || new Date().toISOString()
        });

        handleCancelEditNotice();
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'सार्वजनिक सूचना सफलतापूर्वक संशोधित कर दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 4: Delete Notice with Confirmation Modal ──
  const triggerDeleteNoticeModal = (id: string, noticeTitle: string) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'सूचना हटाएं?',
      message: `क्या आप "${noticeTitle}" को सार्वजनिक पोर्टल से हटाना चाहते हैं?`,
      confirmText: 'हाँ, हटाएं',
      cancelText: 'रद्द करें',
      confirmColor: 'rose',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.deleteNotice(id);
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'सार्वजनिक सूचना पोर्टल से सफलतापूर्वक हटा दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 5.1: Start & Cancel Add Officer ──
  const handleStartAddOfficer = () => {
    setIsAddingOfficer(true);
    setEditingOfficer(null);
    setNewOfficerName('');
    setNewOfficerDesignation('');
    setNewOfficerPhone('');
    setNewOfficerDescription('');
    setNewOfficerOrder(officers.length + 1);
  };

  const handleCancelAddOfficer = () => {
    setIsAddingOfficer(false);
  };

  // ── ACTION 5.2: Save New Officer to Database ──
  const handleSaveNewOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName.trim() || !newOfficerDesignation.trim()) return;

    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'नया अधिकारी जोड़ें?',
      message: `क्या आप "${newOfficerName} (${newOfficerDesignation})" को अधिकारी सूची में जोड़ना चाहते हैं? यह सार्वजनिक पोर्टल पर दिखाई देगा।`,
      confirmText: 'हाँ, जोड़ें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.addOfficer({
          name: newOfficerName.trim(),
          designation: newOfficerDesignation.trim(),
          phone: newOfficerPhone.trim(),
          description: newOfficerDescription.trim(),
          is_active: true,
          display_order: Number(newOfficerOrder) || (officers.length + 1)
        });

        handleCancelAddOfficer();
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'नया अधिकारी प्रोफाइल सफलतापूर्वक जोड़ दिया गया है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 5.3: Start & Cancel Edit Officer ──
  const handleStartEditOfficer = (officer: OfficerProfile) => {
    setEditingOfficer(officer);
    setIsAddingOfficer(false);
    setEditOfficerName(officer.name);
    setEditOfficerDesignation(officer.designation);
    setEditOfficerPhone(officer.phone);
    setEditOfficerDescription(officer.description || '');
    setEditOfficerOrder(officer.display_order || 1);
  };

  const handleCancelEditOfficer = () => {
    setEditingOfficer(null);
  };

  // ── ACTION 5.4: Save Edited Officer to Database ──
  const handleSaveEditOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer || !editOfficerName.trim() || !editOfficerDesignation.trim()) return;

    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'अधिकारी प्रोफाइल अपडेट करें?',
      message: `क्या आप "${editOfficerName}" के विवरण में किए गए बदलाव सुरक्षित करना चाहते हैं?`,
      confirmText: 'हाँ, अपडेट करें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.updateOfficer({
          ...editingOfficer,
          name: editOfficerName.trim(),
          designation: editOfficerDesignation.trim(),
          phone: editOfficerPhone.trim(),
          description: editOfficerDescription.trim(),
          display_order: Number(editOfficerOrder) || 1
        });

        handleCancelEditOfficer();
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'अधिकारी प्रोफाइल सफलतापूर्वक अपडेट कर दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 5.5: Delete Officer with Confirmation Modal ──
  const triggerDeleteOfficerModal = (officer: OfficerProfile) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'अधिकारी हटाएं?',
      message: `क्या आप "${officer.name} (${officer.designation})" को अधिकारी सूची से हटाना चाहते हैं?`,
      confirmText: 'हाँ, हटाएं',
      cancelText: 'रद्द करें',
      confirmColor: 'rose',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.deleteOfficer(officer.id);
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'अधिकारी प्रोफाइल सफलतापूर्वक हटा दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 5.6: Batch Save Officers to Database ──
  const triggerSaveOfficersModal = () => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'अधिकारी प्रोफाइल अपडेट करें?',
      message: 'क्या आप अधिकारियों के विवरण व पदनाम में किए गए सभी बदलाव सुरक्षित करना चाहते हैं?',
      confirmText: 'हाँ, सहेजें',
      cancelText: 'रद्द करें',
      confirmColor: 'teal',
      onCancel: closeModal,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isLoading: true }));
        await DataService.saveOfficers(officers);
        await loadAllData();

        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Updated!',
          message: 'अधिकारियों की प्रोफाइल डेटाबेस में सफलतापूर्वक सुरक्षित कर दी गई है।',
          confirmText: 'OK',
          onClose: closeModal,
        });
      }
    });
  };

  // ── ACTION 6: Logout Confirmation Modal ──
  const triggerLogoutModal = () => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'डैशबोर्ड से लॉगआउट करें?',
      message: 'क्या आप वर्तमान एडमिन सत्र समाप्त करके एडमिन लॉगिन स्क्रीन पर लौटना चाहते हैं?',
      confirmText: 'हाँ, लॉगआउट करें',
      cancelText: 'बने रहें',
      confirmColor: 'navy',
      onCancel: closeModal,
      onConfirm: () => {
        closeModal();
        onLogout();
      }
    });
  };

  const todayHindi = getTodayHindiDate();
  const selectedAltOfficer = officers.find(o => o.id === alternativeOfficerId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-16">
      
      {/* ── GLOBAL FEEDBACK MODAL (Confirmation / Success) ── */}
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
        onCancel={modalState.onCancel || closeModal}
        onClose={modalState.onClose || closeModal}
      />

      {/* ── Top Admin Header with Centered Official Title & Dual Branding ── */}
      <header className="bg-[#0B1728] text-white border-b-2 border-amber-500 sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative">
            
            {/* Left: Dual Logos (Police + ChittorTech) */}
            <div className="flex items-center gap-2.5 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#07111E] border-2 border-amber-400 p-0.5 shadow-md flex-shrink-0">
                <img 
                  src="/rajasthan-police-logo.webp" 
                  alt="Rajasthan Police" 
                  className="w-full h-full object-cover scale-110" 
                />
              </div>
              <div className="w-px h-6 bg-slate-700/80"></div>
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-amber-400/80 p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
                <img 
                  src="/chittortech_logo.png" 
                  alt="ChittorTech Logo" 
                  className="w-full h-full object-cover scale-125" 
                />
              </div>
            </div>

            {/* Center: Main Office Title & Badges - Centered & Highly Visible */}
            <div className="w-full text-center md:px-44">
              <div className="inline-flex items-center justify-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs">
                  PA / गोपनीय शाखा डैशबोर्ड
                </span>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/50 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    डेटाबेस लाइव कनेक्टेड
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full border border-amber-700">
                    लोकल मोड
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white font-devanagari tracking-tight drop-shadow-sm leading-snug">
                पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 font-devanagari font-medium mt-0.5">
                दैनिक जनसुनवाई एवं प्रशासनिक नियंत्रण पोर्टल
              </p>
            </div>

            {/* Right: Action Buttons (Public Portal & Logout) */}
            <div className="flex items-center gap-2 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex-shrink-0">
              <button
                onClick={onViewPublic}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 shadow-sm transition-all hover:scale-102 cursor-pointer"
                title="पब्लिक पोर्टल देखें"
              >
                <span>पब्लिक पोर्टल</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={triggerLogoutModal}
                className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-102 cursor-pointer"
                title="लॉगआउट"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation - Centered & Clean */}
        <div className="bg-[#070F1C] px-4 overflow-x-auto border-t border-slate-800">
          <div className="max-w-5xl mx-auto flex justify-center space-x-2 sm:space-x-6">
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-2.5 px-3 border-b-2 text-xs sm:text-sm font-bold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'availability'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>आज की जनसुनवाई (1-Click)</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`py-2.5 px-3 border-b-2 text-xs sm:text-sm font-bold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'notices'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>सार्वजनिक सूचनाएं ({notices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('officers')}
              className={`py-2.5 px-3 border-b-2 text-xs sm:text-sm font-bold font-devanagari whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'officers'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>अधिकारी प्रोफाइल</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="max-w-4xl mx-auto w-full p-3 sm:p-6 flex-1">

        {/* ═══════════════════════════════════════════════════════
            TAB 1: AVAILABILITY & SLOTS (Redesigned & Super Simple)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'availability' && (
          <div className="space-y-5">

            {/* ── Non-Technical Staff Guide Box ── */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 rounded-2xl p-4 sm:p-5 border border-blue-200 text-slate-800 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm shadow-xs">
                  ℹ️
                </div>
                <div className="flex-1 text-xs font-devanagari space-y-1.5">
                  <div className="font-extrabold text-sm text-blue-950">
                    इस पेज का उपयोग कैसे करें? (दैनिक जनसुनवाई गाइड)
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <strong>उद्देश्य:</strong> प्रतिदिन पुलिस अधीक्षक (SP) महोदय की जनसुनवाई स्थिति को मात्र 1-क्लिक में अपडेट करने के लिए। आपके द्वारा किया गया बदलाव तुरंत पूरे जिले के नागरिकों को लाइव दिखाई देता है।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11.5px]">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <strong className="text-blue-900 block mb-0.5">1. स्थिति चुनें:</strong>
                      'उपलब्ध हैं', 'उपलब्ध नहीं हैं', या 'समय परिवर्तित' में से उचित बटन दबाएं। संदेश अपने आप सेट हो जाएगा।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <strong className="text-blue-900 block mb-0.5">2. समय / विकल्प:</strong>
                      यदि समय बदला है तो समय बदलें। यदि सर अनुपलब्ध हैं तो वैकल्पिक अधिकारी (Addl SP / DySP) चुनें।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <strong className="text-blue-900 block mb-0.5">3. स्थिति लागू करें:</strong>
                      नीचे <strong>'स्थिति तुरंत लागू करें'</strong> बटन दबाकर 'हाँ' पर क्लिक करें। यह तुरंत लाइव हो जाएगा।
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Live Status Card */}
            {liveAvailability && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: STATUS_LABELS[liveAvailability.status]?.bg || '#f1f5f9' }}
                  >
                    {liveAvailability.status === 'available' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-devanagari">
                        वर्तमान में वेबसाइट पर लाइव:
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <div className="text-base sm:text-lg font-extrabold font-devanagari text-slate-900">
                      {STATUS_LABELS[liveAvailability.status]?.title || 'अज्ञात स्थिति'}
                      <span className="text-xs font-normal text-slate-500 ml-2">
                        ({STATUS_LABELS[liveAvailability.status]?.subtitle})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="text-[11px] text-slate-400 font-devanagari">तारीख: {todayHindi}</div>
                  <button
                    type="button"
                    onClick={onViewPublic}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-devanagari inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>पोर्टल पर देखें</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Unsaved Changes Banner */}
            {hasUnsavedChanges && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold font-devanagari">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>आपने बदलाव किए हैं! इसे वेबसाइट पर लाइव करने के लिए 'प्रकाशित करें' बटन दबाएं।</span>
                </div>
                <button
                  type="button"
                  onClick={triggerSaveAvailabilityModal}
                  disabled={saving}
                  className="bg-[#007074] hover:bg-[#005B5E] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0 font-devanagari"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'सहेजा जा रहा है...' : 'तुरंत पब्लिश करें'}</span>
                </button>
              </div>
            )}

            {/* ── STEP 1: Main Status Selection (1-Click) ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm sm:text-base font-extrabold text-slate-900 font-devanagari flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">1</span>
                  <span>आज पुलिस अधीक्षक महोदय की स्थिति चुनें:</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-500 font-devanagari">1-क्लिक चयन</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Available */}
                <button
                  type="button"
                  onClick={() => handleSelectStatus('available')}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    status === 'available'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-400 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {status === 'available' && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-devanagari flex items-center gap-1">
                      <Check className="w-3 h-3" /> चयनित
                    </span>
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 mb-2"></div>
                  <strong className="block text-base font-bold font-devanagari">उपलब्ध हैं</strong>
                  <span className="text-xs text-slate-600 font-devanagari">कार्यालय में जनसुनवाई करेंगे</span>
                </button>

                {/* 2. Unavailable */}
                <button
                  type="button"
                  onClick={() => handleSelectStatus('unavailable')}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    status === 'unavailable'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-400 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {status === 'unavailable' && (
                    <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-devanagari flex items-center gap-1">
                      <Check className="w-3 h-3" /> चयनित
                    </span>
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 mb-2"></div>
                  <strong className="block text-base font-bold font-devanagari text-rose-900">उपलब्ध नहीं हैं</strong>
                  <span className="text-xs text-slate-600 font-devanagari">शासकीय दौरा / बैठक में</span>
                </button>

                {/* 3. Pending */}
                <button
                  type="button"
                  onClick={() => handleSelectStatus('confirmation_pending')}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    status === 'confirmation_pending'
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-400 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {status === 'confirmation_pending' && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-devanagari flex items-center gap-1">
                      <Check className="w-3 h-3" /> चयनित
                    </span>
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 mb-2"></div>
                  <strong className="block text-base font-bold font-devanagari">पुष्टि बाकी है</strong>
                  <span className="text-xs text-slate-600 font-devanagari">समय प्रतीक्षित है</span>
                </button>

                {/* 4. Time Changed */}
                <button
                  type="button"
                  onClick={() => handleSelectStatus('time_changed')}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    status === 'time_changed'
                      ? 'border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-400 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {status === 'time_changed' && (
                    <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-devanagari flex items-center gap-1">
                      <Check className="w-3 h-3" /> चयनित
                    </span>
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 mb-2"></div>
                  <strong className="block text-base font-bold font-devanagari">समय परिवर्तित</strong>
                  <span className="text-xs text-slate-600 font-devanagari">नया समय तय</span>
                </button>
              </div>

              {/* Timing verification toggle */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-700 font-devanagari">
                  समय की प्रामाणिकता (Status Tag):
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                  <button
                    type="button"
                    onClick={() => { setTimingType('confirmed'); setHasUnsavedChanges(true); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all font-devanagari ${
                      timingType === 'confirmed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ✓ पुष्ट समय (Confirmed)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTimingType('tentative'); setHasUnsavedChanges(true); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all font-devanagari ${
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

            {/* ── STEP 2: Alternative Officer (Highlighted when Unavailable) ── */}
            <div className={`rounded-2xl p-5 border shadow-sm transition-all ${
              status === 'unavailable' 
                ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-devanagari flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">2</span>
                  <UserCheck className="w-4 h-4 text-police-700" />
                  <span>वैकल्पिक जनसुनवाई अधिकारी (Alternative Officer):</span>
                </h3>
                {status === 'unavailable' && (
                  <span className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md font-devanagari">
                    अनुपलब्धता हेतु आवश्यक
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-devanagari mb-3">
                यदि एसपी सर उपस्थित नहीं हैं, तो क्या नागरिक किसी अन्य वरिष्ठ अधिकारी से मिल सकते हैं?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-devanagari">
                    अधिकृत अधिकारी चुनें:
                  </label>
                  <select
                    value={alternativeOfficerId}
                    onChange={(e) => { setAlternativeOfficerId(e.target.value); setHasUnsavedChanges(true); }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-devanagari font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-devanagari">
                    वैकल्पिक जनसुनवाई का समय व स्थान:
                  </label>
                  <input
                    type="text"
                    value={alternativeTiming}
                    onChange={(e) => { setAlternativeTiming(e.target.value); setHasUnsavedChanges(true); }}
                    placeholder="दोपहर 12:00 बजे से 01:00 बजे तक (कक्ष संख्या 4)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-devanagari focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ── STEP 3: Time Slots with Fast Presets ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-devanagari flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">3</span>
                    <Clock className="w-4 h-4 text-police-700" />
                    <span>जनसुनवाई समय सत्र (Meeting Slots):</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-devanagari">
                    नागरिकों को दिखाए जाने वाले आधिकारिक समय
                  </p>
                </div>

                {/* Quick Presets Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 font-devanagari mr-1">त्वरित समय:</span>
                  <button
                    type="button"
                    onClick={() => applySlotsPreset('standard')}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 font-devanagari font-semibold"
                  >
                    ⚡ दोनों सत्र
                  </button>
                  <button
                    type="button"
                    onClick={() => applySlotsPreset('morning')}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 font-devanagari font-semibold"
                  >
                    ⚡ केवल प्रातः
                  </button>
                  <button
                    type="button"
                    onClick={() => applySlotsPreset('evening')}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 font-devanagari font-semibold"
                  >
                    ⚡ केवल सायं
                  </button>
                  <button
                    type="button"
                    onClick={() => applySlotsPreset('none')}
                    className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded-lg border border-rose-200 font-devanagari"
                  >
                    रद्द
                  </button>
                </div>
              </div>

              {slots.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed font-devanagari">
                  आज कोई समय सत्र निर्धारित नहीं है।
                </div>
              ) : (
                <div className="space-y-2.5">
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
                        className="p-2 rounded-lg border border-slate-300 w-full sm:w-40 text-xs bg-white font-devanagari font-semibold"
                      />

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-devanagari">से:</span>
                        <input
                          type="text"
                          value={slot.start_time}
                          onChange={(e) => handleUpdateSlot(idx, 'start_time', e.target.value)}
                          placeholder="10:30 AM"
                          className="p-2 rounded-lg border border-slate-300 w-24 text-xs bg-white text-center font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-devanagari">तक:</span>
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
                        className="p-2 rounded-lg border border-slate-300 text-xs bg-white font-devanagari"
                      >
                        <option value="confirmed">पुष्ट (Confirmed)</option>
                        <option value="tentative">प्रस्तावित (Tentative)</option>
                        <option value="cancelled">रद्द (Cancelled)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => triggerDeleteSlotModal(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg ml-auto transition-colors"
                        title="सत्र हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-semibold font-devanagari"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>अन्य सत्र जोड़ें</span>
                </button>
              </div>
            </div>

            {/* ── STEP 4: Public Message / Advisory ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-devanagari mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">4</span>
                <span>नागरिकों हेतु सार्वजनिक संदेश (Advisory Note):</span>
              </h3>
              <p className="text-xs text-slate-500 font-devanagari mb-2">
                यह संदेश मुख्य कार्ड पर नागरिकों को दिखाई देगा
              </p>

              <textarea
                rows={3}
                value={publicMessage}
                onChange={(e) => { setPublicMessage(e.target.value); setHasUnsavedChanges(true); }}
                placeholder="उदा. आज पुलिस अधीक्षक महोदय उपस्थित हैं..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ── LIVE PREVIEW: Exactly What Citizens See ── */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-devanagari">
                    नागरिक पूर्वावलोकन (Live Citizen Preview):
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-devanagari">वेबसाइट पर ऐसा दिखेगा</span>
              </div>

              {/* Mini Simulation of Public Portal Card */}
              <div className="bg-white text-slate-900 rounded-xl p-4 border border-slate-200 shadow-inner">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-devanagari">
                    आज की स्थिति
                  </span>
                  <span className="text-[11px] text-slate-500 font-devanagari">{todayHindi}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: STATUS_LABELS[status].bg }}>
                    {status === 'available' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold font-devanagari leading-snug">
                      {STATUS_LABELS[status].title}
                    </h4>
                    <p className="text-xs text-slate-500 font-devanagari">
                      {STATUS_LABELS[status].subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 font-devanagari border border-slate-200">
                  <strong>कार्यालय संदेश:</strong> {publicMessage || 'कोई संदेश नहीं'}
                </div>

                {status === 'unavailable' && selectedAltOfficer && (
                  <div className="mt-2 p-2.5 rounded-lg bg-blue-50 text-xs text-blue-950 font-devanagari border border-blue-200">
                    <strong>वैकल्पिक जनसुनवाई:</strong> {selectedAltOfficer.name} ({selectedAltOfficer.designation}) — {alternativeTiming}
                  </div>
                )}
              </div>
            </div>

            {/* ── BIG SAVE & PUBLISH ACTION BAR ── */}
            <div className="sticky bottom-3 z-30 pt-2">
              <button
                type="button"
                onClick={triggerSaveAvailabilityModal}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-[#007074] via-teal-700 to-slate-900 hover:from-teal-700 hover:to-slate-950 text-white rounded-2xl font-extrabold text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-98 disabled:opacity-50 ring-4 ring-teal-500/20 font-devanagari"
              >
                <Save className="w-6 h-6 text-amber-300 animate-bounce" />
                <span>
                  {saving ? 'डेटाबेस में लाइव किया जा रहा है...' : '🚀 आज की स्थिति तुरंत पोर्टल पर लाइव करें (Publish Live Now)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB 2: PUBLIC NOTICES (Add & Edit Enabled)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'notices' && (
          <div className="space-y-6">

            {/* ── Non-Technical Staff Guide Box ── */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200 text-slate-800 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm shadow-xs">
                  📢
                </div>
                <div className="flex-1 text-xs font-devanagari space-y-1.5">
                  <div className="font-extrabold text-sm text-amber-950">
                    सूचनाएं कैसे जारी व संपादित करें? (नोटिस गाइड)
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <strong>उद्देश्य:</strong> जनसुनवाई से जुड़े जरूरी निर्देश, अवकाश की सूचना, अथवा आवश्यक दस्तावेज लाने के आदेश नागरिकों के मोबाइल पर सीधे प्रसारित करने के लिए।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11.5px]">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <strong className="text-amber-900 block mb-0.5">1. नई सूचना जारी करें:</strong>
                      शीर्षक व विस्तृत संदेश लिखकर नीचे 'सूचना प्रकाशित करें' बटन दबाएं।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <strong className="text-amber-900 block mb-0.5">2. संपादित करें (Edit):</strong>
                      किसी भी पुरानी सूचना के सामने 'संपादित करें' बटन दबाकर संशोधन करें।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <strong className="text-amber-900 block mb-0.5">3. हटाएं (Delete):</strong>
                      सूचना की आवश्यकता समाप्त होने पर लाल 'कचरा' बटन से तुरंत हटा दें।
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── NOTICE EDIT FORM (Shown when editing a notice) ── */}
            {editingNotice && (
              <div className="bg-amber-50/80 rounded-2xl p-5 border-2 border-amber-400 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-amber-950 font-devanagari flex items-center gap-1.5">
                    <Edit2 className="w-4 h-4 text-amber-600" />
                    <span>सूचना संपादित करें (Edit Public Notice):</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelEditNotice}
                    className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
                    title="रद्द करें"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditNotice} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                      सूचना का शीर्षक:
                    </label>
                    <input
                      type="text"
                      required
                      value={editNoticeTitle}
                      onChange={(e) => setEditNoticeTitle(e.target.value)}
                      placeholder="उदा. जनसुनवाई समय में संशोधन / अवकाश सूचना..."
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                      विस्तृत संदेश:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editNoticeMsg}
                      onChange={(e) => setEditNoticeMsg(e.target.value)}
                      placeholder="नागरिकों के लिए विस्तृत निर्देश या आदेश..."
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-devanagari">
                      <span>प्राथमिकता:</span>
                      <select
                        value={editNoticePriority}
                        onChange={(e) => setEditNoticePriority(e.target.value as any)}
                        className="p-1.5 rounded-lg border border-amber-300 bg-white text-xs font-devanagari"
                      >
                        <option value="normal">सामान्य (Normal)</option>
                        <option value="high">अति महत्वपूर्ण (High)</option>
                      </select>
                    </label>

                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEditNotice}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs font-devanagari transition-colors cursor-pointer"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>बदलाव सुरक्षित करें (Save Changes)</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* ── CREATE NEW NOTICE FORM ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-police-700" />
                <span>नई सार्वजनिक सूचना जारी करें:</span>
              </h3>

              <form onSubmit={handleCreateNoticeSubmit} className="space-y-3">
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
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-devanagari">
                    <span>प्राथमिकता:</span>
                    <select
                      value={newNoticePriority}
                      onChange={(e) => setNewNoticePriority(e.target.value as any)}
                      className="p-1.5 rounded-lg border border-slate-300 text-xs font-devanagari"
                    >
                      <option value="normal">सामान्य (Normal)</option>
                      <option value="high">अति महत्वपूर्ण (High)</option>
                    </select>
                  </label>

                  <button
                    type="submit"
                    className="ml-auto bg-[#007074] hover:bg-[#005B5E] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>सूचना प्रकाशित करें</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ── ACTIVE NOTICES LIST (With Edit & Delete) ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-devanagari mb-3">
                सक्रिय सार्वजनिक सूचनाएं ({notices.length}):
              </h3>

              {notices.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl font-devanagari">
                  कोई सूचना उपलब्ध नहीं है।
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 font-devanagari">{n.title}</h4>
                          {n.priority === 'high' && (
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full font-devanagari">
                              महत्वपूर्ण
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-devanagari mt-1 leading-relaxed">{n.message}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Edit Notice Button */}
                        <button
                          onClick={() => handleStartEditNotice(n)}
                          className="flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                          title="संपादित करें"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>एडिट</span>
                        </button>

                        {/* Delete Notice Button */}
                        <button
                          onClick={() => triggerDeleteNoticeModal(n.id, n.title)}
                          className="flex items-center gap-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB 3: OFFICER PROFILES (Add, Edit, Delete & Save)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'officers' && (
          <div className="space-y-5">

            {/* ── Non-Technical Staff Guide Box ── */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200 text-slate-800 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm shadow-xs">
                  👮
                </div>
                <div className="flex-1 text-xs font-devanagari space-y-1.5">
                  <div className="font-extrabold text-sm text-emerald-950">
                    अधिकारी प्रोफाइल कैसे जोड़ें व अपडेट करें? (प्रोफाइल गाइड)
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <strong>उद्देश्य:</strong> जिले के वरिष्ठ पुलिस अधिकारियों (एसपी सर, एडिशनल एसपी सर, डिप्टी एसपी सर) के नाम, पदनाम और कार्यालय दूरभाष को अद्यतन बनाए रखने के लिए। यह जानकारी सार्वजनिक पोर्टल के 'अधिकारी विवरण' सेक्शन में प्रदर्शित होती है।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11.5px]">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <strong className="text-emerald-900 block mb-0.5">1. नया जोड़ें (Add):</strong>
                      '+ नया अधिकारी जोड़ें' बटन दबाकर नए अधिकारी की प्रोफाइल शामिल करें।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <strong className="text-emerald-900 block mb-0.5">2. संपादित करें (Edit):</strong>
                      ट्रांसफर होने पर नाम व फोन नंबर बदलने के लिए 'एडिट' बटन का उपयोग करें।
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <strong className="text-emerald-900 block mb-0.5">3. डेटाबेस सेव (Save):</strong>
                      बदलाव करने के बाद नीचे 'अधिकारी प्रोफाइल सहेजें' बटन दबाएं।
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ADD NEW OFFICER FORM (Modal / Inline card) ── */}
            {isAddingOfficer && (
              <div className="bg-emerald-50/90 rounded-2xl p-5 border-2 border-emerald-400 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-emerald-950 font-devanagari flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-emerald-700" />
                    <span>नया अधिकारी प्रोफाइल जोड़ें (Add New Officer):</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelAddOfficer}
                    className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
                    title="रद्द करें"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveNewOfficerSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        अधिकारी का नाम: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        placeholder="उदा. श्री राहुल यादव (IPS)"
                        className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-devanagari font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        पदनाम (Designation): <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newOfficerDesignation}
                        onChange={(e) => setNewOfficerDesignation(e.target.value)}
                        placeholder="उदा. अतिरिक्त पुलिस अधीक्षक (Addl. SP)"
                        className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        कार्यालय दूरभाष / फोन:
                      </label>
                      <input
                        type="text"
                        value={newOfficerPhone}
                        onChange={(e) => setNewOfficerPhone(e.target.value)}
                        placeholder="उदा. 01472-240201"
                        className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        कक्ष संख्या / संक्षिप्त विवरण:
                      </label>
                      <input
                        type="text"
                        value={newOfficerDescription}
                        onChange={(e) => setNewOfficerDescription(e.target.value)}
                        placeholder="उदा. कक्ष संख्या 4, प्रथम तल"
                        className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        क्रम संख्या (Order):
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={newOfficerOrder}
                        onChange={(e) => setNewOfficerOrder(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelAddOfficer}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs font-devanagari transition-colors cursor-pointer"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>अधिकारी जोड़ें (Add Officer)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── EDIT OFFICER FORM (Modal / Inline card) ── */}
            {editingOfficer && (
              <div className="bg-amber-50/90 rounded-2xl p-5 border-2 border-amber-400 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-amber-950 font-devanagari flex items-center gap-1.5">
                    <Edit2 className="w-4 h-4 text-amber-600" />
                    <span>अधिकारी प्रोफाइल संशोधित करें: {editingOfficer.name}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelEditOfficer}
                    className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
                    title="रद्द करें"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditOfficerSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        अधिकारी का नाम: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editOfficerName}
                        onChange={(e) => setEditOfficerName(e.target.value)}
                        placeholder="उदा. श्री राहुल यादव (IPS)"
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-devanagari font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        पदनाम (Designation): <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editOfficerDesignation}
                        onChange={(e) => setEditOfficerDesignation(e.target.value)}
                        placeholder="उदा. अतिरिक्त पुलिस अधीक्षक"
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        कार्यालय दूरभाष / फोन:
                      </label>
                      <input
                        type="text"
                        value={editOfficerPhone}
                        onChange={(e) => setEditOfficerPhone(e.target.value)}
                        placeholder="उदा. 01472-240201"
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        कक्ष संख्या / संक्षिप्त विवरण:
                      </label>
                      <input
                        type="text"
                        value={editOfficerDescription}
                        onChange={(e) => setEditOfficerDescription(e.target.value)}
                        placeholder="उदा. कक्ष संख्या 4, प्रथम तल"
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-devanagari focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari">
                        क्रम संख्या (Order):
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editOfficerOrder}
                        onChange={(e) => setEditOfficerOrder(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEditOfficer}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs font-devanagari transition-colors cursor-pointer"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>बदलाव सुरक्षित करें (Save Changes)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── OFFICERS LIST CARD WITH ADD BUTTON ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-devanagari flex items-center gap-2">
                    <Users className="w-4 h-4 text-police-700" />
                    <span>अधिकारियों का विवरण (Officer Profiles) ({officers.length}):</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-devanagari mt-0.5">
                    ये प्रोफाइल सार्वजनिक पोर्टल के अधिकारी अनुभाग व वैकल्पिक सुनवाई सूची में प्रदर्शित होते हैं
                  </p>
                </div>

                {/* + ADD OFFICER BUTTON */}
                <button
                  type="button"
                  onClick={handleStartAddOfficer}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-devanagari transition-all hover:scale-102 cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ नया अधिकारी जोड़ें</span>
                </button>
              </div>

              {/* Officer Cards */}
              <div className="space-y-3">
                {officers.map((officer, index) => (
                  <div key={officer.id || index} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg border border-slate-300 flex-shrink-0">
                        {officer.name.charAt(0)}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 font-devanagari truncate">
                            {officer.name}
                          </h4>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full font-devanagari">
                            क्रम: {officer.display_order || index + 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-devanagari font-medium">
                          {officer.designation}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                          {officer.phone && (
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                              <Phone className="w-3 h-3 text-amber-600" />
                              {officer.phone}
                            </span>
                          )}
                          {officer.description && (
                            <span className="font-devanagari text-[11px] text-slate-500">
                              • {officer.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Edit & Delete */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditOfficer(officer)}
                        className="flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>एडिट</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerDeleteOfficerModal(officer)}
                        className="flex items-center gap-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold font-devanagari transition-colors cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-500 font-devanagari">
                  * सभी परिवर्तन तुरंत डेटाबेस में सुरक्षित करने के लिए सेव बटन दबाएं।
                </span>
                <button
                  type="button"
                  onClick={triggerSaveOfficersModal}
                  className="bg-[#007074] hover:bg-[#005B5E] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm font-devanagari transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>अधिकारी प्रोफाइल सहेजें (Save All)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
