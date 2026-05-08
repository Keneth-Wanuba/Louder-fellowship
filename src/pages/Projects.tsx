import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import {
  ChevronDown, MapPin, Calendar, Heart, Users, Globe,
  Utensils, Star, Quote, ArrowRight, ShieldCheck, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Project, projects } from '../data/projects';

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
    Evangelism: 'bg-royal-gold text-royal-blue',
    'Humanitarian Aid': 'bg-teal-500 text-white',
    Youth: 'bg-purple-500 text-white',
    Health: 'bg-pink-500 text-white',
    Education: 'bg-blue-500 text-white'
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
              transition={{ duration: 1.5, ease: 'easeOut' }}
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
  const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.type === filter);

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

      <section className="relative min-h-[90vh] pt-5 pb-48 md:pb-56 flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/80 to-royal-blue z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.2),transparent_60%)] z-10" />
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
            <h1 className="text-4xl md:text-8xl font-serif font-black mb-8 leading-tight uppercase tracking-tighter">
              Transforming <span className="text-royal-gold italic">Lives</span>.<br />
              <span className="text-royal-gold italic">One Community</span> at a Time.
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Explore our recent outreach projects - from rural evangelism to emergency aid - and witness the power of your partnership.
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

      <section className="relative z-30 -mt-28 md:-mt-32 container mx-auto px-6">
        <div className="bg-royal-blue rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_20px_rgba(212,175,55,0.2)] border-2 border-royal-gold/40 gradient-royal-blue">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <Counter icon={<Users className="w-6 h-6" />} value="12,000+" label="Lives Reached" />
            <Counter icon={<Globe className="w-6 h-6" />} value="8" label="Outreach Projects" />
            <Counter icon={<MapPin className="w-6 h-6" />} value="5" label="Regions Covered" />
            <Counter icon={<Utensils className="w-6 h-6" />} value="3,400+" label="Meals Distributed" />
          </div>
        </div>
      </section>

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

      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div layout className="grid lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

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
                Reaching the little ones in <span className="text-royal-gold">Children's ministry</span>
              </h2>
              <p className="text-xl text-white/70 font-light leading-relaxed">
                Children's ministry in school ministry, children's mega cell and children's church isn't just about sharing meals and games; it's about building a sustainable, Spirit filled, radical faith generation out of our still blank little ones before they grow up. We are planting a seed for the future of the church, nurturing a generation that will carry the torch of faith with passion and purpose. Through engaging activities, heartfelt discipleship, and a loving community, we're seeing lives transformed and destinies shaped in the most beautiful way.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-1 bg-royal-gold rounded-full" />
                  <p className="text-white font-bold tracking-widest uppercase text-xs">Project Vision</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-2">500+</p>
                    <p className="text-white/50 text-sm uppercase tracking-widest">Schools reached</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-2">1000+</p>
                    <p className="text-white/50 text-sm uppercase tracking-widest">Baptisms every year</p>
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
                  src="/journey/Childrens cell tr Derrick.jpeg"
                  alt="Spotlight"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-xs border border-slate-100 italic font-serif">
                <Quote className="w-10 h-10 text-royal-gold mb-4" />
                <p className="text-slate-700 leading-relaxed">
                  "The children's ministry has transformed our community. We see the impact of faith being passed down through generations."
                </p>
                <p className="mt-4 font-bold text-royal-blue not-italic">- Tr. Ishmael, Headteacher, Matvic P/S</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-royal-blue mb-6">Stories of Transformation</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto text-lg italic uppercase tracking-widest">Faces of the people your support changes every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: 'Maama King.',
                place: 'Kasubi',
                quote: 'The Lord instructed me to start praying from Rehoboth. I have not regretted it. I have seen the hand of God in my life and family since then.',
                img: '/journey/Maama King.jpeg'
              },
              {
                name: 'Florence A.',
                place: 'Gayaza',
                quote: 'The church stood with me in my most trying time when I lost my twins and almost died.',
                img: '/journey/Florence.jpg'
              },
              {
                name: 'Gloria K.',
                place: 'Bombo',
                quote: 'I have been raised spiritually, my ministry in the army is prospering, my family is doing well, I have no more worries about my health and finances. I am a living testimony of the power of prayer and partnership with Rehoboth.',
                img: '/journey/Gloria.PNG'
              },
              {
                name: 'Mama Mukisa',
                place: 'Kawaala',
                quote: 'The doctors prayed with me before the checkup. I felt healed in my spirit first.',
                img: ''
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

      {/*
      <section className="py-32 bg-white container mx-auto px-6">
        <div className="bg-royal-blue rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
          Funding section intentionally commented out.
        </div>
      </section>
      */}
    </div>
  );
}
