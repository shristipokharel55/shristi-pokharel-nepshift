import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    MinusCircle,
    Plus
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerAvailability = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = [
        { time: '6:00 AM - 10:00 AM', label: 'Morning' },
        { time: '10:00 AM - 2:00 PM', label: 'Mid-Day' },
        { time: '2:00 PM - 6:00 PM', label: 'Afternoon' },
        { time: '6:00 PM - 10:00 PM', label: 'Evening' },
    ];

    // Sample availability data
    const availability = {
        Mon: [true, true, false, false],
        Tue: [true, true, true, false],
        Wed: [false, true, true, true],
        Thu: [true, false, false, true],
        Fri: [true, true, true, true],
        Sat: [true, true, false, false],
        Sun: [false, false, false, false],
    };

    return (
        <WorkerLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#032A33] mb-2">Availability & Schedule</h1>
                        <p className="text-[#888888]">Set your available time slots for work</p>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20">
                        <Plus size={18} />
                        Add Time Slot
                    </button>
                </div>

                {/* Calendar Header */}
                <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-6">
                        <button className="p-2 rounded-lg hover:bg-[#D3E4E7] transition-colors">
                            <ChevronLeft size={24} className="text-[#0B4B54]" />
                        </button>
                        <h2 className="text-xl font-semibold text-[#032A33]">January 2026</h2>
                        <button className="p-2 rounded-lg hover:bg-[#D3E4E7] transition-colors">
                            <ChevronRight size={24} className="text-[#0B4B54]" />
                        </button>
                    </div>

                    {/* Week View */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-[#888888] font-medium">Time Slot</th>
                                    {days.map(day => (
                                        <th key={day} className="p-3 text-center text-[#032A33] font-semibold">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, slotIndex) => (
                                    <tr key={slotIndex} className="border-t border-[#82ACAB]/20">
                                        <td className="p-3">
                                            <div className="text-[#032A33] font-medium">{slot.label}</div>
                                            <div className="text-sm text-[#888888]">{slot.time}</div>
                                        </td>
                                        {days.map(day => (
                                            <td key={day} className="p-3 text-center">
                                                <button
                                                    className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all
                            ${availability[day][slotIndex]
                                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
                                                            : 'bg-red-50 text-red-400 hover:bg-red-100 border border-red-200'
                                                        }
                          `}
                                                >
                                                    {availability[day][slotIndex] ? (
                                                        <CheckCircle size={18} />
                                                    ) : (
                                                        <MinusCircle size={18} />
                                                    )}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 p-4 glass-card rounded-xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <CheckCircle size={16} className="text-white" />
                        </div>
                        <span className="text-[#032A33] font-medium">Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                            <MinusCircle size={16} className="text-red-400" />
                        </div>
                        <span className="text-[#032A33] font-medium">Not Available</span>
                    </div>
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerAvailability;
