export type SafetyCategory = 'cyber' | 'women';
export type SafetyLanguage = 'hi' | 'en';

export interface SafetyTopic {
  id: string;
  category: SafetyCategory;
  iconName: 'ShieldAlert' | 'FileWarning' | 'QrCode' | 'Briefcase' | 'Video' | 'Monitor' | 'Coins' | 'Smartphone' | 'UserX' | 'Image' | 'Home' | 'Building' | 'AlertCircle';
  severity: 'critical' | 'warning' | 'info';
  badge: {
    hi: string;
    en: string;
  };
  title: {
    hi: string;
    en: string;
  };
  summary: {
    hi: string;
    en: string;
  };
  trapModus: {
    hi: string;
    en: string;
  };
  strictDonts: {
    hi: string[];
    en: string[];
  };
  legalTruthOrDos: {
    hi: string[];
    en: string[];
  };
  recoverySteps: {
    hi: string[];
    en: string[];
  };
  actionCall?: {
    label: { hi: string; en: string };
    phone?: string;
    url?: string;
  };
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  // ─────────────────────────────────────────────────────────────
  // ── CYBER SAFETY (8 TOPICS) ──
  // ─────────────────────────────────────────────────────────────
  {
    id: 'digital-arrest',
    category: 'cyber',
    iconName: 'ShieldAlert',
    severity: 'critical',
    badge: {
      hi: 'अत्यधिक खतरनाक फ्रॉड',
      en: 'High Threat Scam',
    },
    title: {
      hi: 'डिजिटल अरेस्ट एवं फर्जी पुलिस/CBI कॉल',
      en: '"Digital Arrest" & Fake Police/CBI Scam',
    },
    summary: {
      hi: 'वर्दी पहनकर वीडियो कॉल पर गैरकानूनी गिरफ्तारी और पैसे ट्रांसफर का खौफ दिखाना।',
      en: 'Scammers posing in police uniforms on video calls threatening immediate arrest.',
    },
    trapModus: {
      hi: 'स्कैमर्स पुलिस, सीबीआई, नारकोटिक्स या कस्टम्स अधिकारी की वर्दी पहनकर व्हाट्सएप या स्काइप पर वीडियो कॉल करते हैं। वे दावा करते हैं कि आपके आधार कार्ड पर एक अवैध पार्सल (ड्रग्स/नकली पासपोर्ट) पकड़ा गया है और आप पर मनी लॉन्ड्रिंग का केस है। वे नकली पुलिस थाने का बैकग्राउंड दिखाकर आपको कमरे में बंद रहने को कहते हैं और "वेरिफिकेशन" के नाम पर आपके बैंक के सारे पैसे ट्रांसफर करवा लेते हैं।',
      en: 'Scammers call via WhatsApp or Skype dressed in authentic-looking police, CBI, Narcotics, or Customs uniforms against a staged police station backdrop. They allege an illegal parcel containing narcotics registered under your Aadhaar was intercepted, placing you under "Digital Arrest." They demand an immediate wire transfer to a "government verification account" to clear your name.',
    },
    strictDonts: {
      hi: [
        'किसी भी वीडियो कॉल या फोन पर घबराकर अपनी बैंक डिटेल्स न बताएं।',
        'किसी अनजान व्यक्ति के कहने पर अपने कमरे में बंद न हों।',
        'वेरिफिकेशन या जांच के नाम पर किसी भी खाते में 1 रुपया भी ट्रांसफर न करें।',
      ],
      en: [
        'Never panic or disclose your bank balance, FDs, or assets over a video call.',
        'Never lock yourself in a room under intimidation from an unknown caller.',
        'Never transfer funds to any account claiming to be a "police verification" account.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'भारतीय कानून में "डिजिटल अरेस्ट" नाम की कोई व्यवस्था नहीं है।',
        'पुलिस या सीबीआई कभी भी वीडियो कॉल पर पूछताछ या गिरफ्तारी नहीं करती।',
        'कोई भी सरकारी एजेंसी फोन या वीडियो कॉल पर पैसे की मांग नहीं करती।',
      ],
      en: [
        'There is NO provision for "Digital Arrest" under Indian Law.',
        'Law enforcement agencies never conduct interrogations or arrests via Skype/WhatsApp.',
        'No government agency ever demands money transfers over a phone call.',
      ],
    },
    recoverySteps: {
      hi: [
        'तुरंत वीडियो कॉल डिस्कनेक्ट करें और उस नंबर को ब्लॉक करें।',
        'राष्ट्रीय साइबर हेल्पलाइन 1930 पर तुरंत कॉल कर शिकायत दर्ज कराएं।',
        'चित्तौड़गढ़ साइबर पुलिस थाने (97833-11422) पर लिखित सूचना दें।',
      ],
      en: [
        'Disconnect the call immediately and block the caller.',
        'Dial the National Cyber Helpline 1930 right away to report the incident.',
        'Inform the Chittorgarh District Cyber Police Station at 97833-11422.',
      ],
    },
    actionCall: {
      label: { hi: 'साइबर हेल्पलाइन 1930 डायल करें', en: 'Dial Cyber Helpline 1930' },
      phone: '1930',
    },
  },
  {
    id: 'apk-malware',
    category: 'cyber',
    iconName: 'FileWarning',
    severity: 'critical',
    badge: {
      hi: 'मोबाइल वायरस अलर्ट',
      en: 'Mobile Virus Alert',
    },
    title: {
      hi: 'शादी का कार्ड / बिजली बिल (.APK फ़ाइल फ्रॉड)',
      en: 'Wedding Invitation / Power Bill (.APK File Scam)',
    },
    summary: {
      hi: 'व्हाट्सएप पर फर्जी शादी के कार्ड या बिजली कटने के नाम पर मैलवेयर ऐप डाउनलोड कराना।',
      en: 'Malicious .apk spyware sent via WhatsApp disguised as wedding invites or utility bills.',
    },
    trapModus: {
      hi: 'व्हाट्सएप या मैसेज पर संदेश आता है: "भाई मेरी शादी में जरूर आना - Wedding_Invitation.apk" या "आज रात 9:30 बजे बिजली कट जाएगी, तुरंत अपडेट करें - Bijli_Bill.apk"। जैसे ही आप इस फाइल पर क्लिक करते हैं, फोन में बैकग्राउंड में एक जासूसी ऐप इंस्टॉल हो जाती है जो आपके सारे बैंक ओटीपी, पासवर्ड और कॉल हैकर्स तक पहुंचा देती है।',
      en: 'An SMS or WhatsApp message arrives: "Brother, please attend my wedding: Wedding_Invitation.apk" or "Your power supply will be cut tonight at 9:30 PM. Download Bijli_Bill.apk to pay." Clicking installs hidden spyware that silently forwards all your banking OTPs, SMS, and credentials directly to cyber criminals.',
    },
    strictDonts: {
      hi: [
        'व्हाट्सएप, टेलीग्राम या मैसेज पर आई किसी भी .apk फाइल पर कभी क्लिक न करें।',
        'अज्ञात स्रोतों से ऐप इंस्टॉल करने की परमिशन (Unknown Sources) कभी ऑन न रखें।',
      ],
      en: [
        'Never tap or install any file ending in .apk sent via WhatsApp, Telegram, or SMS.',
        'Never enable "Install from Unknown Sources" in your phone settings.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'सभी प्रामाणिक ऐप्स केवल Google Play Store या Apple App Store से ही डाउनलोड करें।',
        'बिजली विभाग कभी भी व्हाट्सएप पर .apk फाइल भेजकर बिल जमा करने को नहीं कहता।',
      ],
      en: [
        'Only install applications from the official Google Play Store or Apple App Store.',
        'Electricity boards and government departments never distribute .apk files via WhatsApp.',
      ],
    },
    recoverySteps: {
      hi: [
        'यदि फाइल इंस्टॉल हो गई है तो तुरंत फोन का इंटरनेट/वाई-फाई बंद करें।',
        'फोन को तुरंत Factory Reset (फॉर्मेट) करें ताकि मैलवेयर डिलीट हो सके।',
        'दूसरे सुरक्षित फोन से बैंक को कॉल कर नेटबैंकिंग व यूपीआई तुरंत ब्लॉक करवाएं।',
      ],
      en: [
        'Turn off mobile data and Wi-Fi immediately if an APK was accidentally installed.',
        'Perform a Factory Reset on your device to completely remove the spyware.',
        'Call your bank immediately from another device to freeze your UPI and net banking.',
      ],
    },
    actionCall: {
      label: { hi: 'राष्ट्रीय साइबर पोर्टल पर जाएं', en: 'Visit Cyber Crime Portal' },
      url: 'https://cybercrime.gov.in',
    },
  },
  {
    id: 'qr-code-upi',
    category: 'cyber',
    iconName: 'QrCode',
    severity: 'warning',
    badge: {
      hi: 'पैसा पाने का धोखा',
      en: 'Payment Trap',
    },
    title: {
      hi: 'क्यूआर कोड (QR Code) व UPI "पैसे पाने" का फ्रॉड',
      en: 'QR Code & UPI "Money Receiving" Scam',
    },
    summary: {
      hi: 'खाते में पैसे भेजने के बहाने QR कोड स्कैन करवाकर या PIN डलवाकर खाते से पैसे उड़ाना।',
      en: 'Tricking victims into scanning QR codes or entering UPI PINs under the pretext of receiving money.',
    },
    trapModus: {
      hi: 'ओएलएक्स पर सामान बेचने या दुकान पर पेमेंट के समय खरीदार कहता है: "मैंने आपको ₹15,000 भेज दिए हैं। आप यह QR कोड स्कैन करके अपना UPI PIN डाल दीजिए, पैसे सीधे आपके खाते में जमा हो जाएंगे।" जैसे ही आप पिन डालते हैं, पैसे आने के बजाय आपके खाते से कट जाते हैं।',
      en: 'While selling used items or collecting shop payments, a scammer sends a QR code claiming: "I have transferred ₹15,000. Just scan this QR code and type your UPI PIN to claim the funds." The moment you enter your PIN, money is debited from your account instead of credited.',
    },
    strictDonts: {
      hi: [
        'सुनहरा नियम: पैसे प्राप्त (Receive) करने के लिए कभी भी UPI PIN डालने की जरूरत नहीं होती!',
        'किसी अनजान व्यक्ति द्वारा भेजा गया QR कोड कभी भी पैसे लेने के लिए स्कैन न करें।',
      ],
      en: [
        'Golden Rule: Entering a UPI PIN is ONLY required to SEND money, NEVER to RECEIVE money.',
        'Never scan an unsolicited QR code sent by an unknown buyer to receive payments.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'पैसे आने पर बैंक का सीधा क्रेडिट SMS आता है, पिन नहीं मांगा जाता।',
        'यदि कोई पिन डालने को कहे, तो समझ जाएं कि वह ठग है।',
      ],
      en: [
        'When money is credited, you simply receive a bank SMS; no user action is needed.',
        'Anyone instructing you to enter a PIN to receive funds is 100% committing fraud.',
      ],
    },
    recoverySteps: {
      hi: [
        'तुरंत अपने बैंक ऐप या कस्टमर केयर से UPI सर्विस डी-रजिस्टर / ब्लॉक करें।',
        'ट्रांजेक्शन यूटीआर (UTR) नंबर और मैसेज का स्क्रीनशॉट लेकर 1930 पर रिपोर्ट करें।',
      ],
      en: [
        'Block or de-register your UPI profile immediately via your official bank app.',
        'Collect the UTR transaction number and call 1930 to freeze the beneficiary account.',
      ],
    },
    actionCall: {
      label: { hi: 'हेल्पलाइन 1930 डायल करें', en: 'Call Helpline 1930' },
      phone: '1930',
    },
  },
  {
    id: 'part-time-job',
    category: 'cyber',
    iconName: 'Briefcase',
    severity: 'warning',
    badge: {
      hi: 'टास्क व निवेश घोटाला',
      en: 'Task & Investment Trap',
    },
    title: {
      hi: 'पार्ट-टाइम जॉब / टेलीग्राम टास्क / क्रिप्टो फ्रॉड',
      en: 'Work-from-Home & Telegram Task Investment Scam',
    },
    summary: {
      hi: 'घर बैठे यूट्यूब लाइक करने या रेटिंग देने के नाम पर लाखों रुपये निवेश करवाकर ठगना।',
      en: 'Luring victims with small task payouts before stealing lakhs via fake investment tasks.',
    },
    trapModus: {
      hi: 'मैसेज आता है: "घर बैठे यूट्यूब वीडियो लाइक करें या होटल रिव्यू दें और रोज ₹2,000 से ₹5,000 कमाएं।" विश्वास जीतने के लिए पहले 2-3 टास्क पर ₹200 से ₹500 आपके खाते में भेजते हैं। फिर एक वीआईपी टेलीग्राम ग्रुप में जोड़कर ₹50,000 से ₹10 लाख तक "हाई रिटर्न क्रिप्टो टास्क" में लगवा लेते हैं और फिर ब्लॉक कर देते हैं।',
      en: 'Messages advertise: "Earn ₹3,000/day by simply liking YouTube videos or submitting 5-star hotel reviews." To win trust, scammers credit ₹200–₹500 initially. Next, they add you to a Telegram VIP channel and convince you to deposit ₹50,000 to ₹10 Lakhs in fake crypto tasks, then freeze your access.',
    },
    strictDonts: {
      hi: [
        'टेलीग्राम या व्हाट्सएप पर किसी भी "टास्क इन्वेस्टमेंट" में 1 रुपया भी न लगाएं।',
        'बिना मेहनत के भारी मुनाफे के दावों पर कभी भरोसा न करें।',
      ],
      en: [
        'Never invest money into Telegram task groups or unverified trading portals.',
        'Never believe promises of guaranteed 50%–200% returns for rating videos.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'कोई भी वैध कंपनी नौकरी देने के लिए पैसे जमा नहीं करवाती।',
        'यह अंतरराष्ट्रीय साइबर सिंडिकेट द्वारा संचालित संगठित अपराध है।',
      ],
      en: [
        'Legitimate companies never ask job applicants to pay or invest money to work.',
        'These schemes are orchestrated by international cybercrime syndicates.',
      ],
    },
    recoverySteps: {
      hi: [
        'कोई अतिरिक्त "विड्रॉल चार्ज" या "टैक्स" न दें।',
        'टेलीग्राम चैट, आईडी और बैंक ट्रांजेक्शन रिकॉर्ड्स सुरक्षित रखकर 1930 पर दर्ज करवाएं।',
      ],
      en: [
        'Do NOT send any additional "withdrawal tax" or "penalty" fees.',
        'Preserve all Telegram chats, handles, and bank transfer receipts, and report to 1930.',
      ],
    },
    actionCall: {
      label: { hi: 'साइबर सेल में रिपोर्ट करें', en: 'Report to Cyber Cell' },
      phone: '1930',
    },
  },
  {
    id: 'sextortion',
    category: 'cyber',
    iconName: 'Video',
    severity: 'critical',
    badge: {
      hi: 'ब्लैकमेलिंग फ्रॉड',
      en: 'Blackmail Trap',
    },
    title: {
      hi: 'वीडियो कॉल सेक्सटॉर्शन एवं ब्लैकमेल',
      en: 'Video Call Sextortion & Extortion Scam',
    },
    summary: {
      hi: 'अनजान वीडियो कॉल पर स्क्रीन रिकॉर्डिंग कर अश्लील वीडियो बनाकर परिजनों को भेजने की धमकी।',
      en: 'Recording victims on video calls and threatening to distribute edited clips to relatives.',
    },
    trapModus: {
      hi: 'अनजान नंबर से व्हाट्सएप पर वीडियो कॉल आता है। कॉल उठाते ही सामने से अश्लील वीडियो दिखता है और वे आपकी स्क्रीन रिकॉर्ड कर लेते हैं। थोड़ी देर बाद आपका चेहरा जोड़कर बनाया गया आपत्तिजनक वीडियो भेजकर ₹50,000 से ₹2 लाख की मांग की जाती है, और धमकी दी जाती है कि पैसे न देने पर यह वीडियो यूट्यूब, फेसबुक और आपके रिश्तेदारों को भेज दिया जाएगा।',
      en: 'An unknown video call arrives on WhatsApp. Once answered, a pre-recorded explicit video plays while scammers record your face. Minutes later, they send a morphed compromising clip demanding ₹50,000 to ₹2 Lakhs, threatening to broadcast it to your Facebook friends and family.',
    },
    strictDonts: {
      hi: [
        'घबराएं नहीं और डरकर एक भी रुपया ट्रांसफर न करें! एक बार देने पर वे बार-बार मांगेंगे।',
        'आत्मघाती कदम या तनाव न लें — पुलिस पूरी तरह आपके साथ है।',
      ],
      en: [
        'DO NOT PANIC and NEVER pay any ransom! Paying once leads to endless demands.',
        'Do not take extreme stress — police units handle these cases with complete confidentiality.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'पुलिस विशेष हैश-ब्लॉकिंग टूल की मदद से इन वीडियो को इंटरनेट से हटवा देती है।',
        'पीड़ित की पहचान पूरी तरह गोपनीय रखी जाती है।',
      ],
      en: [
        'Police coordinate with platforms to hash and permanently suppress these clips.',
        'The victim identity is kept strictly confidential by law.',
      ],
    },
    recoverySteps: {
      hi: [
        'उस नंबर को तुरंत ब्लॉक करें और कॉल का जवाब न दें।',
        'अपने फेसबुक/इंस्टाग्राम अकाउंट को तुरंत "Private" कर लें।',
        'चित्तौड़गढ़ साइबर थाना प्रभारी (97833-11422) या 1930 पर तुरंत संपर्क करें।',
      ],
      en: [
        'Block the offending number immediately and refuse all communications.',
        'Switch all your social media accounts (Facebook, Instagram) to Private.',
        'Contact Chittorgarh Cyber Police Station directly at 97833-11422 or dial 1930.',
      ],
    },
    actionCall: {
      label: { hi: 'साइबर थाना चित्तौड़गढ़ (सीधा संपर्क)', en: 'Cyber Thana Chittorgarh (Direct)' },
      phone: '9783311422',
    },
  },
  {
    id: 'screen-share',
    category: 'cyber',
    iconName: 'Monitor',
    severity: 'warning',
    badge: {
      hi: 'रिमोट एक्सेस धोखा',
      en: 'Remote Access Fraud',
    },
    title: {
      hi: 'AnyDesk / TeamViewer स्क्रीन-शेयरिंग फ्रॉड',
      en: 'AnyDesk / TeamViewer Screen-Sharing Fraud',
    },
    summary: {
      hi: 'कस्टमर केयर बनकर AnyDesk या QuickSupport ऐप डाउनलोड करवाकर फोन को हैक करना।',
      en: 'Impersonating customer support to gain full remote control of your smartphone.',
    },
    trapModus: {
      hi: 'गूगल से निकाले गए फर्जी बैंक, गैस एजेंसी या कोरियर कस्टमर केयर नंबर पर जब आप कॉल करते हैं, तो वे कहते हैं: "आपके रिफंड के लिए Play Store से AnyDesk या TeamViewer ऐप डाउनलोड करें।" जैसे ही आप 9 अंकों का कोड देते हैं, आपके पूरे मोबाइल की स्क्रीन उनके पास चली जाती है और वे आपके बैंक खाते से पैसे निकाल लेते हैं।',
      en: 'Victims searching for courier, bank, or utility helpline numbers on Google call fake listings. The fake executive claims: "To process your refund, please install AnyDesk / QuickSupport from the Play Store." Once you share the 9-digit session code, they view your screen, watch you enter passwords, and siphon funds.',
    },
    strictDonts: {
      hi: [
        'किसी भी कस्टमर केयर के कहने पर कोई रिमोट कंट्रोल ऐप (AnyDesk, TeamViewer, RustDesk) इंस्टॉल न करें।',
        'कभी भी अपना 9 अंकों का स्क्रीन शेयरिंग कोड किसी से साझा न करें।',
      ],
      en: [
        'Never install screen-sharing software (AnyDesk, TeamViewer, RustDesk) on instructions from support staff.',
        'Never share any 9-digit remote access session code with anyone.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'बैंक या कोई भी वैध संस्था कभी भी ग्राहकों से स्क्रीन-शेयरिंग ऐप डाउनलोड नहीं करवाती।',
      ],
      en: [
        'No authorized bank or company ever instructs customers to download remote-access apps.',
      ],
    },
    recoverySteps: {
      hi: [
        'तुरंत मोबाइल डेटा बंद करें और उस रिमोट ऐप को अनइंस्टॉल करें।',
        'अपने बैंक को तुरंत कॉल कर खाता और यूपीआई फ्रीज करवाएं।',
      ],
      en: [
        'Turn off internet connectivity immediately and uninstall the remote control app.',
        'Contact your bank immediately to freeze your debit card and internet banking.',
      ],
    },
    actionCall: {
      label: { hi: 'हेल्पलाइन 1930', en: 'Helpline 1930' },
      phone: '1930',
    },
  },
  {
    id: 'instant-loan',
    category: 'cyber',
    iconName: 'Coins',
    severity: 'warning',
    badge: {
      hi: 'अवैध लोन ऐप अलर्ट',
      en: 'Illegal Loan Trap',
    },
    title: {
      hi: 'फर्जी इंस्टेंट लोन ऐप्स व ब्लैकमेल',
      en: 'Instant Predatory Loan Apps & Harassment',
    },
    summary: {
      hi: '2 मिनट में बिना कागजात लोन देने वाली चीनी ऐप्स द्वारा फोटो व कॉन्टैक्ट्स चुराकर वसूली करना।',
      en: 'Chinese loan apps accessing private galleries and contacts to extort exorbitant sums.',
    },
    trapModus: {
      hi: 'बिना किसी दस्तावेज के ₹5,000 का तुरंत लोन देने वाली फर्जी ऐप्स। इंस्टॉल होते ही ये आपकी पूरी फोन बुक और गैलरी की तस्वीरें अपने सर्वर पर कॉपी कर लेती हैं। 7 दिन बाद भारी ब्याज जोड़कर ₹25,000 मांगते हैं और पैसे न देने पर परिजनों व दोस्तों को गंदी फोटो भेजकर बदनाम करने की धमकी देते हैं।',
      en: 'Predatory apps promise instant ₹5,000 loans without verification. Upon installation, they steal your entire contact book and photo gallery. Within a week, recovery agents demand 300% interest and threaten to circulate morphed photos to all your contacts.',
    },
    strictDonts: {
      hi: [
        'सोशल मीडिया विज्ञापनों से कोई भी अनवेरिफाइड लोन ऐप डाउनलोड न करें।',
        'ऐप्स को अपनी फोटो गैलरी या कॉन्टैक्ट्स की परमिशन न दें।',
      ],
      en: [
        'Never install unverified lending applications from social media ads or APK links.',
        'Never grant photo gallery or contact permissions to finance utilities.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'केवल भारतीय रिजर्व बैंक (RBI) द्वारा मान्यता प्राप्त NBFC या बैंकों से ही लोन लें।',
        'अवैध वसूली एजेंटों के खिलाफ BNS में सख्त कानूनी दंडात्मक प्रावधान हैं।',
      ],
      en: [
        'Only borrow from RBI-registered banks and recognized NBFCs.',
        'Harassment and extortion by illegal recovery agents are severe criminal offenses under BNS.',
      ],
    },
    recoverySteps: {
      hi: [
        'ऐप को तुरंत अनइंस्टॉल करें और फोन की परमिशन सेटिंग्स रीसेट करें।',
        'ब्लैकमेलिंग की कॉल रिकॉर्डिंग व चैट लेकर 1930 और साइबर पोर्टल पर शिकायत दें।',
      ],
      en: [
        'Uninstall the app immediately and revoke device permissions.',
        'Preserve extortion audio recordings and submit a complaint on cybercrime.gov.in and dial 1930.',
      ],
    },
    actionCall: {
      label: { hi: 'राष्ट्रीय साइबर पोर्टल', en: 'National Cyber Portal' },
      url: 'https://cybercrime.gov.in',
    },
  },
  {
    id: 'sim-swap',
    category: 'cyber',
    iconName: 'Smartphone',
    severity: 'warning',
    badge: {
      hi: 'सिम व केवाईसी फ्रॉड',
      en: 'SIM & KYC Scam',
    },
    title: {
      hi: 'सिम स्वैप एवं फर्जी बैंक KYC एक्सपायरी',
      en: 'SIM Swap & Fake Bank KYC Expiry Scam',
    },
    summary: {
      hi: 'बैंक खाता या सिम बंद होने का फर्जी डर दिखाकर लिंक पर क्लिक करवाना या सिम क्लोन करना।',
      en: 'Sending phishing links threatening bank suspension to capture net banking credentials.',
    },
    trapModus: {
      hi: 'संदेश आता है: "प्रिय ग्राहक, आपका बैंक खाता आज रात 12 बजे बंद हो जाएगा क्योंकि आपकी KYC अधूरी है। तुरंत इस लिंक पर क्लिक कर आधार नंबर व ओटीपी दर्ज करें।" जैसे ही आप लिंक पर डिटेल्स भरते हैं, आपका पूरा बैंक खाता खाली हो जाता है।',
      en: 'An urgent SMS reads: "Dear Customer, your bank account will be suspended today due to pending KYC. Update immediately at [fake-link]." Entering your credentials on this phishing portal hands full account control to criminals.',
    },
    strictDonts: {
      hi: [
        'एसएमएस में आए किसी भी लिंक पर अपनी बैंक आईडी, पासवर्ड या ओटीपी न डालें।',
        'बैंक कभी भी एसएमएस लिंक से ऑनलाइन KYC अपडेट करने का दबाव नहीं बनाते।',
      ],
      en: [
        'Never enter your net banking password, PIN, or OTP on SMS web links.',
        'Banks never demand online KYC submission through unofficial SMS URLs.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'KYC संबंधित किसी भी कार्य के लिए केवल अपनी बैंक शाखा या आधिकारिक बैंक ऐप का उपयोग करें।',
      ],
      en: [
        'Always visit your designated bank branch or official bank mobile application for KYC updates.',
      ],
    },
    recoverySteps: {
      hi: [
        'यदि गलती से पासवर्ड दर्ज कर दिया है तो तुरंत बैंक को कॉल कर नेटबैंकिंग ब्लॉक कराएं।',
        'यदि आपके सिम का नेटवर्क अचानक गायब हो जाए, तो तुरंत टेलीकॉम ऑपरेटर से संपर्क करें।',
      ],
      en: [
        'Call your bank helpline immediately to block digital banking if credentials were submitted.',
        'If your mobile SIM abruptly loses all cellular reception, contact your telecom provider immediately.',
      ],
    },
    actionCall: {
      label: { hi: 'हेल्पलाइन 1930', en: 'Helpline 1930' },
      phone: '1930',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // ── WOMEN SAFETY & SUPPORT (5 TOPICS) ──
  // ─────────────────────────────────────────────────────────────
  {
    id: 'stalking-harassment',
    category: 'women',
    iconName: 'UserX',
    severity: 'critical',
    badge: {
      hi: 'कानूनी अधिकार एवं सुरक्षा',
      en: 'Legal Rights & Protection',
    },
    title: {
      hi: 'पीछा करना, छेड़छाड़ एवं अवांछित कॉल/मैसेज',
      en: 'Stalking, Harassment & Obscene Phone Calls',
    },
    summary: {
      hi: 'स्कूल, कॉलेज, कोचिंग या दफ्तर आते-जाते समय पीछा करने या फोन पर परेशान करने पर त्वरित पुलिस कार्रवाई।',
      en: 'Rapid police response for women facing stalking, street harassment, or obscene messages.',
    },
    trapModus: {
      hi: 'किसी मनचले द्वारा रास्ते में लगातार पीछा करना, फब्तियां कसना या अलग-अलग नंबरों से कॉल व व्हाट्सएप मैसेज करके मानसिक रूप से प्रताड़ित करना।',
      en: 'A stalker trailing a woman along her route to school, coaching, or work, or repeatedly harassing her with anonymous calls, social media texts, and threats.',
    },
    strictDonts: {
      hi: [
        'अपराध को चुपचाप न सहें — चुप्पी से अपराधियों के हौसले बढ़ते हैं।',
        'बिना पुलिस सहायता के अकेले किसी एकांत स्थान पर आरोपी का सामना न करें।',
      ],
      en: [
        'Never suffer in silence — silence emboldens offenders.',
        'Never confront an aggressive stalker in isolated areas without alerting police or family.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'भारतीय न्याय संहिता (BNS) की धारा 78 के तहत किसी महिला का पीछा करना गैर-जमानती अपराध है।',
        'महिला गरिमा हेल्पलाइन 1090 पर शिकायत करने पर पीड़िता की पहचान 100% गोपनीय रखी जाती है।',
        'चित्तौड़गढ़ पुलिस की निर्भया स्क्वाड (महिला पुलिस टीम) भीड़भाड़ वाले स्थानों पर तैनात रहती है।',
      ],
      en: [
        'Under Section 78 of the Bharatiya Nyaya Sanhita (BNS), stalking is a non-bailable cognizable offense.',
        'Reporting to the 1090 Garima Helpline keeps the complainant identity strictly anonymous.',
        'Chittorgarh Police Nirbhaya Squad (women patrol team) operates across major public hubs.',
      ],
    },
    recoverySteps: {
      hi: [
        'तत्काल महिला गरिमा हेल्पलाइन 1090 पर कॉल करें (24 घंटे निःशुल्क सेवा)।',
        'अवांछित कॉल व मैसेज के स्क्रीनशॉट और नंबर सुरक्षित रखें।',
        'आपात स्थिति में सीधे 112 डायल करें — पुलिस वैन तुरंत आपके पास पहुंचेगी।',
      ],
      en: [
        'Dial the 1090 Garima Women Helpline immediately (24/7 toll-free).',
        'Preserve all incoming call logs, SMS records, and screenshots as evidence.',
        'Dial 112 immediately in any critical emergency — police interceptors will arrive rapidly.',
      ],
    },
    actionCall: {
      label: { hi: 'महिला हेल्पलाइन 1090 डायल करें', en: 'Dial Women Helpline 1090' },
      phone: '1090',
    },
  },
  {
    id: 'cyber-women',
    category: 'women',
    iconName: 'Image',
    severity: 'critical',
    badge: {
      hi: 'साइबर सुरक्षा व निजता',
      en: 'Privacy & Cyber Defense',
    },
    title: {
      hi: 'सोशल मीडिया पर फोटो दुरुपयोग / फर्जी प्रोफाइल / डीपफेक',
      en: 'Social Media Photo Misuse, Impersonation & Deepfakes',
    },
    summary: {
      hi: 'तस्वीरों को एडिट कर फर्जी आईडी बनाना, अश्लील टिप्पणी करना या एआई डीपफेक से बदनाम करने की साजिश।',
      en: 'Legal remedies against morphing photos, creating fake social profiles, or deepfake extortion.',
    },
    trapModus: {
      hi: 'सोशल मीडिया (इंस्टाग्राम, फेसबुक) से किसी महिला की सामान्य तस्वीरें चुराकर फर्जी अकाउंट बनाना, आपत्तिजनक कैप्शन लिखना या एआई टूल्स से डीपफेक वीडियो बनाकर ब्लैकमेल करना।',
      en: 'Stealing personal photos from public profiles to create vulgar fake accounts, posting abusive comments, or fabricating AI deepfakes to defame and intimidate women.',
    },
    strictDonts: {
      hi: [
        'घबराकर आरोपी को कोई पैसा न दें।',
        'सबूत (स्क्रीनशॉट/लिंक) लिए बिना सोशल मीडिया चैट को डिलीट न करें।',
      ],
      en: [
        'Never succumb to extortion demands or transfer money.',
        'Do not delete messages or the profile URL before securing clear screenshots as proof.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'आईटी एक्ट (IT Act 66E, 67A) और BNS के तहत यह गंभीर दंडात्मक अपराध है जिसमें जेल व भारी जुर्माने का प्रावधान है।',
        'साइबर पोर्टल cybercrime.gov.in पर "महिला व बच्चों के विरुद्ध अपराध" के लिए विशेष प्राथमिकता सेल है।',
      ],
      en: [
        'Stringent provisions exist under IT Act (Sections 66E, 67A) and BNS with mandatory imprisonment.',
        'The National Cyber Portal maintains a prioritized cell dedicated to crimes against women.',
      ],
    },
    recoverySteps: {
      hi: [
        'उस फर्जी प्रोफाइल का पूरा वेब लिंक (URL) और स्क्रीनशॉट सेव करें।',
        'सीधे चित्तौड़गढ़ साइबर पुलिस थाने (97833-11422 / pscybercgh@gmail.com) पर शिकायत दें।',
        'cybercrime.gov.in पर रिपोर्ट दर्ज करें — पुलिस संबंधित सोशल मीडिया कंपनी से प्रोफाइल हटवाती है।',
      ],
      en: [
        'Save the full URL and screenshots of the offending account immediately.',
        'Contact the Chittorgarh Cyber Police Station directly at 97833-11422 or pscybercgh@gmail.com.',
        'Submit a report on cybercrime.gov.in to initiate takedown requests with the platform.',
      ],
    },
    actionCall: {
      label: { hi: 'साइबर थाना चित्तौड़गढ़ (सीधा संपर्क)', en: 'Cyber Thana Chittorgarh' },
      phone: '9783311422',
    },
  },
  {
    id: 'domestic-violence',
    category: 'women',
    iconName: 'Home',
    severity: 'warning',
    badge: {
      hi: 'सपोर्ट व परामर्श',
      en: 'Support & Counseling',
    },
    title: {
      hi: 'घरेलू हिंसा एवं प्रताड़ना निवारण',
      en: 'Domestic Violence & Family Harassment Support',
    },
    summary: {
      hi: 'पारिवारिक या वैवाहिक प्रताड़ना के मामलों में पुलिस महिला सेल एवं कानूनी सलाह केंद्र द्वारा सहायता।',
      en: 'Institutional support, legal aid, and counseling for women facing domestic abuse.',
    },
    trapModus: {
      hi: 'ससुराल या परिवार में महिला के साथ शारीरिक, मानसिक, आर्थिक प्रताड़ना या दहेज को लेकर उत्पीड़न करना।',
      en: 'Physical, emotional, or financial harassment and domestic abuse within marital or domestic relationships.',
    },
    strictDonts: {
      hi: [
        'गंभीर शारीरिक हिंसा या जान के खतरे को नजरअंदाज न करें।',
        'कानूनी अधिकारों की जानकारी के बिना किसी दबाव में समझौता न करें।',
      ],
      en: [
        'Never ignore physical assault or threats to personal safety.',
        'Do not accept unfair terms under intimidation without consulting legal counsel or police counselors.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'घरेलू हिंसा से महिला संरक्षण अधिनियम (DV Act) के तहत महिला को निवास, भरण-पोषण और सुरक्षा का पूर्ण अधिकार है।',
        'चित्तौड़गढ़ पुलिस में अतिरिक्त पुलिस अधीक्षक की अध्यक्षता में विशेष "महिला अपराध अन्वेषण सेल (SIUCAW)" कार्यरत है।',
        'कलेक्ट्रेट/एसपी परिसर में "महिला सुरक्षा एवं सलाह केंद्र (MSSK)" में निःशुल्क परामर्श उपलब्ध है।',
      ],
      en: [
        'The Protection of Women from Domestic Violence Act guarantees residence, maintenance, and protection orders.',
        'Chittorgarh Police maintains a dedicated SIUCAW unit headed by an Additional Superintendent of Police.',
        'A Women Counseling Center (MSSK) operates inside the SP Office campus providing confidential guidance.',
      ],
    },
    recoverySteps: {
      hi: [
        'महिला अन्वेषण सेल (Addl. SP SIUCAW, चित्तौड़गढ़) के सीयूजी नंबर 94142-94206 पर संपर्क करें।',
        'राजस्थान महिला हेल्पलाइन 181 पर कॉल कर कानूनी सहायता व परामर्श प्राप्त करें।',
        'किसी भी आपात स्थिति में तुरंत 112 डायल करें।',
      ],
      en: [
        'Contact the SIUCAW Women Cell (Addl. SP Chittorgarh) directly at 94142-94206.',
        'Dial Rajasthan Women Helpline 181 for medical aid, shelter home, and legal counseling.',
        'In any life-threatening situation, dial 112 for instantaneous police arrival.',
      ],
    },
    actionCall: {
      label: { hi: 'SIUCAW महिला सेल चित्तौड़गढ़ (Addl. SP)', en: 'SIUCAW Women Cell Chittorgarh' },
      phone: '9414294206',
    },
  },
  {
    id: 'posh-workplace',
    category: 'women',
    iconName: 'Building',
    severity: 'info',
    badge: {
      hi: 'कार्यस्थल अधिकार',
      en: 'Workplace Rights',
    },
    title: {
      hi: 'कार्यस्थल पर यौन उत्पीड़न निवारण (POSH Act)',
      en: 'Prevention of Sexual Harassment at Workplace (POSH)',
    },
    summary: {
      hi: 'दफ्तरों, निजी कंपनियों या संस्थानों में महिला कर्मचारियों के सम्मान व सुरक्षित माहौल की कानूनी गारंटी।',
      en: 'Mandatory statutory safeguards protecting women against harassment in professional environments.',
    },
    trapModus: {
      hi: 'कार्यस्थल पर किसी सहकर्मी या वरिष्ठ अधिकारी द्वारा अवांछित शारीरिक स्पर्श, अनुचित टिप्पणियां, पदोन्नति के बदले अनैतिक मांग या भय का माहौल बनाना।',
      en: 'Unwelcome physical contact, sexually colored remarks, or implicit threats affecting employment or promotion.',
    },
    strictDonts: {
      hi: [
        'नौकरी खोने के डर से उत्पीड़न को नजरअंदाज न करें।',
        'लिखित साक्ष्यों (ईमेल, मैसेज) को नष्ट न करें।',
      ],
      en: [
        'Never tolerate misconduct out of fear of employment retaliation.',
        'Never delete written communications, emails, or chat logs documenting inappropriate behavior.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'हर संस्थान (10 या अधिक कर्मचारियों वाले) में कानूनी रूप से आंतरिक शिकायत समिति (ICC) होना अनिवार्य है।',
        'जांच के दौरान पीड़िता के तबादले या छुट्टी का अधिकार कानून द्वारा सुरक्षित है।',
      ],
      en: [
        'Every organization with 10 or more employees must mandatorily maintain an Internal Complaints Committee (ICC).',
        'The law safeguards complainants from retaliation and permits interim leave during inquiry.',
      ],
    },
    recoverySteps: {
      hi: [
        'घटना की तारीख और साक्ष्य के साथ संस्थान की आंतरिक शिकायत समिति (ICC) को लिखित शिकायत दें।',
        'यदि संस्थान सुनवाई न करे तो जिला कलेक्टर कार्यालय / महिला अधिकारिता विभाग या स्थानीय थाने में शिकायत दर्ज कराएं।',
      ],
      en: [
        'Submit a dated written complaint with evidence to your organization’s Internal Complaints Committee (ICC).',
        'If unaddressed, lodge an official complaint with the Local Complaints Committee (LCC) or the police.',
      ],
    },
    actionCall: {
      label: { hi: 'महिला गरिमा हेल्पलाइन 1090', en: 'Women Garima Helpline 1090' },
      phone: '1090',
    },
  },
  {
    id: 'emergency-sos',
    category: 'women',
    iconName: 'AlertCircle',
    severity: 'critical',
    badge: {
      hi: 'आपातकालीन सहायता',
      en: '24/7 Emergency SOS',
    },
    title: {
      hi: 'सार्वजनिक स्थलों पर आपात सुरक्षा एवं महिला डेस्क',
      en: 'Public Emergency Response & Thana Mahila Desk',
    },
    summary: {
      hi: 'अकेले सफर करते समय असुरक्षा, रात में मदद की आवश्यकता या थाने पर महिला पुलिसकर्मी से सीधी सहायता।',
      en: 'Immediate police intervention when traveling alone or visiting police stations.',
    },
    trapModus: {
      hi: 'रात के समय बस स्टैंड, रेलवे स्टेशन या सुनसान सड़क पर किसी असामाजिक तत्व द्वारा पीछा या डराने की स्थिति।',
      en: 'Feeling unsafe while traveling alone at night or encountering anti-social elements in public transit hubs.',
    },
    strictDonts: {
      hi: [
        'खतरे का आभास होने पर सुनसान या अंधेरे रास्तों पर न जाएं — तुरंत भीड़भाड़ वाली दुकान या पेट्रोल पंप की ओर बढ़ें।',
      ],
      en: [
        'Never walk into unlit or isolated lanes when sensing danger; move towards open shops or fuel stations.',
      ],
    },
    legalTruthOrDos: {
      hi: [
        'चित्तौड़गढ़ जिले के प्रत्येक पुलिस थाने में 24 घंटे "महिला हेल्प डेस्क" संचालित है जहां महिला पुलिसकर्मी उपलब्ध रहती हैं।',
        'डायल 112 पर कॉल करने पर जीपीएस ट्रैक्ड पीसीआर गाड़ी तुरंत आपकी लाइव लोकेशन पर पहुंचती है।',
      ],
      en: [
        'Every police station in Chittorgarh operates a 24/7 dedicated "Women Help Desk" staffed by female officers.',
        'Dialing 112 automatically dispatches GPS-monitored police patrol vehicles directly to your coordinates.',
      ],
    },
    recoverySteps: {
      hi: [
        'सीधे 112 डायल करें या अपने फोन से लाइव लोकेशन परिजनों से साझा करें।',
        'चित्तौड़गढ़ जिला पुलिस कंट्रोल रूम 01472-240055 पर तुरंत सूचना दें।',
      ],
      en: [
        'Dial 112 immediately and broadcast your live GPS location to trusted emergency contacts.',
        'Call the Chittorgarh Police Control Room directly at 01472-240055 for instantaneous dispatch.',
      ],
    },
    actionCall: {
      label: { hi: 'आपातकाल 112 डायल करें', en: 'Dial Police Emergency 112' },
      phone: '112',
    },
  },
];
