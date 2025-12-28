import { LayoutDashboard, Users, Settings, FileText, ChartBar } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AdminSidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full bg-[var(--color-neutral-950)] text-white flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center">
            <span className="text-[var(--color-neutral-950)] font-bold">A</span>
          </div>
          <div>
            <h2 className="text-white">Admin Panel</h2>
            <p className="text-xs text-white/60">Management Console</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-[var(--color-neutral-950)]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center">
            <span className="text-[var(--color-neutral-950)]">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">John Doe</p>
            <p className="text-xs text-white/60">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
