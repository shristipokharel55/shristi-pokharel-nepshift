import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    CheckCircle,
    Clock,
    DollarSign,
    MapPin,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    Star,
    Zap
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

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
const RecommendedJobCard = ({ job, delay }) => (
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
            <button className="
        px-4 py-2 rounded-xl
        bg-[#0B4B54] hover:bg-[#0D5A65]
        text-white text-sm font-semibold
        transition-all duration-200
        btn-ripple
      ">
                View Details
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
        completed: 24,
        active: 3,
        pending: 5,
        earnings: 45600
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
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

    // Chart data
    const jobsChartData = [
        { label: 'Mon', value: 3 },
        { label: 'Tue', value: 5 },
        { label: 'Wed', value: 2 },
        { label: 'Thu', value: 7 },
        { label: 'Fri', value: 4 },
        { label: 'Sat', value: 6 },
        { label: 'Sun', value: 3 },
    ];

    const earningsData = [
        { day: 'Mon', amount: 1200 },
        { day: 'Tue', amount: 1800 },
        { day: 'Wed', amount: 1400 },
        { day: 'Thu', amount: 2200 },
        { day: 'Fri', amount: 1900 },
        { day: 'Sat', amount: 2500 },
        { day: 'Sun', amount: 1600 },
    ];

    const recommendedJobs = [
        {
            id: 1,
            title: 'Kitchen Helper',
            company: 'Hotel Himalaya',
            location: 'Kathmandu',
            time: '6 AM - 2 PM',
            pay: '1,200',
            rating: 4.8,
            tag: 'Recommended'
        },
        {
            id: 2,
            title: 'Event Staff',
            company: 'Marriott Hotel',
            location: 'Lalitpur',
            time: '4 PM - 10 PM',
            pay: '1,500',
            rating: 4.5,
            tag: 'New'
        },
        {
            id: 3,
            title: 'Warehouse Helper',
            company: 'Daraz Nepal',
            location: 'Bhaktapur',
            time: '8 AM - 4 PM',
            pay: '1,000',
            rating: 4.3,
            tag: 'Urgent'
        }
    ];

    return (
        <WorkerLayout>
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
                        <span className="px-4 py-2 rounded-xl bg-[#82ACAB]/20 text-[#0B4B54] font-semibold flex items-center gap-2">
                            <Zap size={16} className="text-yellow-500" />
                            Pro Helper
                        </span>
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

            {/* Quick Actions and Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Actions */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-semibold text-[#032A33] text-lg mb-4">Quick Actions</h3>
                    <QuickActionButton
                        title="Update Availability"
                        description="Set your work schedule"
                        icon={Calendar}
                        onClick={() => navigate('/worker/availability')}
                        color="#0B4B54"
                        delay={200}
                    />
                    <QuickActionButton
                        title="View Nearby Jobs"
                        description="Find jobs around you"
                        icon={MapPin}
                        onClick={() => navigate('/worker/nearby-jobs')}
                        color="#82ACAB"
                        delay={300}
                    />
                    <QuickActionButton
                        title="Check Earnings"
                        description="View payment history"
                        icon={DollarSign}
                        onClick={() => navigate('/worker/earnings')}
                        color="#032A33"
                        delay={400}
                    />
                </div>

                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SimpleBarChart data={jobsChartData} title="Jobs This Week" />
                        <EarningsChart data={earningsData} />
                    </div>
                </div>
            </div>

            {/* Recommended Jobs Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#032A33] text-lg">Recommended Shifts</h3>
                    <button
                        onClick={() => navigate('/worker/nearby-jobs')}
                        className="text-[#0B4B54] hover:text-[#0D5A65] font-semibold text-sm flex items-center gap-1 group"
                    >
                        View All
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedJobs.map((job, index) => (
                        <RecommendedJobCard key={job.id} job={job} delay={600 + (index * 100)} />
                    ))}
                </div>
            </div>

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
