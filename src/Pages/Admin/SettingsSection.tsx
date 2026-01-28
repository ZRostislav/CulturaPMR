import { Bell, Lock, User, Mail, Globe } from 'lucide-react';

export function SettingsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Settings</h2>
        <p className="text-sm text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gray-600" />
          <h3>Profile Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Bio</label>
            <textarea
              rows={3}
              defaultValue="Administrator with extensive experience in managing complex systems."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          
          <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-gray-600" />
          <h3>Security</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          
          <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3>Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Email notifications', description: 'Receive email updates about your account activity' },
            { label: 'Push notifications', description: 'Receive push notifications on your devices' },
            { label: 'Weekly digest', description: 'Get a weekly summary of your activity' },
            { label: 'Marketing emails', description: 'Receive emails about new features and updates' },
          ].map((item, index) => (
            <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-sm mb-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:via-yellow-500 peer-checked:to-yellow-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-600" />
          <h3>Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Language</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC+0 (London)</option>
              <option>UTC+1 (Paris)</option>
            </select>
          </div>
          
          <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
