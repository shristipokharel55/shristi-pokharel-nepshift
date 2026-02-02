import {
    AlertCircle,
    ArrowUpRight,
    Briefcase,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Loader2,
    MoreHorizontal,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from '../../utils/api';

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendUp, iconBg, iconColor }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {value}
                </h3>
                {trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                        <span className={`
                            flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                            ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}
                        `}>
                            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trendValue}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">vs last month</span>
                    </div>
                )}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon size={20} className={iconColor} />
            </div>
        </div>
    </div>
);

// Verification Request Card Component
const VerificationCard = ({ name, type, date, status, avatar }) => {
    const statusStyles = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        rejected: 'bg-slate-50 text-slate-700 border-slate-200'
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-slate-300 transition-all duration-200 group">
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-sm">
                    {avatar}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium">{type}</span>
                        <span className="text-slate-300">•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${statusStyles[status]}`}>
                    {status}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors" title="View Details">
                        <Eye size={16} />
                    </button>
                    {status === 'pending' && (
                        <>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                                <CheckCircle size={16} />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Reject">
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Recent Activity Item Component
const ActivityItem = ({ icon: Icon, iconBg, title, description, time }) => (
    <div className="relative pl-6 py-3 border-l border-slate-100 last:border-0 hover:border-slate-300 transition-colors group">
        <div className={`absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${iconBg}`}></div>
        <div className="flex items-start justify-between group-hover:translate-x-1 transition-transform duration-200">
            <div>
                <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
                {time}
            </span>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsResponse, activityResponse] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activity')
                ]);
                setStats(statsResponse.data.data);
                setRecentActivity(activityResponse.data.data || []);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Map activity type to icon and color
    const getActivityIcon = (type) => {
        const iconMap = {
            user_registered: { icon: UserCheck, bg: 'bg-emerald-500' },
            payment_processed: { icon: DollarSign, bg: 'bg-[#3B82F6]' },
            shift_posted: { icon: Briefcase, bg: 'bg-indigo-500' },
            verification_pending: { icon: AlertCircle, bg: 'bg-amber-500' },
            shift_completed: { icon: CheckCircle, bg: 'bg-emerald-500' },
            user_verified: { icon: CheckCircle, bg: 'bg-emerald-500' },
            verification_rejected: { icon: XCircle, bg: 'bg-rose-500' }
        };
        return iconMap[type] || { icon: AlertCircle, bg: 'bg-slate-500' };
    };

    // Revenue Trend Chart Options
    const revenueChartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: "'Inter', sans-serif",
            sparkline: { enabled: false },
            animations: { enabled: true }
        },
        colors: ['#3B82F6'], // Slate Blue / Primary Blue
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#3B82F6']
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#64748B', fontSize: '11px', fontWeight: 500 }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#64748B', fontSize: '11px', fontWeight: 500 },
                formatter: (val) => `Rs ${val / 1000}k`
            }
        },
        grid: {
            borderColor: '#F1F5F9',
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
            padding: { top: 0, right: 0, bottom: 0, left: 10 }
        },
        tooltip: {
            theme: 'light',
            y: { formatter: (val) => `Rs ${val.toLocaleString()}` },
            style: { fontSize: '12px', fontFamily: 'Inter' }
        }
    };

    const revenueChartSeries = [{
        name: 'Revenue',
        data: [45000, 52000, 49000, 63000, 71000, 65000, 78000, 85000, 91000, 88000, 95000, 102000]
    }];

    // User Demographics Pie Chart Options
    const demographicsChartOptions = {
        chart: {
            type: 'donut',
            fontFamily: "'Inter', sans-serif"
        },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'], // Blue, Emerald, Amber, Red
        labels: ['Helpers', 'Hirers', 'Pending', 'Inactive'],
        legend: {
            position: 'bottom',
            fontSize: '12px',
            fontFamily: 'Inter',
            fontWeight: 500,
            markers: { radius: 12 },
            itemMargin: { horizontal: 12, vertical: 0 }
        },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '12px', fontFamily: 'Inter', color: '#64748B' },
                        value: { show: true, fontSize: '24px', fontFamily: 'Inter', fontWeight: 700, color: '#1E293B' },
                        total: { show: true, showAlways: true, label: 'Total Users', fontSize: '12px', fontFamily: 'Inter', fontWeight: 500, color: '#64748B' }
                    }
                },
                expandOnClick: false
            }
        },
        stroke: { width: 0 },
        tooltip: {
            y: { formatter: (val) => `${val} users` }
        }
    };

    // Dynamic demographics data based on API response
    const demographicsChartSeries = stats?.userDemographics ? [
        stats.userDemographics.helpers || 0,
        stats.userDemographics.hirers || 0,
        stats.userDemographics.pendingVerification || 0,
        stats.userDemographics.inactive || 0
    ] : [0, 0, 0, 0];

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <p className="text-slate-900 font-semibold">Failed to load dashboard</p>
                    <p className="text-slate-500 text-sm mt-1">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Format number helper
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return num.toLocaleString();
        return num?.toString() || '0';
    };

    return (
        <div className="space-y-8 animate-fade-in-up" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Admin Overview
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Real-time visualization of platform metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md shadow-sm">All Time</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-md">30D</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-md">7D</button>
                    </div>
                    <button className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2">
                        <ArrowUpRight size={16} />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={formatNumber(stats?.totalUsers || 0)}
                    icon={Users}
                    trend={true}
                    trendValue={`${stats?.usersTrend > 0 ? '+' : ''}${stats?.usersTrend || 0}%`}
                    trendUp={stats?.usersTrend >= 0}
                    iconBg="bg-blue-50"
                    iconColor="text-[#3B82F6]"
                />
                <StatCard
                    title="Active Shifts"
                    value={formatNumber(stats?.activeShifts || 0)}
                    icon={Briefcase}
                    trend={true}
                    trendValue={`${stats?.totalShifts || 0} total`}
                    trendUp={true}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <StatCard
                    title="Revenue"
                    value={`Rs ${formatNumber(stats?.totalRevenue || 0)}`}
                    icon={DollarSign}
                    trend={true}
                    trendValue={`${stats?.completedShifts || 0} completed`}
                    trendUp={true}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Pending KYC"
                    value={formatNumber(stats?.pendingVerifications || 0)}
                    icon={Clock}
                    trend={true}
                    trendValue={stats?.pendingVerifications > 0 ? 'High Priority' : 'All Clear'}
                    trendUp={stats?.pendingVerifications === 0}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">Financial Performance</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Gross volume processed</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                            <TrendingUp size={14} />
                            <span className="text-sm font-bold">+23.1%</span>
                        </div>
                    </div>
                    <Chart
                        options={revenueChartOptions}
                        series={revenueChartSeries}
                        type="area"
                        height={320}
                    />
                </div>

                {/* User Demographics Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">User Distribution</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">By account type</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <Chart
                            options={demographicsChartOptions}
                            series={demographicsChartSeries}
                            type="donut"
                            height={280}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Verifications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">Verification Requests</h3>
                            <p className="text-xs text-slate-500 font-medium">{stats?.pendingVerifications || 0} pending actions</p>
                        </div>
                        <a href="/admin/verification" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline transition-colors">
                            View All
                        </a>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentVerifications?.length > 0 ? (
                            stats.recentVerifications.slice(0, 5).map((request, index) => (
                                <VerificationCard 
                                    key={request._id || index} 
                                    name={request.fullName || request.email}
                                    type="KYC Verification"
                                    date={new Date(request.createdAt).toLocaleDateString()}
                                    status={request.verificationStatus || 'pending'}
                                    avatar={(request.fullName || request.email || 'U').charAt(0).toUpperCase()}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm font-medium">No pending verifications</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">System Activity</h3>
                            <p className="text-xs text-slate-500 font-medium">Latest logs</p>
                        </div>
                        <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="space-y-1 pl-2">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => {
                                const iconInfo = getActivityIcon(activity.type);
                                return (
                                    <ActivityItem 
                                        key={activity._id || index} 
                                        icon={iconInfo.icon}
                                        iconBg={iconInfo.bg}
                                        title={activity.title}
                                        description={activity.description}
                                        time={activity.time}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm font-medium">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
