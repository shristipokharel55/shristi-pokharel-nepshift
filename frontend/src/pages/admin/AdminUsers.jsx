import {
    AlertCircle,
    Download,
    Edit,
    Eye,
    Loader2,
    MapPin,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

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

// Edit User Modal
const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate(user.id, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Edit User</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none"
                        >
                            <option value="helper">Helper</option>
                            <option value="hirer">Hirer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            New Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Min. 6 characters"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// View User Modal
const ViewUserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">User Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-600 font-bold text-2xl shadow-sm border border-slate-200">
                            {user.fullName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900">{user.fullName}</h4>
                            <p className="text-slate-500">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <RoleBadge role={user.role} />
                                <StatusBadge isVerified={user.isVerified} isActive={user.isActive} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Joined Date</p>
                            <p className="text-slate-900 font-medium">{user.createdAt}</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                            <div className="flex items-center gap-1 text-slate-900 font-medium">
                                <MapPin size={16} className="text-slate-400" />
                                {user.location}
                            </div>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                            <p className="text-slate-900 font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">User ID</p>
                            <p className="text-slate-500 text-xs font-mono truncate" title={user.id}>{user.id}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// User Row Component
const UserRow = ({ user, onView, onEdit, onDelete, isLoading }) => (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm text-sm">
                    {user.fullName.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-slate-800 text-sm">{user.fullName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <RoleBadge role={user.role} />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate max-w-[150px]" title={user.location}>{user.location}</span>
            </div>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-500 font-medium">{user.createdAt}</span>
        </td>
        <td className="px-6 py-4">
            <StatusBadge isVerified={user.isVerified} isActive={user.isActive} />
        </td>
        <td className="px-6 py-4">
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#3B82F6]" />
            ) : (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onView(user)}
                        className="p-1.5 text-slate-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(user)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit User"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(user)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete User"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </td>
    </tr>
);

const AdminUsers = () => {
    const [filter, setFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    // Modal state
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            const usersData = response.data.data || [];
            // Transform data for display
            const transformed = usersData.map(user => ({
                id: user._id,
                fullName: user.fullName || user.email.split('@')[0],
                email: user.email,
                role: user.role || 'helper',
                location: user.location || 'Not specified',
                phone: user.phone,
                createdAt: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                isVerified: user.isVerified || false,
                isActive: user.isActive !== false // Default to true if not specified
            }));
            setUsers(transformed);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (userId, data) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, data);

            if (response.data.success) {
                toast.success('User updated successfully');
                // Refresh users or update local state
                fetchUsers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user');
            throw err;
        }
    };

    const handleDelete = async (user) => {
        if (actionLoading) return;
        if (!confirm(`Are you sure you want to delete ${user.fullName}?`)) return;

        try {
            setActionLoading(user.id);
            await api.delete(`/admin/users/${user.id}`);
            // Remove user from local state
            setUsers(prev => prev.filter(u => u.id !== user.id));
            toast.success('User deleted successfully');
        } catch (err) {
            console.error('Failed to delete user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

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
        <div className="space-y-8 animate-fade-in-up" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage and monitor all platform users
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 bg-white text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 border border-slate-200 show-sm">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="px-5 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <Plus size={16} />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* ... (Keep existing stats cards) ... */}
                <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#3B82F6]">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.total}</p>
                            <p className="text-xs text-slate-500 font-medium">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.helpers}</p>
                            <p className="text-xs text-slate-500 font-medium">Helpers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.hirers}</p>
                            <p className="text-xs text-slate-500 font-medium">Hirers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight">{stats.verified}</p>
                            <p className="text-xs text-slate-500 font-medium">Verified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Table */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
                <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                    >
                        <option value="all">All Roles</option>
                        <option value="helper">Helpers</option>
                        <option value="hirer">Hirers</option>
                    </select>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                        {['all', 'verified', 'pending', 'inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === status
                                    ? 'bg-white text-[#3B82F6] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
                            <span className="ml-3 text-slate-500">Loading users...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                            <p className="text-slate-900 font-semibold">Failed to load users</p>
                            <p className="text-slate-500 text-sm">{error}</p>
                            <button
                                onClick={fetchUsers}
                                className="mt-4 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Users className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-slate-900 font-semibold">No users found</p>
                            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
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
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isLoading={actionLoading === user.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{filteredUsers.length}</span> of{' '}
                        <span className="font-medium text-slate-900">{users.length}</span> users
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEditModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onUpdate={handleUpdateUser}
                />
            )}

            {isViewModalOpen && selectedUser && (
                <ViewUserModal
                    user={selectedUser}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminUsers;
