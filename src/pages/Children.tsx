import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Star, 
  Zap, 
  Church, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Users, 
  Smile, 
  Palette, 
  Music, 
  Camera,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const PROGRAMS = [
  {
    title: "Children's Church",
    time: "Every Sunday at 9:00 AM",
    description: "A fun and faith-filled service designed specifically for kids to encounter God's love through storytelling, worship, and interactive lessons.",
    icon: <Church className="w-8 h-8" />,
    stats: "3 Services",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    title: "The Children's Mega Cell",
    time: "Every Saturday at 1:00 PM",
    description: "Our flagship weekend program for deep discipleship. In holidays we meet every Saturday, and during school terms, we gather on the last Saturday of the month.",
    icon: <Zap className="w-8 h-8" />,
    stats: "Holidays & Term-ly",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    highlight: true
  },
  {
    title: "School Ministry",
    time: "Community Partnership",
    description: "Taking the gospel to the classroom. We partner with local schools to provide spiritual guidance, counseling, and biblical coaching to students.",
    icon: <BookOpen className="w-8 h-8" />,
    stats: "5+ Schools",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    title: "Educational Drives",
    time: "Annual Events",
    description: "Supporting academic journeys through our annual Candidate Dedication services and Back-to-School provision drives for those in need.",
    icon: <Award className="w-8 h-8" />,
    stats: "Annual",
    color: "bg-purple-50 text-purple-600 border-purple-100"
  }
];

const VALUES = [
  { name: "Spirit Filled", icon: <Sparkles className="w-6 h-6" />, text: "Teaching children to yield to the Holy Spirit and hear God's voice early." },
  { name: "Radical Faith", icon: <Zap className="w-6 h-6" />, text: "Equipping them with a bold, unapologetic faith in Christ Jesus." },
  { name: "Bible Centered", icon: <BookOpen className="w-6 h-6" />, text: "Founding every lesson on the unadulterated Word of God." },
];

const ACTIVITIES = [
  { name: "Creative Arts", icon: <Palette className="w-5 h-5" /> },
  { name: "Children's Choir", icon: <Music className="w-5 h-5" /> },
  { name: "Bible Quiz", icon: <BookOpen className="w-5 h-5" /> },
  { name: "Drama & Skits", icon: <Camera className="w-5 h-5" /> },
  { name: "Sports & Fun", icon: <Smile className="w-5 h-5" /> },
  { name: "Peer Groups", icon: <Users className="w-5 h-5" /> },
];

