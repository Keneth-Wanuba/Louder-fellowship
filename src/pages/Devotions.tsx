import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, Share2, Bookmark, Lightbulb, CheckCircle2, BellRing, Loader2, Facebook, Twitter, MessageCircle, Send, AlertCircle, Heart, Zap, Flame, Sparkles, ThumbsUp } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getTodayReminder } from '../constants';
import ShareMenu from '../components/ShareMenu';

export interface Devotion {
  id: string;
  title: string;
  scripture: string;
  content: string;
  nuggets?: string[];
  date: string;
  author: string;
  reactions?: Record<string, number>;
}

const REACTION_OPTIONS = [
  { type: 'Amen', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { type: 'I receive', icon: <Zap className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { type: 'Hallelujah', icon: <Flame className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { type: 'Glory', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { type: 'ThankYou', icon: <Heart className="w-4 h-4" />, color: 'bg-red-50 text-red-600 border-red-200' },
  { type: 'Point taken', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { type: 'Like', icon: <ThumbsUp className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

export default function Devotions() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, Set<string>>>({}); // devotionId -> Set of reactionTypes
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharingDevotion, setSharingDevotion] = useState<Devotion | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  useEffect(() => {
    fetchDevotions();
    // Load existing reactions from localStorage
    const saved = localStorage.getItem('lf_devotion_user_reactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const reconstructed: Record<string, Set<string>> = {};
        Object.keys(parsed).forEach(id => {
          reconstructed[id] = new Set(parsed[id]);
        });
        setUserReactions(reconstructed);
      } catch (e) {
        console.error("Failed to load saved reactions", e);
      }
    }
  }, []);

  const saveUserReactions = (reactions: Record<string, Set<string>>) => {
    const serializable: Record<string, string[]> = {};
    Object.keys(reactions).forEach(id => {
      serializable[id] = Array.from(reactions[id]);
    });
    localStorage.setItem('lf_devotion_user_reactions', JSON.stringify(serializable));
  };

  const handleReact = async (devotionId: string, reactionType: string) => {
    // Check if user already reacted with this type to this devotion
    if (userReactions[devotionId]?.has(reactionType)) return;

    // Optimistic update
    setDevotions(prev => prev.map(d => {
      if (d.id === devotionId) {
        const currentReactions = { ...(d.reactions || {}) };
        currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
        return { ...d, reactions: currentReactions };
      }
      return d;
    }));

    // Update user reactions local state
    setUserReactions(prev => {
      const next = { ...prev };
      if (!next[devotionId]) next[devotionId] = new Set();
      next[devotionId].add(reactionType);
      saveUserReactions(next);
      return next;
    });

    try {
      await fetch(`/api/devotions/${devotionId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
    } catch (err) {
      console.error("Failed to send reaction to server:", err);
      // We don't necessarily need to rollback for a "like" system, 
      // but in a more strict app we would.
    }
  };

  const fetchDevotions = async () => {
    setIsLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/devotions', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setDevotions(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch devotions');
      }
    } catch (err: any) {
      console.error("Error fetching devotions:", err);
      if (err.name === 'AbortError') {
        setError('The connection timed out after 30 seconds. Please check your internet connection and try again.');
      } else {
        setError('Hallelujah! We encountered a minor technical issue while fetching your spiritual nourishment. Please refresh and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const latestDevotion = devotions[0];
  const olderDevotions = devotions.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-royal-gold/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-royal-gold animate-spin relative z-10" />
        </div>
        <div className="text-center">
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 animate-bounce">Preparing your Word...</p>
          <p className="text-slate-400 text-xs italic">Nourishing your spirit for the day ahead</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-50 max-w-md text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-royal-blue mb-4">Connection Issue</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => fetchDevotions()}
              className="bg-royal-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-royal-blue/20 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Retry Connection
            </button>
            <Link 
              to="/" 
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-royal-blue transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!latestDevotion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <BookOpen className="w-16 h-16 text-slate-200" />
        <h2 className="text-2xl font-serif font-bold text-royal-blue">No devotions found</h2>
        <p className="text-slate-500">Check back later for spiritual nourishment.</p>
        <Link 
          to="/" 
          className="bg-royal-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-royal-gold transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handleShareTo = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram', devotion: Devotion) => {
    const url = window.location.href;
    const reminder = getTodayReminder();
    const boldTitle = `Theme: ${devotion.title}`;
    const boldAuthor = `Author: ${devotion.author || 'Prophet Ezekiel Kayondo'}`;
    const formattedContent = devotion.content.substring(0, 300) + (devotion.content.length > 300 ? '...' : '');
    const programReminder = `Today's Program: ${reminder}`;
    
    const text = `${boldTitle}\n${boldAuthor}\n\n${formattedContent}\n\n${programReminder}`;
    const encodedText = encodeURIComponent(`${text}\n\nRead more: ${url}`);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(boldTitle)}&url=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(boldTitle + '\n' + boldAuthor)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleShare = async (devotion: Devotion) => {
    setIsSharing(true);
    const reminder = getTodayReminder();
    const url = window.location.href;
    
    // Format message as requested
    const boldTitle = `*Theme: ${devotion.title}*`;
    const boldAuthor = `*Author: ${devotion.author || 'Prophet Ezekiel Kayondo'}*`;
    const formattedContent = devotion.content.substring(0, 500) + (devotion.content.length > 500 ? '...' : '');
    const programReminder = `Today's Program: ${reminder}`;
    
    const fullMessage = `${boldTitle}\n${boldAuthor}\n\n${formattedContent}\n\n${programReminder}\n\nRead full devotion: ${url}`;
    const shareTitle = `Today's Word: ${devotion.title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: fullMessage,
          url: url,
        });
      } else {
        // Fallback to WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    } finally {
      setTimeout(() => setIsSharing(false), 800);
    }
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setMessage("thank you for subscribing to our devotion, we'll keep you posted");
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const isEmailValid = validateEmail(email);

  return (
    <>
      <SEO 
        title="Daily Devotions"
        description="Daily spiritual nourishment and words of encouragement from Louder Fellowship. Equip your spirit for the day ahead."
      />
      
      <header className="bg-royal-blue py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1504052434139-0147980ff636?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Daily Devotion</h1>
            <p className="text-royal-gold uppercase tracking-[0.3em] font-bold italic underline decoration-white/30 underline-offset-8">Divine Nourishment</p>
          </motion.div>
        </div>
      </header>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Latest Devotion */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="p-10 md:p-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-5 py-2 bg-royal-gold text-royal-blue rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-royal-gold/20">
                      Latest Word
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Calendar className="w-4 h-4 text-royal-gold" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{latestDevotion.date}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-serif font-black text-royal-blue mb-8 leading-tight">
                    {latestDevotion.title}
                  </h2>
                  
                  <div className="bg-royal-blue/5 p-8 rounded-3xl border-l-[6px] border-royal-gold mb-10">
                    <p className="text-royal-blue font-serif italic text-xl leading-relaxed">
                      {latestDevotion.scripture}
                    </p>
                  </div>
                  
                  <div className="prose prose-lg text-slate-600 max-w-none">
                    <div className="leading-loose markdown-body">
                      <ReactMarkdown>{latestDevotion.content}</ReactMarkdown>
                    </div>
                  </div>

                  {latestDevotion.nuggets && latestDevotion.nuggets.length > 0 && (
                    <div className="mt-12 bg-slate-50 p-8 rounded-3xl border-t-4 border-royal-blue">
                      <h3 className="text-xl font-serif font-black text-royal-blue mb-6 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-royal-gold" /> Spiritual Nuggets
                      </h3>
                      <ul className="space-y-4">
                        {latestDevotion.nuggets.map((nugget, index) => (
                          <li key={index} className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-royal-blue text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                              {index + 1}
                            </span>
                            <p className="text-slate-600 font-medium">{nugget}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reactions Section */}
                  <div className="mt-12 py-8 border-t border-b border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">How did this word bless you today?</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {REACTION_OPTIONS.map((option) => {
                        const count = latestDevotion.reactions?.[option.type] || 0;
                        const hasReacted = userReactions[latestDevotion.id]?.has(option.type);
                        
                        return (
                          <button
                            key={option.type}
                            onClick={() => handleReact(latestDevotion.id, option.type)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 active:scale-95 group/react ${
                              hasReacted 
                                ? `${option.color.split(' ')[0]} ${option.color.split(' ')[1]} border-current shadow-md` 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-royal-blue/30 hover:bg-slate-50 hover:shadow-sm'
                            }`}
                          >
                            <div className={`transition-transform duration-500 ${hasReacted ? 'scale-110' : 'group-hover/react:scale-110 group-hover/react:rotate-6'}`}>
                              {option.icon}
                            </div>
                            <div className="flex flex-col items-start leading-none gap-0.5">
                              <span className="text-[10px] font-black uppercase tracking-widest">{option.type}</span>
                              {count > 0 && (
                                <span className={`text-[10px] font-bold ${hasReacted ? 'opacity-100' : 'opacity-40'}`}>{count}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Today's Program Reminder */}
                  <div className="mt-12 p-8 bg-royal-blue rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-royal-gold/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                      <div className="w-20 h-20 rounded-3xl bg-royal-gold flex items-center justify-center text-royal-blue shadow-xl shadow-royal-gold/20 flex-shrink-0 animate-pulse-slow">
                        <BellRing className="w-10 h-10" />
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h4 className="text-royal-gold font-black uppercase tracking-[0.3em] text-[10px] mb-3">Divine Daily Reminder</h4>
                        <p className="text-2xl font-serif font-black italic leading-tight group-hover:text-royal-gold transition-colors duration-500">
                          {getTodayReminder()}
                        </p>
                      </div>
                      <Link to="/programs" className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-royal-blue border border-white/20 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all whitespace-nowrap shadow-xl">
                        Full Schedule
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col gap-8">
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Share Word:</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setSharingDevotion(latestDevotion); setIsShareMenuOpen(true); }}
                          className="px-6 py-2 bg-royal-blue text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-royal-gold hover:text-royal-blue transition-all shadow-lg flex items-center gap-2 group"
                        >
                          <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Share Now
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-royal-gold flex items-center justify-center text-royal-blue font-black uppercase shadow-inner">
                          {latestDevotion.author.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Written By</p>
                          <p className="text-royal-blue font-black">{latestDevotion.author}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={() => { setSharingDevotion(latestDevotion); setIsShareMenuOpen(true); }}
                          className="h-12 rounded-full bg-slate-50 text-slate-400 hover:text-royal-gold transition-all border border-slate-100 flex items-center gap-2 px-6 hover:bg-white hover:shadow-md"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            More Platforms
                          </span>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:text-royal-blue transition-all border border-slate-100 flex items-center justify-center hover:bg-white hover:shadow-md">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Sidebar: Past Devotions */}
            <div className="space-y-8">
              <div className="bg-royal-blue p-10 rounded-[2rem] text-white">
                <h3 className="text-2xl font-serif font-bold text-royal-gold mb-6">Archive</h3>
                <div className="space-y-6">
                  {olderDevotions.length === 0 ? (
                    <p className="text-white/40 text-sm italic">No older devotions available.</p>
                  ) : (
                    olderDevotions.map((devotion) => (
                      <div key={devotion.id} className="group cursor-pointer">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-white/40 text-xs font-bold">{devotion.date}</p>
                              {devotion.reactions && Object.values(devotion.reactions).reduce((a, b) => a + b, 0) > 0 && (
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-royal-gold bg-white/10 px-2.5 py-1 rounded-full border border-royal-gold/20">
                                  <Sparkles className="w-3 h-3" /> {Object.values(devotion.reactions).reduce((a, b) => a + b, 0)}
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold group-hover:text-royal-gold transition-colors line-clamp-2">
                              {devotion.title}
                            </h4>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSharingDevotion(devotion); setIsShareMenuOpen(true); }}
                            className="p-2 text-white/20 hover:text-royal-gold transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="inline-flex items-center gap-1 text-royal-gold text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read Now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="bg-royal-gold/10 p-10 rounded-[3rem] border-2 border-royal-gold/20 shadow-xl shadow-royal-gold/5">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-royal-blue mb-8 shadow-md border border-royal-gold/20">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-black text-royal-blue mb-4 uppercase tracking-tight italic">Mailing List</h3>
                <p className="text-slate-600 text-sm font-medium mb-8 leading-relaxed">
                  Receive our daily devotionals directly in your inbox every morning at <span className="text-royal-blue font-bold">5:00 AM.</span>
                </p>
                <form className="space-y-3" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-royal-gold/20 focus:ring-2 focus:ring-royal-gold outline-none transition-all disabled:opacity-50"
                    disabled={status === 'loading'}
                  />
                  <button 
                    disabled={!isEmailValid || status === 'loading'}
                    className="w-full bg-royal-blue text-white py-3 rounded-xl font-bold hover:bg-royal-gold hover:text-royal-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Subscribe
                  </button>
                  {status === 'success' && (
                    <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-2">
                      <CheckCircle2 className="w-3 h-3" /> {message}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-[10px] text-red-500 font-bold mt-2">
                      {message}
                    </p>
                  )}
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {sharingDevotion && (
        <ShareMenu 
          isOpen={isShareMenuOpen} 
          onClose={() => setIsShareMenuOpen(false)} 
          devotion={sharingDevotion} 
        />
      )}
    </>
  );
}

