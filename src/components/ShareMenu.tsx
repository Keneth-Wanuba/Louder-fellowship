import React, { useState } from 'react';
import { MessageCircle, Facebook, Twitter, Send, X, Link, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Devotion } from '../pages/Devotions';
import { getTodayReminder } from '../constants';

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  devotion: Devotion;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ isOpen, onClose, devotion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.origin + '/devotions';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShareTo = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram') => {
    // Determine the base URL for devotions
    // If the devotion has an ID, we might want to link to a specific path if implemented
    // But based on the current app structure, devotions seem to be on the /devotions page
    // We'll use the origin + /devotions and maybe the title as a hash or param if needed
    // However, the current app doesn't seem to have individual devotion routes like /devotions/:id
    // So we link to the devotions page.
    const url = window.location.origin + '/devotions';
    const reminder = getTodayReminder();
    
    // Create formatted text with emojis for a better sharing experience
    const titleText = `📖 *Theme:* ${devotion.title}`;
    const scriptureText = `📜 *Scripture:* ${devotion.scripture}`;
    const authorText = `✍️ *Author:* ${devotion.author || 'Prophet Ezekiel Kayondo'}`;
    const programText = `🔔 *Today's Program:* ${reminder}`;
    
    const baseText = `${titleText}\n${scriptureText}\n${authorText}\n\n`;
    const footer = `\n\n${programText}\n\nRead more at: ${url}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp': {
        // WhatsApp allows quite a lot of text. We'll include most of it.
        const contentLimit = 2000;
        const content = devotion.content.length > contentLimit 
          ? devotion.content.substring(0, contentLimit) + "..." 
          : devotion.content;
        const fullMessage = `${baseText}${content}${footer}`;
        shareUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        break;
      }
      case 'facebook': {
        // Facebook sharer ignores the 'text' param usually, so we just provide the link.
        // The display will depend on Open Graph tags.
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      }
      case 'twitter': {
        // Twitter/X has a strict 280 char limit.
        // We'll only include the title, scripture (shortened if needed), author and link.
        const twitterTitle = `📖 ${devotion.title}`;
        const twitterScripture = `📜 ${devotion.scripture.length > 50 ? devotion.scripture.substring(0, 47) + '...' : devotion.scripture}`;
        const twitterBody = `${twitterTitle}\n${twitterScripture}\n${authorText.split('*')[2]?.trim() || devotion.author}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterBody)}&url=${encodeURIComponent(url)}`;
        break;
      }
      case 'telegram': {
        // Telegram allows good length text as well.
        const contentLimit = 1500;
        const content = devotion.content.length > contentLimit 
          ? devotion.content.substring(0, contentLimit) + "..." 
          : devotion.content;
        const fullMessage = `${baseText}${content}${footer}`;
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fullMessage)}`;
        break;
      }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="font-serif font-black text-royal-blue text-xl">Share Word</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-1">Spread the gospel</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleShareTo('whatsapp')}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all group border border-transparent hover:border-green-400"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
              </button>
              
              <button 
                onClick={() => handleShareTo('facebook')}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group border border-transparent hover:border-blue-400"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
              </button>
              
              <button 
                onClick={() => handleShareTo('twitter')}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all group border border-transparent hover:border-slate-400"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Twitter / X</span>
              </button>
              
              <button 
                onClick={() => handleShareTo('telegram')}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all group border border-transparent hover:border-sky-400"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Telegram</span>
              </button>
            </div>

            <div className="mt-4">
              <button 
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${
                  copied 
                    ? 'bg-royal-gold/10 border-royal-gold text-royal-gold' 
                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${copied ? 'bg-royal-gold text-white' : 'bg-white'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </span>
                </div>
                {!copied && (
                  <span className="text-[10px] opacity-30 font-mono hidden xs:inline">
                    louder.fellowship/word
                  </span>
                )}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono">
                {devotion.title}
              </p>
              <div className="flex justify-center items-center gap-2">
                <div className="w-2 h-0.5 bg-royal-gold rounded-full" />
                <p className="text-[10px] font-black text-royal-gold uppercase tracking-[0.3em]">Blessed to Bless</p>
                <div className="w-2 h-0.5 bg-royal-gold rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareMenu;
