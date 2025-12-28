import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';

const reports = [
  {
    id: 1,
    title: 'Monthly Revenue Report',
    description: 'Comprehensive revenue analysis for December 2024',
    date: '2024-12-20',
    size: '2.4 MB',
    type: 'Financial',
    status: 'Ready',
  },
  {
    id: 2,
    title: 'User Engagement Report',
    description: 'User activity and engagement metrics',
    date: '2024-12-18',
    size: '1.8 MB',
    type: 'Analytics',
    status: 'Ready',
  },
  {
    id: 3,
    title: 'Q4 Performance Summary',
    description: 'Quarterly performance and KPI overview',
    date: '2024-12-15',
    size: '3.2 MB',
    type: 'Performance',
    status: 'Ready',
  },
  {
    id: 4,
    title: 'Security Audit Report',
    description: 'System security and compliance audit',
    date: '2024-12-10',
    size: '1.5 MB',
    type: 'Security',
    status: 'Processing',
  },
  {
    id: 5,
    title: 'Customer Satisfaction Survey',
    description: 'Annual customer feedback analysis',
    date: '2024-12-05',
    size: '2.1 MB',
    type: 'Survey',
    status: 'Ready',
  },
];

export function ReportsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-sm text-gray-600">Generate and download various reports</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-xl">48</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-xl">234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-xl">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3>Recent Reports</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm mb-1">{report.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{report.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full ${
                        report.type === 'Financial' ? 'bg-green-100 text-green-700' :
                        report.type === 'Analytics' ? 'bg-blue-100 text-blue-700' :
                        report.type === 'Performance' ? 'bg-purple-100 text-purple-700' :
                        report.type === 'Security' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    report.status === 'Ready' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status}
                  </span>
                  
                  {report.status === 'Ready' && (
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            View All Reports →
          </button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Financial Report', icon: TrendingUp, color: 'green' },
            { name: 'User Analytics', icon: Users, color: 'blue' },
            { name: 'Performance Metrics', icon: ChartBar, color: 'purple' },
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <button
                key={index}
                className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50/50 transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-lg bg-${template.color}-100 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${template.color}-600`} />
                </div>
                <p className="text-sm mb-1">{template.name}</p>
                <p className="text-xs text-gray-500">Click to generate</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Import for the missing icons
import { Users, ChartBar } from 'lucide-react';
