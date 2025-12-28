import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left side */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Notifications</h3>
                  <span className="text-xs text-gray-500">3 new</span>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {[
                  { title: 'New user registered', time: '5 minutes ago', type: 'info' },
                  { title: 'Report generated', time: '1 hour ago', type: 'success' },
                  { title: 'System update available', time: '2 hours ago', type: 'warning' },
                ].map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-1">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-xs text-gray-600 hover:text-gray-900">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm">John Doe</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center">
            <span className="text-sm text-white">JD</span>
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
