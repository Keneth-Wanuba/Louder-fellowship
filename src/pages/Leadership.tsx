import React from 'react';
import { motion } from 'motion/react';
import { 
  PenTool, 
  Users, 
  BookOpen, 
  UserCheck, 
  Compass, 
  Crown, 
  Sparkles, 
  Mic2, 
  ArrowRight,
  Quote,
  MessageSquare,
  Globe2,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ROLES = [
  {
    title: "The Teacher",
    icon: <BookOpen className="w-6 h-6" />,
    description: "Gifted with profound insight into the mysteries of the Word, breaking down complex spiritual truths into practical, life-transforming wisdom."
  },
  {
    title: "The Discipler",
    icon: <Users className="w-6 h-6" />,
    description: "A father at heart, dedicated to personal growth and the spiritual maturity of every believer, raising a generation of ministers."
  },
  {
    title: "The Writer",
    icon: <PenTool className="w-6 h-6" />,
    description: "Authored numerous impactful Christian literature and founded 'Baruch - School of Christian Writers' to empower others to pen God's word."
  },
  {
    title: "The Pastor",
    icon: <Heart className="w-6 h-6" />,
    description: "Leading with compassion and prophetic guidance, shepherding the flock of Louder Fellowship and Rehoboth Ministries with spiritual integrity."
  }
];

export default function Leadership() {
  const papaImage = "https://i.ibb.co/s97GCMX7/Untitled-design.jpg";

  return (
    <div className="bg-white selection:bg-royal-gold selection:text-royal-blue overflow-hidden">
      <SEO 
        title="Leadership | Ezekiel Kayondo" 
        description="Meet Ezekiel Kayondo, the Vision Bearer of Louder Fellowship and Rehoboth Ministries. A writer, teacher, and discipler dedicated to raising a generation that hears God clearly."
      />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-royal-blue">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000" 
            alt="Library background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-royal-gold/20 blur-3xl rounded-full opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl aspect-[4/5]">
                <img 
                  src={papaImage} 
                  alt="Ezekiel Kayondo" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/60 via-transparent to-transparent"></div>
              </div>
            </motion.div>

            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-royal-gold text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-8 border border-white/10"
              >
                <Compass className="w-4 h-4" /> The Vision Bearer
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]"
              >
                Ezekiel <br />
                <span className="text-royal-gold italic">Kayondo</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-lg"
              >
                A Prophet called to echo the audible voice of God, a Writer dedicated to the preservation of truth, and a Father committed to raising Kingdom pioneers.
              </motion.p>

              <div className="flex flex-wrap gap-4">
                <a href="#story" className="px-8 py-4 bg-white text-royal-blue font-black rounded-2xl hover:bg-royal-gold hover:scale-105 transition-all shadow-xl text-xs uppercase tracking-widest">
                  Read My Story
                </a>
                <Link to="/contact" className="px-8 py-4 bg-white/10 text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md text-xs uppercase tracking-widest">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Role Grid */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ROLES.map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-royal-gold/30 hover:bg-white transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-royal-blue text-royal-gold flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg">
                  {role.icon}
                </div>
                <h3 className="text-lg font-black text-royal-blue uppercase tracking-tight mb-3">{role.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story */}
      <section id="story" className="py-32 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-royal-blue text-center mb-16 uppercase tracking-tighter decoration-royal-gold/30 underline decoration-4 underline-offset-8">
              A Journey of <span className="text-royal-gold italic">Obedience</span>
            </h2>
            
            <p className="text-xl text-slate-800 leading-relaxed font-medium mb-12 first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:text-royal-blue first-letter:mr-3 first-letter:float-left">
              The story of Ezekiel Kayondo is inextricably linked with the birth of Louder Fellowship. It began with a simple "Yes" to God in a small corridor at Bulamba Hostel in Makerere Kivulu. As a student, the burden for a generation that seemed to be losing its way led him to start a simple Bible study with just two other people.
            </p>

            <blockquote className="my-16 border-l-8 border-royal-gold bg-slate-50 p-12 rounded-3xl relative">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-royal-gold/10 -scale-x-100" />
              <p className="text-2xl font-serif italic text-royal-blue leading-relaxed relative z-10 m-0">
                "I remember the veranda nights in Kivulu. We didn't have much, but we had the Word. And the Word was enough to sustain us through the seasons of 'Mayim Chayim' unto the global mandate we carry today."
              </p>
              <footer className="mt-6 font-black uppercase tracking-widest text-xs text-royal-gold">— Ezekiel Kayondo</footer>
            </blockquote>

            <div className="space-y-12">
              <div className="bg-white border-l-4 border-royal-blue pl-8 py-2">
                <h4 className="text-xl font-black text-royal-blue uppercase tracking-tight mb-2">The Multi-National Mandate</h4>
                <p className="text-slate-600 leading-relaxed m-0">
                  Following the divine vision received in 2018 during a series of outdoor all-nights at MTR grounds, Ezekiel was called to not only lead a fellowship but to spark a movement. His prophetic voice moved the ministry from rented restaurants and garages into international digital spaces, reaching thousands across Somalia, Dubai, Canada, the USA, and beyond.
                </p>
              </div>

              <div className="bg-white border-l-4 border-royal-gold pl-8 py-2">
                <h4 className="text-xl font-black text-royal-blue uppercase tracking-tight mb-2">The Call to Discipleship</h4>
                <p className="text-slate-600 leading-relaxed m-0">
                  Beyond the pulpit, his heart beats for discipleship. He founded the 'Nourish: School of Ministry' as a response to the need for well-equipped leaders who can navigate the complexities of modern ministry while staying anchored in biblical truth. His focus is on raising 'Prophetic Leaders' who can hear and interpret God's voice for their specific spheres of influence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Literary Works */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <span className="text-royal-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">The Pen of a Ready Writer</span>
              <h2 className="text-3xl md:text-6xl font-serif font-black mb-8 italic">Preserving <span className="text-royal-gold">Truth</span> Through Ink</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Ezekiel Kayondo believes that letters are a legacy. Through his writing ministry, he has established the Baruch School of Christian Writers, teaching ministers and believers how to document their spiritual journeys and revelations.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-royal-gold">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Authored Books</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-royal-gold">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Global Reach</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-1 blur-2xl bg-royal-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-[3rem] p-12 border border-white/10 hover:border-royal-gold/30 transition-all">
                  <Mic2 className="w-12 h-12 text-royal-gold mb-8" />
                  <p className="text-2xl font-serif italic mb-8 leading-relaxed">
                    "We are not just speakers; we are scribes of the Spirit. Every word God gives us is a seed that must be planted in the hearts of men and preserved in the pages of history."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-royal-gold text-royal-blue flex items-center justify-center font-black">EK</div>
                    <div>
                      <h5 className="font-black uppercase tracking-widest text-[10px]">Ezekiel Kayondo</h5>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest">Prophet & Author</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-px h-24 bg-royal-blue/20 mx-auto mb-12"></div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-royal-blue mb-8 uppercase tracking-tighter">Connect with the <br /> <span className="text-royal-gold">Vision</span></h2>
          <p className="text-lg text-slate-500 mb-12 font-medium max-w-xl mx-auto">
            Whether it's through discipleship, the school of ministry, or his literary works, discover how you can grow under this prophetic grace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-royal-blue text-white font-black rounded-full hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
              Send a Message
            </Link>
            <Link to="/give" className="w-full sm:w-auto px-12 py-5 bg-white text-royal-blue border border-slate-200 font-black rounded-full hover:border-royal-blue transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
              Support the Ministry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
