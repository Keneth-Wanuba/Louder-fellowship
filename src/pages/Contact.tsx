import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram, Send, Share2, MessageCircle } from 'lucide-react';
import React from 'react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO 
        title="Contact"
        description="Connect with Louder Fellowship and Rehoboth Ministries in Kampala. Reach out for prayer, counseling, or inquiries via WhatsApp, phone, or visit us in Kawaala."
        keywords="contact church Kampala, prayer request Uganda, Louder Fellowship phone number, prophetic counseling, Rehoboth Ministries address"
      />
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
                    <p className="text-slate-600 font-light">Rehoboth Discipleship Global Ministries<br />25 Hajji Juma Kayondo Rd, Kampala (8HP2+4G)</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Call / WhatsApp</h3>
                    <a href="tel:+256701751463" className="text-slate-600 font-light hover:text-royal-gold transition-colors">+256 701751463</a>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold flex-shrink-0">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-1">Email Us</h3>
                    <a href="mailto:rehobothdgul@gmail.com" className="text-slate-600 font-light hover:text-royal-gold transition-colors">rehobothdgul@gmail.com</a>
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

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-royal-gold/20 rounded-full flex items-center justify-center text-royal-gold mx-auto mb-6">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-royal-blue mb-4">Chat With Us Directly</h2>
                <p className="text-slate-600">The fastest way to reach us is through WhatsApp or a direct call. Our ministry team is ready to pray with you and answer your inquiries.</p>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="https://wa.me/256701751463?text=Praise%20the%20Lord%2C%20I%20would%20like%20to..." 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Chat on WhatsApp</span>
                </a>
                
                <a 
                  href="tel:+256701751463" 
                  className="w-full bg-royal-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-royal-blue/90 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Phone className="w-6 h-6" />
                  <span>Direct Call</span>
                </a>

                <a 
                  href="mailto:rehobothdgul@gmail.com" 
                  className="w-full bg-white text-royal-blue border-2 border-royal-blue py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                >
                  <Mail className="w-6 h-6" />
                  <span>Send an Email</span>
                </a>
              </div>

              <p className="text-center text-sm text-slate-400 mt-8 font-medium">Available 24/7 for Prayer & Counselling</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="h-[450px] w-full bg-slate-100 relative">
        <iframe 
          src="https://maps.google.com/maps?q=25%20Hajji%20Juma%20Kayondo%20Rd%2C%20Kampala%208HP2%2B4G&t=&z=17&ie=UTF8&iwloc=&output=embed" 
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
            <a href="https://maps.app.goo.gl/H5xYfmCWDVc8xQWR8" target="_blank" rel="noreferrer" className="text-sm text-royal-gold hover:underline">Open in Google Maps</a>
          </div>
        </div>
      </section>
    </>
  );
}