export default function Children() {
  return (
    <div className="bg-white selection:bg-royal-gold selection:text-royal-blue">
      <SEO 
        title="Children's Ministry" 
        description="Building a Spirit-filled, radical faith generation. Discover our Children's Church, Mega Cell, and outreach programs for the next generation at Louder Fellowship."
      />

      {/* Hero Section */}
      <header className="relative py-24 md:py-32 overflow-hidden bg-royal-blue">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/journey/Childrens cell 5.jpeg" 
            alt="Children's Ministry" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue via-royal-blue/80 to-royal-blue"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-royal-gold text-royal-blue font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-royal-gold/20 mb-8"
          >
            <Star className="w-4 h-4" /> The Next Generation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            Building a <span className="text-royal-gold italic">Spirit-Filled</span> <br /> Generation
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            At Louder Fellowship Children's Ministry, we are planting seeds for a future where every child knows the audible voice of God and walks in radical faith.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#programs" className="px-10 py-5 bg-royal-gold text-royal-blue font-black rounded-3xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-royal-gold/10 text-xs uppercase tracking-widest">
              Explore Programs
            </a>
            <Link to="/contact" className="px-10 py-5 bg-white/10 text-white border border-white/20 font-black rounded-3xl hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md text-xs uppercase tracking-widest">
              Register a Child
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Core Values */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {VALUES.map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-royal-gold/10 rounded-2xl flex items-center justify-center text-royal-gold mx-auto mb-6 group-hover:bg-royal-gold group-hover:text-royal-blue transition-all duration-500 shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-royal-blue mb-3 uppercase tracking-tight">{value.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Image Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute -inset-4 bg-royal-gold/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                  <img 
                    src="/journey/Childrens cell 5.jpeg" 
                    alt="Children gathering" 
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 p-8 bg-white/90 backdrop-blur-md rounded-[2rem] border border-white/20 max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-royal-gold flex items-center justify-center text-royal-blue shadow-lg">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-royal-blue font-black text-lg">Growing daily</h4>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Community Impact</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "We have reached over 500 children through our Saturday cell meetings and school outreaches."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-royal-blue/10 text-royal-blue rounded-full text-[10px] font-black uppercase tracking-widest">
                Our Statistics
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-royal-blue leading-tight tracking-tight">
                Impacting Minds, <br />
                <span className="text-royal-gold">Transforming</span> Souls.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                By investing in the spiritual formation of children, we are ensuring that the audible voice of God continues to resonate through the next generation. Our ministry is hands-on, hearts-on, and Bible-centered.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <span className="block text-4xl font-black text-royal-blue mb-1">500+</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Children Reached</span>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <span className="block text-4xl font-black text-royal-gold mb-1">5+</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Partner Schools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Programs Grid */}
      <section id="programs" className="py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-royal-blue mb-6">Our Weekly Flow</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">From Sunday church to midweek school outreaches, we provide continuous spiritual nourishment for every age group.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PROGRAMS.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-10 rounded-[3rem] border transition-all duration-500 flex flex-col md:flex-row gap-8 items-start hover:shadow-2xl hover:-translate-y-2 ${program.highlight ? 'bg-royal-gold/5 border-royal-gold/20' : 'bg-white border-slate-100'}`}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-12 ${program.color}`}>
                  {program.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-white/80 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-royal-gold transition-colors">
                      {program.stats}
                    </span>
                    <Calendar className="w-4 h-4 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-royal-blue uppercase tracking-tight mb-2 group-hover:text-royal-gold transition-colors">{program.title}</h3>
                  <p className="text-royal-gold font-bold text-xs uppercase tracking-widest mb-6">{program.time}</p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {program.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Bubbles */}
      <section className="py-24 bg-royal-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-gold/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-black mb-8 italic">Every child is <span className="text-royal-gold">Gifted</span></h2>
            <p className="text-white/60 max-w-xl mx-auto font-medium">We create an environment where children can discover their talents and use them for God's glory through various activities.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-royal-gold hover:text-royal-blue transition-all cursor-default shadow-lg"
              >
                <div className="text-royal-gold group-hover:text-royal-blue">{activity.icon}</div>
                <span className="font-black uppercase tracking-widest text-[11px]">{activity.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold mx-auto mb-10 shadow-2xl relative">
            <Heart className="w-10 h-10 animate-pulse fill-current" />
            <div className="absolute inset-0 bg-royal-blue rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-royal-blue mb-8 tracking-tighter">Your Child <br /> <span className="text-royal-gold">Belongs</span> Here</h2>
          <p className="text-xl text-slate-600 mb-12 font-medium">
            Join us this weekend and see your child grow in wisdom, stature, and in favor with God and man.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-royal-blue text-white font-black rounded-full hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl shadow-royal-blue/20 text-sm uppercase tracking-[0.2em]">
              Send an Inquiry
            </Link>
            <Link to="/give" className="w-full sm:w-auto px-12 py-5 bg-white text-royal-blue border border-slate-200 font-black rounded-full hover:border-royal-blue transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
              Support Ministry
            </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 opacity-20 filter grayscale">
             <Star className="w-8 h-8" />
             <Star className="w-8 h-8" />
             <Star className="w-8 h-8" />
          </div>
        </div>
      </section>
    </div>
  );
}
