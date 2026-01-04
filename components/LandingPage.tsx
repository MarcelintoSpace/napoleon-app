
import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { translations } from '../translations';

interface LandingPageProps {
  onStart: (lang: AppLanguage) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [selectedLang, setSelectedLang] = useState<AppLanguage>('en');
  const t = translations[selectedLang];

  const languages: { code: AppLanguage, label: string, flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a2b48] text-[#d4af37] px-8 text-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[100px]"></div>

      <div className="mb-10 relative z-10">
        <div className="w-36 h-36 rounded-full border-4 border-[#d4af37] overflow-hidden bg-white mx-auto shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&h=200&auto=format&fit=crop" 
            alt="Napoleon Hill" 
            className="w-full h-full object-cover grayscale opacity-90 scale-110"
          />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#1a2b48] text-[10px] font-black px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg whitespace-nowrap">
          MASTER MIND
        </div>
      </div>
      
      <div className="relative z-10 max-w-sm">
        <h1 className="font-serif text-4xl font-black mb-3 tracking-tight leading-tight uppercase">
          {t.landingTitle}
        </h1>
        <p className="text-white/60 text-sm mb-12 italic font-light leading-relaxed">
          "{t.landingSubtitle}"
        </p>
      </div>

      {/* Professional Language Picker */}
      <div className="flex justify-center gap-6 mb-12 relative z-10">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setSelectedLang(l.code)}
            className={`group flex flex-col items-center gap-3 transition-all duration-500 ${selectedLang === l.code ? 'scale-110' : 'opacity-30 grayscale blur-[0.5px]'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-all border-2 ${selectedLang === l.code ? 'bg-white border-[#d4af37]' : 'bg-[#1a2b48] border-white/10'}`}>
              {l.flag}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${selectedLang === l.code ? 'text-[#d4af37]' : 'text-white'}`}>
              {l.code}
            </span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => onStart(selectedLang)}
        className="relative z-10 w-full max-w-xs btn-gold text-[#1a2b48] font-black py-5 rounded-2xl shimmer active:scale-95 transition-all hover:brightness-110 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
      >
        <span>{t.ctaStart}</span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"/>
        </svg>
      </button>
      
      <p className="mt-8 text-[9px] text-white/30 uppercase tracking-[0.4em] font-medium relative z-10">
        v1.0.1 • The Science of Success
      </p>
    </div>
  );
};

export default LandingPage;
