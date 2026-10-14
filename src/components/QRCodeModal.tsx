import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentUrl = window.location.origin + window.location.pathname;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'SP_Chittorgarh_Jansunwai_QR.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex p-3 rounded-full bg-police-50 text-police-800 mb-3 border border-police-100">
          <QrCode className="w-6 h-6 text-[#1D3557]" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-devanagari">
          आधिकारिक जनसुनवाई QR कोड
        </h3>
        <p className="text-xs text-slate-600 mt-1 font-devanagari">
          नागरिक इस QR कोड को स्कैन करके सीधे आज की जनसुनवाई उपलब्धता देख सकते हैं।
        </p>

        {/* QR Code Graphic Frame */}
        <div 
          ref={qrRef} 
          className="my-5 p-4 bg-white border-2 border-dashed border-[#1D3557] rounded-xl inline-block shadow-inner"
        >
          <QRCodeSVG
            value={currentUrl}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/rajasthan-police-logo.webp',
              x: undefined,
              y: undefined,
              height: 38,
              width: 38,
              excavate: true,
            }}
          />
          <div className="text-[11px] font-bold text-police-900 mt-1 font-devanagari">
            पुलिस अधीक्षक कार्यालय, चित्तौड़गढ़
          </div>
        </div>

        {/* URL Box */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-4 truncate">
          <span className="truncate mr-2 font-mono text-[11px]">{currentUrl}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1 bg-white hover:bg-slate-50 px-2 py-1 rounded text-police-800 font-semibold border border-slate-300 shadow-2xs active:scale-95 transition-all"
            title="लिंक कॉपी करें"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हुआ' : 'कॉपी'}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadSVG}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#0B1728] hover:bg-[#112240] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>पोस्टर हेतु QR डाउनलोड करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
