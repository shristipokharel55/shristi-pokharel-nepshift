import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Loader2,
    MapPin,
    Phone,
    Search,
    Shield,
    User,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

// Document View Modal Component
const DocumentViewModal = ({ isOpen, onClose, request, onApprove, onReject, isLoading }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen || !request) return null;

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        onReject(request, rejectionReason);
        setRejectionReason('');
        setShowRejectForm(false);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('/')) {
            return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center text-white font-bold">
                            {request.name?.charAt(0) || 'H'}
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

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <User size={14} />
                                User Type
                            </div>
                            <p className="font-semibold text-slate-800">Hirer</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Phone size={14} />
                                Phone
                            </div>
                            <p className="font-semibold text-slate-800">{request.phone || 'N/A'}</p>
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
                            <p className="font-semibold text-slate-800 capitalize">{request.status}</p>
                        </div>
                    </div>

                    {request.bio && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">About</h3>
                            <p className="text-slate-600 text-sm">{request.bio}</p>
                        </div>
                    )}

                    {request.location && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                <MapPin size={16} />
                                Location
                            </div>
                            <p className="text-slate-600 text-sm">{request.location}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={18} />
                            Verification Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {request.citizenshipFront && (
                                <div className="group relative">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-[#4A9287] transition-colors">
                                        <div className="aspect-[3/2] relative">
                                            <img 
                                                src={getImageUrl(request.citizenshipFront)}
                                                alt="Citizenship Front"
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setSelectedImage(getImageUrl(request.citizenshipFront))}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <p className="text-sm font-medium text-slate-700">Citizenship Front</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {request.citizenshipBack && (
                                <div className="group relative">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-[#4A9287] transition-colors">
                                        <div className="aspect-[3/2] relative">
                                            <img 
                                                src={getImageUrl(request.citizenshipBack)}
                                                alt="Citizenship Back"
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setSelectedImage(getImageUrl(request.citizenshipBack))}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <p className="text-sm font-medium text-slate-700">Citizenship Back</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {request.selfieWithId && (
                                <div className="group relative">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-[#4A9287] transition-colors">
                                        <div className="aspect-[3/2] relative">
                                            <img 
                                                src={getImageUrl(request.selfieWithId)}
                                                alt="Selfie with ID"
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setSelectedImage(getImageUrl(request.selfieWithId))}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <p className="text-sm font-medium text-slate-700">Selfie with ID</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {request.status === 'rejected' && request.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <h3 className="font-semibold text-red-800 mb-2">Rejection Reason</h3>
                            <p className="text-red-700 text-sm">{request.rejectionReason}</p>
                        </div>
                    )}

                    {/* Show approve/reject buttons for pending, unverified, or when documents are uploaded */}
                    {(request.status === 'pending' || request.status === 'unverified' || 
                      (request.citizenshipFront || request.citizenshipBack || request.selfieWithId)) && 
                     request.status !== 'approved' && (
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                            {!showRejectForm ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onApprove(request)}
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={20} />
                                                Approve Hirer
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowRejectForm(true)}
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <XCircle size={20} />
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                        rows={4}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleRejectSubmit}
                                            disabled={isLoading || !rejectionReason.trim()}
                                            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={20} />
                                                    Confirm Rejection
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowRejectForm(false);
                                                setRejectionReason('');
                                            }}
                                            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img 
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-full rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-600 border-amber-200',
        approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        rejected: 'bg-red-50 text-red-600 border-red-200',
        unverified: 'bg-slate-50 text-slate-600 border-slate-200',
    };

    const labels = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        unverified: 'Not Submitted',
    };

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.unverified}`}>
            {labels[status] || status}
        </span>
    );
};

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
            <span className="text-sm text-slate-600">{request.phone || 'N/A'}</span>
        </td>
        <td className="px-6 py-4">
            <span className="text-sm text-slate-600">{request.location || 'N/A'}</span>
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

const AdminHirerVerification = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/hirer-verifications?status=all');
            const hirers = response.data.data || [];
            
            const transformed = hirers.map(hirer => ({
                id: hirer._id,
                name: hirer.fullName || hirer.email.split('@')[0],
                email: hirer.email,
                phone: hirer.phone,
                bio: hirer.bio,
                location: hirer.address ? `${hirer.address.municipality || ''}, ${hirer.address.district || ''}`.trim().replace(/^,|,$/g, '') : null,
                submittedAt: new Date(hirer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: hirer.verificationStatus || 'pending',
                citizenshipFront: hirer.verificationDocs?.citizenshipFront,
                citizenshipBack: hirer.verificationDocs?.citizenshipBack,
                selfieWithId: hirer.verificationDocs?.selfieWithId,
                rejectionReason: hirer.rejectionReason
            }));
            
            setVerificationRequests(transformed);
        } catch (err) {
            console.error('Failed to fetch hirer verifications:', err);
            setError(err.response?.data?.message || 'Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (request) => {
        if (actionLoading) return;
        
        console.log('Approving hirer:', request.id);
        
        try {
            setActionLoading(request.id);
            const response = await api.put(`/admin/approve-hirer/${request.id}`);
            
            console.log('Approve response:', response.data);
            
            if (response.data.success) {
                toast.success('Hirer approved successfully!');
                setVerificationRequests(prev => 
                    prev.map(r => r.id === request.id ? { ...r, status: 'approved' } : r)
                );
                setIsModalOpen(false);
                setSelectedRequest(null);
                // Refresh data to get latest state
                await fetchVerifications();
            } else {
                toast.error('Failed to approve: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Failed to approve:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to approve hirer';
            toast.error(errorMessage);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (request, reason) => {
        if (actionLoading) return;
        if (!reason) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        
        console.log('Rejecting hirer:', request.id, 'Reason:', reason);
        
        try {
            setActionLoading(request.id);
            const response = await api.put(`/admin/reject-hirer/${request.id}`, { reason });
            
            console.log('Reject response:', response.data);
            
            if (response.data.success) {
                toast.success('Hirer rejected successfully');
                setVerificationRequests(prev => 
                    prev.map(r => r.id === request.id ? { ...r, status: 'rejected', rejectionReason: reason } : r)
                );
                setIsModalOpen(false);
                setSelectedRequest(null);
                // Refresh data to get latest state
                await fetchVerifications();
            } else {
                toast.error('Failed to reject: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Failed to reject:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to reject hirer';
            toast.error(errorMessage);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Hirer Verification Requests
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review and manage hirer identity verifications
                    </p>
                </div>
                <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

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

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search hirers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4A9287] focus:border-[#4A9287] outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hirer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
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

export default AdminHirerVerification;
