import React, { useState, useEffect, useRef } from 'react';
import { Quote, MessageSquare, Heart, Mail, Sparkles, Send, User, Phone, CheckCircle2, AlertCircle, Image as ImageIcon, Upload, Plus } from 'lucide-react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import CommentsSection from '../components/CommentsSection';

export interface Testimony {
  id: string;
  author: string;
  location: string;
  content: string;
  date: string;
  likes: number;
  projectId?: number;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  contact?: string;
}

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [blessed, setBlessed] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    author: '',
    location: '',
    contact: '',
    content: ''
  });

  useEffect(() => {
    fetchTestimonies();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      const offset = 100; // Account for any sticky headers
      const elementPosition = formRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const fetchTestimonies = async () => {
    setIsLoading(true);
    setError(null);
    
    // Create an AbortController for the 30-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn("Testimonies fetch timed out after 30 seconds");
    }, 30000);

    try {
      console.log("Fetching testimonies from /api/testimonies/approved...");
      const response = await fetch('/api/testimonies/approved', { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Clear the timeout as we got a response
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully fetched ${data.length} testimonies`);
        setTestimonies(data);
        const initialLikes: Record<string, number> = {};
        data.forEach((t: Testimony) => initialLikes[t.id] = t.likes || 0);
        setLikes(initialLikes);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }
    } catch (err: any) {
      console.error("Critical error fetching testimonies:", err);
      // Ensure timeout is cleared even on error
      clearTimeout(timeoutId);
      
      if (err.name === 'AbortError') {
        setError('The connection timed out after 30 seconds. Please check your internet and try again.');
      } else {
        setError(err.message || 'We could not load the testimonies. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlessed = (id: string) => {
    if (blessed.has(id)) return;
    
    setBlessed(prev => new Set(prev).add(id));
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double clicking while submitting
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      console.log("Submitting testimony data:", formData);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/testimony/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      console.log("Submission response status:", response.status);

      if (response.ok) {
        setSubmissionStatus({
          type: 'success',
          message: 'Hallelujah! Your testimony has been submitted and is awaiting review by our team.'
        });
        setFormData({ author: '', location: '', contact: '', content: '' });
        // Auto hide form after 5 seconds
        setTimeout(() => {
          setShowForm(false);
          setSubmissionStatus(null);
        }, 5000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Invalid server response' }));
        throw new Error(errorData.error || errorData.message || 'Failed to submit testimony.');
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      const errorMessage = (err.message || 'An unexpected error occurred. Please try again.');
      
      setSubmissionStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvedTestimonies = testimonies;

  return (
    <>
      <SEO 
        title="Testimonies"
        description="Share and read stories of God's faithfulness at Louder Fellowship. Be encouraged by the power of testimony."
      />
      
      <header className="bg-royal-blue py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1518655061766-48c34ca35539?auto=format&fit=crop&q=80&w=2000" 
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
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 italic">Testimonies</h1>
            <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">The Power of the Overcoming Word</p>
          </motion.div>
        </div>
      </header>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-3xl font-serif font-bold text-royal-blue">Faith Stories</h2>
              <p className="text-xs font-black uppercase tracking-widest text-royal-gold mt-1">Celebrating Miracles</p>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-royal-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-royal-gold hover:text-royal-blue transition-all flex items-center gap-3 shadow-xl shadow-royal-blue/20 group active:scale-95"
            >
              {showForm ? 'View Stories' : 'Share My Story'}
              <motion.div
                animate={{ rotate: showForm ? 45 : 0 }}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-royal-blue/20 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-royal-gold" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submissionStatus && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 shadow-lg border ${submissionStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {submissionStatus.type === 'success' ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest">{submissionStatus.type === 'success' ? 'Hallelujah!' : 'Error'}</p>
                    <p className="text-xs font-medium">{submissionStatus.message}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {showForm ? (
              <motion.div
                key="submission-form"
                ref={formRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-royal-gold/10 scroll-mt-24"
              >
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-serif font-bold text-royal-blue mb-2">Submit Your Testimony</h3>
                  <p className="text-slate-500 text-sm">Your story can change a life. Please share what God has done for you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <input 
                          type="text"
                          required
                          autoFocus
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           Location (Town/City)
                        </label>
                        <input 
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm"
                          placeholder="Where are you from?"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Phone className="w-3 h-3" /> Contact Info (Phone/Email)
                      </label>
                      <input 
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm"
                        placeholder="How can we reach you?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Quote className="w-3 h-3" /> Your Healing / Miracle Story
                    </label>
                    <textarea 
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm h-48 resize-none"
                      placeholder="Tell us what God did..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-royal-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Testimony
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="testimonies-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-10"
              >
                {isLoading ? (
                  <div className="text-center py-20">
                    <div className="w-12 h-12 border-4 border-royal-blue/30 border-t-royal-blue rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Loading Stories...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl border border-red-100 p-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold text-royal-blue mb-2">Connection Issue</h3>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button 
                      onClick={() => fetchTestimonies()}
                      className="bg-royal-blue text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-royal-gold hover:text-royal-blue transition-all shadow-lg"
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : testimonies.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl border border-dashed border-slate-200">
                    <Quote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No stories shared yet. Be the first to testify!</p>
                  </div>
                ) : (
                  testimonies.map((testimony, index) => (
                    <motion.div 
                      key={testimony.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 relative group overflow-hidden"
                    >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-royal-blue rounded-2xl flex items-center justify-center text-royal-gold font-black text-2xl shadow-xl shadow-royal-blue/20 group-hover:rotate-6 transition-transform duration-500">
                            {testimony.author.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-royal-blue uppercase tracking-tight">{testimony.author}</h4>
                            <div className="flex items-center gap-2 text-slate-400">
                              <p className="text-[10px] font-black uppercase tracking-widest text-royal-gold/60">{testimony.location}</p>
                              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                              <p className="text-[10px] font-black uppercase tracking-widest">{testimony.date}</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleBlessed(testimony.id)}
                          className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${blessed.has(testimony.id) ? 'bg-royal-gold text-royal-blue shadow-royal-gold/30' : 'bg-white text-slate-400 hover:text-royal-blue border-transparent hover:shadow-xl'} border active:scale-95`}
                        >
                          <motion.div
                            animate={blessed.has(testimony.id) ? { scale: [1, 1.4, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart className={`w-4 h-4 ${blessed.has(testimony.id) ? 'fill-current' : ''}`} />
                          </motion.div>
                          <span>{likes[testimony.id] || testimony.likes} Blessed</span>
                        </button>
                      </div>
                      
                      <div className="relative">
                        <Quote className="w-20 h-20 text-royal-gold/5 absolute -top-10 -left-6" />
                        <p className="text-xl md:text-2xl font-serif italic text-royal-blue leading-relaxed relative z-10 px-2">
                          "{testimony.content}"
                        </p>
                      </div>

                      <CommentsSection testimonyId={testimony.id} />

                      {testimony.projectId && (
                        <div className="mt-8 pt-6 border-t border-slate-50">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-royal-blue/5 rounded-lg text-royal-blue/60 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Impact Story
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!showForm && (
            <div className="mt-20 p-12 bg-white rounded-[3rem] shadow-2xl border border-royal-gold/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-royal-gold"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-black mb-4 text-royal-blue italic">Have a story to tell?</h3>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto font-medium">
                  Your testimony is a weapon of warfare and a seed of faith for someone else. Don't hide what God has done.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-royal-blue text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl"
                  >
                    Share It Now
                  </button>
                  <a 
                    href="mailto:rehobothdgul@gmail.com?subject=My Testimony"
                    className="w-full sm:w-auto bg-slate-50 text-slate-400 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-royal-blue/5 hover:text-royal-blue transition-all"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

