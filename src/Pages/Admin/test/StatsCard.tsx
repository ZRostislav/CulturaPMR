import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, isPositive, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl mb-2">{value}</h3>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
