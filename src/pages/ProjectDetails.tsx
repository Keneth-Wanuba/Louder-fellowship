import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Calendar, Users, Heart,
  ShieldCheck, Quote, Star, Activity, Image as ImageIcon
} from 'lucide-react';
import SEO from '../components/SEO';
import { projects } from '../data/projects';
import { Skeleton } from '../components/ui/Skeleton';

const ProjectDetailsSkeleton = () => (
  <div className="bg-slate-50 min-h-screen pb-20">
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-200">
      <div className="container mx-auto px-6 relative z-10">
        <Skeleton className="w-32 h-4 mb-8 bg-slate-300" />
        <div className="max-w-4xl space-y-6">
          <Skeleton className="w-24 h-6 rounded-full bg-slate-300" />
          <Skeleton className="w-3/4 h-16 bg-slate-300" />
          <div className="flex gap-6">
            <Skeleton className="w-32 h-6 bg-slate-300" />
            <Skeleton className="w-32 h-6 bg-slate-300" />
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 -mt-10 relative z-20">
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="aspect-video w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const project = projects.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-royal-blue mb-4">Project Not Found</h1>
          <p className="text-slate-500 mb-8">The project you are looking for does not exist.</p>
          <Link to="/projects" className="px-8 py-3 bg-royal-blue text-white rounded-full font-bold hover:bg-royal-gold transition-all">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const badgeColors = {
    'Evangelism': 'bg-royal-gold text-royal-blue',
    'Humanitarian Aid': 'bg-teal-500 text-white',
    'Youth': 'bg-purple-500 text-white',
    'Health': 'bg-pink-500 text-white',
    'Education': 'bg-blue-500 text-white'
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO
        title={`${project.title} - Kingdom Outreach`}
        description={project.description}
        keywords={`outreach, ${project.type}, ${project.location}, Louder Fellowship projects`}
      />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-royal-blue">
        <div className="absolute inset-0 z-0">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-royal-blue via-royal-blue/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors uppercase tracking-widest text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>
          
          <div className="max-w-4xl">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg mb-6 ${badgeColors[project.type]}`}>
              {project.type}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-royal-gold" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-royal-gold" />
                <span>{project.timeframe}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100"
            >
              <h2 className="text-3xl font-serif font-bold text-royal-blue mb-6">Project Overview</h2>
              <p className="text-lg text-slate-700 leading-relaxed font-light whitespace-pre-line">
                {project.fullDescription}
              </p>
            </motion.div>

            {/* Image Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <ImageIcon className="w-6 h-6 text-royal-gold" />
                  <h2 className="text-3xl font-serif font-bold text-royal-blue">Gallery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden aspect-video relative group">
                      <img src={img} alt={`${project.title} gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Impact Stories */}
            {project.stories && project.stories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif font-bold text-royal-blue mb-6">Impact Stories</h2>
                {project.stories.map((story, idx) => (
                   <div key={idx} className="bg-royal-gold/10 p-8 rounded-[2rem] border border-royal-gold/20 relative">
                     <Quote className="absolute top-8 right-8 w-12 h-12 text-royal-gold/20" />
                     <p className="text-xl font-serif text-slate-800 italic leading-relaxed mb-6 pr-10">"{story.quote}"</p>
                     <p className="font-bold text-royal-blue uppercase tracking-widest text-sm">— {story.name}</p>
                   </div>
                ))}
              </motion.div>
            )}
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Funding Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 sticky top-28"
            >
              <h3 className="text-xl font-bold text-royal-blue mb-6">Project Progress</h3>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-500">Funded</span>
                  <span className="text-2xl font-bold text-royal-gold">{project.funded}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${project.funded === 100 ? 'bg-green-500' : 'bg-royal-gold'}`}
                    style={{ width: `${project.funded}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {project.impactStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="text-slate-600">{stat.label}</span>
                    <span className="font-bold text-royal-blue text-lg">{stat.value}</span>
                  </div>
                ))}
              </div>

              {project.funded < 100 ? (
                <Link to="/give" className="w-full flex items-center justify-center gap-2 py-4 bg-royal-blue text-white rounded-xl font-bold hover:bg-royal-gold transition-all shadow-lg">
                  <Heart className="w-5 h-5" /> Support This Project
                </Link>
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2 py-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200">
                  <ShieldCheck className="w-6 h-6" /> 
                  <span>Fully Funded & Completed</span>
                  <span className="text-xs font-normal text-green-600 block mt-1">Thank you for your generous support.</span>
                </div>
              )}
            </motion.div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
