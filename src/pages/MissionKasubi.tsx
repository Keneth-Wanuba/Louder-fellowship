import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Heart, 
  Zap, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Gift, 
  Stethoscope, 
  Utensils, 
  Shirt, 
  Home as HomeIcon,
  MessageSquare,
  Globe,
  Share2,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NEEDS = [
  {
    title: "Financial Support",
    icon: <CircleDollarSign className="w-6 h-6" />,
    description: "Funds for crusade equipment, transport, and mission logistics.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    title: "Labourers",
    icon: <Users className="w-6 h-6" />,
    description: "Soul winners for door-to-door preaching and mission staff.",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    title: "Material Gifts",
    icon: <Gift className="w-6 h-6" />,
    description: "Food, clothing, and household items for the community.",
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    title: "Medication",
    icon: <Stethoscope className="w-6 h-6" />,
    description: "Basic medical supplies for our health outreach station.",
    color: "bg-rose-50 text-rose-600 border-rose-100"
  }
];

const SCHEDULE = [
  { day: "Aug 31", event: "Mission Launch & Door-to-Door", time: "8:00 AM - 5:00 PM" },
  { day: "Sept 1", event: "Community Outreach & Crusade Night 1", time: "All Day" },
  { day: "Sept 2", event: "Door-to-Door & Crusade Night 2", time: "All Day" },
  { day: "Sept 3", event: "Grand Crusade & Healing Service", time: "4:00 PM - 9:00 PM" },
  { day: "Sept 4", event: "Mission Wrap-up & Dedication", time: "9:00 AM - 1:00 PM" },
];

