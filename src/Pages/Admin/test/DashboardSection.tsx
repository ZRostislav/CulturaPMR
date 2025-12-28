import { StatsCard } from './StatsCard';
import { DollarSign, Users, TrendingUp, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200, expenses: 2400 },
  { month: 'Feb', revenue: 5300, expenses: 2800 },
  { month: 'Mar', revenue: 4800, expenses: 2600 },
  { month: 'Apr', revenue: 6100, expenses: 3200 },
  { month: 'May', revenue: 7200, expenses: 3600 },
  { month: 'Jun', revenue: 6800, expenses: 3400 },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1900 },
  { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3200 },
  { month: 'May', users: 4100 },
  { month: 'Jun', users: 4800 },
];

export function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$48,574"
          change="12.5%"
          isPositive={true}
          icon={DollarSign}
        />
        <StatsCard
          title="Active Users"
          value="4,832"
          change="8.2%"
          isPositive={true}
          icon={Users}
        />
        <StatsCard
          title="Growth Rate"
          value="24.8%"
          change="3.1%"
          isPositive={true}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Reports"
          value="1,284"
          change="5.4%"
          isPositive={false}
          icon={FileText}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="url(#colorGradient)" 
                strokeWidth={3}
                dot={{ fill: '#EAB308', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FACC15" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { user: 'Sarah Johnson', action: 'Created new report', time: '2 minutes ago', type: 'create' },
            { user: 'Michael Chen', action: 'Updated user permissions', time: '15 minutes ago', type: 'update' },
            { user: 'Emma Williams', action: 'Deleted old records', time: '1 hour ago', type: 'delete' },
            { user: 'James Brown', action: 'Exported analytics data', time: '3 hours ago', type: 'export' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-white">{activity.user.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                activity.type === 'create' ? 'bg-green-100 text-green-700' :
                activity.type === 'update' ? 'bg-blue-100 text-blue-700' :
                activity.type === 'delete' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
