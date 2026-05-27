import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavItem[];
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className={`flex items-center gap-1.5 py-8 px-2 transition-all font-black uppercase tracking-[0.15em] text-[12px] ${
          isOpen ? 'text-royal-gold' : 'text-white hover:text-royal-gold/80'
        }`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-royal-gold' : 'text-white/40'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] -ml-4"
          >
            <div className="p-3 bg-slate-50/50 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3">
                {label} Section
              </span>
            </div>
            <div className="p-2 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-royal-blue/5 group transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && (
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-royal-blue group-hover:text-royal-gold group-hover:border-royal-gold/40 group-hover:shadow-lg transition-all duration-300">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-royal-blue uppercase tracking-wider group-hover:text-royal-gold transition-colors">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="h-1 bg-royal-gold w-full opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;
