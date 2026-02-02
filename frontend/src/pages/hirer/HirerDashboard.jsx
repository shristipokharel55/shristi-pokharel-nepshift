import {
    ArrowUpRight,
    Briefcase,
    Clock,
    DollarSign,
    MapPin,
    Plus,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';
import { useAuth } from '../../context/AuthContext';

const HirerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const firstName = user?.fullName?.split(" ")[0] || "Employer";

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const stats = [
        { label: 'Total Hires', value: '24', icon: Users, color: 'bg-blue-100 text-blue-600', trend: '+12%' },
        { label: 'Active Shifts', value: '3', icon: Briefcase, color: 'bg-emerald-100 text-emerald-600', trend: null },
        { label: 'Total Spend', value: 'Rs 45k', icon: DollarSign, color: 'bg-purple-100 text-purple-600', trend: '+8%' },
    ];

    const recentApplicants = [
        { id: 1, name: 'Ram Sharma', role: 'Kitchen Helper', rating: 4.8, experience: '2 years', avatar: 'R', appliedFor: 'Morning Kitchen Staff', time: '2 hours ago' },
        { id: 2, name: 'Sita Gurung', role: 'Event Staff', rating: 4.9, experience: '3 years', avatar: 'S', appliedFor: 'Wedding Event Helper', time: '4 hours ago' },
        { id: 3, name: 'Hari Thapa', role: 'Warehouse Helper', rating: 4.5, experience: '1 year', avatar: 'H', appliedFor: 'Package Sorting', time: '5 hours ago' },
        { id: 4, name: 'Maya Rai', role: 'Restaurant Server', rating: 4.7, experience: '2 years', avatar: 'M', appliedFor: 'Morning Kitchen Staff', time: '6 hours ago' },
        { id: 5, name: 'Bikash Lama', role: 'Cleaning Staff', rating: 4.6, experience: '1.5 years', avatar: 'B', appliedFor: 'Hotel Cleaning', time: '8 hours ago' },
    ];

    const activeShifts = [
        { id: 1, title: 'Kitchen Helper', location: 'Lalitpur', workers: 2, totalWorkers: 3, status: 'In Progress', startTime: '6:00 AM', endTime: '2:00 PM', progress: 65 },
        { id: 2, title: 'Event Staff', location: 'Kathmandu', workers: 5, totalWorkers: 5, status: 'Fully Staffed', startTime: '4:00 PM', endTime: '11:00 PM', progress: 30 },
        { id: 3, title: 'Warehouse Helper', location: 'Bhaktapur', workers: 1, totalWorkers: 2, status: 'Needs Staff', startTime: '8:00 AM', endTime: '4:00 PM', progress: 0 },
    ];

    return (
        <HirerLayout>
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                    <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {firstName}!</h1>
                            <p className="text-white/80 text-lg mb-6">You have <span className="text-amber-400 font-semibold">5 new applicants</span> waiting for your review.</p>
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={() => navigate('/hirer/applicants')}
                                    className="px-5 py-2.5 bg-white text-[#0B4B54] font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
                                >
                                    <Users size={18} />
                                    View Applicants
                                </button>
                                <button 
                                    onClick={() => navigate('/hirer/post-shift')}
                                    className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Post New Shift
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="glass-card rounded-2xl p-6 card-hover animate-fade-in-up opacity-0"
                            style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'forwards' }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={24} />
                                </div>
                                {stat.trend && (
                                    <span className="flex items-center gap-1 text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                                        <TrendingUp size={14} />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-[#032A33] mb-1">{stat.value}</p>
                            <p className="text-[#888888]">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Applicants */}
                    <div className="glass-card rounded-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                        <div className="p-6 border-b border-[#82ACAB]/20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-[#032A33]">Recent Applicants</h2>
                                <button 
                                    onClick={() => navigate('/hirer/applicants')}
                                    className="text-[#0B4B54] text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    View All <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentApplicants.map((applicant) => (
                                <div key={applicant.id} className="p-4 hover:bg-[#D3E4E7]/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                                            {applicant.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-semibold text-[#032A33]">{applicant.name}</h3>
                                                <span className="flex items-center gap-0.5 text-amber-500 text-sm">
                                                    <Star size={12} className="fill-amber-500" />
                                                    {applicant.rating}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#888888]">{applicant.role} • {applicant.experience}</p>
                                            <p className="text-xs text-[#82ACAB] mt-1">Applied for: {applicant.appliedFor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[#82ACAB] mb-2">{applicant.time}</p>
                                            <button className="px-3 py-1.5 bg-[#0B4B54] text-white text-xs font-medium rounded-lg hover:bg-[#0B4B54]/90 transition-colors">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Shifts */}
                    <div className="glass-card rounded-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                        <div className="p-6 border-b border-[#82ACAB]/20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-[#032A33]">Active Shifts</h2>
                                <button 
                                    onClick={() => navigate('/hirer/manage-jobs')}
                                    className="text-[#0B4B54] text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    Manage All <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {activeShifts.map((shift) => (
                                <div key={shift.id} className="p-4 bg-[#D3E4E7]/30 rounded-xl hover:bg-[#D3E4E7]/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-[#032A33]">{shift.title}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-[#888888]">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {shift.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {shift.startTime} - {shift.endTime}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                            shift.status === 'Fully Staffed' ? 'bg-emerald-100 text-emerald-700' :
                                            shift.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {shift.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-[#82ACAB]" />
                                            <span className="text-sm text-[#888888]">
                                                {shift.workers}/{shift.totalWorkers} workers
                                            </span>
                                        </div>
                                        <button className="px-3 py-1.5 border border-[#0B4B54] text-[#0B4B54] text-xs font-medium rounded-lg hover:bg-[#0B4B54] hover:text-white transition-colors">
                                            Track Status
                                        </button>
                                    </div>
                                    {shift.progress > 0 && (
                                        <div className="mt-3">
                                            <div className="h-2 bg-[#82ACAB]/30 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all ${
                                                        shift.progress >= 75 ? 'bg-emerald-500' :
                                                        shift.progress >= 50 ? 'bg-blue-500' :
                                                        'bg-amber-500'
                                                    }`}
                                                    style={{ width: `${shift.progress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-[#82ACAB] mt-1">{shift.progress}% shift complete</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerDashboard;
