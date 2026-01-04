
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';
import { generateNapoleonResponse } from '../services/geminiService';
import { translations } from '../translations';

interface ChatWindowProps {
  user: UserProfile;
  onMessageSent: () => boolean;
  onUpgrade: () => void;
  isLimited: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onMessageSent, onUpgrade, isLimited }) => {
  const t = translations[user.language];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: t.welcome,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const canSend = onMessageSent();
    if (!canSend) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await generateNapoleonResponse([...messages, userMsg], user.language);
    
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#faf9f6]">
      <header className="px-6 py-4 bg-[#1a2b48] text-white flex items-center justify-between shadow-xl border-b border-[#d4af37]/40 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-[#d4af37] overflow-hidden bg-white shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&h=200&auto=format&fit=crop" 
              alt="Napoleon Hill" 
              className="w-full h-full object-cover grayscale" 
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg tracking-tight">Napoleon Hill</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-black">Online</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onUpgrade}
          className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
            user.isPremium 
              ? 'bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37]' 
              : 'btn-gold text-[#1a2b48] shimmer'
          }`}
        >
          {!user.isPremium && (
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z"/>
            </svg>
          )}
          {user.isPremium ? t.member : t.upgrade}
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-[#1a2b48] text-white rounded-br-none' : 'bg-white text-[#2d3748] rounded-bl-none border border-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 ml-4">
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {isLimited ? (
          <button 
            onClick={onUpgrade} 
            className="w-full btn-gold text-[#1a2b48] font-black py-5 rounded-2xl shimmer animate-pulse uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C10.8954 17 10 16.1046 10 15C10 13.8954 10.8954 13 12 13C13.1046 13 14 13.8954 14 15C14 16.1046 13.1046 17 12 17ZM18 20V10H6V20H18ZM18 8C19.1046 8 20 8.89543 20 10V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V10C4 8.89543 4.89543 8 6 8H7V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V8H18ZM15 8V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V8H15Z"/>
            </svg>
            {t.unlock}
          </button>
        ) : (
          <div className="flex gap-3 items-center bg-[#f8f9fa] rounded-2xl px-5 py-2.5 border border-gray-100 focus-within:border-[#d4af37]/50 focus-within:bg-white focus-within:shadow-xl transition-all duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent border-none focus:outline-none text-[#1a2b48] text-base py-3 font-medium placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend} 
              className={`p-3.5 rounded-xl transition-all active:scale-90 ${input.trim() ? 'btn-gold text-[#1a2b48]' : 'bg-gray-200 text-gray-400 opacity-50'}`}
              disabled={!input.trim()}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[3]" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
