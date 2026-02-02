import {
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Search,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

// Verification Status Badge
const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-600 border-amber-200',
        approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        rejected: 'bg-red-50 text-red-600 border-red-200',
        under_review: 'bg-blue-50 text-blue-600 border-blue-200'
    };

    const labels = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        under_review: 'Under Review'
    };

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// Verification Request Row
const VerificationRow = ({ request, onView, onApprove, onReject }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center text-white font-bold">
                    {request.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-slate-800">{request.name}</p>
                    <p className="text-sm text-slate-500">{request.email}</p>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-600">{request.type}</span>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-600">{request.userType}</span>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-500">{request.submittedAt}</span>
        </td>
        <td className="px-6 py-4">
            <StatusBadge status={request.status} />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onView(request)}
                    className="p-2 text-slate-400 hover:text-[#4A9287] hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
                <button 
                    onClick={() => onApprove(request)}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Approve"
                >
                    <CheckCircle size={18} />
                </button>
                <button 
                    onClick={() => onReject(request)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reject"
                >
                    <XCircle size={18} />
                </button>
            </div>
        </td>
    </tr>
);

const AdminVerification = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock verification requests data
    const verificationRequests = [
        { id: 1, name: 'Ram Bahadur Thapa', email: 'ram.thapa@email.com', type: 'KYC Verification', userType: 'Helper', submittedAt: 'Feb 2, 2026', status: 'pending' },
        { id: 2, name: 'Sita Sharma', email: 'sita.sharma@email.com', type: 'Business License', userType: 'Hirer', submittedAt: 'Feb 1, 2026', status: 'pending' },
        { id: 3, name: 'Hari Prasad Gautam', email: 'hari.gautam@email.com', type: 'ID Verification', userType: 'Helper', submittedAt: 'Jan 31, 2026', status: 'under_review' },
        { id: 4, name: 'Maya Gurung', email: 'maya.gurung@email.com', type: 'KYC Verification', userType: 'Helper', submittedAt: 'Jan 30, 2026', status: 'pending' },
        { id: 5, name: 'Bijay Rai', email: 'bijay.rai@email.com', type: 'Address Proof', userType: 'Helper', submittedAt: 'Jan 29, 2026', status: 'approved' },
        { id: 6, name: 'Anita Tamang', email: 'anita.tamang@email.com', type: 'Business License', userType: 'Hirer', submittedAt: 'Jan 28, 2026', status: 'rejected' },
        { id: 7, name: 'Krishna Shrestha', email: 'krishna.shrestha@email.com', type: 'KYC Verification', userType: 'Helper', submittedAt: 'Jan 27, 2026', status: 'pending' },
    ];

    const stats = {
        total: verificationRequests.length,
        pending: verificationRequests.filter(r => r.status === 'pending').length,
        approved: verificationRequests.filter(r => r.status === 'approved').length,
        rejected: verificationRequests.filter(r => r.status === 'rejected').length,
    };

    const filteredRequests = verificationRequests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             req.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Verification Requests
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review and manage user KYC and document verifications
                    </p>
                </div>
                <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            <p className="text-sm text-slate-500">Total Requests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                            <p className="text-sm text-slate-500">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
                            <p className="text-sm text-slate-500">Approved</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <XCircle size={20} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.rejected}</p>
                            <p className="text-sm text-slate-500">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 flex-1 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-[#4A9287] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.map((request) => (
                                <VerificationRow
                                    key={request.id}
                                    request={request}
                                    onView={(r) => console.log('View', r)}
                                    onApprove={(r) => console.log('Approve', r)}
                                    onReject={(r) => console.log('Reject', r)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium">{filteredRequests.length}</span> of{' '}
                        <span className="font-medium">{verificationRequests.length}</span> requests
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

export default AdminVerification;
