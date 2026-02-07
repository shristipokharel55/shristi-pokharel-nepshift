import {
    BadgeCheck,
    Calendar,
    CalendarOff,
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
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

const WorkerAvailability = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [searchQuery, setSearchQuery] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // For calendar date filtering
    const [loading, setLoading] = useState(true);
    const [allShifts, setAllShifts] = useState([]);
    const [workerStats, setWorkerStats] = useState({
        totalHours: 0,
        totalShifts: 0,
        totalEarnings: 0,
        averageRating: 0,
        earningsPotential: 0,
        earnedThisWeek: 0
    });

    // Fetch worker shifts and stats
    useEffect(() => {
        fetchWorkerShifts();
    }, []);

    const fetchWorkerShifts = async () => {
        try {
            setLoading(true);
            // Fetch worker's applied/accepted shifts
            const response = await api.get('/bids/my-bids');
            
            if (response.data.success) {
                // Filter only accepted bids with shift data
                const acceptedBids = response.data.data.filter(
                    bid => bid.status === 'accepted' && bid.shiftId
                );
                
                // Map bids to shift data
                const shifts = acceptedBids.map(bid => ({
                    id: bid._id,
                    shiftId: bid.shiftId?._id,
                    title: bid.shiftId?.title || 'Untitled Shift',
                    location: bid.shiftId?.location?.address || 'Location not specified',
                    time: bid.shiftId?.time ? `${bid.shiftId.time.start} - ${bid.shiftId.time.end}` : 'Time TBD',
                    date: bid.shiftId?.date ? new Date(bid.shiftId.date) : null,
                    pay: bid.bidAmount || bid.shiftId?.pay?.max || 0,
                    status: bid.shiftId?.status || 'pending',
                    category: bid.shiftId?.category || 'General',
                    estimatedArrival: bid.estimatedArrivalTime
                })).filter(shift => shift.date); // Only include shifts with valid dates
                
                setAllShifts(shifts);
                calculateStats(shifts);
            }
        } catch (error) {
            console.error('Failed to fetch shifts:', error);
            toast.error('Failed to load your shifts');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (shifts) => {
        const totalEarnings = shifts.reduce((sum, shift) => sum + shift.pay, 0);
        const totalShifts = shifts.length;
        
        // Calculate potential earnings for upcoming shifts
        const upcomingPay = shifts
            .filter(shift => shift.date > new Date())
            .reduce((sum, shift) => sum + shift.pay, 0);
        
        setWorkerStats({
            totalHours: totalShifts * 6, // Approximate 6 hours per shift
            totalShifts,
            totalEarnings,
            averageRating: 4.8, // This should come from user profile
            earningsPotential: upcomingPay,
            earnedThisWeek: totalEarnings * 0.65 // Sample calculation
        });
    };


    // Filter shifts based on date
    const getTodayShifts = () => {
        if (selectedDate) {
            // Show shifts for selected date
            return allShifts.filter(shift => 
                shift.date && isSameDay(shift.date, selectedDate)
            );
        }
        // Show today's shifts
        const today = new Date();
        return allShifts.filter(shift => 
            shift.date && isSameDay(shift.date, today)
        );
    };

    const getUpcomingShifts = () => {
        if (selectedDate) {
            // When a date is selected, show only that date's shifts
            return [];
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return allShifts.filter(shift => 
            shift.date && shift.date > today
        ).sort((a, b) => a.date - b.date);
    };

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };

    const formatShiftDate = (date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (isSameDay(date, today)) return 'Today';
        if (isSameDay(date, tomorrow)) return 'Tomorrow';
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Mini calendar generation
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const monthDays = getDaysInMonth(currentDate);
    const today = new Date().getDate();
    const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear();

    // Get days that have shifts
    const getShiftDays = () => {
        return allShifts
            .filter(shift => 
                shift.date &&
                shift.date.getMonth() === currentDate.getMonth() &&
                shift.date.getFullYear() === currentDate.getFullYear()
            )
            .map(shift => shift.date.getDate());
    };

    const shiftDays = getShiftDays();

    const handleDateClick = (day) => {
        if (!day) return;
        const clickedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        setSelectedDate(clickedDate);
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress':
            case 'completed':
            case 'reserved':
                return 'border-emerald-500';
            case 'open':
                return 'border-amber-500';
            default:
                return 'border-gray-300';
        }
    };

    const todayShifts = getTodayShifts();
    const upcomingShifts = getUpcomingShifts();

    if (loading) {
        return (
            <WorkerLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54] mx-auto mb-4"></div>
                        <div className="text-gray-600">Loading your schedule...</div>
                    </div>
                </div>
            </WorkerLayout>
        );
    }

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
                    {/* Selected Date Filter Banner */}
                    {selectedDate && (
                        <div className="mb-6 bg-[#0B4B54] text-white p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} />
                                <span className="font-semibold">
                                    Showing shifts for {selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        month: 'long', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <button 
                                onClick={clearDateFilter}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}

                    {/* Today/Selected Date Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-[#0B4B54] rounded-full"></div>
                            <h2 className="text-xl font-bold text-[#032A33]">
                                {selectedDate ? 'Shifts on Selected Date' : "Today's Shifts"}
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {todayShifts.length > 0 ? (
                                todayShifts.map((shift) => (
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
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            shift.status === 'in-progress' || shift.status === 'reserved'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {shift.status}
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
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-[#82ACAB]/10 p-12 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <CalendarOff size={48} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-700 mb-2">
                                                {selectedDate ? 'No shifts scheduled' : 'No shifts today'}
                                            </h3>
                                            <p className="text-gray-500">
                                                {selectedDate 
                                                    ? 'You don\'t have any shifts on this date.' 
                                                    : 'You don\'t have any shifts scheduled for today.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Section - Only show when no date is selected */}
                    {!selectedDate && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-[#82ACAB] rounded-full"></div>
                                <h2 className="text-xl font-bold text-[#032A33]">Upcoming Schedule</h2>
                            </div>
                            <div className="space-y-5">
                                {upcomingShifts.length > 0 ? (
                                    upcomingShifts.map((shift) => (
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
                                                                {formatShiftDate(shift.date)}
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
                                    ))
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm border border-[#82ACAB]/10 p-12 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-gray-100 rounded-full">
                                                <Calendar size={48} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-700 mb-2">
                                                    No upcoming shifts
                                                </h3>
                                                <p className="text-gray-500">
                                                    You don't have any shifts scheduled for future dates.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                            {monthDays.map((day, index) => {
                                const isToday = isCurrentMonth && day === today;
                                const hasShift = shiftDays.includes(day);
                                const isSelected = selectedDate && 
                                    selectedDate.getDate() === day && 
                                    selectedDate.getMonth() === currentDate.getMonth() &&
                                    selectedDate.getFullYear() === currentDate.getFullYear();
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateClick(day)}
                                        disabled={!day}
                                        className={`
                                            aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-200
                                            ${!day ? '' :
                                                isSelected
                                                    ? 'bg-[#032A33] text-white font-black shadow-lg ring-2 ring-[#0B4B54] ring-offset-2'
                                                    : isToday
                                                    ? 'bg-[#0B4B54] text-white font-black shadow-lg'
                                                    : hasShift
                                                    ? 'bg-[#D3E4E7] text-[#0B4B54] font-bold hover:bg-[#0B4B54] hover:text-white'
                                                    : 'text-[#032A33] hover:bg-[#D3E4E7]/30 font-medium'}
                                            ${day ? 'cursor-pointer' : 'cursor-default'}
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
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
                            <div className="text-4xl font-black mb-2 tracking-tight">
                                NPR {workerStats.earningsPotential.toLocaleString()}
                            </div>
                            <p className="text-xs text-[#82ACAB]/70 mb-8 font-medium">Projected for upcoming shifts</p>

                            {workerStats.earningsPotential > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                        <span className="text-[#82ACAB]/60">Progress</span>
                                        <span className="text-[#82ACAB]">
                                            {Math.round((workerStats.earnedThisWeek / (workerStats.earningsPotential + workerStats.earnedThisWeek)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-[#82ACAB] to-[#0B4B54] h-3 rounded-full shadow-[0_0_15px_rgba(130,172,171,0.3)] transition-all duration-1000"
                                            style={{ 
                                                width: `${Math.round((workerStats.earnedThisWeek / (workerStats.earningsPotential + workerStats.earnedThisWeek)) * 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#82ACAB]/40 pt-2">
                                        <span>NPR {workerStats.earnedThisWeek.toLocaleString()} earned</span>
                                        <span>NPR {workerStats.earningsPotential.toLocaleString()} left</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Clock size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">{workerStats.totalHours}</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Hours</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Calendar size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">{workerStats.totalShifts}</div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Shifts</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <DollarSign size={20} className="text-[#0B4B54]" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">
                                {(workerStats.totalEarnings / 1000).toFixed(1)}k
                            </div>
                            <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Earnings</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#82ACAB]/10 hover:border-[#0B4B54]/30 transition-all group">
                            <div className="p-2.5 bg-[#D3E4E7]/40 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                <Star size={20} className="text-amber-500" />
                            </div>
                            <div className="text-3xl font-black text-[#032A33] mb-1">
                                {workerStats.averageRating.toFixed(1)}
                            </div>
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
