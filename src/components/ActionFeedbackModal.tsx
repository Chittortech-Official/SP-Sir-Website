import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

export type ModalType = 'confirm' | 'success' | 'danger' | 'info';

export interface ActionFeedbackModalProps {
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

export const ActionFeedbackModal: React.FC<ActionFeedbackModalProps> = ({
  isOpen,
  type,
  title,
  message,
  confirmText = 'Yes, Update',
  cancelText = 'Cancel',
  confirmColor = 'teal',
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (onCancel) onCancel();
        else if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, onClose]);

  if (!isOpen) return null;

  // Determine button color classes
  const getButtonColorClasses = () => {
    switch (confirmColor) {
      case 'rose':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200';
      case 'emerald':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200';
      case 'navy':
        return 'bg-[#0B1728] hover:bg-[#162A4A] text-white shadow-slate-300';
      case 'teal':
      default:
        return 'bg-[#007074] hover:bg-[#005B5E] text-white shadow-teal-100';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        if (!isLoading) {
          if (type === 'success' && onClose) onClose();
          else if (onCancel) onCancel();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100 relative text-center transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: '0.2s' }}
      >
        {/* Optional close icon in corner */}
        {type !== 'success' && !isLoading && (
          <button 
            type="button" 
            onClick={onCancel || onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ── TOP CIRCULAR ICON ── */}
        <div className="flex justify-center mb-5">
          {type === 'confirm' && (
            <div className="w-20 h-20 rounded-full border-[3.5px] border-amber-300 flex items-center justify-center bg-amber-50/40">
              <span className="text-4xl font-extrabold text-amber-500 font-sans select-none leading-none">!</span>
            </div>
          )}

          {type === 'danger' && (
            <div className="w-20 h-20 rounded-full border-[3.5px] border-rose-300 flex items-center justify-center bg-rose-50/40">
              <span className="text-4xl font-extrabold text-rose-500 font-sans select-none leading-none">!</span>
            </div>
          )}

          {type === 'success' && (
            <div className="w-20 h-20 rounded-full border-[3.5px] border-emerald-300 flex items-center justify-center bg-emerald-50/40 relative">
              <Check className="w-10 h-10 text-emerald-600 stroke-[2.5] animate-scale-in" />
            </div>
          )}

          {type === 'info' && (
            <div className="w-20 h-20 rounded-full border-[3.5px] border-blue-300 flex items-center justify-center bg-blue-50/40">
              <span className="text-3xl font-extrabold text-blue-500 font-sans select-none">i</span>
            </div>
          )}
        </div>

        {/* ── TITLE ── */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-devanagari tracking-tight leading-snug">
          {title}
        </h3>

        {/* ── SUBTITLE / DESCRIPTION ── */}
        <p className="text-slate-500 font-medium text-xs sm:text-sm mt-2.5 mb-7 font-devanagari leading-relaxed max-w-xs mx-auto">
          {message}
        </p>

        {/* ── ACTION BUTTONS ── */}
        {type === 'success' ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#007074] hover:bg-[#005B5E] text-white font-bold px-10 py-2.5 rounded-xl text-sm shadow-md transition-all active:scale-95 font-devanagari"
            >
              {confirmText || 'OK'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 font-devanagari flex items-center justify-center gap-1.5 ${getButtonColorClasses()} ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              <span>{confirmText}</span>
            </button>

            <button
              type="button"
              onClick={onCancel || onClose}
              disabled={isLoading}
              className="bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all active:scale-95 font-devanagari"
            >
              {cancelText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
