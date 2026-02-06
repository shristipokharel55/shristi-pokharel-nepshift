import {
    AlertCircle,
    ArrowUpRight,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    MapPin,
    Shield,
    ShieldCheck,
    Star,
    TrendingUp,
    User,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BidModal from '../../components/worker/BidModal';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

// Profile Completion Banner Component
const ProfileCompletionBanner = ({ percentage, onComplete }) => {
    const isComplete = percentage >= 100;

    if (isComplete) return null;

    return (
        <div
            className="glass-card rounded-2xl p-5 mb-6 border-l-4 border-[#0B4B54] animate-fade-in-up"
            style={{ animationFillMode: 'forwards' }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
                        <User size={24} className="text-[#0B4B54]" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#032A33]">Complete Your Profile</h4>
                        <p className="text-sm text-[#888888]">
                            Your profile is {percentage}% complete. Add more details to get more job opportunities.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#0B4B54] to-[#82ACAB] rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={onComplete}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0B4B54] text-white text-sm font-semibold hover:bg-[#0D5A65] transition-colors"
                    >
                        Complete
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Verification Status Banner Component
const VerificationBanner = ({ status, onVerify }) => {
    if (status === 'verified') return null;

    const bannerConfig = {
        'not_submitted': {
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-400',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            icon: AlertCircle,
            title: 'Verify Your Identity',
            message: 'Submit your citizenship documents to get verified and start bidding on jobs.',
            buttonText: 'Get Verified',
            buttonColor: 'bg-amber-500 hover:bg-amber-600'
        },
        'pending': {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-400',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            icon: Shield,
            title: 'Verification In Progress',
            message: 'Your documents are being reviewed. This usually takes 1-2 business days.',
            buttonText: 'View Status',
            buttonColor: 'bg-blue-500 hover:bg-blue-600'
        },
        'rejected': {
            bgColor: 'bg-red-50',
            borderColor: 'border-red-400',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            icon: AlertCircle,
            title: 'Verification Rejected',
            message: 'Your verification was rejected. Please resubmit with valid documents.',
            buttonText: 'Resubmit',
            buttonColor: 'bg-red-500 hover:bg-red-600'
        }
    };

    const config = bannerConfig[status] || bannerConfig['not_submitted'];
    const IconComponent = config.icon;

    return (
        <div
            className={`rounded-2xl p-5 mb-6 border-l-4 ${config.bgColor} ${config.borderColor} animate-fade-in-up`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                        <IconComponent size={24} className={config.iconColor} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#032A33]">{config.title}</h4>
                        <p className="text-sm text-[#888888]">{config.message}</p>
                    </div>
                </div>
                <button
                    onClick={onVerify}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors ${config.buttonColor}`}
                >
                    {config.buttonText}
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// Verified Badge Component
const VerifiedBadge = () => (
    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-2 text-sm">
        <ShieldCheck size={16} />
        Verified Helper
    </span>
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendValue, gradientFrom, gradientTo, delay }) => (
    <div
        className={`
      glass-card rounded-2xl p-6 card-hover
      animate-fade-in-up opacity-0
    `}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-start justify-between mb-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                    boxShadow: `0 8px 20px -8px ${gradientFrom}50`
                }}
            >
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <div className={`
          flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
          ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}
        `}>
                    <TrendingUp size={14} className={trend === 'down' ? 'rotate-180' : ''} />
                    {trendValue}
                </div>
            )}
        </div>
        <h3 className="text-3xl font-bold text-[#032A33] mb-1">{value}</h3>
        <p className="text-[#888888] font-medium">{title}</p>
    </div>
);

// Quick Action Button Component
const QuickActionButton = ({ title, description, icon: Icon, onClick, color, delay }) => (
    <button
        onClick={onClick}
        className={`
      w-full p-5 rounded-2xl text-left
      bg-white/80 hover:bg-white
      border border-[#82ACAB]/20 hover:border-[#0B4B54]/30
      shadow-sm hover:shadow-lg hover:shadow-[#0B4B54]/5
      transition-all duration-300 group
      animate-fade-in-up opacity-0
    `}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-[#032A33] group-hover:text-[#0B4B54] transition-colors">
                    {title}
                </h4>
                <p className="text-sm text-[#888888]">{description}</p>
            </div>
            <ArrowUpRight
                size={20}
                className="text-[#82ACAB] group-hover:text-[#0B4B54] transition-all group-hover:translate-x-1 group-hover:-translate-y-1"
            />
        </div>
    </button>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <h3 className="font-semibold text-[#032A33] mb-6">{title}</h3>
            <div className="flex items-end justify-between gap-3 h-40">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex justify-center">
                            <div
                                className="w-8 rounded-t-lg transition-all duration-500 hover:opacity-80"
                                style={{
                                    height: `${(item.value / maxValue) * 120}px`,
                                    background: `linear-gradient(180deg, #0B4B54 0%, #82ACAB 100%)`,
                                    animationDelay: `${index * 100}ms`
                                }}
                            />
                        </div>
                        <span className="text-xs text-[#888888] font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Earnings Line Chart Component
const EarningsChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.amount));

    return (
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[#032A33]">Earnings Overview</h3>
                <select className="px-3 py-1.5 rounded-lg bg-[#D3E4E7]/50 text-sm text-[#032A33] border-0 focus:ring-2 focus:ring-[#0B4B54]/20">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                </select>
            </div>
            <div className="relative h-32">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#82ACAB" strokeWidth="0.5" strokeOpacity="0.3" />
                    ))}

                    {/* Area fill */}
                    <path
                        d={`
              M 0 ${100 - (data[0]?.amount / maxValue) * 80}
              ${data.map((d, i) => `L ${(i / (data.length - 1)) * 300} ${100 - (d.amount / maxValue) * 80}`).join(' ')}
              L 300 100 L 0 100 Z
            `}
                        fill="url(#areaGradient)"
                        opacity="0.3"
                    />

                    {/* Line */}
                    <path
                        d={`
              M 0 ${100 - (data[0]?.amount / maxValue) * 80}
              ${data.map((d, i) => `L ${(i / (data.length - 1)) * 300} ${100 - (d.amount / maxValue) * 80}`).join(' ')}
            `}
                        fill="none"
                        stroke="#0B4B54"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Dots */}
                    {data.map((d, i) => (
                        <circle
                            key={i}
                            cx={(i / (data.length - 1)) * 300}
                            cy={100 - (d.amount / maxValue) * 80}
                            r="4"
                            fill="#0B4B54"
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}

                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0B4B54" />
                            <stop offset="100%" stopColor="#82ACAB" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="flex justify-between mt-4">
                {data.map((d, i) => (
                    <span key={i} className="text-xs text-[#888888]">{d.day}</span>
                ))}
            </div>
        </div>
    );
};

// Recommended Job Card
const RecommendedJobCard = ({ job, delay, shift, onApply }) => (
    <div
        className="
      glass-card rounded-2xl p-5 card-hover
      animate-fade-in-up opacity-0
    "
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#D3E4E7] flex items-center justify-center">
                    <Briefcase size={20} className="text-[#0B4B54]" />
                </div>
                <div>
                    <h4 className="font-semibold text-[#032A33]">{job.title}</h4>
                    <p className="text-sm text-[#888888]">{job.company}</p>
                </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#82ACAB]/20 text-[#0B4B54]">
                {job.tag}
            </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-[#888888]">
                <MapPin size={14} className="text-[#82ACAB]" />
                {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#888888]">
                <Clock size={14} className="text-[#82ACAB]" />
                {job.time}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#888888]">
                <DollarSign size={14} className="text-[#82ACAB]" />
                Rs {job.pay}
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#82ACAB]/20">
            <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-[#032A33]">{job.rating}</span>
            </div>
            <button
                onClick={() => onApply && onApply(shift)}
                className="
        px-4 py-2 rounded-xl
        bg-[#0B4B54] hover:bg-[#0D5A65]
        text-white text-sm font-semibold
        transition-all duration-200
        btn-ripple
      ">
                Apply Now
            </button>
        </div>
    </div>
);

const WorkerDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const firstName = user?.fullName?.split(" ")[0] || "Worker";

    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({
        completed: 0,
        active: 0,
        pending: 0,
        earnings: 0
    });

    // Profile and verification states
    const [profileData, setProfileData] = useState({
        profileCompletionPercentage: 0,
        verificationStatus: 'not_submitted',
        isVerified: false
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch worker stats from backend
    useEffect(() => {
        const fetchWorkerStats = async () => {
            try {
                setLoadingStats(true);
                const response = await api.get('/helper/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching worker stats:', error);
                toast.error('Failed to load statistics');
            } finally {
                setLoadingStats(false);
            }
        };

        fetchWorkerStats();
    }, []);

    // Fetch profile and verification status
    useEffect(() => {
        const fetchProfileStatus = async () => {
            try {
                setLoadingProfile(true);
                const [profileRes, verificationRes] = await Promise.all([
                    api.get('/helper/profile'),
                    api.get('/helper/verification-status')
                ]);

                setProfileData({
                    profileCompletionPercentage: profileRes.data?.data?.profileCompletionPercentage || 0,
                    verificationStatus: verificationRes.data?.data?.verificationStatus || 'not_submitted',
                    isVerified: verificationRes.data?.data?.isVerified || false
                });
            } catch (error) {
                console.error('Error fetching profile status:', error);
                // Set defaults if API fails
                setProfileData({
                    profileCompletionPercentage: 0,
                    verificationStatus: 'not_submitted',
                    isVerified: false
                });
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfileStatus();
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // State for real shift data
    const [recommendedShifts, setRecommendedShifts] = useState([]);
    const [loadingShifts, setLoadingShifts] = useState(true);

    // Bid modal state
    const [selectedShift, setSelectedShift] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);

    // Fetch available shifts for recommendations
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                setLoadingShifts(true);
                const response = await api.get('/shifts?status=open');
                if (response.data.success) {
                    // Take first 3 shifts for recommendations
                    setRecommendedShifts(response.data.data.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching shifts:', error);
            } finally {
                setLoadingShifts(false);
            }
        };

        fetchShifts();
    }, []);

    // Handle bid modal
    const handleApplyShift = (shift) => {
        setSelectedShift(shift);
        setShowBidModal(true);
    };

    const handleBidSuccess = (message) => {
        toast.success(message || 'Bid placed successfully!');
        setShowBidModal(false);
        setSelectedShift(null);
        // Refresh stats after successful bid
        api.get('/helper/stats').then(response => {
            if (response.data.success) {
                setStats(response.data.data);
            }
        });
    };

    return (
        <WorkerLayout>
            {/* Profile Completion and Verification Banners */}
            {!loadingProfile && (
                <>
                    <ProfileCompletionBanner
                        percentage={profileData.profileCompletionPercentage}
                        onComplete={() => navigate('/worker/complete-profile')}
                    />
                    <VerificationBanner
                        status={profileData.verificationStatus}
                        onVerify={() => navigate('/worker/verification')}
                    />
                </>
            )}

            {/* Greeting Section */}
            <div className="mb-8 animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#032A33] mb-2">
                            {getGreeting()}, <span className="text-[#0B4B54]">{firstName}</span>! 👋
                        </h1>
                        <p className="text-[#888888] font-medium">{formatDate()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {profileData.isVerified ? (
                            <VerifiedBadge />
                        ) : (
                            <span className="px-4 py-2 rounded-xl bg-[#82ACAB]/20 text-[#0B4B54] font-semibold flex items-center gap-2">
                                <Zap size={16} className="text-yellow-500" />
                                Pro Helper
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    trend="up"
                    trendValue="+12%"
                    gradientFrom="#0B4B54"
                    gradientTo="#82ACAB"
                    delay={100}
                />
                <StatCard
                    title="Active Jobs"
                    value={stats.active}
                    icon={Briefcase}
                    gradientFrom="#0B4B54"
                    gradientTo="#0D5A65"
                    delay={200}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pending}
                    icon={Clock}
                    trend="up"
                    trendValue="+3"
                    gradientFrom="#82ACAB"
                    gradientTo="#0B4B54"
                    delay={300}
                />
                <StatCard
                    title="Total Earnings"
                    value={`Rs ${stats.earnings.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+8%"
                    gradientFrom="#032A33"
                    gradientTo="#0B4B54"
                    delay={400}
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="font-semibold text-[#032A33] text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        title="Find Shifts"
                        description="Browse available jobs"
                        icon={Briefcase}
                        onClick={() => navigate('/worker/find-shifts')}
                        color="#0B4B54"
                        delay={200}
                    />
                    <QuickActionButton
                        title="My Shifts"
                        description="View your applications"
                        icon={Calendar}
                        onClick={() => navigate('/worker/my-shifts')}
                        color="#82ACAB"
                        delay={300}
                    />
                    <QuickActionButton
                        title="Wallet"
                        description="View payment history"
                        icon={DollarSign}
                        onClick={() => navigate('/worker/wallet')}
                        color="#032A33"
                        delay={400}
                    />
                </div>
            </div>

            {/* Recommended Jobs Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#032A33] text-lg">Recommended Shifts</h3>
                    <button
                        onClick={() => navigate('/worker/find-shifts')}
                        className="text-[#0B4B54] hover:text-[#0D5A65] font-semibold text-sm flex items-center gap-1 group"
                    >
                        View All
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
                {loadingShifts ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54] mx-auto"></div>
                        <p className="text-[#888888] mt-4">Loading shifts...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedShifts.map((shift, index) => (
                            <RecommendedJobCard
                                key={shift._id}
                                job={{
                                    id: shift._id,
                                    title: shift.title || 'Untitled Position',
                                    company: shift.hirerId?.fullName || 'Employer',
                                    location: shift.location?.city || 'Location not specified',
                                    time: shift.time ? `${shift.time.start} - ${shift.time.end}` : 'Flexible Timing',
                                    pay: shift.pay ? `${shift.pay.min}-${shift.pay.max}` : 'Negotiable',
                                    rating: 4.5,
                                    tag: 'New'
                                }}
                                shift={shift}
                                onApply={handleApplyShift}
                                delay={600 + (index * 100)}
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

            {/* Footer Info */}
            <div className="text-center py-6 border-t border-[#82ACAB]/20">
                <p className="text-sm text-[#888888]">
                    © 2026 Nepshift. All rights reserved. |{' '}
                    <button className="text-[#0B4B54] hover:underline">Privacy Policy</button>{' '}
                    |{' '}
                    <button className="text-[#0B4B54] hover:underline">Terms of Service</button>
                </p>
            </div>
        </WorkerLayout>
    );
};

export default WorkerDashboard;
