import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SliderSettings } from "./SliderSettings";
import { EventManagement } from "./EventManagement";
import { AccountSettings } from "./AccountSettings";
import { GallarySettings } from "./GallarySettings";
import {
  Settings,
  Ticket,
  LayoutDashboard,
  User,
  Images,
  ShieldUser,
} from "lucide-react";
import { authApi } from "../../components/services/auth.api";
import { EventDTO } from "../../components/services/eventShowcase.api";
import { AdministratorsSettings } from "./AdministratorsSettings";

type UserType = {
  id: number;
  username: string;
  created_at: string;
};

export let setActiveSectionGlobal: ((section: any) => void) | null = null;
export let setSliderDataGlobal: ((data: EventDTO) => void) | null = null;

export function ControlsPage() {
  const [activeSection, setActiveSection] = useState<
    "slider" | "events" | "profile" | "gallary" | "administrators"
  >("slider");
  const [sliderData, setSliderData] = useState<EventDTO | null>(null);
  const changeSection = (
    section: "slider" | "events" | "profile" | "gallary" | "administrators",
  ) => {
    setActiveSection(section);

    // 🔥 ВАЖНО: если уходим со слайдера — сбрасываем редактирование
    if (section !== "slider") {
      setSliderData(null);
    }
  };

  setActiveSectionGlobal = setActiveSection;
  setSliderDataGlobal = setSliderData;

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await authApi.me();
        setUser(response.data);
      } catch (e) {
        console.log("Не удалось получить профиль");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const menuItems = [
    { id: "slider" as const, label: "Слайдер", icon: Ticket },
    { id: "events" as const, label: "Мероприятия", icon: Settings },
    { id: "gallary" as const, label: "Галерея", icon: Images },
    {
      id: "administrators" as const,
      label: "Администраторы",
      icon: ShieldUser,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-neutral-950)] flex pt-24 ">
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 bg-[var(--color-neutral-900)] border-r border-white/10 flex flex-col"
      >
        <div className="p-6 border-b border-white/10">
          <motion.div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <LayoutDashboard className="h-6 w-6 text-[var(--color-neutral-950)]" />
            </div>
            <h1 className="text-white font-bold">Админ Панель</h1>
          </motion.div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => changeSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group ${
                    isActive
                      ? "text-[var(--color-neutral-950)]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/20"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <Icon
                    className={`h-5 w-5 relative z-10 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`}
                  />
                  <span className="relative z-10 font-bold">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 border-t border-white/10"
        >
          <button
            onClick={() => changeSection("profile")}
            className={`w-full flex items-center gap-4 px-2 py-3 rounded-xl transition-all ${
              activeSection === "profile"
                ? "bg-white/10 ring-1 ring-white/20"
                : "hover:bg-white/5"
            }`}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/20">
              <User className="h-5 w-5 text-black" />
            </div>

            <div className="flex flex-col min-w-0 text-left">
              {loading ? (
                <span className="text-xs text-white/30 animate-pulse">
                  Загрузка...
                </span>
              ) : (
                <>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">
                    аккаунт
                  </span>
                  <span className="text-sm font-medium text-white truncate">
                    {user?.username || "Профиль"}
                  </span>
                </>
              )}
            </div>
          </button>
        </motion.div>
      </motion.aside>

      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeSection === "slider" && (
            <motion.div
              key="slider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <SliderSettings initialData={sliderData} />
            </motion.div>
          )}
          {activeSection === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <EventManagement />
            </motion.div>
          )}
          {activeSection === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-white"
            >
              <AccountSettings user={user} />
            </motion.div>
          )}
          {activeSection === "gallary" && (
            <motion.div
              key="gallary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-white"
            >
              <GallarySettings />
            </motion.div>
          )}
          {activeSection === "administrators" && (
            <motion.div
              key="gallary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-white"
            >
              <AdministratorsSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
