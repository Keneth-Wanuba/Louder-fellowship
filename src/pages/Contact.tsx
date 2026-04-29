import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram, Send, Share2 } from 'lucide-react';
import React, { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your prayer request has been sent successfully.' });
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send');
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Sorry, there was an error sending your message. Please try again later or contact us via WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="bg-royal-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">We are here to pray with you</p>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Our Location</h3>
                    <p className="text-slate-600 font-light">Rehoboth Discipleship Global Ministries<br />Kasubi-Kawaala, Mugema zone, Opposite Matvic Primary school, Kampala, Uganda</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Call / WhatsApp</h3>
                    <p className="text-slate-600 font-light">+256 701751463</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Email Us</h3>
                    <p className="text-slate-600 font-light">rehobothdgul@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <Share2 />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Follow Us</h3>
                    <div className="flex gap-4 mt-4">
                      <a href="https://www.facebook.com/louderfellowship" target="_blank" rel="noreferrer" className="text-royal-blue hover:text-royal-gold transition-colors"><Facebook /></a>
                      <a href="https://x.com/louder_fe" target="_blank" rel="noreferrer" className="text-royal-blue hover:text-royal-gold transition-colors"><Twitter /></a>
                      <a href="https://www.youtube.com/@louderfellowship1828" target="_blank" rel="noreferrer" className="text-royal-blue hover:text-royal-gold transition-colors"><Youtube /></a>
                      <a href="https://www.instagram.com/rehoboth_louder/" target="_blank" rel="noreferrer" className="text-royal-blue hover:text-royal-gold transition-colors"><Instagram /></a>
                      <a href="https://t.me/+c-qcHSR4-2U0YTA0" target="_blank" rel="noreferrer" className="text-royal-blue hover:text-royal-gold transition-colors" title="Telegram"><Send /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-royal-blue mb-6 border-b border-royal-gold/20 pb-4">Send a Prayer Request</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input type="text" name="firstName" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input type="text" name="lastName" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Message / Prayer Request</label>
                  <textarea name="message" rows={4} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"></textarea>
                </div>
                
                {status && (
                  <div className={`p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-royal-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-royal-blue/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="h-[450px] w-full bg-slate-100 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.754832560577!2d32.5463423!3d0.323555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0000000001%3A0x0!2sMatvic%20Primary%20School!5e0!3m2!1sen!2sug!4v1712345678901!5m2!1sen!2sug" 
          className="w-full h-full border-0" 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Ministry Location Map"
        ></iframe>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 bg-royal-gold rounded-full flex items-center justify-center text-royal-blue">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-royal-blue">Visit Us Physically</p>
            <a href="https://maps.app.goo.gl/7nPiSsMoc7p5tTuYA" target="_blank" rel="noreferrer" className="text-sm text-royal-gold hover:underline">Open in Google Maps</a>
          </div>
        </div>
      </section>
    </>
  );
}
