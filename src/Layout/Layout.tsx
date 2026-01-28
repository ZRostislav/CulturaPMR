import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      setPendingScroll(id);
      navigate("/");
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/" && pendingScroll) {
      const element = document.getElementById(pendingScroll);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      setPendingScroll(null);
    }
  }, [location.pathname, pendingScroll]);

  const navItems = [
    { label: "Главная", id: "hero" },
    { label: "Мероприятия", id: "listEvents" },
    { label: "Галерея", id: "gallery" },
    { label: "Контакты", id: "contacts" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Увеличенный Логотип и Название */}
            <Link to="/" className="text-white group flex items-center gap-4">
              <div className="relative">
                <img
                  src="/MKK.png"
                  alt="Лого"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform group-hover:scale-110"
                />
                <div className="absolute -inset-1 bg-yellow-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-black tracking-tighter uppercase leading-none">
                  Многофункциональный
                </span>
                <span className="text-sm md:text-lg font-light tracking-[0.2em] uppercase text-yellow-500 leading-none">
                  Культурный Комплекс
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-neutral-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-neutral-900 border-b border-neutral-800 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-neutral-200 text-xl font-bold uppercase tracking-widest"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-900 relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none">
          <img
            src="/MKK.png"
            alt=""
            className="w-full h-full object-contain translate-x-1/3 scale-150 blur-xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-md">
              <div className="flex items-center gap-5 mb-8">
                <img
                  src="/MKK.png"
                  alt="Лого"
                  className="w-20 h-20 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-white text-2xl font-black uppercase leading-tight">
                    Многофункциональный
                  </span>
                  <span className="text-yellow-500 text-lg font-medium uppercase tracking-widest">
                    Культурный Комплекс
                  </span>
                </div>
              </div>
              <p className="text-neutral-500 leading-relaxed text-lg italic">
                «Место, где рождается вдохновение и оживает культура».
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full md:w-auto">
              <div>
                <h3 className="text-white font-black mb-6 uppercase tracking-widest text-sm border-b border-yellow-500/30 pb-2 w-fit">
                  Связь
                </h3>
                <div className="text-neutral-400 space-y-4 text-lg">
                  <p className="hover:text-yellow-500 transition-colors cursor-pointer">
                    0 (552) 2-65-34
                  </p>
                  <p className="hover:text-yellow-500 transition-colors cursor-pointer">
                    -
                  </p>
                  <p>г. Бендеры, ул. Ленина, д. 32</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-black mb-6 uppercase tracking-widest text-sm border-b border-yellow-500/30 pb-2 w-fit">
                  Режим работы
                </h3>
                <div className="text-neutral-400 space-y-2 text-lg">
                  <p className="text-white font-bold text-2xl">08:00 – 20:00</p>
                  <p className="text-yellow-500/60 uppercase text-xs tracking-[0.3em]">
                    Ежедневно без выходных
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-xs uppercase tracking-widest">
            <p>
              © {new Date().getFullYear()} Многофункциональный Культурный
              Комплекс
            </p>
            <p>г. Бендеры</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
