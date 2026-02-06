import {
    AlertCircle,
    ArrowUpRight,
    Briefcase,
    Building,
    Clock,
    DollarSign,
    Filter,
    Loader2,
    MapPin,
    Search,
    ShieldAlert,
    Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BidModal from '../../components/worker/BidModal';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

// Verification Required Banner
const VerificationRequiredBanner = ({ onVerify }) => (
    <div className="glass-card rounded-2xl p-5 mb-6 bg-amber-50 border border-amber-200 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ShieldAlert size={24} className="text-amber-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-[#032A33]">Verification Required</h4>
                    <p className="text-sm text-[#888888]">
                        You must verify your identity before you can apply for shifts.
                    </p>
                </div>
            </div>
            <button
                onClick={onVerify}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
                Get Verified
                <ArrowUpRight size={16} />
            </button>
        </div>
    </div>
);

const ShiftCard = ({ shift, delay, canApply, onApply, onVerify }) => {
    const navigate = useNavigate();

    return (
        <div
            className="glass-card rounded-2xl p-6 card-hover animate-fade-in-up opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center">
                        <Briefcase size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#032A33] text-lg">{shift.title}</h3>
                        <div className="flex items-center gap-2 text-[#888888]">
                            <Building size={14} />
                            <span className="text-sm">{shift.company}</span>
                        </div>
                    </div>
                </div>
                <span className={`
          px-3 py-1.5 rounded-full text-xs font-semibold
          ${shift.tag === 'Urgent'
                        ? 'bg-red-100 text-red-600 border border-red-200'
                        : shift.tag === 'New'
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : shift.tag === 'Recommended'
                                ? 'bg-purple-100 text-purple-600 border border-purple-200'
                                : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                    }
        `}>
                    {shift.tag}
                </span>
            </div>

            <p className="text-[#888888] text-sm mb-4 line-clamp-2">{shift.description}</p>

            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33]">{shift.location}</span>
                    <span className="text-[#888888]">({shift.distance})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33]">{shift.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33] font-semibold">Rs {shift.pay}/shift</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#82ACAB]/20">
                <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-[#032A33]">{shift.rating}</span>
                    <span className="text-[#888888] text-sm">({shift.reviews} reviews)</span>
                </div>
                {canApply ? (
                    <button
                        onClick={() => onApply(shift)}
                        className="
                            px-5 py-2.5 rounded-xl
                            bg-[#0B4B54] hover:bg-[#0D5A65]
                            text-white font-semibold text-sm
                            transition-all duration-200 flex items-center gap-2
                            shadow-lg shadow-[#0B4B54]/20
                        "
                    >
                        Apply Now
                        <ArrowUpRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={onVerify}
                        className="
                            px-5 py-2.5 rounded-xl
                            bg-gray-300 hover:bg-gray-400
                            text-gray-700 font-semibold text-sm
                            transition-all duration-200 flex items-center gap-2
                        "
                        title="You must be verified to apply"
                    >
                        <AlertCircle size={16} />
                        Verify to Apply
                    </button>
                )}
            </div>
        </div>
    );
};

const FindShifts = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [canBid, setCanBid] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('not_submitted');
    const [loading, setLoading] = useState(true);

    // Bid modal state
    const [selectedShift, setSelectedShift] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);

    // Check if user can bid on shifts
    useEffect(() => {
        const checkBidEligibility = async () => {
            try {
                setLoading(true);
                const response = await api.get('/helper/can-bid');
                setCanBid(response.data?.data?.canBid || false);
                setVerificationStatus(response.data?.data?.verificationStatus || 'not_submitted');
            } catch (error) {
                console.error('Error checking bid eligibility:', error);
                setCanBid(false);
            } finally {
                setLoading(false);
            }
        };

        checkBidEligibility();
    }, []);

    // Open bid modal when worker clicks apply
    const handleApply = (shift) => {
        console.log('Apply clicked for shift:', shift);
        setSelectedShift(shift);
        setShowBidModal(true);
    };

    // When bid is successfully placed
    const handleBidSuccess = (message) => {
        toast.success(message || 'Bid placed successfully!');
        setShowBidModal(false);
        setSelectedShift(null);
    };

    const handleVerify = () => {
        navigate('/worker/verification');
    };

    const [availableShifts, setAvailableShifts] = useState([]);
    const [loadingShifts, setLoadingShifts] = useState(true);

    // Fetch all available shifts
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                setLoadingShifts(true);
                // Use the new endpoint specifically for open shifts
                const response = await api.get('/shifts/open');
                if (response.data.success) {
                    setAvailableShifts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching shifts:', error);
                toast.error('Failed to load shifts. Please try again.');
            } finally {
                setLoadingShifts(false);
            }
        };

        fetchShifts();
    }, []);

    const filters = ['All', 'Construction', 'Marketing', 'Delivery', 'Event Staff', 'Cleaning', 'Security', 'Teaching', 'Data Entry', 'Customer Service', 'Other'];

    if (loading) {
        return (
            <WorkerLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
                </div>
            </WorkerLayout>
        );
    }

    return (
        <WorkerLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Find Shifts</h1>
                    <p className="text-[#888888]">Discover available shifts near your location</p>
                </div>

                {/* Verification Required Banner */}
                {!canBid && verificationStatus !== 'pending' && (
                    <VerificationRequiredBanner onVerify={handleVerify} />
                )}

                {/* Pending Verification Banner */}
                {verificationStatus === 'pending' && (
                    <div className="glass-card rounded-2xl p-5 mb-6 bg-blue-50 border border-blue-200 animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Clock size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#032A33]">Verification In Progress</h4>
                                <p className="text-sm text-[#888888]">
                                    Your documents are being reviewed. You'll be able to apply for shifts once verified.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
                            <input
                                type="text"
                                placeholder="Search shifts by title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                  w-full pl-12 pr-4 py-3 rounded-xl
                  bg-[#D3E4E7]/30 border border-[#82ACAB]/30
                  text-[#032A33] placeholder-[#888888]
                  focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10
                  transition-all
                "
                            />
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-[#D3E4E7] text-[#0B4B54] font-semibold hover:bg-[#82ACAB]/30 transition-colors flex items-center justify-center gap-2">
                            <Filter size={18} />
                            More Filters
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`
                  px-4 py-2 rounded-xl font-medium text-sm transition-all
                  ${activeFilter === filter
                                        ? 'bg-[#0B4B54] text-white shadow-lg shadow-[#0B4B54]/20'
                                        : 'bg-[#D3E4E7]/50 text-[#032A33] hover:bg-[#82ACAB]/30'
                                    }
                `}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[#888888]">
                        Showing <span className="font-semibold text-[#032A33]">{availableShifts.length}</span> shifts near you
                    </p>
                    <select className="px-4 py-2 rounded-xl bg-white border border-[#82ACAB]/30 text-[#032A33] focus:outline-none focus:border-[#0B4B54]">
                        <option>Sort by: Nearest</option>
                        <option>Sort by: Highest Pay</option>
                        <option>Sort by: Rating</option>
                        <option>Sort by: Newest</option>
                    </select>
                </div>

                {/* Shift Listings */}
                {loadingShifts ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-[#0B4B54] mx-auto" />
                        <p className="text-[#888888] mt-4">Loading available shifts...</p>
                    </div>
                ) : availableShifts.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <Briefcase size={64} className="text-[#82ACAB] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#032A33] mb-2">No Shifts Available</h3>
                        <p className="text-[#888888]">Check back later for new opportunities</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {availableShifts.map((shift, index) => (
                            <ShiftCard
                                key={shift._id}
                                shift={{
                                    ...shift, // Spread raw data first so formatted props below override it
                                    id: shift._id,
                                    title: shift.title || 'Untitled Position',
                                    company: shift.hirerId?.fullName || 'Employer',
                                    description: shift.description || 'No description provided',
                                    location: shift.location?.city || 'Location not specified',
                                    distance: '-- km',
                                    time: shift.time ? `${shift.time.start} - ${shift.time.end}` : 'Flexible Timing',
                                    pay: shift.pay ? `${shift.pay.min}-${shift.pay.max}` : 'Negotiable',
                                    rating: 4.5,
                                    reviews: 0,
                                    tag: 'New',
                                }}
                                delay={index * 100}
                                canApply={canBid}
                                onApply={() => handleApply(shift)}
                                onVerify={handleVerify}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bid Modal - Shows when worker clicks Apply */}
            {showBidModal && selectedShift && (
                <BidModal
                    shift={selectedShift}
                    onClose={() => setShowBidModal(false)}
                    onSuccess={handleBidSuccess}
                />
            )}
        </WorkerLayout>
    );
};

export default FindShifts;
