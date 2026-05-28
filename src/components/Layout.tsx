import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Menu, X, Facebook, Twitter, Youtube, Instagram, Send, MapPin, Phone, Mail, 
  ChevronDown, BookOpen, ShieldCheck, Globe, Calendar, Play, Quote, Heart,
  Info, Sprout, MessageSquare, Cross, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NavDropdown from './NavDropdown';

const ABOUT_ITEMS = [
  { label: 'Our Story', href: '/about', icon: <BookOpen className="w-5 h-5" />, description: 'The journey and vision of our ministry.' },
  { label: 'Leadership', href: '/leadership', icon: <Compass className="w-5 h-5" />, description: 'Meet our vision bearer.' },
  { label: 'Statement of Faith', href: '/faith', icon: <ShieldCheck className="w-5 h-5" />, description: 'What we believe and stand for.' },
];

const MINISTRY_ITEMS = [
  { label: 'Devotions', href: '/devotions', icon: <BookOpen className="w-5 h-5" />, description: 'Daily bread for your spiritual growth.' },
  { label: "Children's Ministry", href: '/children', icon: <Heart className="w-5 h-5" />, description: 'Building a Spirit-filled generation.' },
  { label: 'Programs', href: '/programs', icon: <Calendar className="w-5 h-5" />, description: 'Our weekly and special gatherings.' },
  { label: 'Sermons', href: '/sermons', icon: <Play className="w-5 h-5" />, description: 'Impactful messages from our ministers.' },
];

