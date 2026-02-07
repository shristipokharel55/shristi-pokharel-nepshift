import {
    BadgeCheck,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Filter,
    Grid,
    List,
    MapPin,
    Search,
    Star,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerAvailability = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [searchQuery, setSearchQuery] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 7)); // Feb 7, 2026

    // Sample shift data - Replace with actual API data
    const todayShifts = [
        {
            id: 1,
            title: 'Morning Cleaning Service',
            location: 'Thamel, Kathmandu',
            time: '8:00 AM - 12:00 PM',
            pay: 1500,
            status: 'active',
            category: 'Cleaning'
        },
        {
            id: 2,
            title: 'Event Staff Support',
            location: 'Durbar Marg',
            time: '2:00 PM - 6:00 PM',
            pay: 2000,
            status: 'awaiting',
            category: 'Event Staff'
        }
    ];

    const upcomingShifts = [
        {
            id: 3,
            title: 'Restaurant Helper',
            location: 'Jhamsikhel, Lalitpur',
            time: '6:00 PM - 10:00 PM',
            date: 'Feb 8',
            pay: 1800,
            status: 'confirmed',
            category: 'Customer Service'
        },
        {
            id: 4,
            title: 'Delivery Assistant',
            location: 'Baneshwor',
            time: '10:00 AM - 4:00 PM',
            date: 'Feb 9',
            pay: 2200,
            status: 'confirmed',
            category: 'Delivery'
        },
        {
            id: 5,
            title: 'Construction Support',
            location: 'Bhaktapur',
            time: '7:00 AM - 3:00 PM',
            date: 'Feb 10',
            pay: 2500,
            status: 'confirmed',
            category: 'Construction'
        }
    ];

    // Mini calendar generation
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const monthDays = getDaysInMonth(currentDate);
    const today = currentDate.getDate();

    // Sample shift days - Replace with actual data
    const shiftDays = [7, 8, 9, 10, 14, 15, 20, 21];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
            case 'completed':
            case 'confirmed':
                return 'border-emerald-500';
            case 'awaiting':
                return 'border-amber-500';
            default:
                return 'border-gray-300';
        }
    };

    return (
        <WorkerLayout>
            {/* Header Section - Blended into main theme */}
            <div className="mb-8 px-4 py-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#032A33] tracking-tight">
                            Work Schedule
                        </h1>
                        <p className="text-[#888888] mt-1 font-medium">
                            Manage your shifts and track your earnings
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border border-[#82ACAB]/20 p-1 self-start md:self-auto shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${viewMode === 'list'
                                ? 'bg-[#0B4B54] text-white shadow-md'
                                : 'text-[#888888] hover:bg-white'
                                }`}
                        >
                            <List size={18} />
                            <span className="font-semibold text-sm">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${viewMode === 'calendar'
                                ? 'bg-[#0B4B54] text-white shadow-md'
                                : 'text-[#888888] hover:bg-white'
                                }`}
                        >
                            <Grid size={18} />
                            <span className="font-semibold text-sm">Calendar</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] group-focus-within:text-[#0B4B54] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by shift name, location, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/80 border border-[#82ACAB]/20 shadow-sm focus:border-[#0B4B54] focus:ring-4 focus:ring-[#0B4B54]/5 focus:outline-none transition-all placeholder:text-[#888888]"
                        />
                    </div>

                    <button className="px-6 py-3.5 rounded-2xl bg-white shadow-sm border border-[#82ACAB]/20 hover:bg-white flex items-center justify-center gap-2 transition-all group">
                        <Filter size={20} className="text-[#0B4B54]" />
                        <span className="font-bold text-[#032A33]">Filter</span>
                    </button>
                </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pb-8 max-w-7xl mx-auto">

                {/* LEFT COLUMN - Shift List */}
                <div className="lg:col-span-8">
                    {/* Today Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-[#0B4B54] rounded-full"></div>
                            <h2 className="text-xl font-bold text-[#032A33]">Today's Shifts</h2>
                        </div>
                        <div className="space-y-5">
                            {todayShifts.map((shift) => (
                                <div
                                    key={shift.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-[#82ACAB]/10 hover:shadow-lg hover:shadow-[#0B4B54]/5 transition-all duration-300 border-l-[6px] ${getStatusColor(shift.status)} relative overflow-hidden group cursor-pointer`}
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-[#032A33] group-hover:text-[#0B4B54] transition-colors">
                                                        {shift.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${shift.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {shift.status === 'active' ? 'Active' : 'Awaiting'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-[#888888] font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={16} className="text-[#82ACAB]" />
                                                        <span>{shift.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={16} className="text-[#82ACAB]" />
                                                        <span>{shift.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right bg-[#D3E4E7]/20 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none w-full md:w-auto">
                                                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-1">Estimated Pay</div>
                                                <div className="font-black text-2xl text-[#032A33]">
                                                    NPR {shift.pay.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#82ACAB]/10 flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-[#888888] uppercase tracking-widest">Category:</span>
                                                <span className="px-3 py-1 bg-[#D3E4E7]/40 text-[#0B4B54] text-xs font-bold rounded-lg uppercase tracking-wide">
                                                    {shift.category}
                                                </span>
                                            </div>
                                            <button className="flex items-center gap-2 text-sm font-bold text-[#0B4B54] hover:text-[#0D5A65] transition-colors group/btn">
                                                <span>View Full Details</span>
                                                <ChevronRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-[#82ACAB] rounded-full"></div>
                            <h2 className="text-xl font-bold text-[#032A33]">Upcoming Schedule</h2>
                        </div>
                        <div className="space-y-5">
                            {upcomingShifts.map((shift) => (
                                <div
                                    key={shift.id}
                                    className="bg-white rounded-2xl shadow-sm border border-[#82ACAB]/10 hover:shadow-lg hover:shadow-[#0B4B54]/5 transition-all duration-300 border-l-[6px] border-[#D3E4E7] relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-[#032A33] group-hover:text-[#0B4B54] transition-colors">
                                                        {shift.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#032A33] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
                                                        <Calendar size={12} />
                                                        {shift.date}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-[#888888] font-medium tracking-tight">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={16} className="text-[#82ACAB]" />
                                                        <span>{shift.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={16} className="text-[#82ACAB]" />
                                                        <span>{shift.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right bg-[#D3E4E7]/20 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none w-full md:w-auto">
                                                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-1">Pay on Completion</div>
                                                <div className="font-black text-2xl text-[#032A33]">
                                                    NPR {shift.pay.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#82ACAB]/10 flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-[#888888] uppercase tracking-widest">Status:</span>
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg uppercase tracking-wide">
                                                    Confirmed
                                                </span>
                                            </div>
                                            <button className="flex items-center gap-2 text-sm font-bold text-[#0B4B54] hover:text-[#0D5A65] transition-colors group/btn">
                                                <span>View Shift Details</span>
                                                <ChevronRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Stats & Calendar */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Mini Calendar Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#82ACAB]/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-[#032A33]">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                                    className="p-2 hover:bg-[#D3E4E7]/30 border border-[#82ACAB]/10 rounded-xl transition-all"
                                >
                                    <ChevronLeft size={18} className="text-[#0B4B54]" />
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                                    className="p-2 hover:bg-[#D3E4E7]/30 border border-[#82ACAB]/10 rounded-xl transition-all"
                                >
                                    <ChevronRight size={18} className="text-[#0B4B54]" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-[10px] font-black text-[#888888] py-2 uppercase tracking-tight">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {monthDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`
                                        aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-200
                                        ${!day ? '' :
                                            day === today
                                                ? 'bg-[#0B4B54] text-white font-black shadow-lg scale-110'
                                                : shiftDays.includes(day)
                                                    ? 'bg-[#D3E4E7] text-[#0B4B54] font-bold'
                                                    : 'text-[#032A33] hover:bg-[#D3E4E7]/30 font-medium'}
                                        ${day ? 'cursor-pointer' : ''}
                                    `}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Earnings Card */}
                    <div className="bg-[#032A33] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-[#0B4B54]/50 rounded-lg">
                                    <TrendingUp size={20} className="text-[#82ACAB]" />
                                </div>
                                <h3 className="font-bold text-[#82ACAB] uppercase tracking-widest text-[10px]">Total Potential</h3>
                            </div>
                            <div className="text-4xl font-black mb-2 tracking-tight">NPR 8,000</div>
                            <p className="text-xs text-[#82ACAB]/70 mb-8 font-medium">Projected for the current work week</p>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                    <span className="text-[#82ACAB]/60">Progress</span>
                                    <span className="text-[#82ACAB]">65%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-[#82ACAB] to-[#0B4B54] h-3 rounded-full shadow-[0_0_15px_rgba(130,172,171,0.3)] transition-all duration-1000"
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#82ACAB]/40 pt-2">
                                    <span>NPR 5,200 earned</span>
                                    <span>NPR 2,800 left</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Clock size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">24</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Hours</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Calendar size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">8</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Shifts</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <DollarSign size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">5.2k</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Earnings</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Star size={20} className="text-amber-500" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">4.8</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Rating</div>
                        </div>
                    </div>

                    {/* Trust Badge Card */}
                    <div className="bg-gradient-to-br from-[#0B4B54] to-[#032A33] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12">
                            <BadgeCheck size={120} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                <BadgeCheck size={28} />
                            </div>
                            <div>
                                <div className="font-black text-lg uppercase tracking-tight">Verified</div>
                                <div className="text-xs text-[#82ACAB] font-medium tracking-wide">Identity confirmed & profile verified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerAvailability;
