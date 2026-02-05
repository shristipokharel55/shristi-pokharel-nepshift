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
    Users
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

    useEffect(() => {
        const fetchShiftDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/shifts/${id}/details`);
                if (response.data.success) {
                    setShiftData(response.data.data);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${shift.status === 'open'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : shift.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : shift.status === 'completed'
                                        ? 'bg-gray-100 text-gray-700 border border-gray-200'
                                        : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </span>
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
                                                            <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
                                                                Accept
                                                            </button>
                                                            <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
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

            <style jsx>{`
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
            `}</style>
        </HirerLayout>
    );
};

export default ShiftDetails;
