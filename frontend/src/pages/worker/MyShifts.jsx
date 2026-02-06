import {
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    MessageCircle,
    Navigation,
    Phone,
    Star,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

const MyShifts = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        thisMonth: 0,
        totalEarned: 0,
        avgRating: 0
    });

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewShiftId, setReviewShiftId] = useState(null);
    const [reviewToUserId, setReviewToUserId] = useState(null);



    const tabs = [
        { id: 'requests', label: 'Requests', icon: FileText },
        { id: 'active', label: 'Active', icon: Briefcase },
        { id: 'history', label: 'History', icon: CheckCircle },
    ];

    // Fetch all bids on component mount
    useEffect(() => {
        fetchBids();
    }, []);

    const fetchBids = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bids/my-bids');
            if (response.data.success) {
                setBids(response.data.data);
                calculateStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
            toast.error('Failed to load your shifts');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (allBids) => {
        const acceptedBids = allBids.filter(bid => bid.status === 'accepted');
        const completedBids = acceptedBids.filter(bid => bid.shiftId?.status === 'completed');

        // Calculate total earned from completed shifts
        const totalEarned = completedBids.reduce((sum, bid) => sum + (bid.bidAmount || 0), 0);

        // Calculate this month's jobs
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonth = completedBids.filter(bid => {
            const bidDate = new Date(bid.createdAt);
            return bidDate >= startOfMonth;
        }).length;

        setStats({
            totalJobs: completedBids.length,
            thisMonth: thisMonth,
            totalEarned: totalEarned,
            avgRating: 4.9 // TODO: Calculate from actual ratings
        });
    };

    // Filter bids by status
    const pendingBids = bids.filter(bid => bid.status === 'pending');
    const acceptedBids = bids.filter(bid =>
        bid.status === 'accepted' &&
        bid.shiftId?.status !== 'completed'
    );
    const completedBids = bids.filter(bid =>
        bid.status === 'accepted' &&
        bid.shiftId?.status === 'completed'
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'accepted':
                return 'bg-emerald-100 text-emerald-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleStatusChange = async (shiftId, newStatus) => {
        try {
            let response;
            if (newStatus === 'completed') {
                response = await api.put(`/shifts/${shiftId}/complete`);
            } else {
                response = await api.put(`/shifts/${shiftId}`, { status: newStatus });
            }

            if (response.data.success) {
                toast.success(`Shift marked as ${newStatus}`);
                fetchBids(); // Refresh list to move it to history
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    // Submit rating and review
    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setSubmittingReview(true);
            const response = await api.post('/reviews', {
                shiftId: reviewShiftId,
                toUserId: reviewToUserId,
                rating,
                comment
            });

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                setShowRatingModal(false);
                setRating(0);
                setComment('');
                setReviewShiftId(null);
                setReviewToUserId(null);
                fetchBids(); // Refresh to potentially show updated state if needed
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleOpenRateModal = (shiftId, hirerId) => {
        setReviewShiftId(shiftId);
        setReviewToUserId(hirerId);
        setRating(0);
        setComment('');
        setShowRatingModal(true);
    };

    if (loading) {
        return (
            <WorkerLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54]"></div>
                </div>
            </WorkerLayout>
        );
    }

    const renderRequests = () => (
        <div className="space-y-4">
            {pendingBids.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                    <FileText size={48} className="text-[#82ACAB] mx-auto mb-4" />
                    <h4 className="font-semibold text-[#032A33] mb-2">No Pending Requests</h4>
                    <p className="text-[#888888]">Your bid requests will appear here</p>
                </div>
            ) : (
                pendingBids.map((bid, index) => (
                    <div
                        key={bid._id}
                        className="glass-card rounded-2xl p-6 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100">
                                    <FileText size={24} className="text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#032A33] text-lg mb-1">
                                        {bid.shiftId?.title || 'Shift'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[#888888] text-sm mb-2">
                                        <Building size={14} />
                                        {bid.hirerId?.fullName || 'Employer'}
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="flex items-center gap-1 text-[#032A33]">
                                            <MapPin size={14} className="text-[#82ACAB]" />
                                            {bid.shiftId?.location?.city || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1 text-[#032A33]">
                                            <Clock size={14} className="text-[#82ACAB]" />
                                            {bid.shiftId?.time?.start} - {bid.shiftId?.time?.end}
                                        </span>
                                        <span className="flex items-center gap-1 text-[#032A33] font-semibold">
                                            <DollarSign size={14} className="text-[#82ACAB]" />
                                            Rs {bid.bidAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(bid.status)}`}>
                                    {bid.status}
                                </span>
                                <span className="text-sm text-[#888888]">{formatDate(bid.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderActive = () => (
        <div className="space-y-4">
            {acceptedBids.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                    <Briefcase size={48} className="text-[#82ACAB] mx-auto mb-4" />
                    <h4 className="font-semibold text-[#032A33] mb-2">No Active Shifts</h4>
                    <p className="text-[#888888]">Your accepted shifts will appear here</p>
                </div>
            ) : (
                acceptedBids.map((bid, index) => (
                    <div
                        key={bid._id}
                        className="glass-card rounded-2xl p-6 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center relative">
                                        <Briefcase size={28} className="text-blue-600" />
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-[#032A33] text-xl">
                                                {bid.shiftId?.title || 'Shift'}
                                            </h3>
                                            <div className="relative">
                                                <select
                                                    value={bid.shiftId?.status || 'in-progress'}
                                                    onChange={(e) => handleStatusChange(bid.shiftId?._id, e.target.value)}
                                                    className="appearance-none px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border-none outline-none cursor-pointer hover:bg-emerald-200 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <p className="text-[#0B4B54] font-medium">
                                            {bid.hirerId?.fullName || 'Employer'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={16} className="text-[#82ACAB]" />
                                        <span className="text-[#032A33]">{bid.shiftId?.location?.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock size={16} className="text-[#82ACAB]" />
                                        <span className="text-[#032A33]">
                                            {bid.shiftId?.time?.start} - {bid.shiftId?.time?.end}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign size={16} className="text-[#82ACAB]" />
                                        <span className="text-[#032A33] font-semibold">Rs {bid.bidAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={16} className="text-[#82ACAB]" />
                                        <span className="text-[#032A33]">{bid.hirerId?.phone || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="text-sm text-[#888888]">
                                    Estimated arrival: <span className="font-semibold text-[#032A33]">{bid.estimatedArrivalTime}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex lg:flex-col gap-2">
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B4B54] text-white font-medium hover:bg-[#0D5A65] transition-colors">
                                    <MessageCircle size={18} />
                                    <span>Contact</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D3E4E7] text-[#032A33] font-medium hover:bg-[#82ACAB]/30 transition-colors">
                                    <Navigation size={18} />
                                    <span>Navigate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderHistory = () => (
        <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Jobs', value: stats.totalJobs.toString(), icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
                    { label: 'This Month', value: stats.thisMonth.toString(), icon: Calendar, color: 'text-blue-600 bg-blue-100' },
                    { label: 'Total Earned', value: `Rs ${stats.totalEarned.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600 bg-purple-100' },
                    { label: 'Avg Rating', value: stats.avgRating.toString(), icon: Star, color: 'text-amber-600 bg-amber-100' },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-xl p-4 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[1]} flex items-center justify-center mb-3`}>
                            <stat.icon size={20} className={stat.color.split(' ')[0]} />
                        </div>
                        <p className="text-2xl font-bold text-[#032A33]">{stat.value}</p>
                        <p className="text-sm text-[#888888]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Completed Job Cards */}
            <div className="space-y-4">
                {completedBids.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-2xl">
                        <CheckCircle size={48} className="text-[#82ACAB] mx-auto mb-4" />
                        <h4 className="font-semibold text-[#032A33] mb-2">No Completed Shifts</h4>
                        <p className="text-[#888888]">Your completed shifts will appear here</p>
                    </div>
                ) : (
                    completedBids.map((bid, index) => (
                        <div
                            key={bid._id}
                            className="glass-card rounded-2xl p-6 animate-fade-in-up"
                            style={{ animationDelay: `${200 + index * 100}ms` }}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle size={28} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#032A33] text-lg mb-1">
                                            {bid.shiftId?.title || 'Shift'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[#888888] text-sm mb-2">
                                            <Building size={14} />
                                            {bid.hirerId?.fullName || 'Employer'}
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm">
                                            <span className="flex items-center gap-1 text-[#032A33]">
                                                <MapPin size={14} className="text-[#82ACAB]" />
                                                {bid.shiftId?.location?.city || 'N/A'}
                                            </span>
                                            <span className="flex items-center gap-1 text-[#032A33]">
                                                <Calendar size={14} className="text-[#82ACAB]" />
                                                {formatDate(bid.shiftId?.date)}
                                            </span>
                                            <span className="flex items-center gap-1 text-[#032A33] font-semibold">
                                                <DollarSign size={14} className="text-[#82ACAB]" />
                                                Rs {bid.bidAmount?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={() => handleOpenRateModal(bid.shiftId?._id, bid.hirerId?._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0B4B54] text-white rounded-lg hover:bg-[#0D5A65] transition-colors text-sm font-medium"
                                    >
                                        <Star size={16} />
                                        Rate Hirer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">My Shifts</h1>
                    <p className="text-[#888888]">Manage all your shift requests, active shifts, and history</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-[#D3E4E7]/50 rounded-xl w-fit">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-[#0B4B54] text-white shadow-lg'
                                        : 'text-[#032A33] hover:bg-white/50'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                {activeTab === 'requests' && renderRequests()}
                {activeTab === 'active' && renderActive()}
                {activeTab === 'history' && renderHistory()}

                {/* Rating Modal */}
                {showRatingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#032A33]">Rate Employer</h2>
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    How was your experience?
                                </label>
                                <div className="flex items-center gap-2 justify-center py-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`${star <= (hoverRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    {rating === 0 && 'Click to rate'}
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent'}
                                </p>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience with this employer..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    {comment.length}/500 characters
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview || rating === 0}
                                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${submittingReview || rating === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#0B4B54] text-white hover:bg-[#0D5A65]'
                                        }`}
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </WorkerLayout>
    );
};

export default MyShifts;
