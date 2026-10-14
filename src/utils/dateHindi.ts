// Hindi Date & Time Localization Utilities for Chittorgarh SP Office

const HINDI_DAYS = [
  'रविवार',
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार'
];

const HINDI_MONTHS = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर'
];

export function getTodayHindiDate(): string {
  const now = new Date();
  const dayName = HINDI_DAYS[now.getDay()];
  const dateNum = now.getDate();
  const monthName = HINDI_MONTHS[now.getMonth()];
  const year = now.getFullYear();

  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

export function formatHindiDateTime(isoString: string): string {
  if (!isoString) return 'अपुष्ट';
  try {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = HINDI_MONTHS[d.getMonth()];
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    let period = 'सुबह';

    if (hours >= 12 && hours < 16) {
      period = 'दोपहर';
    } else if (hours >= 16 && hours < 20) {
      period = 'शाम';
    } else if (hours >= 20 || hours < 4) {
      period = 'रात';
    }

    const displayHours = hours % 12 || 12;

    return `${day} ${month}, ${period} ${displayHours}:${minutes} बजे`;
  } catch {
    return 'अपुष्ट';
  }
}

export function getStatusConfig(status: string) {
  switch (status) {
    case 'available':
      return {
        label: 'आज जनसुनवाई के लिए उपलब्ध',
        shortLabel: 'उपलब्ध',
        subText: 'पुलिस अधीक्षक कार्यालय में जनसुनवाई हेतु उपस्थित हैं',
        badgeBg: 'bg-emerald-50 border-emerald-500 text-emerald-900',
        cardBorder: 'border-emerald-500',
        headerBg: 'from-emerald-700 via-emerald-800 to-slate-900',
        accentColor: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
        iconType: 'check-circle',
        ariaStatus: 'Available'
      };
    case 'unavailable':
      return {
        label: 'आज जनसुनवाई के लिए उपलब्ध नहीं',
        shortLabel: 'उपलब्ध नहीं',
        subText: 'विशेष शासकीय कार्य / दौरे के कारण SP सर आज जनसुनवाई के लिए उपलब्ध नहीं हैं',
        badgeBg: 'bg-rose-50 border-rose-500 text-rose-900',
        cardBorder: 'border-rose-500',
        headerBg: 'from-rose-700 via-rose-800 to-slate-900',
        accentColor: 'text-rose-700',
        dotColor: 'bg-rose-500',
        iconType: 'x-circle',
        ariaStatus: 'Unavailable'
      };
    case 'time_changed':
      return {
        label: 'जनसुनवाई का समय बदल गया है',
        shortLabel: 'समय परिवर्तित',
        subText: 'अपरिहार्य कारणों से आज जनसुनवाई के समय में संशोधन किया गया है',
        badgeBg: 'bg-blue-50 border-blue-500 text-blue-900',
        cardBorder: 'border-blue-500',
        headerBg: 'from-blue-700 via-blue-800 to-slate-900',
        accentColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        iconType: 'clock',
        ariaStatus: 'Time Changed'
      };
    case 'confirmation_pending':
    default:
      return {
        label: 'समय की पुष्टि बाकी है',
        shortLabel: 'पुष्टि प्रतीक्षित',
        subText: 'आज की जनसुनवाई का समय अभी कार्यालय द्वारा अद्यतन (Confirm) किया जा रहा है',
        badgeBg: 'bg-amber-50 border-amber-500 text-amber-900',
        cardBorder: 'border-amber-500',
        headerBg: 'from-amber-600 via-amber-700 to-slate-900',
        accentColor: 'text-amber-700',
        dotColor: 'bg-amber-500',
        iconType: 'alert-circle',
        ariaStatus: 'Pending Confirmation'
      };
  }
}
