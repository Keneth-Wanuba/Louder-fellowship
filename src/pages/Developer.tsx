import {
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Wrench,
} from 'lucide-react';
import SEO from '../components/SEO';

const developer = {
  name: 'Keneth Wanuba',
  role: 'Web & Systems Developer',
  location: 'Kampala, Uganda',
  profileImage: '/Meico%20profile.png',
  email: 'kennymeico@gmail.com',
  github: 'https://github.com/Keneth-Wanuba',
  linkedin: 'https://www.linkedin.com/in/keneth-wanuba',
  cvUrl: 'mailto:kennymeico@gmail.com?subject=CV%20Request&body=Hello%20Keneth%2C%20I%20visited%20your%20developer%20page%20and%20would%20like%20to%20request%20your%20CV.',
};

const strengths = [
  'Responsive church, ministry, nonprofit, and community websites',
  'React, TypeScript, Tailwind CSS, routing, SEO, and deployment workflows',
  'Clear donation, contact, project, sermon, and content presentation flows',
  'Simple admin-friendly structures that can grow as the ministry grows',
];

const projects = [
  {
    name: 'Louder Fellowship Website',
    type: 'Ministry website',
    description:
      'A public website for Louder Fellowship and Rehoboth Discipleship Global Ministries, presenting the ministry story, faith statement, sermons, programs, outreach projects, giving channels, and contact information.',
    link: '/',
  },
  {
    name: 'Kingdom Outreach Project Pages',
    type: 'Impact storytelling',
    description:
      'Project listing and detail pages designed to help visitors understand outreach work through photos, locations, categories, impact details, and clear calls to support the mission.',
    link: '/projects',
  },
  {
    name: 'Donation and Contact Experience',
    type: 'Visitor conversion flow',
    description:
      'Focused giving and contact pages that make it easier for viewers to support the ministry, call, email, WhatsApp, or visit the fellowship physically.',
    link: '/give',
  },
];

const cvItems = [
  { label: 'Focus', value: 'Frontend development, ministry websites, user-friendly digital experiences' },
  { label: 'Stack', value: 'React, TypeScript, Tailwind CSS, Vite, SEO, Vercel-ready deployments' },
  { label: 'Strength', value: 'Turning real ministry work into clean pages that visitors can understand quickly' },
  { label: 'Available for', value: 'Websites, redesigns, landing pages, content structuring, and ongoing improvements' },
];

export default function Developer() {
  return (
    <>
      <SEO
        title="Website Developer"
        description="Meet Keneth Wanuba, the web developer behind the Louder Fellowship website. View his work, CV summary, socials, and contact details."
        keywords="Keneth Wanuba, web developer Uganda, Louder Fellowship developer, React developer Kampala, ministry website developer"
      />

      <header className="bg-royal-blue py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-royal-gold uppercase tracking-[0.28em] font-bold mb-5">Website Developer</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Built by {developer.name}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              I design and build clear, responsive digital experiences for ministries, communities, and growing organizations. My work helps people understand the story, see the impact, and take the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${developer.email}`}
                className="bg-royal-gold text-royal-blue px-6 py-3 rounded-full font-bold hover:bg-white transition-all inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
              <a
                href={developer.cvUrl}
                className="border border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-royal-blue transition-all inline-flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Request CV
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <aside className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-6 bg-slate-200">
                <img
                  src={developer.profileImage}
                  alt={`${developer.name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue mb-2">{developer.name}</h2>
              <p className="text-royal-gold font-bold uppercase tracking-widest text-xs mb-6">{developer.role}</p>

              <div className="space-y-4 text-slate-600 mb-8">
                <p className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-royal-gold flex-shrink-0" />
                  <span>{developer.location}</span>
                </p>
                <a href={`mailto:${developer.email}`} className="flex items-center gap-3 hover:text-royal-gold transition-colors">
                  <Mail className="w-5 h-5 text-royal-gold flex-shrink-0" />
                  <span>{developer.email}</span>
                </a>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <a href={developer.github} target="_blank" rel="noreferrer" className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-royal-blue hover:border-royal-gold transition-all flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <a href={developer.linkedin} target="_blank" rel="noreferrer" className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-royal-blue hover:border-royal-gold transition-all flex items-center justify-center gap-2">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a href={`mailto:${developer.email}`} className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-royal-blue hover:border-royal-gold transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Email
                </a>
              </div>
            </aside>

            <div>
              <p className="text-royal-gold uppercase tracking-[0.25em] font-bold text-xs mb-4">What I Do</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-royal-blue mb-6">
                I build websites that make the message easy to find, trust, and act on.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                This site was developed to help visitors move naturally from discovery to connection: learning the ministry story, browsing outreach work, listening to sermons, giving, and reaching the team without confusion.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {strengths.map((item) => (
                  <div key={item} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
                    <Sparkles className="w-6 h-6 text-royal-gold mb-4" />
                    <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
            <div>
              <p className="text-royal-gold uppercase tracking-[0.25em] font-bold text-xs mb-4">CV Snapshot</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal-blue mb-6">Professional Profile</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                A concise overview of my current web development focus. For a full CV, use the request button and I will send the latest copy directly.
              </p>
              <a
                href={developer.cvUrl}
                className="bg-royal-blue text-white px-6 py-3 rounded-full font-bold hover:bg-royal-gold hover:text-royal-blue transition-all inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Request Full CV
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {cvItems.map((item) => (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-royal-gold uppercase tracking-widest text-xs font-bold mb-3">{item.label}</p>
                  <p className="text-slate-700 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-royal-gold uppercase tracking-[0.25em] font-bold text-xs mb-4">Selected Work</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal-blue">Projects I Have Worked On</h2>
            </div>
            <a href={developer.github} target="_blank" rel="noreferrer" className="text-royal-blue font-bold hover:text-royal-gold transition-colors inline-flex items-center gap-2">
              View GitHub
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article key={project.name} className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-royal-gold/10 rounded-xl flex items-center justify-center text-royal-gold mb-6">
                  {project.type.includes('website') ? <Globe2 /> : project.type.includes('flow') ? <Wrench /> : <BriefcaseBusiness />}
                </div>
                <p className="text-royal-gold uppercase tracking-widest text-xs font-bold mb-3">{project.type}</p>
                <h3 className="text-2xl font-serif font-bold text-royal-blue mb-4">{project.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>
                <a href={project.link} className="font-bold text-royal-blue hover:text-royal-gold transition-colors inline-flex items-center gap-2">
                  Open Project
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
