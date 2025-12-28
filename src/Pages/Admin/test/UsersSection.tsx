import { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alice Cooper', email: 'alice.cooper@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, name: 'Bob Martin', email: 'bob.martin@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
  { id: 3, name: 'Carol White', email: 'carol.white@example.com', role: 'Editor', status: 'Active', joinDate: '2024-03-10' },
  { id: 4, name: 'David Lee', email: 'david.lee@example.com', role: 'User', status: 'Inactive', joinDate: '2024-01-05' },
  { id: 5, name: 'Eva Green', email: 'eva.green@example.com', role: 'Admin', status: 'Active', joinDate: '2024-04-12' },
  { id: 6, name: 'Frank Ocean', email: 'frank.ocean@example.com', role: 'Editor', status: 'Active', joinDate: '2024-05-08' },
  { id: 7, name: 'Grace Kelly', email: 'grace.kelly@example.com', role: 'User', status: 'Active', joinDate: '2024-06-01' },
  { id: 8, name: 'Henry Ford', email: 'henry.ford@example.com', role: 'User', status: 'Inactive', joinDate: '2024-02-14' },
];

export function UsersSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2>User Management</h2>
          <p className="text-sm text-gray-600">Manage and monitor all users</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-white">{user.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 text-sm ${
                      user.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {mockUsers.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
