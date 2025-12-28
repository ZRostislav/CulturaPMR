import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SliderSettings } from "./test/SliderSettings";
import { EventManagement } from "./test/EventManagement";
import { Settings, Ticket, LayoutDashboard } from "lucide-react";

export function ControlsPage() {
  const [activeSection, setActiveSection] = useState<"slider" | "events">(
    "slider"
  );

  const menuItems = [
    { id: "slider" as const, label: "Слайдер", icon: Ticket },
    { id: "events" as const, label: "Мероприятия", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-neutral-950)] flex pt-18 ">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 bg-[var(--color-neutral-900)] border-r border-white/10 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <LayoutDashboard className="h-6 w-6 text-[var(--color-neutral-950)]" />
            </div>
            <div>
              <h1 className="text-white">Админ Панель</h1>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  onClick={() => setActiveSection(item.id)}
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
                    className={`h-5 w-5 relative z-10 ${
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }`}
                  />
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="p-6 border-t border-white/10"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">Admin User</p>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeSection === "slider" && (
            <motion.div
              key="slider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              <SliderSettings />
            </motion.div>
          )}
          {activeSection === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              <EventManagement />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
