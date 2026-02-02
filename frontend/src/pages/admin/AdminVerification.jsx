import {
    AlertCircle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Loader2,
    Search,
    XCircle,
    X,
    Image,
    User,
    Calendar,
    Shield,
    CreditCard
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

// Document View Modal Component
const DocumentViewModal = ({ isOpen, onClose, request, onApprove, onReject, isLoading }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen || !request) return null;

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        onReject(request, rejectionReason);
        setRejectionReason('');
        setShowRejectForm(false);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // Handle relative paths
        if (imagePath.startsWith('/')) {
            return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center text-white font-bold">
                            {request.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{request.name}</h2>
                            <p className="text-sm text-slate-500">{request.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Info Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <User size={14} />
                                User Type
                            </div>
                            <p className="font-semibold text-slate-800">{request.userType}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <FileText size={14} />
                                Document Type
                            </div>
                            <p className="font-semibold text-slate-800">{request.type}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Calendar size={14} />
                                Submitted
                            </div>
                            <p className="font-semibold text-slate-800">{request.submittedAt}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Shield size={14} />
                                Status
                            </div>
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Citizenship Number */}
                    {request.citizenshipNumber && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <CreditCard size={14} />
                                Citizenship Number
                            </div>
                            <p className="font-semibold text-slate-800 font-mono text-lg">{request.citizenshipNumber}</p>
                        </div>
                    )}

                    {/* Document Images */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Image size={20} className="text-[#4A9287]" />
                            Citizenship Documents
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Front Image */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                    <p className="text-sm font-medium text-slate-700">Front Side</p>
                                </div>
                                <div className="p-4">
                                    {request.citizenshipFrontImage ? (
                                        <img 
                                            src={getImageUrl(request.citizenshipFrontImage)}
                                            alt="Citizenship Front"
                                            className="w-full h-48 object-contain bg-slate-100 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedImage(getImageUrl(request.citizenshipFrontImage))}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <p className="text-slate-400 text-sm">No image uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Back Image */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                    <p className="text-sm font-medium text-slate-700">Back Side</p>
                                </div>
                                <div className="p-4">
                                    {request.citizenshipBackImage ? (
                                        <img 
                                            src={getImageUrl(request.citizenshipBackImage)}
                                            alt="Citizenship Back"
                                            className="w-full h-48 object-contain bg-slate-100 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedImage(getImageUrl(request.citizenshipBackImage))}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <p className="text-slate-400 text-sm">No image uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reason Form */}
                    {showRejectForm && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <label className="block text-sm font-medium text-red-700 mb-2">
                                Reason for Rejection
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a detailed reason for rejection..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 outline-none text-slate-700 placeholder:text-slate-400 resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    onClick={() => setShowRejectForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectSubmit}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading && <Loader2 size={14} className="animate-spin" />}
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && !showRejectForm && (
                    <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 flex justify-end gap-3 rounded-b-2xl">
                        <button
                            onClick={() => setShowRejectForm(true)}
                            className="px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <XCircle size={18} />
                            Reject
                        </button>
                        <button
                            onClick={() => onApprove(request)}
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            Approve Verification
                        </button>
                    </div>
                )}
            </div>

            {/* Full Image Preview */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={24} className="text-white" />
                    </button>
                    <img 
                        src={selectedImage}
                        alt="Document Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            )}
        </div>
    );
};

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
const VerificationRow = ({ request, onView, onApprove, onReject, isLoading }) => (
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
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#4A9287]" />
            ) : (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onView(request)}
                        className="p-2 text-slate-400 hover:text-[#4A9287] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    {request.status === 'pending' && (
                        <>
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
                        </>
                    )}
                </div>
            )}
        </td>
    </tr>
);

const AdminVerification = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch verification requests on mount and when filter changes
    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/verifications');
            const users = response.data.data || [];
            // Transform data for display - include citizenship details
            const transformed = users.map(user => ({
                id: user._id,
                name: user.fullName || user.email.split('@')[0],
                email: user.email,
                type: user.citizenshipNumber ? 'Citizenship Verification' : 'KYC Verification',
                userType: user.role === 'helper' ? 'Helper' : user.role === 'hirer' ? 'Hirer' : 'User',
                submittedAt: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: user.verificationStatus || 'pending',
                documents: user.documents || [],
                // Add citizenship details
                citizenshipNumber: user.citizenshipNumber || user.helperProfile?.citizenshipNumber,
                citizenshipFrontImage: user.citizenshipFrontImage || user.helperProfile?.citizenshipFrontImage,
                citizenshipBackImage: user.citizenshipBackImage || user.helperProfile?.citizenshipBackImage,
                rejectionReason: user.rejectionReason || user.helperProfile?.rejectionReason
            }));
            setVerificationRequests(transformed);
        } catch (err) {
            console.error('Failed to fetch verifications:', err);
            setError(err.response?.data?.message || 'Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (request) => {
        if (actionLoading) return;
        try {
            setActionLoading(request.id);
            await api.put(`/admin/verify/${request.id}`, { action: 'approve' });
            // Update local state
            setVerificationRequests(prev => 
                prev.map(r => r.id === request.id ? { ...r, status: 'approved' } : r)
            );
            // Close modal and show success
            setIsModalOpen(false);
            setSelectedRequest(null);
        } catch (err) {
            console.error('Failed to approve:', err);
            alert(err.response?.data?.message || 'Failed to approve user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (request, reason) => {
        if (actionLoading) return;
        if (!reason) {
            reason = prompt('Please provide a reason for rejection:');
            if (!reason) return;
        }
        
        try {
            setActionLoading(request.id);
            await api.put(`/admin/verify/${request.id}`, { action: 'reject', reason });
            // Update local state
            setVerificationRequests(prev => 
                prev.map(r => r.id === request.id ? { ...r, status: 'rejected', rejectionReason: reason } : r)
            );
            // Close modal
            setIsModalOpen(false);
            setSelectedRequest(null);
        } catch (err) {
            console.error('Failed to reject:', err);
            alert(err.response?.data?.message || 'Failed to reject user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleView = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

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
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-[#4A9287]" />
                            <span className="ml-3 text-slate-500">Loading verifications...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                            <p className="text-slate-900 font-semibold">Failed to load data</p>
                            <p className="text-slate-500 text-sm">{error}</p>
                            <button
                                onClick={fetchVerifications}
                                className="mt-4 px-4 py-2 bg-[#4A9287] text-white rounded-lg text-sm font-medium hover:bg-[#3d7a71] transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
                            <p className="text-slate-900 font-semibold">No verification requests</p>
                            <p className="text-slate-500 text-sm">All caught up!</p>
                        </div>
                    ) : (
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
                                        onView={handleView}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        isLoading={actionLoading === request.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
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
            
            {/* Document View Modal */}
            <DocumentViewModal
                isOpen={isModalOpen}
                onClose={closeModal}
                request={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={actionLoading === selectedRequest?.id}
            />
        </div>
    );
};

export default AdminVerification;
