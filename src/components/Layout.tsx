import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Facebook, Twitter, Youtube, Instagram, Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-royal-blue text-white sticky top-0 z-50 shadow-xl border-b border-royal-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex flex-col">
                <span className="text-2xl font-serif font-bold tracking-tighter text-royal-gold leading-none">LOUDER</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">Fellowship</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-royal-gold transition-colors font-medium">Home</Link>
              <Link to="/about" className="hover:text-royal-gold transition-colors">Our Story</Link>
              <Link to="/faith" className="hover:text-royal-gold transition-colors">Statement of Faith</Link>
              <Link to="/programs" className="hover:text-royal-gold transition-colors">Programs</Link>
              <Link to="/sermons" className="hover:text-royal-gold transition-colors">Sermons</Link>
              <Link to="/give" className="hover:text-royal-gold transition-colors">Donate</Link>
              <Link to="/contact" className="bg-royal-gold text-royal-blue px-5 py-2 rounded-full font-bold hover:bg-white transition-all">Contact</Link>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-royal-blue border-t border-royal-gold/20 pb-6 px-4">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-royal-gold">Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>Our Story</Link>
              <Link to="/faith" onClick={() => setIsMenuOpen(false)}>Statement of Faith</Link>
              <Link to="/programs" onClick={() => setIsMenuOpen(false)}>Programs</Link>
              <Link to="/sermons" onClick={() => setIsMenuOpen(false)}>Sermons</Link>
              <Link to="/give" onClick={() => setIsMenuOpen(false)}>Donate</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
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
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex flex-col mb-6">
                <span className="text-3xl font-serif font-bold tracking-tighter text-royal-gold leading-none">LOUDER</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/80">Fellowship</span>
              </Link>
              <p className="text-white/60 max-w-md mb-8">
                A Christ and Bible believing church under Louder Fellowship, based in Kampala. Our heart is to mentor believers into mature Christians who light up their environments.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/louderfellowship" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royal-gold hover:border-royal-gold transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="https://x.com/louder_fe" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royal-gold hover:border-royal-gold transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="https://www.youtube.com/@louderfellowship1828" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royal-gold hover:border-royal-gold transition-all"><Youtube className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/rehoboth_louder/" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royal-gold hover:border-royal-gold transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="https://t.me/+c-qcHSR4-2U0YTA0" target="_blank" rel="noreferrer" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royal-gold hover:border-royal-gold transition-all" title="Telegram"><Send className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-royal-gold">Quick Links</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/faith" className="hover:text-white transition-colors">Statement of Faith</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link to="/sermons" className="hover:text-white transition-colors">Sermons</Link></li>
                <li><Link to="/give" className="hover:text-white transition-colors">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-royal-gold">Contact Info</h4>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-royal-gold flex-shrink-0" />
                  <span>25 Hajji Juma Kayondo Rd, Kampala (8HP2+4G)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-royal-gold flex-shrink-0" />
                  <a href="tel:+256701751463" className="hover:text-royal-gold transition-colors">+256 701751463</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-royal-gold flex-shrink-0" />
                  <a href="mailto:rehobothdgul@gmail.com" className="hover:text-royal-gold transition-colors">rehobothdgul@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 text-center text-white/40 text-sm">
            <p>&copy; {(new Date()).getFullYear()} Louder Fellowship & Rehoboth Discipleship Global Ministries. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