export default function MissionKasubi() {
  return (
    <div className="bg-white selection:bg-royal-gold selection:text-royal-blue">
      <SEO 
        title="Mission Kasubi 3 | Gospel Outreach" 
        description="Join us for Mission Kasubi 3 at Rehoboth Church Grounds. A soul-winning mission featuring door-to-door preaching and a week-long crusade."
      />

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-royal-blue">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544427928-c49bcdee84ba?auto=format&fit=crop&q=80&w=2000" 
            alt="Mission Outreach" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-royal-blue via-royal-blue/90 to-royal-blue/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-royal-gold text-royal-blue font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-royal-gold/20 mb-8"
          >
            <Zap className="w-4 h-4" /> Upcoming Gospel Invasion
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
          >
            Mission <br />
            <span className="text-royal-gold italic">Kasubi 3</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            A radical week of soul-winning, door-to-door preaching, and miraculous crusades. The harvest is ready.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-10 mb-16 px-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Calendar className="w-7 h-7 text-royal-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-royal-gold">Event Dates</p>
                <p className="text-lg font-bold">Aug 31 — Sept 4</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <MapPin className="w-7 h-7 text-royal-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-royal-gold">Location</p>
                <p className="text-lg font-bold">Rehoboth Church Grounds</p>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#support" className="w-full sm:w-auto px-12 py-5 bg-royal-gold text-royal-blue font-black rounded-full hover:bg-white hover:scale-105 transition-all shadow-xl shadow-royal-gold/10 text-xs uppercase tracking-widest">
              Support the Mission
            </a>
            <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-white/10 text-white border border-white/20 font-black rounded-full hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md text-xs uppercase tracking-widest">
              Join as Labourer
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap- 2 opacity-40">
           <div className="w-px h-12 bg-gradient-to-b from-transparent to-royal-gold"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-royal-gold rotate-90 mt-8">Explore</span>
        </div>
      </header>

      {/* Urgency / Status Section */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-royal-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest border border-rose-100 mb-6">
                  <Clock className="w-3.5 h-3.5" /> Funding Status: Critical
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-royal-blue mb-8 leading-tight">
                  The Mission Fund is <span className="text-rose-600 block">at Zero.</span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                  Mission Kasubi 3 is entirely dependent on the free-will offerings and support of individuals like you. Every grain of rice, every liter of fuel for the crusade speakers, and every medical supply is a miracle waiting to happen through your hand.
                </p>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-4">
                  <div className="w-[0.5%] h-full bg-rose-600 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Raised: UGX 0</span>
                  <span className="text-royal-gold">Goal: UGX 15,000,000</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { label: "Reach", val: "Kasubi Zone", icon: <Globe /> },
                   { label: "Target", val: "1000+ Souls", icon: <Users /> },
                   { label: "Crusades", val: "4 Nights", icon: <Zap /> },
                   { label: "Outreach", val: "Door-to-Door", icon: <HomeIcon /> }
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-royal-gold/30 transition-colors">
                      <div className="text-royal-blue mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
                        {stat.icon}
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-royal-blue">{stat.val}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Details */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-serif font-black text-royal-blue mb-8 uppercase tracking-tighter leading-none">
                Soul Winning <br /> <span className="text-royal-gold italic">Strategy</span>
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed mb-10">
                We believe in the power of the audible voice of God. Our approach combines direct contact with the community and large-scale public gospel events.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-royal-blue text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-royal-blue uppercase tracking-tight">Door-to-Door</h4>
                    <p className="text-sm text-slate-500">Intimate one-on-one ministry in the homes of Kasubi residents.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-royal-blue text-white flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-royal-blue uppercase tracking-tight">Open Air Crusade</h4>
                    <p className="text-sm text-slate-500">Public events with worship, preaching, and prayers for the sick.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="lg:w-2/3">
              <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-royal-gold mb-12 flex items-center gap-4">
                  <span className="w-12 h-px bg-royal-gold"></span> Mission Schedule
                </h3>
                <div className="space-y-12 relative z-10">
                  {SCHEDULE.map((item, idx) => (
                    <div key={idx} className="flex gap-8 group">
                       <div className="text-right w-24">
                         <span className="block text-xl font-black text-white">{item.day.split(' ')[1]}</span>
                         <span className="block text-[10px] font-black uppercase text-royal-gold tracking-widest">{item.day.split(' ')[0]}</span>
                       </div>
                       <div className="flex-1 pb-12 border-l border-white/10 pl-8 relative">
                         <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 bg-royal-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] group-hover:scale-125 transition-transform"></div>
                         <h4 className="text-xl font-black group-hover:text-royal-gold transition-colors">{item.event}</h4>
                         <p className="text-slate-400 text-sm mt-2">{item.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Needs Grid */}
      <section id="support" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-royal-gold mb-4 block">Supplies Needed</span>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-royal-blue uppercase tracking-tighter">Mission <br /> <span className="text-royal-gold italic">Requirements</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {NEEDS.map((need, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12 ${need.color}`}>
                  {need.icon}
                </div>
                <h3 className="text-xl font-black text-royal-blue uppercase tracking-tight mb-4">{need.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{need.description}</p>
                <Link to="/give" className="text-[10px] font-black uppercase tracking-widest text-royal-blue hover:text-royal-gold transition-colors flex items-center gap-2">
                  Partner Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="py-32 bg-royal-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img src="https://images.unsplash.com/photo-1544427928-c49bcdee84ba?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-serif font-black text-white mb-12 tracking-tighter italic">Will you be the <span className="text-royal-gold underline decoration-royal-gold/30">Miracle?</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link to="/give" className="w-full sm:w-auto px-12 py-6 bg-royal-gold text-royal-blue font-black rounded-full hover:bg-white transition-all shadow-2xl text-sm uppercase tracking-widest">
               Give to Mission Kasubi
             </Link>
             <Link to="/contact" className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white border border-white/20 font-black rounded-full hover:bg-white/20 transition-all text-sm uppercase tracking-widest">
               Register as Labourer
             </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-white/30">
            <Share2 className="w-6 h-6 hover:text-royal-gold cursor-pointer transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Share Mission with Friends</span>
          </div>
        </div>
      </section>
    </div>
  );
}
