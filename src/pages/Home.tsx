import { ArrowRight, MessageCircle, Phone, Users, ShieldCheck, ShoppingCart, Calendar, Video, Heart, MapPin, Globe, Zap, Church, BookOpen, Award, Star, Quote, Sparkles, Share2, BellRing, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getTodayReminder } from '../constants';
import { Testimony } from './Testimonies';
import { Devotion } from './Devotions';
import ShareMenu from '../components/ShareMenu';
import { buildScriptureReference } from '../utils/devotionScripture';

export default function Home() {
  const [isSharing, setIsSharing] = useState(false);
  const [sharingDevotion, setSharingDevotion] = useState<Devotion | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [currentTestimony, setCurrentTestimony] = useState(0);
  const [direction, setDirection] = useState(0);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [blessed, setBlessed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn("Home data fetch timed out after 10 seconds");
      }, 10000);

      try {
        const [devResp, testResp] = await Promise.all([
          fetch('/api/devotions', { signal: controller.signal }),
          fetch('/api/testimonies/approved', { signal: controller.signal })
        ]);
        
        clearTimeout(timeoutId);
        
        if (devResp.ok && testResp.ok) {
          const devs = await devResp.json();
          const tests = await testResp.json();
          setDevotions(devs);
          setTestimonies(tests);
          
          const initialLikes: Record<string, number> = {};
          tests.forEach((t: Testimony) => initialLikes[t.id] = t.likes || 0);
          setLikes(initialLikes);
        } else {
          throw new Error(`Failed to load data (Devotions: ${devResp.status}, Testimonies: ${testResp.status})`);
        }
      } catch (e: any) {
        console.error("Critical error fetching home data:", e);
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
          console.error("Home data fetch timed out");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBlessed = (id: string) => {
    if (blessed.has(id)) return;
    
    setBlessed(prev => new Set(prev).add(id));
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const approvedTestimonies = testimonies;

  const nextTestimony = () => {
    if (approvedTestimonies.length === 0) return;
    setDirection(1);
    setCurrentTestimony((prev) => (prev + 1) % approvedTestimonies.length);
  };

  const prevTestimony = () => {
    if (approvedTestimonies.length === 0) return;
    setDirection(-1);
    setCurrentTestimony((prev) => (prev - 1 + approvedTestimonies.length) % approvedTestimonies.length);
  };

  useEffect(() => {
    if (approvedTestimonies.length > 0) {
      const timer = setInterval(nextTestimony, 8000);
      return () => clearInterval(timer);
    }
  }, [approvedTestimonies.length]);

  const latestDevotion = devotions[0];
  const latestThemeText = latestDevotion?.themeScripture?.text || latestDevotion?.scripture?.split('-')[0]?.trim() || '';
  const latestThemeReference = latestDevotion?.themeScripture
    ? buildScriptureReference(latestDevotion.themeScripture.reference)
    : latestDevotion?.scripture?.split('-')[1]?.trim() || '';
  const papaImage = "/journey/image.png";
  const bookCover = "https://i.ibb.co/C3KXCrft/book-discount.jpg";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-blue flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-royal-gold animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Preparing your atmosphere...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Home"
        description="Join Louder Fellowship and Rehoboth Ministries in Kampala, Uganda. Led by Prophet Ezekiel Kayondo. Witness the audible voice of God, soul winning, and saint equipping."
        keywords="Rehoboth, Discipleship, Ezekiel Kayondo, Louder, Fellowship, Christian fellowship Kampala, winning souls, equipping saints"
      />
      {/* Hero Section */}
      <header className="relative lg:h-[90vh] py-12 md:py-8 flex items-center justify-center overflow-hidden bg-royal-blue">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" 
            alt="Church Worship" 
            className="w-full h-full object-cover animate-subtle-zoom opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/60 via-royal-blue/40 to-royal-blue"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1),transparent_70%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full">
          <div className="mb-8 md:mb-12 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-royal-gold text-royal-blue rounded-full shadow-lg shadow-royal-gold/20"
            >
              <BellRing className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em]">{getTodayReminder()}</span>
            </motion.div>
          </div>

          <h1 className="text-[2rem] md:text-[clamp(2.2rem,4.5vw,3.8rem)] font-serif font-black text-white mb-6 md:mb-8 leading-tight tracking-tighter uppercase animate-fade-in delay-200 drop-shadow-2xl">
            Winning <span className="text-royal-gold italic">Souls</span>.  <br />
            Equipping <span className="text-royal-gold italic">Saints</span>.
          </h1>

          <p className="text-base md:text-xl text-white/80 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-medium tracking-wide animate-fade-in delay-500">
            A Bible-believing fellowship dedicated to mentoring believers into <span className="text-royal-gold font-bold">mature Christians</span> who shine as lights in every environment.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 animate-fade-in delay-700 w-full max-w-3xl mx-auto">
            <a href="https://www.youtube.com/@louderfellowship1828/streams" target="_blank" rel="noreferrer" className="flex-1 px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 group border border-red-500">
              <Video className="w-6 h-6 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col items-start font-sans">
                <span className="text-[9px] uppercase tracking-widest text-white/80 font-black">Sunday 07:00 AM</span>
                <span className="text-base font-black leading-none mt-0.5 whitespace-nowrap">WATCH LIVE STREAM</span>
              </div>
            </a>
            <Link to="/about" className="flex-1 px-8 py-5 bg-royal-gold text-royal-blue font-black rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group uppercase tracking-widest text-sm whitespace-nowrap">
              Our Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
            <div className="flex gap-4 sm:shrink-0">
              <a href="https://wa.me/256701751463" target="_blank" rel="noreferrer" className="p-5 bg-white/5 backdrop-blur-md text-white rounded-2xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group">
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="tel:+256701751463" className="p-5 bg-white/5 backdrop-blur-md text-white rounded-2xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mission Kasubi Banner */}
      <section className="bg-royal-blue py-6 border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-royal-gold/10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/mission-kasubi" className="flex flex-col md:flex-row items-center justify-center gap-6 group">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-royal-gold"></span>
              </span>
              <p className="text-royal-gold font-black uppercase tracking-[0.3em] text-[10px] md:text-sm">Active Campaign: Mission Kasubi 3</p>
            </div>
            <div className="h-px w-12 bg-white/20 hidden md:block"></div>
            <p className="text-white text-xs md:text-lg font-serif italic text-center">"A whole week of soul winning and medical outreach — starting Aug 31"</p>
            <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-royal-gold group-hover:text-royal-blue transition-all">
              Join the harvest field
            </div>
          </Link>
        </div>
      </section>

      {/* Today's Devotion Section */}
      <section className="relative py-12 -mt-10 z-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative bg-white rounded-[3rem] p-8 md:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden"
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-royal-gold/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal-blue/5 rounded-full -ml-32 -mb-32 blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-12">
                <div className="flex items-center gap-4 group/word">
                  <div className="w-14 h-14 rounded-2xl bg-royal-blue flex items-center justify-center text-royal-gold shadow-xl shadow-royal-blue/20 group-hover/word:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-royal-blue tracking-tight">Today's Word</h3>
                    <p className="text-[10px] text-royal-gold/60 font-black uppercase tracking-[0.3em]">{latestDevotion?.date || 'Spiritual Nourishment'}</p>
                  </div>
                </div>
                <Link 
                  to="/devotions" 
                  className="px-6 py-2 bg-royal-gold/10 text-royal-gold border border-royal-gold/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-royal-gold hover:text-royal-blue transition-all"
                >
                  View Archive
                </Link>
              </div>

              {latestDevotion ? (
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                  <div className="lg:col-span-1 border-l-2 border-royal-gold/30 flex lg:flex-col items-center justify-start py-2 gap-6 opacity-40">
                    <Quote className="w-8 h-8 text-royal-blue" />
                  </div>
                  
                  <div className="lg:col-span-7">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-royal-blue mb-8 leading-[1.1] italic group-hover:text-royal-gold transition-colors duration-500">
                      {latestDevotion.title}
                    </h2>
                    
                    <div className="prose prose-slate prose-lg max-w-none">
                      <div className="text-slate-600 leading-relaxed font-medium line-clamp-3 md:line-clamp-4">
                        <ReactMarkdown>{latestDevotion.content}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link 
                        to="/devotions" 
                        className="inline-flex items-center gap-2 text-royal-blue font-black text-sm uppercase tracking-widest group/link"
                      >
                        Read Full Devotion 
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                   <div className="lg:col-span-4 bg-slate-50/50 backdrop-blur-sm p-8 rounded-[3rem] border border-slate-100 relative group-hover:translate-y-[-8px] transition-transform duration-700 shadow-sm hover:shadow-xl hover:bg-white">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-royal-blue shadow-lg border border-royal-gold/20">
                      <BookOpen className="w-6 h-6 pointer-events-none" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">The Theme</h4>
                    <p className="text-royal-blue font-serif italic text-lg leading-relaxed">
                      "{latestThemeText}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-slate-400 text-xs font-bold">{latestThemeReference}</span>
                    </div>
                    
                    {latestDevotion.nuggets && latestDevotion.nuggets.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-royal-gold/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-royal-gold fill-royal-gold/20" />
                          <span className="text-[10px] font-black text-royal-gold uppercase tracking-widest leading-none">Divine Nugget</span>
                        </div>
                        <p className="text-royal-blue text-sm font-bold italic leading-tight">
                          "{latestDevotion.nuggets[0]}"
                        </p>
                      </div>
                    )}
 
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => { setSharingDevotion(latestDevotion); setIsShareMenuOpen(true); }}
                        className="p-3 bg-white shadow-md border border-slate-100 rounded-2xl text-slate-400 hover:text-royal-blue hover:border-royal-blue transition-all flex items-center gap-2 px-5 group/share active:scale-95"
                      >
                        <Share2 className="w-4 h-4 group-hover/share:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Share Word
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400 italic">No devotion for today. Check back later!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-20 h-1 bg-royal-gold mb-8"></div>
              <h2 className="text-4xl font-serif font-bold text-royal-blue mb-6">Why/What we do</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed italic">
                "Louder fellowship started by a revelation that God speaks loudly, not only in a still small voice."
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group/vision">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-xl shadow-royal-blue/5 border border-royal-gold/20 flex items-center justify-center text-royal-blue group-hover/vision:bg-royal-blue group-hover/vision:text-royal-gold transition-all duration-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Win Souls</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Reaching out to the lost and bringing them into the light of Christ through prophetic evangelism.<br /> <strong className="text-royal-gold"> Mark 16:15 </strong>(“Go into all the world and preach the gospel to all creation.”)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/vision">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-xl shadow-royal-blue/5 border border-royal-gold/20 flex items-center justify-center text-royal-blue group-hover/vision:bg-royal-blue group-hover/vision:text-royal-gold transition-all duration-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Equip Saints</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Equipping believers for the work of ministry, till we all come to the measure of the stature of the fullness of Christ.
                      <br /> <strong className="text-royal-gold"> Ephesians 4:12-13 </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-royal-gold rounded-2xl z-0"></div>
              <img src={papaImage} alt="Prophet Ezekiel Kayondo" className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-2xl" />
              <div className="absolute bottom-8 right-8 z-20 bg-royal-blue text-white p-6 rounded-xl shadow-xl">
                <p className="font-serif text-xl italic mb-1">"God speaks loudly"</p>
                <p className="text-royal-gold font-bold">-Ezekiel Kayondo</p>
                <p className="text-royal-gold font-bold">(Vision bearer)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Store Section */}
      <section className="py-24 bg-royal-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-royal-gold text-royal-blue rounded-full mb-6 shadow-lg shadow-royal-gold/20 animate-pulse-slow">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ministry Store</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 italic tracking-tight">Resources for your <span className="text-royal-gold">Growth</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto font-medium">All proceeds directly support our mission of spreading the Gospel through global outreach and church development projects.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Book Item */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 transition-all hover:bg-white/10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative group-hover:scale-105 transition-transform duration-500 shadow-2xl rounded-lg overflow-hidden border border-white/20">
                  <img src={bookCover} alt="Master Teach Us To Pray Book" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="bg-royal-gold text-royal-blue text-[10px] font-black px-2 py-1 rounded">Prayer manual</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Master Teach Us to Pray</h3>
                  <p className="text-royal-gold font-bold mb-4">by Ezekiel Kayondo</p>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    A practical guide designed to deepen your understanding and practice of prayer, a timeless and fruitful spiritual discipline. This book draws inspiration from the disciples' request to Jesus in the Gospel of Luke, asking, "Lord, teach us to pray.".
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-tight">Hard Copy</p>
                        <p className="text-lg font-bold">UGX 20,000</p>
                      </div>
                      <span className="text-[10px] text-royal-gold border border-royal-gold/30 px-2 py-1 rounded">In Local Bookshops</span>
                    </div>
                    <a href="https://www.amazon.com/Master-Teach-Us-Pray-Practical/dp/991369308X" target="_blank" rel="noreferrer" className="w-full bg-white text-royal-blue py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-royal-gold transition-colors">
                      <ShoppingCart className="w-4 h-4" /> Get Kindle/Amazon
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
         {/* Testimonials Carousel */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-royal-blue/5 -skew-y-2 origin-top-left -z-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-royal-gold text-royal-blue font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-royal-gold/20 mb-6">
              <Sparkles className="w-4 h-4" /> Living Testimonies
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
              <div className="flex flex-col items-center md:items-start">
                <h2 className="text-3xl md:text-5xl font-serif font-black text-royal-blue text-center md:text-left leading-[1.1]">What God Is Doing</h2>
                <p className="text-royal-gold font-black uppercase tracking-[0.2em] text-[10px] mt-2">Stories of Faith & Victory</p>
              </div>
              <Link 
                to="/testimonies"
                className="flex items-center gap-2 bg-royal-blue/5 text-royal-blue px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-royal-blue hover:text-white transition-all shadow-sm group/btn"
              >
                View All Stories <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="min-h-[350px] flex items-center justify-center">
              {approvedTestimonies.length > 0 ? (
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentTestimony}
                    custom={direction}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full"
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-royal-blue/10 rounded-full flex items-center justify-center text-4xl font-black text-royal-blue shadow-inner border-4 border-white">
                        {approvedTestimonies[currentTestimony].author.charAt(0)}
                      </div>
                      
                      <div className="space-y-6 max-w-3xl">
                        <div className="relative flex flex-col items-center">
                          <Quote className="w-10 h-10 text-royal-gold/10 mb-4 md:mb-0 md:absolute md:-top-4 md:-left-8" />
                          <p className="text-lg md:text-2xl font-serif italic text-royal-blue leading-relaxed px-4">
                            "{approvedTestimonies[currentTestimony].content}"
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <h4 className="text-xl font-black text-royal-blue italic">{approvedTestimonies[currentTestimony].author}</h4>
                          <div className="flex items-center gap-3 mt-4">
                            <p className="text-royal-gold font-bold uppercase tracking-widest text-[10px]">{approvedTestimonies[currentTestimony].location}</p>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            
                            <button 
                              onClick={() => handleBlessed(approvedTestimonies[currentTestimony].id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border ${blessed.has(approvedTestimonies[currentTestimony].id) ? 'bg-royal-gold text-royal-blue border-royal-gold' : 'bg-royal-blue/5 text-royal-blue border-transparent hover:bg-royal-blue/10'}`}
                            >
                              <motion.div
                                animate={blessed.has(approvedTestimonies[currentTestimony].id) ? { scale: [1, 1.5, 1] } : {}}
                              >
                                <Heart className={`w-3.5 h-3.5 ${blessed.has(approvedTestimonies[currentTestimony].id) ? 'fill-current' : ''}`} />
                              </motion.div>
                              <span className="font-bold text-[10px] uppercase tracking-wider">
                                {likes[approvedTestimonies[currentTestimony].id] || 0} Blessed
                                {blessed.has(approvedTestimonies[currentTestimony].id) && " ✓"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <p className="text-slate-400 italic">No testimonies available yet.</p>
              )}
            </div>

            {/* Navigation Controls */}
            {approvedTestimonies.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <button 
                onClick={prevTestimony}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-md flex items-center justify-center text-royal-blue hover:bg-royal-blue hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {approvedTestimonies.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentTestimony ? 1 : -1);
                      setCurrentTestimony(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTestimony ? 'w-6 bg-royal-gold' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimony}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-md flex items-center justify-center text-royal-blue hover:bg-royal-blue hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Children's Ministry Section */}
      <section className="py-24 bg-slate-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-gold/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-blue/5 rounded-full blur-3xl -ml-64 -mb-64"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-royal-gold/20 rounded-[3rem] blur-2xl opacity-50"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src="/journey/Childrens cell 5.jpeg" 
                  alt="Children's Mega Cell Ministry" 
                  className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-royal-gold flex items-center justify-center text-royal-blue">
                      <Star className="w-5 h-5" />
                    </div>
                    <h4 className="text-royal-blue font-bold">500+ Children Reached</h4>
                  </div>
                  <p className="text-slate-600 text-sm italic">Building a Spirit filled, radical faith generation.</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-gold text-royal-blue font-black text-[10px] uppercase tracking-widest shadow-lg shadow-royal-gold/20 mb-6 group">
                  <Heart className="w-3.5 h-3.5 fill-royal-blue/20 group-hover:scale-125 transition-transform" /> The Next Generation
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-black text-royal-blue mb-6 leading-tight">
                  Children's <br /> <span className="text-royal-gold italic">Ministry</span>
                </h2>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  Building a sustainable, Spirit-filled generation. We are planting seeds for the future of the church.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-1 gap-4">
                {[
                  {
                    title: "Children's Church",
                    time: "Every Sunday at 9:00 AM",
                    icon: <Church className="w-6 h-6" />,
                    color: "border-royal-blue"
                  },
                  {
                    title: "School Ministry",
                    time: "Partnering with schools in our community",
                    icon: <BookOpen className="w-6 h-6" />,
                    color: "border-slate-400"
                  },
                  {
                    title: "Educational Drives",
                    time: "Annual Candidate Dedication & Back-to-School",
                    icon: <Award className="w-6 h-6" />,
                    color: "border-royal-gold"
                  },
                  {
                    title: "The Children's Mega Cell",
                    time: "Every Saturday at 1:00 PM",
                    sub: "Holidays: Every Sat | School: Last Sat",
                    icon: <Zap className="w-6 h-6" />,
                    color: "border-royal-gold",
                    highlight: true
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`group/item p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex gap-6 items-center ${item.highlight ? 'bg-royal-gold/5 border-royal-gold/20' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.highlight ? 'bg-royal-gold text-royal-blue shadow-lg shadow-royal-gold/20 group-hover/item:bg-royal-blue group-hover/item:text-royal-gold' : 'bg-slate-50 text-royal-blue group-hover/item:bg-royal-blue group-hover/item:text-royal-gold'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-royal-blue text-lg uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-sm">{item.time}</p>
                      {item.sub && <p className="text-royal-gold text-[9px] uppercase font-black mt-1 tracking-widest bg-royal-gold/10 px-2 py-0.5 rounded-full inline-block">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  to="/children" 
                  className="inline-flex items-center gap-4 px-10 py-5 bg-royal-blue text-white font-bold rounded-full hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl group"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kingdom Outreach Summary */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/95 via-royal-blue/80 to-transparent z-10" />
          <img 
            src="https://i.ibb.co/S4N0hFVW/image.png" 
            alt="Outreach" 
            className="w-full h-full object-cover animate-subtle-zoom"
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-royal-gold text-royal-blue font-black text-[10px] uppercase tracking-[0.2em] mb-8 shadow-xl shadow-royal-gold/20 backdrop-blur-md">
              <Globe className="w-4 h-4 animate-spin-slow" /> Kingdom Outreach
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 leading-tight tracking-tighter">
              Transforming Lives <br />
              <span className="text-royal-gold italic text-3xl md:text-4xl">Beyond the Four Walls</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 font-light leading-relaxed">
              We believe the church is a movement. Our outreach projects span across Uganda — from rural evangelism and emergency relief to medical camps and youth conferences. Partner with us as we bring hope and practical love to communities in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/projects" className="px-8 py-4 bg-white text-royal-blue font-bold rounded-full hover:bg-royal-gold hover:text-white transition-all shadow-xl text-center flex items-center justify-center gap-2 group">
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore Our Projects
              </Link>
              <Link to="/give" className="px-8 py-4 bg-royal-blue/50 border border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-royal-blue transition-all shadow-xl text-center flex items-center justify-center gap-2 group backdrop-blur-sm">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-royal-blue">Connect With Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/programs" className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-royal-gold/30">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-royal-blue mb-8 group-hover:bg-royal-blue group-hover:text-royal-gold transition-all duration-500 shadow-sm">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-royal-blue mb-3 uppercase tracking-tight">Service Times</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Join us for physical and online gatherings throughout the week. <span className="text-royal-gold font-bold">Details here →</span></p>
            </Link>
            <Link to="/sermons" className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-royal-gold/30">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-royal-blue mb-8 group-hover:bg-royal-blue group-hover:text-royal-gold transition-all duration-500 shadow-sm">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-royal-blue mb-3 uppercase tracking-tight">Watch / Listen</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Access our latest sermons and zoom fellowship recordings. <span className="text-royal-gold font-bold">Watch now →</span></p>
            </Link>
            <Link to="/give" className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-royal-gold/30">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-royal-blue mb-8 group-hover:bg-royal-blue group-hover:text-royal-gold transition-all duration-500 shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-royal-blue mb-3 uppercase tracking-tight">Donate</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Support the work of God and our church development projects. <span className="text-royal-gold font-bold">Give here →</span></p>
            </Link>
            <Link to="/contact" className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-royal-gold/30">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-royal-blue mb-8 group-hover:bg-royal-blue group-hover:text-royal-gold transition-all duration-500 shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-royal-blue mb-3 uppercase tracking-tight">Locate Us</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Serving our community from Kasubi-Kawaala, Kampala. <span className="text-royal-gold font-bold">View map →</span></p>
            </Link>
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
