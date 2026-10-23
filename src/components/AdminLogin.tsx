
import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Database, 
  CalendarCheck, 
  ShieldCheck, 
  Headphones, 
  Phone, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToPublic?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // 1. Try Supabase Auth first
      if (isSupabaseConfigured && supabase && cleanEmail) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!error) {
          localStorage.setItem('sp_admin_session', 'active');
          localStorage.setItem('sp_admin_email', cleanEmail);
          onSuccess();
          return;
        }
      }

      // 2. Verified admin credentials fallback
      if (cleanEmail === 'paconfi.branchcgh@gmail.com' && cleanPassword === '123456') {
        localStorage.setItem('sp_admin_session', 'active');
        localStorage.setItem('sp_admin_email', cleanEmail);
        onSuccess();
        return;
      }

      setErrorMsg('अमान्य ईमेल अथवा पासवर्ड! केवल अधिकृत प्रशासनिक ईमेल (paconfi.branchcgh@gmail.com) द्वारा ही लॉगिन मान्य है।');
    } catch (err: any) {
      setErrorMsg('लॉगिन में त्रुटि: ' + (err.message || 'पुनः प्रयास करें'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col justify-between font-sans relative">
      {/* Top Header Bar with Official Admin Branding & Status */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs sticky top-0 z-20 shadow-xs">
        <div className="flex items-center space-x-2 font-bold text-slate-800">
          <img 
            src="/rajasthan-police-logo.webp" 
            alt="Police" 
            className="w-5 h-5 rounded-full object-contain" 
          />
          <span className="font-semibold text-xs text-slate-700">Official Admin Portal</span>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200/90 px-3 py-1 rounded-full text-emerald-800 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Status: <strong>Fully Operational</strong></span>
        </div>
      </div>

      {/* Main Split Content Section */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 lg:py-14 gap-10 lg:gap-16">
        
        {/* LEFT COLUMN: Clean, Elegant Government & Tech Branding on White Background */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-2 bg-white border border-slate-300/80 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-xs">
              <img 
                src="/rajasthan-police-logo.webp" 
                alt="Police" 
                className="w-4 h-4 rounded-full object-contain" 
              />
              <span className="text-[11px] uppercase tracking-wide">RAJASTHAN POLICE</span>
              <span className="text-slate-300">|</span>
              <span className="text-amber-600 text-[11px]">OFFICIAL ADMIN PORTAL</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-300/90 px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-amber-900 shadow-xs">
              <img src="/chittortech_logo.png" alt="ChittorTech" className="w-3.5 h-3.5 object-contain" />
              <span>ChittorTech</span>
              <span className="text-amber-700 font-normal text-[10px]">OFFICIAL DEVELOPER</span>
            </div>
          </div>

          {/* Dev Tag */}
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200 px-3 py-1 rounded-lg">
            <span>&lt;/&gt;</span>
            <span>ENGINEERED BY CHITTORTECH</span>
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Chittorgarh Police <span className="text-amber-500">Admin</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Secure central portal for managing Chittorgarh SP public availability, time slots, alternative public hearing officers, and emergency notices.
            </p>
          </div>

          {/* 4 Feature Cards (Ultra Clean & High Quality) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs flex items-center space-x-3 text-xs font-semibold text-slate-800 hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <span>Real-time Cloud Database Sync</span>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs flex items-center space-x-3 text-xs font-semibold text-slate-800 hover:border-emerald-300 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span>Daily Hearing Status & Schedule</span>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs flex items-center space-x-3 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-all">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>End-to-End SSL Protection</span>
            </div>

            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs flex items-center space-x-3 text-xs font-semibold text-slate-800 hover:border-amber-300 transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <span>24/7 ChittorTech Developer Support</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Login Form Card (KAALA / DARK Form on White Page with Amber Accents) */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-[#0B1728] rounded-3xl p-6 sm:p-8 shadow-2xl text-white border-2 border-slate-800 relative overflow-hidden">
            {/* Top Golden Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Welcome Back</span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Please enter your credentials to access the dashboard.
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#132238] border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-devanagari leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-sans">
                  ADMIN EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#132238] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-sans">
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#132238] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-sans transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>

            {/* NEED HELP? CHITTORTECH SUPPORT BOX */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-[#070F1C] border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-white text-[11px] uppercase tracking-wide">
                    <img src="/chittortech_logo.png" alt="ChittorTech" className="w-4 h-4 object-contain" />
                    <span>NEED HELP? CHITTORTECH SUPPORT</span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    24/7 Priority
                  </span>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+917597451057"
                    className="flex items-center justify-center gap-1.5 bg-[#132238] p-2 rounded-xl border border-slate-700 hover:border-slate-600 font-semibold text-slate-200 text-[11px] transition-colors"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>+91 7597451057</span>
                  </a>

                  <a
                    href="https://wa.me/917597451057?text=Hello%20ChittorTech%20Support%2C%20I%20need%20help%20with%20Chittorgarh%20Police%20Portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 p-2 rounded-xl border border-[#25D366]/30 font-semibold text-[#25D366] text-[11px] transition-colors"
                  >
                    <MessageSquare className="w-3 h-3 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Emails */}
                <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                  <div>
                    Contact: <a href="mailto:contact@chittortech.in" className="text-amber-400 hover:underline font-medium">contact@chittortech.in</a>
                  </div>
                  <div>
                    Business: <a href="mailto:business@chittortech.in" className="text-amber-400 hover:underline font-medium">business@chittortech.in</a>
                  </div>
                </div>

                {/* Visit Portal */}
                <div className="pt-1.5 border-t border-slate-800 text-center">
                  <a
                    href="https://chittortech.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <span>Visit ChittorTech Portal (chittortech.in)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar on White/Light Theme */}
      <div className="bg-white/80 border-t border-slate-200/90 py-3.5 px-6 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Superintendent of Police Office, Chittorgarh • Rajasthan Police
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>Engineered & Maintained by</span>
            <img src="/chittortech_logo.png" alt="ChittorTech" className="w-3.5 h-3.5 object-contain inline" />
            <span className="font-bold text-amber-600">ChittorTech</span>
          </div>
        </div>
      </div>
    </div>
  );
};
