import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Leaf, MessageCircle } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Нүүр', path: '/' },
  { name: 'Амралт', path: '/experience' },
  { name: 'Хаус', path: '/houses' },
  { name: 'Эко Аялал', path: '/eco-tour' },
  { name: 'Мэдээлэл', path: '/news' },
  { name: 'Захиалга', path: '/booking' },
  { name: 'Галерей', path: '/gallery' },
  { name: 'Холбоо барих', path: '/contact' },
];

const FallingLeaves = () => {
  const [leaves] = useState(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 10,
    initialX: Math.random() * 40 - 20,
    animateX: Math.random() * 40 - 20,
    rotate: 360 + Math.random() * 360
  })));

  const [groundedLeaves] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 15,
    rotate: Math.random() * 360,
    size: Math.random() * 15 + 10,
    opacity: Math.random() * 0.15 + 0.05
  })));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Falling Leaves */}
      {leaves.map((leaf) => (
        <motion.div
          key={`falling-${leaf.id}`}
          initial={{ 
            top: -50,
            x: leaf.initialX + "px", 
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            top: "100%", 
            x: leaf.animateX + "px",
            rotate: leaf.rotate,
            opacity: [0, 0.2, 0.2, 0]
          }}
          transition={{ 
            duration: leaf.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: leaf.delay
          }}
          className="absolute text-white"
          style={{
            left: `${leaf.left}%`,
          }}
        >
          <Leaf size={leaf.size} fill="currentColor" />
        </motion.div>
      ))}

      {/* Grounded Leaves (The Pile) */}
      <div className="absolute bottom-0 left-0 right-0 h-12">
        {groundedLeaves.map((leaf) => (
          <div
            key={`grounded-${leaf.id}`}
            className="absolute text-white"
            style={{
              left: `${leaf.left}%`,
              bottom: `${leaf.bottom}px`,
              transform: `rotate(${leaf.rotate}deg)`,
              opacity: leaf.opacity
            }}
          >
            <Leaf size={leaf.size} fill="currentColor" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12",
        (isScrolled || isMenuOpen) ? "py-4 bg-white shadow-sm" : "py-6 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
            <img 
              src="https://lh3.googleusercontent.com/d/18uAV6mFKrTaRXMtml9Qu0ENa3DfsgMEA" 
              alt="SUUT RESORT Logo" 
              className={cn(
                "h-12 w-auto transition-all duration-300",
                (!isScrolled && !isMenuOpen) && "brightness-0 invert"
              )} 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-yellow",
                  location.pathname === item.path 
                    ? "text-brand-yellow" 
                    : (isScrolled || isMenuOpen) ? "text-brand-teal" : "text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/booking" className="btn-primary py-2 px-6 text-sm">Захиалах</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={cn("lg:hidden p-2", (isScrolled || isMenuOpen) ? "text-brand-teal" : "text-white")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-xl font-serif font-medium",
                    location.pathname === item.path ? "text-brand-yellow" : "text-brand-teal"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/booking" className="btn-primary mt-4">Захиалах</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-brand-teal text-white pt-20 pb-10 px-6 md:px-12 lg:px-24 overflow-hidden">
        <FallingLeaves />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="https://lh3.googleusercontent.com/d/18uAV6mFKrTaRXMtml9Qu0ENa3DfsgMEA" alt="SUUT RESORT Logo" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Байгалийн сайханд, тав тухтай орчинд амран тухлахыг хүсвэл SUUT RESORT-ыг зориорой. Бид танд мартагдашгүй дурсамжийг бэлэглэх болно.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/suutresort" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-teal transition-all"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-teal transition-all"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Цэс</h4>
            <ul className="space-y-4 text-sm text-white/70">
              {navItems.map(item => (
                <li key={item.path}><Link to={item.path} className="hover:text-white transition-colors">{item.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Холбоо барих</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-brand-yellow" />
                <div className="space-y-1">
                  <span>Монгол улс, Улаанбаатар, +59 Баянчандмань</span>
                  <a 
                    href="https://maps.app.goo.gl/zPp1JUX1TBpVqYkt5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs text-brand-yellow hover:underline"
                  >
                    Газрын зураг дээр үзэх →
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-brand-yellow" />
                <span>+976 8801-0011, 8800-7338</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-brand-yellow" />
                <span>info@suutresort.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Мэдээлэл авах</h4>
            <p className="text-sm text-white/70 mb-4">Шинэ мэдээ, хямдрал урамшууллын мэдээллийг цаг алдалгүй аваарай.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="И-мэйл хаяг" className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-yellow" />
              <button className="bg-brand-yellow text-brand-teal rounded-full px-6 py-2 text-sm font-bold hover:bg-white transition-all">Илгээх</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} SUUT RESORT. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p>
            <a 
              href="https://cornerstoneai.dev/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-brand-yellow transition-colors"
            >
              Cornerstone Ai бүтээв
            </a>
          </p>
        </div>
      </footer>

      {/* Messenger FAB */}
      <a 
        href="https://m.me/suutresort" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#0084FF] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Chat on Messenger"
      >
        <MessageCircle size={28} fill="currentColor" />
        <span className="absolute right-full mr-4 bg-white text-brand-teal px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-brand-teal/5">
          Чатлах
        </span>
      </a>
    </div>
  );
}
