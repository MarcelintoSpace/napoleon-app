
import React, { useState } from 'react';
import { requestPurchase } from '../services/billingService';
import { AppLanguage } from '../types';
import { translations } from '../translations';

interface SubscriptionModalProps {
  lang: AppLanguage;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ lang, onClose, onSubscribe }) => {
  const t = translations[lang];

  const handlePay = () => {
    requestPurchase();
    if (!(window as any).store) {
      setTimeout(() => onSubscribe(), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
        <div className="h-24 bg-[#1a2b48] flex items-center justify-center text-[#d4af37]">
          <h3 className="font-serif text-xl font-bold uppercase tracking-widest">{t.paywallTitle}</h3>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            {t.paywallBody}
          </p>
          
          <button 
            onClick={handlePay}
            className="w-full bg-[#d4af37] text-[#1a2b48] font-black py-4 rounded-xl shadow-lg mb-4 uppercase tracking-widest text-sm"
          >
            {t.subscribeBtn}
          </button>
          
          <button onClick={onClose} className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {t.maybeLater}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
