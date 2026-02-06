import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    Loader2,
    MapPin,
    Star,
    User,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';
import api from '../../utils/api';

const ShiftDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shiftData, setShiftData] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [reviewToUserId, setReviewToUserId] = useState(null);

    useEffect(() => {
        const fetchShiftDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/shifts/${id}/details`);
                if (response.data.success) {
                    setShiftData(response.data.data);

                    // Check if user can review this shift
                    if (response.data.data.shift.status === 'completed') {
                        checkReviewEligibility();
                    }
                }
            } catch (error) {
                console.error('Error fetching shift details:', error);
                toast.error(error.response?.data?.message || 'Failed to load shift details');
                navigate('/hirer/manage-jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchShiftDetails();
    }, [id, navigate]);

    // Check if user can submit a review for this shift
    const checkReviewEligibility = async () => {
        try {
            const response = await api.get(`/reviews/can-review/${id}`);
            if (response.data.success && response.data.canReview) {
                setCanReview(true);
                setReviewToUserId(response.data.toUserId);
            }
        } catch (error) {
            console.error('Error checking review eligibility:', error);
        }
    };

    // Complete the shift and update stats
    const handleCompleteShift = async () => {
        try {
            const response = await api.put(`/shifts/${id}/complete`);
            if (response.data.success) {
                toast.success('Shift marked as completed! Stats have been updated.');

                // Refresh shift details
                const updatedShift = await api.get(`/shifts/${id}/details`);
                if (updatedShift.data.success) {
                    setShiftData(updatedShift.data.data);
                    checkReviewEligibility(); // Check if can review now
                }
            }
        } catch (error) {
            console.error('Error completing shift:', error);
            toast.error(error.response?.data?.message || 'Failed to complete shift');
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
                shiftId: id,
                toUserId: reviewToUserId,
                rating,
                comment
            });

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                setShowRatingModal(false);
                setCanReview(false);
                setRating(0);
                setComment('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Handle Accept Application
    const handleAccept = async (applicationId) => {
        try {
            const response = await api.put(`/bids/${applicationId}`, {
                status: 'accepted'
            });

            if (response.data.success) {
                toast.success('Application accepted successfully!');
                // Refresh shift details to show updated status
                const updatedShift = await api.get(`/shifts/${id}/details`);
                if (updatedShift.data.success) {
                    setShiftData(updatedShift.data.data);
                }
            }
        } catch (error) {
            console.error('Error accepting application:', error);
            toast.error(error.response?.data?.message || 'Failed to accept application');
        }
    };

    // Handle Reject Application
    const handleReject = async (applicationId) => {
        try {
            const response = await api.put(`/bids/${applicationId}`, {
                status: 'rejected'
            });

            if (response.data.success) {
                toast.success('Application rejected');
                // Refresh shift details to show updated status
                const updatedShift = await api.get(`/shifts/${id}/details`);
                if (updatedShift.data.success) {
                    setShiftData(updatedShift.data.data);
                }
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error(error.response?.data?.message || 'Failed to reject application');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle Status Change
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        // If user selects 'completed', use the specialized completion handler
        if (newStatus === 'completed') {
            handleCompleteShift();
            return;
        }

        try {
            const response = await api.put(`/shifts/${id}`, { status: newStatus });

            if (response.data.success) {
                toast.success(`Shift status updated to ${newStatus}`);
                // Update local state without full reload
                setShiftData(prev => ({
                    ...prev,
                    shift: {
                        ...prev.shift,
                        status: newStatus
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) {
        return (
            <HirerLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
                </div>
            </HirerLayout>
        );
    }

    if (!shiftData) {
        return (
            <HirerLayout>
                <div className="text-center py-12">
                    <Briefcase size={64} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Shift Not Found</h3>
                    <button
                        onClick={() => navigate('/hirer/manage-jobs')}
                        className="mt-4 px-6 py-2 bg-[#0B4B54] text-white rounded-xl hover:bg-[#0D5A65] transition-colors"
                    >
                        Back to Jobs
                    </button>
                </div>
            </HirerLayout>
        );
    }

    const { shift, bids, totalBids } = shiftData;

    // Helper to get color class for status
    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-700 border-green-200';
            case 'reserved': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <HirerLayout>
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/hirer/manage-jobs')}
                    className="flex items-center gap-2 text-[#0B4B54] hover:text-[#0D5A65] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Jobs</span>
                </button>

                {/* Shift Information Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center">
                                <Briefcase size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#032A33] mb-1">{shift.title}</h1>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                    {shift.category}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="relative">
                                <select
                                    value={shift.status}
                                    onChange={handleStatusChange}
                                    className={`appearance-none px-4 py-2 pr-8 rounded-xl text-sm font-semibold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 transition-all ${getStatusColor(shift.status)}`}
                                >
                                    <option value="open">Open</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Rate Worker Button - Show for completed shifts if can review */}
                            {shift.status === 'completed' && canReview && (
                                <button
                                    onClick={() => setShowRatingModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0B4B54] text-white rounded-lg hover:bg-[#0D5A65] transition-colors"
                                >
                                    <Star size={18} />
                                    <span>Rate Worker</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {shift.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{shift.description}</p>
                        </div>
                    )}

                    {/* Shift Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F4FBFA] flex items-center justify-center">
                                <DollarSign size={20} className="text-[#0B4B54]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pay Range</p>
                                <p className="text-lg font-semibold text-[#032A33]">
                                    Rs {shift.pay.min.toLocaleString()} - Rs {shift.pay.max.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F4FBFA] flex items-center justify-center">
                                <Calendar size={20} className="text-[#0B4B54]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="text-lg font-semibold text-[#032A33]">{formatDate(shift.date)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F4FBFA] flex items-center justify-center">
                                <Clock size={20} className="text-[#0B4B54]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="text-lg font-semibold text-[#032A33]">
                                    {shift.time.start} - {shift.time.end}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F4FBFA] flex items-center justify-center">
                                <MapPin size={20} className="text-[#0B4B54]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="text-lg font-semibold text-[#032A33]">{shift.location.address}</p>
                                <p className="text-sm text-gray-500">{shift.location.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    {shift.skills && shift.skills.length > 0 && (
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {shift.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg bg-[#D3E4E7] text-[#032A33] text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Applicants Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Users size={24} className="text-[#0B4B54]" />
                            <h2 className="text-2xl font-bold text-[#032A33]">Applicants</h2>
                        </div>
                        <span className="px-4 py-2 rounded-xl bg-[#F4FBFA] text-[#0B4B54] font-semibold">
                            {totalBids} {totalBids === 1 ? 'Bid' : 'Bids'}
                        </span>
                    </div>

                    {/* No Applicants State */}
                    {bids.length === 0 ? (
                        <div className="text-center py-12 bg-[#F4FBFA] rounded-xl">
                            <User size={64} className="text-[#82ACAB] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#032A33] mb-2">No Applicants Yet</h3>
                            <p className="text-gray-600">
                                We'll notify you when someone bids on this shift.
                            </p>
                        </div>
                    ) : (
                        /* Applicants List */
                        <div className="space-y-4">
                            {bids.map((bid, index) => (
                                <div
                                    key={bid._id}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                    style={{
                                        animation: 'fadeInUp 0.3s ease-out',
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: 'backwards'
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Worker Avatar */}
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center text-white font-bold text-xl">
                                                {bid.worker.name.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Worker Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-[#032A33]">
                                                        {bid.worker.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                        <span className="font-medium text-gray-700">
                                                            {bid.worker.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-3">
                                                    {bid.worker.skillCategory} • {bid.worker.jobsCompleted} jobs completed
                                                </p>

                                                {/* Bid Details */}
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Bid Amount</p>
                                                        <p className="text-lg font-bold text-[#0B4B54]">
                                                            Rs {bid.bidAmount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Estimated Arrival</p>
                                                        <p className="text-lg font-semibold text-gray-700">
                                                            {bid.estimatedArrivalTime}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Message */}
                                                {bid.message && (
                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                        <p className="text-sm text-gray-600 italic">"{bid.message}"</p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => navigate(`/hirer/worker/${bid.worker.id}`)}
                                                        className="px-4 py-2 rounded-lg bg-[#F4FBFA] text-[#0B4B54] font-semibold hover:bg-[#D3E4E7] transition-colors"
                                                    >
                                                        View Profile
                                                    </button>
                                                    {bid.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAccept(bid._id)}
                                                                className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(bid._id)}
                                                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bid.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : bid.status === 'accepted'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#032A33]">Rate Worker</h2>
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                                placeholder="Share your experience with this worker..."
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

            {/* <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style> */}
        </HirerLayout>
    );
};

export default ShiftDetails;
