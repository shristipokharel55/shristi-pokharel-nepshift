import {
    AlertCircle,
    ArrowUpRight,
    Briefcase,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
    XCircle
} from 'lucide-react';
import Chart from 'react-apexcharts';

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendUp, iconBg, iconColor }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {value}
                </h3>
                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        {trendUp ? (
                            <TrendingUp size={14} className="text-emerald-500" />
                        ) : (
                            <TrendingDown size={14} className="text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trendValue}
                        </span>
                        <span className="text-sm text-slate-400">vs last month</span>
                    </div>
                )}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
                <Icon size={24} className={iconColor} />
            </div>
        </div>
    </div>
);

// Verification Request Card Component
const VerificationCard = ({ name, type, date, status, avatar }) => {
    const statusStyles = {
        pending: 'bg-amber-50 text-amber-600 border-amber-200',
        approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        rejected: 'bg-red-50 text-red-600 border-red-200'
    };

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center text-white font-bold">
                    {avatar}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{type}</span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusStyles[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-[#4A9287] hover:bg-white rounded-lg transition-colors">
                        <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-colors">
                        <CheckCircle size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors">
                        <XCircle size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Recent Activity Item Component
const ActivityItem = ({ icon: Icon, iconBg, title, description, time }) => (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {title}
            </p>
            <p className="text-sm text-slate-500 truncate">{description}</p>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>
    </div>
);

const AdminDashboard = () => {
    // Revenue Trend Chart Options
    const revenueChartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            sparkline: { enabled: false }
        },
        colors: ['#4A9287'],
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
            width: 3
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#94a3b8', fontSize: '12px' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#94a3b8', fontSize: '12px' },
                formatter: (val) => `Rs ${val / 1000}k`
            }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: 'light',
            y: { formatter: (val) => `Rs ${val.toLocaleString()}` }
        }
    };

    const revenueChartSeries = [{
        name: 'Revenue',
        data: [45000, 52000, 49000, 63000, 71000, 65000, 78000, 85000, 91000, 88000, 95000, 102000]
    }];

    // User Demographics Pie Chart Options
    const demographicsChartOptions = {
        chart: {
            type: 'pie',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        colors: ['#4A9287', '#64748b', '#f59e0b', '#ef4444'],
        labels: ['Helpers', 'Hirers', 'Pending Verification', 'Inactive'],
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            markers: { radius: 4 },
            itemMargin: { horizontal: 10, vertical: 5 }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
            style: { fontSize: '12px', fontWeight: 600 }
        },
        plotOptions: {
            pie: {
                donut: { size: '0%' },
                expandOnClick: true
            }
        },
        stroke: { width: 2, colors: ['#fff'] },
        tooltip: {
            y: { formatter: (val) => `${val} users` }
        }
    };

    const demographicsChartSeries = [8500, 2100, 450, 320];

    // Mock Data for Verification Requests
    const verificationRequests = [
        { name: 'Ram Bahadur Thapa', type: 'KYC Verification', date: '2 hours ago', status: 'pending', avatar: 'R' },
        { name: 'Sita Sharma', type: 'Business License', date: '4 hours ago', status: 'pending', avatar: 'S' },
        { name: 'Hari Prasad', type: 'KYC Verification', date: '5 hours ago', status: 'pending', avatar: 'H' },
        { name: 'Maya Gurung', type: 'ID Verification', date: '6 hours ago', status: 'pending', avatar: 'M' },
        { name: 'Bijay Rai', type: 'KYC Verification', date: '8 hours ago', status: 'pending', avatar: 'B' },
    ];

    // Mock Data for Recent Activity
    const recentActivity = [
        { icon: UserCheck, iconBg: 'bg-emerald-500', title: 'New user registered', description: 'Anita Tamang joined as a helper', time: '2m ago' },
        { icon: DollarSign, iconBg: 'bg-[#4A9287]', title: 'Payment processed', description: 'Rs 15,000 transferred to Hari Prasad', time: '15m ago' },
        { icon: Briefcase, iconBg: 'bg-blue-500', title: 'New shift posted', description: 'Kitchen Helper needed in Kathmandu', time: '32m ago' },
        { icon: AlertCircle, iconBg: 'bg-amber-500', title: 'Verification pending', description: 'Ram Thapa submitted KYC documents', time: '1h ago' },
        { icon: CheckCircle, iconBg: 'bg-emerald-500', title: 'Shift completed', description: 'Cleaning service completed successfully', time: '2h ago' },
    ];

    return (
        <div className="space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Welcome back! Here's what's happening with Nepshift today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287]">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This year</option>
                    </select>
                    <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2">
                        <ArrowUpRight size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="11,370"
                    icon={Users}
                    trend={true}
                    trendValue="+12.5%"
                    trendUp={true}
                    iconBg="bg-[#4A9287]/10"
                    iconColor="text-[#4A9287]"
                />
                <StatCard
                    title="Active Shifts"
                    value="842"
                    icon={Briefcase}
                    trend={true}
                    trendValue="+8.2%"
                    trendUp={true}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Revenue (Monthly)"
                    value="Rs 1.02M"
                    icon={DollarSign}
                    trend={true}
                    trendValue="+23.1%"
                    trendUp={true}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                />
                <StatCard
                    title="Pending Verifications"
                    value="47"
                    icon={Clock}
                    trend={true}
                    trendValue="-5.3%"
                    trendUp={false}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Revenue Trend</h3>
                            <p className="text-sm text-slate-500">Monthly revenue overview for 2026</p>
                        </div>
                        <div className="flex items-center gap-2 text-[#4A9287]">
                            <TrendingUp size={20} />
                            <span className="font-semibold">+23.1%</span>
                        </div>
                    </div>
                    <Chart
                        options={revenueChartOptions}
                        series={revenueChartSeries}
                        type="area"
                        height={300}
                    />
                </div>

                {/* User Demographics Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">User Demographics</h3>
                        <p className="text-sm text-slate-500">Distribution by user type</p>
                    </div>
                    <Chart
                        options={demographicsChartOptions}
                        series={demographicsChartSeries}
                        type="pie"
                        height={280}
                    />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Verifications */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Pending Verifications</h3>
                            <p className="text-sm text-slate-500">KYC requests awaiting approval</p>
                        </div>
                        <button className="text-sm font-medium text-[#4A9287] hover:text-[#3d7a71] flex items-center gap-1">
                            View All
                            <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {verificationRequests.map((request, index) => (
                            <VerificationCard key={index} {...request} />
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                            <p className="text-sm text-slate-500">Latest platform events</p>
                        </div>
                        <button className="text-sm font-medium text-[#4A9287] hover:text-[#3d7a71] flex items-center gap-1">
                            View All
                            <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {recentActivity.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
