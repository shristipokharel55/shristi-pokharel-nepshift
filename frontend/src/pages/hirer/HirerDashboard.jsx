import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';
import { useAuth } from '../../context/AuthContext';

// Stat Card Component
const StatCard = ({ title, value, icon, trend, trendValue, delay }) => (
    <div
        className={`
      glass-card rounded-2xl p-6 card-hover
      animate-fade-in-up opacity-0
    `}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-start justify-between mb-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#0B4B54] to-[#0D5A65]"
            >
                <i className={`ph ${icon} text-2xl text-white`}></i>
            </div>
            {trend && (
                <div className={`
          flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
          ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}
        `}>
                    <i className={`ph ${trend === 'up' ? 'ph-trend-up' : 'ph-trend-down'} font-bold`}></i>
                    {trendValue}
                </div>
            )}
        </div>
        <h3 className="text-3xl font-bold text-[#032A33] mb-1">{value}</h3>
        <p className="text-[#888888] font-medium">{title}</p>
    </div>
);

// Applicant List Item
const ApplicantItem = ({ applicant, delay }) => (
    <div
        className="p-4 bg-white hover:bg-[#F4FBFA] border border-[#82ACAB]/10 rounded-xl transition-all duration-200 animate-slide-in-left opacity-0"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#82ACAB] to-[#0B4B54] flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
                {applicant.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-[#032A33] truncate">{applicant.name}</h4>
                    <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        <i className="ph-fill ph-star text-amber-500"></i>
                        {applicant.rating}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#888888] mb-1">
                    <span className="flex items-center gap-1">
                        <i className="ph ph-briefcase text-[#82ACAB]"></i>
                        {applicant.experience}
                    </span>
                    <span>•</span>
                    <span className="truncate">Applied: {applicant.appliedFor}</span>
                </div>
            </div>
            <button className="px-4 py-2 bg-[#0B4B54] hover:bg-[#0D5A65] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md">
                Review
            </button>
        </div>
    </div>
);

// Active Shift Card
const ActiveShiftCard = ({ shift, delay }) => (
    <div
        className="p-4 bg-white border border-[#82ACAB]/20 rounded-xl hover:shadow-md transition-all duration-200 animate-fade-in-up opacity-0"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex justify-between items-start mb-3">
            <div>
                <h4 className="font-semibold text-[#032A33]">{shift.title}</h4>
                <p className="text-xs text-[#888888] mt-0.5">{shift.location}</p>
            </div>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${shift.status === 'Fully Staffed' ? 'bg-emerald-100 text-emerald-700' :
                shift.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                }`}>
                {shift.status}
            </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#555555] mb-3">
            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-100">
                <i className="ph ph-clock text-[#82ACAB]"></i>
                {shift.startTime} - {shift.endTime}
            </span>
            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-100">
                <i className="ph ph-users text-[#82ACAB]"></i>
                {shift.workers}/{shift.totalWorkers}
            </span>
        </div>

        <div className="w-full h-1.5 bg-[#D3E4E7] rounded-full overflow-hidden">
            <div
                className="h-full bg-[#0B4B54] rounded-full transition-all duration-500"
                style={{ width: `${shift.progress}%` }}
            ></div>
        </div>
    </div>
);

const HirerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const firstName = user?.fullName?.split(" ")[0] || "Employer";

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get greeting based on time of day
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

    const stats = [
        { label: 'Total Hires', value: '24', icon: 'ph-users', trend: 'up', trendValue: '+12%' },
        { label: 'Active Shifts', value: '3', icon: 'ph-briefcase', trend: null },
        { label: 'Total Spend', value: 'Rs 45k', icon: 'ph-currency-dollar', trend: 'up', trendValue: '+8%' },
    ];

    const recentApplicants = [
        { id: 1, name: 'Ram Sharma', rating: 4.8, experience: '2 yrs', avatar: 'R', appliedFor: 'Kitchen Helper' },
        { id: 2, name: 'Sita Gurung', rating: 4.9, experience: '3 yrs', avatar: 'S', appliedFor: 'Event Staff' },
        { id: 3, name: 'Hari Thapa', rating: 4.5, experience: '1 yr', avatar: 'H', appliedFor: 'Warehouse Helper' },
        { id: 4, name: 'Maya Rai', rating: 4.7, experience: '2 yrs', avatar: 'M', appliedFor: 'Restaurant Server' },
        { id: 5, name: 'Bikash Lama', rating: 4.6, experience: '1.5 yrs', avatar: 'B', appliedFor: 'Cleaning Staff' },
    ];

    const activeShifts = [
        { id: 1, title: 'Kitchen Helper', location: 'Lalitpur', workers: 2, totalWorkers: 3, status: 'In Progress', startTime: '6:00 AM', endTime: '2:00 PM', progress: 65 },
        { id: 2, title: 'Event Staff', location: 'Kathmandu', workers: 5, totalWorkers: 5, status: 'Fully Staffed', startTime: '4:00 PM', endTime: '11:00 PM', progress: 30 },
        { id: 3, title: 'Warehouse Helper', location: 'Bhaktapur', workers: 1, totalWorkers: 2, status: 'Needs Staff', startTime: '8:00 AM', endTime: '4:00 PM', progress: 10 },
    ];

    return (
        <HirerLayout>
            <div className="max-w-[1400px] mx-auto min-h-screen pb-10">
                {/* Hero / Greeting Section */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-[#032A33] mb-2 font-display">
                                {getGreeting()}, <span className="text-[#0B4B54]">{firstName}</span>! 👋
                            </h1>
                            <p className="text-[#888888] font-medium text-lg flex items-center gap-2">
                                You have <span className="text-[#0B4B54] font-semibold bg-[#D3E4E7]/50 px-2 py-0.5 rounded-lg">5 new applicants</span> waiting for review.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/hirer/post-shift')}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B4B54] to-[#0F6974] text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20 hover:shadow-[#0B4B54]/30 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <i className="ph ph-plus-circle text-lg"></i>
                                Post a Shift
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                            delay={100 + index * 100}
                        />
                    ))}
                </div>

                {/* Content Grid: Applicants & Shifts */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Recent Applicants Column (Use 2 spans on large screens) */}
                    <div className="xl:col-span-2 space-y-4 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-[#032A33] flex items-center gap-2">
                                <i className="ph ph-users text-[#0B4B54]"></i>
                                Recent Applicants
                            </h2>
                            <button
                                onClick={() => navigate('/hirer/applicants')}
                                className="text-[#0B4B54] font-semibold text-sm hover:underline flex items-center gap-1 group"
                            >
                                View All
                                <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>

                        <div className="glass-card rounded-2xl p-6 shadow-sm border border-[#82ACAB]/20">
                            <div className="space-y-3">
                                {recentApplicants.map((applicant, idx) => (
                                    <ApplicantItem
                                        key={applicant.id}
                                        applicant={applicant}
                                        delay={500 + idx * 50}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Shifts Column (Use 1 span on large screens) */}
                    <div className="xl:col-span-1 space-y-4 animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-[#032A33] flex items-center gap-2">
                                <i className="ph ph-clock-countdown text-[#0B4B54]"></i>
                                Active Shifts
                            </h2>
                            <button
                                onClick={() => navigate('/hirer/manage-jobs')}
                                className="text-[#0B4B54] font-semibold text-sm hover:underline"
                            >
                                Manage
                            </button>
                        </div>

                        <div className="glass-card rounded-2xl p-5 shadow-sm border border-[#82ACAB]/20 space-y-4 min-h-[400px]">
                            {activeShifts.map((shift, idx) => (
                                <ActiveShiftCard
                                    key={shift.id}
                                    shift={shift}
                                    delay={600 + idx * 100}
                                />
                            ))}

                            <button className="w-full py-3 mt-2 rounded-xl border border-dashed border-[#82ACAB] text-[#0B4B54] font-medium hover:bg-[#F4FBFA] transition-colors flex items-center justify-center gap-2 group">
                                <i className="ph ph-plus-circle text-lg group-hover:scale-110 transition-transform"></i>
                                View All Active Shifts
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                <div className="text-center py-6 mt-8 border-t border-[#82ACAB]/10">
                    <p className="text-sm text-[#888888] flex items-center justify-center gap-2">
                        <i className="ph-fill ph-check-circle text-emerald-500"></i>
                        All systems operational
                    </p>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerDashboard;
