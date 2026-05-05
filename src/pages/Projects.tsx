import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { 
  ChevronDown, MapPin, Calendar, Heart, Users, Globe, 
  Utensils, Activity, GraduationCap, Star, Quote, ArrowRight,
  ShieldCheck, Wallet, Sparkles, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Project, projects } from '../data/projects';

// --- Components ---

const Counter = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[,+]/g, ''));
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="flex justify-center mb-3">
        <div className="p-4 bg-royal-gold/10 rounded-full text-royal-gold backdrop-blur-sm border border-royal-gold/20">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-serif font-bold text-white mb-1">
        {count.toLocaleString()}{value.includes('+') ? '+' : ''}
      </div>
      <div className="text-sm font-medium text-white/70 uppercase tracking-widest">{label}</div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const badgeColors = {
    'Evangelism': 'bg-royal-gold text-royal-blue',
    'Humanitarian Aid': 'bg-teal-500 text-white',
    'Youth': 'bg-purple-500 text-white',
    'Health': 'bg-pink-500 text-white',
    'Education': 'bg-blue-500 text-white'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 hover:border-royal-gold/50 transition-all duration-300 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${badgeColors[project.type]}`}>
            {project.type}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-serif font-bold text-royal-blue mb-4 group-hover:text-royal-gold transition-colors">
          {project.title}
        </h3>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm italic">
            <MapPin className="w-4 h-4 text-royal-gold" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm italic">
            <Calendar className="w-4 h-4 text-royal-gold" />
            <span>{project.timeframe}</span>
          </div>
        </div>
        
        <p className="text-slate-600 mb-8 line-clamp-2 font-light leading-relaxed">
          {project.description}
        </p>
        
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-royal-blue uppercase tracking-tighter">Funding Progress</span>
            <span className="text-royal-gold font-bold">{project.funded}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${project.funded}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full ${project.funded === 100 ? 'bg-green-500' : 'bg-royal-gold'}`}
            />
          </div>
          {project.funded === 100 && (
            <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Fully Funded & Completed
            </p>
          )}
        </div>
        
        <Link to={`/projects/${project.id}`} className="w-full flex items-center justify-center gap-2 py-4 bg-royal-blue text-white rounded-xl font-bold hover:bg-royal-gold transition-all group/btn">
          <span>Read More Impact</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.type === filter);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title="Kingdom Outreach"
        description="Explore the impact of Louder Fellowship and Rehoboth Ministries through our outreach projects in Uganda - from crusades and relief to medical camps and youth conferences."
        keywords="church outreach Uganda, Christian aid Kampala, evangelical missions, humanitarian work Uganda, community development Kampala"
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] pt-5 pb-32 flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/80 to-royal-blue z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.2),transparent_60%)] z-10"></div>
          <img 
            src="https://i.ibb.co/S4N0hFVW/image.png" 
            alt="Outreach" 
            className="w-full h-full object-cover animate-subtle-zoom"
          />
        </motion.div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-royal-gold text-royal-blue font-bold text-xs uppercase tracking-[0.3em] mb-6">
              Our Kingdom Work
            </span>
            <h1 className="text-6xl md:text-6xl font-serif font-black mb-8 leading-tight uppercase tracking-tighter">
              Transforming <span className="text-royal-gold italic">Lives</span>.<br />
              <span className="text-royal-gold italic">Communities</span> at a Time.
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Explore our recent outreach projects — from rural evangelism to emergency aid — and witness the power of your partnership.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#projects-grid" className="px-10 py-5 bg-white text-royal-blue rounded-full font-bold text-lg hover:bg-royal-gold hover:text-white transition-all shadow-2xl">
                View Projects ↓
              </a>
              <Link to="/give" className="px-10 py-5 bg-royal-gold text-royal-blue rounded-full font-bold text-lg hover:bg-white transition-all shadow-2xl">
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <ChevronDown className="w-10 h-10" />
        </motion.div>
      </section>

      {/* 2. IMPACT COUNTER BAR */}
      <section className="relative z-30 -mt-16 container mx-auto px-6">
        <div className="bg-royal-blue rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_20px_rgba(212,175,55,0.2)] border-2 border-royal-gold/40 gradient-royal-blue">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <Counter icon={<Users className="w-6 h-6" />} value="12,000+" label="Lives Reached" />
            <Counter icon={<Globe className="w-6 h-6" />} value="8" label="Outreach Projects" />
            <Counter icon={<MapPin className="w-6 h-6" />} value="5" label="Regions Covered" />
            <Counter icon={<Utensils className="w-6 h-6" />} value="3,400+" label="Meals Distributed" />
          </div>
        </div>
      </section>

      {/* 3. FILTER BAR (Sticky) */}
      <div id="projects-grid" className="sticky top-20 z-40 py-4 md:py-8 bg-slate-50/90 backdrop-blur-md">
        <div className="w-full">
          <div className="overflow-x-auto hide-scrollbar px-4 md:px-6 pb-2">
            <div className="flex justify-start md:justify-center min-w-full">
              <div className="flex gap-1 md:gap-2 bg-white p-2 rounded-full shadow-md border border-slate-100 w-max">
                <div className="p-2 md:p-3 text-royal-gold hidden sm:flex items-center"><Filter className="w-4 h-4 md:w-5 md:h-5" /></div>
                {['All', 'Evangelism', 'Humanitarian Aid', 'Youth', 'Health', 'Education'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                      filter === cat 
                        ? 'bg-royal-gold text-royal-blue shadow-inner' 
                        : 'text-slate-500 hover:text-royal-blue hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PROJECTS GRID */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            layout
            className="grid lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 5. FEATURED SPOTLIGHT */}
      <section className="py-32 bg-royal-blue overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=1000" 
            alt="Bg Decor" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-gold/20 text-royal-gold font-bold text-xs uppercase tracking-widest border border-royal-gold/30">
                <Star className="w-4 h-4" /> Featured Impact
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                Reaching the Unreached in <span className="text-royal-gold">Eastern Uganda</span>
              </h2>
              <p className="text-xl text-white/70 font-light leading-relaxed">
                The Eastern Uganda Evangelism tour isn't just about sharing messages; it's about building sustainable faith communities in villages that haven't seen a church in generations.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-1 bg-royal-gold rounded-full" />
                  <p className="text-white font-bold tracking-widest uppercase text-xs">Project Vision</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-2">50+</p>
                    <p className="text-white/50 text-sm uppercase tracking-widest">Villages Active</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-2">1,200</p>
                    <p className="text-white/50 text-sm uppercase tracking-widest">Baptisms in 2024</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/give" className="inline-flex items-center gap-4 px-12 py-6 bg-royal-gold text-royal-blue rounded-full font-bold text-xl hover:bg-white transition-all shadow-2xl">
                  Fund This Project
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white/10">
          <img 
            src="https://i.ibb.co/pj6440YQ/image.png" 
            alt="Spotlight" 
            className="w-full aspect-[4/5] object-cover"
          />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-xs border border-slate-100 italic font-serif">
                <Quote className="w-10 h-10 text-royal-gold mb-4" />
                <p className="text-slate-700 leading-relaxed">
                  "For the first time in 40 years, our village has hope. Louder Fellowship didn't just bring words, they brought family."
                </p>
                <p className="mt-4 font-bold text-royal-blue not-italic">— Elder Masaba, Mbale District</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. IMPACT STORIES CAROUSEL (Simplified for one-page feel) */}
      <section className="py-32 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-royal-blue mb-6">Stories of Transformation</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto text-lg italic uppercase tracking-widest">Faces of the people your support changes every day.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                name: "Sarah A.", 
                place: "Karamoja", 
                quote: "When the drought hit, we thought we were finished. The food arrived just in time.",
                img: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400" 
              },
              { 
                name: "John Baptist", 
                place: "Jinja", 
                quote: "The conference showed me that as a young man, I have a place in the Kingdom.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
              },
              { 
                name: "Mama Florence", 
                place: "Masaka", 
                quote: "The doctors prayed with me before the checkup. I felt healed in my spirit first.",
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" 
              }
            ].map((story, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, borderColor: 'rgba(212, 175, 55, 0.5)' }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center transition-all duration-300"
              >
                <Quote className="w-12 h-12 text-royal-gold/30 mb-8" />
                <p className="text-xl font-serif text-slate-700 leading-relaxed mb-8 italic">"{story.quote}"</p>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-royal-gold/20 shadow-lg">
                  <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <div className="font-bold text-royal-blue text-lg">{story.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-royal-gold font-bold">{story.place}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION / FUNDING SECTION */}
      <section className="py-32 bg-white container mx-auto px-6">
        <div className="bg-royal-blue rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
          {/* Background Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal-gold/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royal-gold/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Every Gift Transforms a Life</h2>
            <p className="text-white/70 text-xl font-light">Join us in this mission by becoming a monthly partner. Choose a tier that resonates with your heart.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10 relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-12 rounded-[3rem] border border-white/10 flex flex-col items-center hover:bg-white/10 transition-all border-b-4 border-b-royal-gold">
              <div className="w-16 h-16 bg-royal-gold/20 rounded-2xl flex items-center justify-center text-royal-gold mb-8 uppercase tracking-widest text-xs font-black">🌱 SEED</div>
              <p className="text-white/60 text-sm uppercase tracking-[0.3em] font-black mb-4">Seed Partner</p>
              <div className="text-5xl font-bold text-white mb-8">$25<span className="text-xl text-white/40">/mo</span></div>
              <ul className="space-y-4 mb-12 text-white/70 w-full">
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-royal-gold" /> Supplies 10 Outreach Kits</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-royal-gold" /> Feeds 2 Families weekly</li>
              </ul>
              <Link to="/give" className="w-full py-5 bg-white text-royal-blue rounded-2xl font-bold text-center hover:bg-royal-gold hover:text-white transition-all">Select Tier</Link>
            </div>

            <div className="bg-white shadow-[0_40px_70px_-15px_rgba(0,0,0,0.5)] p-12 rounded-[3rem] flex flex-col items-center scale-105 relative z-20 border-4 border-royal-gold">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-royal-gold text-royal-blue px-8 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Most Impactful</div>
              <div className="w-16 h-16 bg-royal-gold/20 rounded-2xl flex items-center justify-center text-royal-gold mb-8 uppercase tracking-widest text-xs font-black">🔥 IMPACT</div>
              <p className="text-royal-blue/60 text-sm uppercase tracking-[0.3em] font-black mb-4">Impact Partner</p>
              <div className="text-5xl font-bold text-royal-blue mb-8">$100<span className="text-xl text-royal-blue/40">/mo</span></div>
              <ul className="space-y-4 mb-12 text-slate-500 w-full">
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-royal-gold" /> Funds 1 Remote Crusade</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-royal-gold" /> Community Health Kit</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-royal-gold" /> Youth Discipleship Pack</li>
              </ul>
              <Link to="/give" className="w-full py-5 bg-royal-gold text-royal-blue rounded-2xl font-bold text-center hover:bg-royal-blue hover:text-white transition-all shadow-xl">Select Tier</Link>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-12 rounded-[3rem] border border-white/10 flex flex-col items-center hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-royal-gold/20 rounded-2xl flex items-center justify-center text-royal-gold mb-8 uppercase tracking-widest text-xs font-black">👑 BUILDER</div>
              <p className="text-white/60 text-sm uppercase tracking-[0.3em] font-black mb-4">Kingdom Builder</p>
              <div className="text-5xl font-bold text-white mb-8">Custom</div>
              <ul className="space-y-4 mb-12 text-white/70 w-full text-center">
                <li className="italic">Support large scale infrastructure and long-term kingdom investments.</li>
              </ul>
              <Link to="/give" className="w-full py-5 bg-white/10 text-white border-2 border-white/20 rounded-2xl font-bold text-center hover:bg-white hover:text-royal-blue transition-all">Donate Any Amount</Link>
            </div>
          </div>
          
          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 text-white/50 border-t border-white/10 pt-12">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-royal-gold" />
              <span className="text-sm font-bold tracking-widest uppercase">100% Ministry Direct</span>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-royal-gold" />
              <span className="text-sm font-bold tracking-widest uppercase">Secure Giving</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-royal-gold" />
              <span className="text-sm font-bold tracking-widest uppercase">Tax Deductible Receipt</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
