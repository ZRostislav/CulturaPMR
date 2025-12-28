import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const trafficData = [
  { name: 'Mon', visitors: 2400, pageViews: 4800 },
  { name: 'Tue', visitors: 3200, pageViews: 6200 },
  { name: 'Wed', visitors: 2800, pageViews: 5600 },
  { name: 'Thu', visitors: 4100, pageViews: 8200 },
  { name: 'Fri', visitors: 3900, pageViews: 7800 },
  { name: 'Sat', visitors: 3400, pageViews: 6800 },
  { name: 'Sun', visitors: 2900, pageViews: 5800 },
];

const deviceData = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 32 },
  { name: 'Tablet', value: 10 },
];

const COLORS = ['#FACC15', '#EAB308', '#CA8A04'];

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Analytics Overview</h2>
        <p className="text-sm text-gray-600">Track and analyze your performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-600">Total Visitors</h4>
            <span className="text-green-600 text-sm">↑ 14%</span>
          </div>
          <p className="text-3xl mb-1">23,492</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-600">Page Views</h4>
            <span className="text-green-600 text-sm">↑ 22%</span>
          </div>
          <p className="text-3xl mb-1">47,400</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-600">Avg. Session</h4>
            <span className="text-red-600 text-sm">↓ 3%</span>
          </div>
          <p className="text-3xl mb-1">4m 32s</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="mb-4">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="#EAB308" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#CA8A04" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#EAB308" 
                strokeWidth={2}
                fill="url(#colorVisitors)" 
              />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#9CA3AF" 
                strokeWidth={2}
                fill="url(#colorPageViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-3">
            {deviceData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm">{device.name}</span>
                </div>
                <span className="text-sm">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="mb-4">Top Performing Pages</h3>
        <div className="space-y-4">
          {[
            { page: '/dashboard', views: 8429, uniqueVisitors: 4821, bounceRate: '32%' },
            { page: '/products', views: 6234, uniqueVisitors: 3942, bounceRate: '28%' },
            { page: '/about', views: 4892, uniqueVisitors: 3214, bounceRate: '45%' },
            { page: '/contact', views: 3421, uniqueVisitors: 2847, bounceRate: '38%' },
            { page: '/blog', views: 2984, uniqueVisitors: 2341, bounceRate: '52%' },
          ].map((page, index) => (
            <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-sm mb-1">{page.page}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{page.views.toLocaleString()} views</span>
                  <span>{page.uniqueVisitors.toLocaleString()} unique</span>
                  <span>{page.bounceRate} bounce</span>
                </div>
              </div>
              <div className="w-32 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (page.views / 8429) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
