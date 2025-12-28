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
    { label: "О комплексе", id: "about" },
    { label: "Мероприятия", id: "listEvents" },
    { label: "Галерея", id: "gallery" },
    { label: "Контакты", id: "contacts" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg"></div>
                <span>Культура.ПМР</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-4 pt-4 pb-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-neutral-300 hover:text-white transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg"></div>
                <span className="text-white">Культура.ПМР</span>
              </div>
              <p className="text-neutral-400">
                Пространство для культуры, творчества и вдохновения
              </p>
            </div>

            <div>
              <h3 className="text-white mb-4">Контакты</h3>
              <div className="text-neutral-400 space-y-2">
                <p>Телефон: 0 (552) 2-65-34</p>
                <p>Email: yesmilka1994@mail.ru</p>
                <p>Адрес: Приднестровье, г. Бендеры, ул. Ленина д. 32</p>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Часы работы</h3>
              <div className="text-neutral-400 space-y-2">
                <p>Пн-Вс: с 08:00 до 17:00</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-neutral-500">
            <p>
              © {new Date().getFullYear()} Культура.ПМР. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
