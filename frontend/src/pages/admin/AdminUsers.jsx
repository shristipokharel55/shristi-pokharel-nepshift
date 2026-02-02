import {
    Download,
    Edit,
    Eye,
    MapPin,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users
} from 'lucide-react';
import { useState } from 'react';

// User Status Badge
const StatusBadge = ({ isVerified, isActive }) => {
    if (!isActive) {
        return (
            <span className="px-3 py-1 text-xs font-medium rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                Inactive
            </span>
        );
    }
    return isVerified ? (
        <span className="px-3 py-1 text-xs font-medium rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
            Verified
        </span>
    ) : (
        <span className="px-3 py-1 text-xs font-medium rounded-full border bg-amber-50 text-amber-600 border-amber-200">
            Pending
        </span>
    );
};

// Role Badge
const RoleBadge = ({ role }) => {
    const styles = {
        helper: 'bg-blue-50 text-blue-600',
        hirer: 'bg-purple-50 text-purple-600',
        admin: 'bg-red-50 text-red-600'
    };

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
};

// User Row Component
const UserRow = ({ user, onView, onEdit, onDelete }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center text-white font-bold">
                    {user.fullName.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-slate-800">{user.fullName}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <RoleBadge role={user.role} />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                {user.location}
            </div>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-500">{user.createdAt}</span>
        </td>
        <td className="px-6 py-4">
            <StatusBadge isVerified={user.isVerified} isActive={user.isActive} />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onView(user)}
                    className="p-2 text-slate-400 hover:text-[#4A9287] hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
                <button 
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit User"
                >
                    <Edit size={18} />
                </button>
                <button 
                    onClick={() => onDelete(user)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete User"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </td>
    </tr>
);

const AdminUsers = () => {
    const [filter, setFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock users data
    const users = [
        { id: 1, fullName: 'Ram Bahadur Thapa', email: 'ram.thapa@email.com', role: 'helper', location: 'Kathmandu', createdAt: 'Jan 15, 2026', isVerified: true, isActive: true },
        { id: 2, fullName: 'Sita Sharma', email: 'sita.sharma@email.com', role: 'hirer', location: 'Pokhara', createdAt: 'Jan 18, 2026', isVerified: true, isActive: true },
        { id: 3, fullName: 'Hari Prasad Gautam', email: 'hari.gautam@email.com', role: 'helper', location: 'Lalitpur', createdAt: 'Jan 20, 2026', isVerified: false, isActive: true },
        { id: 4, fullName: 'Maya Gurung', email: 'maya.gurung@email.com', role: 'helper', location: 'Bhaktapur', createdAt: 'Jan 22, 2026', isVerified: true, isActive: true },
        { id: 5, fullName: 'Bijay Rai', email: 'bijay.rai@email.com', role: 'hirer', location: 'Kathmandu', createdAt: 'Jan 25, 2026', isVerified: false, isActive: true },
        { id: 6, fullName: 'Anita Tamang', email: 'anita.tamang@email.com', role: 'helper', location: 'Chitwan', createdAt: 'Jan 28, 2026', isVerified: true, isActive: false },
        { id: 7, fullName: 'Krishna Shrestha', email: 'krishna.shrestha@email.com', role: 'helper', location: 'Kathmandu', createdAt: 'Feb 1, 2026', isVerified: false, isActive: true },
    ];

    const stats = {
        total: users.length,
        helpers: users.filter(u => u.role === 'helper').length,
        hirers: users.filter(u => u.role === 'hirer').length,
        verified: users.filter(u => u.isVerified).length,
    };

    const filteredUsers = users.filter(user => {
        const matchesStatus = filter === 'all' || 
            (filter === 'verified' && user.isVerified) || 
            (filter === 'pending' && !user.isVerified) ||
            (filter === 'inactive' && !user.isActive);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage and monitor all platform users
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                    <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2">
                        <Plus size={18} />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A9287]/10 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-[#4A9287]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            <p className="text-sm text-slate-500">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UserCheck size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.helpers}</p>
                            <p className="text-sm text-slate-500">Helpers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.hirers}</p>
                            <p className="text-sm text-slate-500">Hirers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <UserCheck size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.verified}</p>
                            <p className="text-sm text-slate-500">Verified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4A9287]/20"
                    >
                        <option value="all">All Roles</option>
                        <option value="helper">Helpers</option>
                        <option value="hirer">Hirers</option>
                    </select>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        {['all', 'verified', 'pending', 'inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-[#4A9287] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onView={(u) => console.log('View', u)}
                                    onEdit={(u) => console.log('Edit', u)}
                                    onDelete={(u) => console.log('Delete', u)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                        <span className="font-medium">{users.length}</span> users
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-[#4A9287] rounded-lg hover:bg-[#3d7a71] transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