const COMMUNITY_ITEMS = [
  { label: 'Kingdom Outreach', href: '/projects', icon: <Globe className="w-5 h-5" />, description: 'Winning souls and spreading the gospel.' },
  { label: 'Testimonies', href: '/testimonies', icon: <Quote className="w-5 h-5" />, description: 'Real stories of God\'s faithfulness.' },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (label: string) => {
    setActiveAccordion(activeAccordion === label ? null : label);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Top Bar */}
      <div className="bg-[#0f1d4a] py-1.5 px-8 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-royal-gold/20 z-[60] relative">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-royal-gold">School of ministry & Sunday service</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-royal-gold" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Sun @ 07:00 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-royal-gold" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Kasubi, Kampala</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-royal-blue text-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'h-16 shadow-2xl py-0' : 'h-24 shadow-xl py-2'
      } border-b border-royal-gold flex items-center`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="flex flex-col">
                  <span className={`font-serif font-black tracking-tighter text-royal-gold leading-none transition-all duration-300 ${
                    isScrolled ? 'text-2xl' : 'text-4xl'
                  }`}>LOUDER</span>
                  <span className={`uppercase tracking-[0.3em] font-black text-white transition-all duration-300 ${
                    isScrolled ? 'text-[8px]' : 'text-[12px]'
                  }`}>Fellowship</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center">
              <div className="flex items-center h-full">
                <Link to="/" className="text-[12px] font-black uppercase tracking-[0.15em] px-4 hover:text-royal-gold transition-all relative group h-full flex items-center">
                  Home
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-royal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                </Link>
                
                <div className="w-[1px] h-4 bg-royal-gold/40 mx-1" />
                
                <div className="relative group h-full flex items-center">
                  <NavDropdown label="About" items={ABOUT_ITEMS} />
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-royal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                </div>
                
                <div className="w-[1px] h-4 bg-royal-gold/40 mx-1" />
                
                <div className="relative group h-full flex items-center">
                  <NavDropdown label="Ministry" items={MINISTRY_ITEMS} />
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-royal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                </div>
                
                <div className="w-[1px] h-4 bg-royal-gold/40 mx-1" />
                
                <div className="relative group h-full flex items-center">
                  <NavDropdown label="Community" items={COMMUNITY_ITEMS} />
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-royal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                </div>
                
                <div className="w-[1px] h-4 bg-royal-gold/40 mx-1" />
                
                <Link to="/give" className="text-[12px] font-black uppercase tracking-[0.15em] px-4 hover:text-royal-gold transition-all relative group h-full flex items-center">
                  Donate
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-royal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                </Link>
              </div>

              <div className="ml-8">
                <Link 
                  to="/contact" 
                  className={`bg-royal-gold text-royal-blue px-8 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center border-2 border-royal-gold ${
                    isScrolled ? 'py-2.5' : 'py-3'
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'text-royal-gold' : 'text-white'}`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Reverted to original style */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-royal-blue border-y border-royal-gold pb-8 px-6 animate-fade-in shadow-2xl z-50 overflow-y-auto max-h-[calc(100vh-100px)]">
            <div className="flex flex-col space-y-6 pt-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-royal-gold font-black uppercase tracking-widest text-xs">Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Our Story</Link>
              <Link to="/leadership" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Leadership</Link>
              <Link to="/faith" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Statement of Faith</Link>
              <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Kingdom Outreach</Link>
              <Link to="/children" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Children's Ministry</Link>
              <Link to="/programs" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Programs</Link>
              <Link to="/sermons" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Sermons</Link>
              <Link to="/testimonies" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Testimonies</Link>
              <Link to="/devotions" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Devotions</Link>
              <Link to="/give" onClick={() => setIsMenuOpen(false)} className="text-white/80 font-black uppercase tracking-widest text-xs hover:text-royal-gold transition-colors">Donate</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="bg-royal-gold text-royal-blue text-center p-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-royal-blue text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src="https://i.ibb.co/Z1mL88kL/image.png" alt="Louder Fellowship Logo" className="h-16 w-auto" />
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold tracking-tighter text-royal-gold leading-none">LOUDER</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/80">Fellowship</span>
                </div>
              </Link>
              <p className="text-white/60 max-w-md mb-8">
                A Christ and Bible believing church under Louder Fellowship, based in Kampala. Our heart is to mentor believers into mature Christians who light up their environments.
              </p>
                <div className="flex space-x-4">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/louderfellowship" },
                    { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/louder_fe" },
                    { icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/@louderfellowship1828" },
                    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/rehoboth_louder/" },
                    { icon: <Send className="w-5 h-5" />, href: "https://t.me/+c-qcHSR4-2U0YTA0" }
                  ].map((social, idx) => (
                    <a 
                      key={idx}
                      href={social.href} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-royal-gold hover:text-royal-blue hover:border-royal-gold hover:-translate-y-1 transition-all duration-300 shadow-lg"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-royal-gold">Quick Links</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link to="/children" className="hover:text-white transition-colors">Children's Ministry</Link></li>
                <li><Link to="/faith" className="hover:text-white transition-colors">Statement of Faith</Link></li>
                <li><Link to="/projects" className="hover:text-white transition-colors">Outreach Projects</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link to="/sermons" className="hover:text-white transition-colors">Sermons</Link></li>
                <li><Link to="/testimonies" className="hover:text-white transition-colors">Testimonies</Link></li>
                <li><Link to="/devotions" className="hover:text-white transition-colors">Devotions</Link></li>
                <li><Link to="/give" className="hover:text-white transition-colors">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-royal-gold">Contact Info</h4>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-royal-gold shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm mt-2 text-white/80">25 Hajji Juma Kayondo Rd, Kampala (8HP2+4G)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-royal-gold shadow-md">
                    <Phone className="w-5 h-5" />
                  </div>
                  <a href="tel:+256701751463" className="hover:text-royal-gold transition-colors text-sm font-medium text-white/80 tracking-wide">+256 701751463</a>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-royal-gold shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <a href="mailto:rehobothdgul@gmail.com" className="hover:text-royal-gold transition-colors text-sm font-medium text-white/80 tracking-wide">rehobothdgul@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 text-center flex flex-col items-center gap-4">
            <p className="text-white/40 text-sm">&copy; {(new Date()).getFullYear()} Louder Fellowship & Rehoboth Discipleship Global Ministries. All rights reserved.</p>
            <Link to="/developer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-royal-gold/40 hover:text-royal-gold transition-colors duration-300">
              <span className="w-4 h-px bg-current opacity-20"></span>
              Developer Kenny Meico
              <span className="w-4 h-px bg-current opacity-20"></span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
