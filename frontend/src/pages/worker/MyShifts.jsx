import {
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    MessageCircle,
    Navigation,
    Phone,
    Star,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const MyShifts = () => {
    const [activeTab, setActiveTab] = useState('requests');

    const tabs = [
        { id: 'requests', label: 'Requests', icon: FileText },
        { id: 'active', label: 'Active', icon: Briefcase },
        { id: 'history', label: 'History', icon: CheckCircle },
    ];

    // Requests Data
    const requests = [
        {
            id: 1,
            title: 'Kitchen Helper',
            company: 'Hotel Himalaya',
            location: 'Lalitpur',
            time: '6:00 AM - 2:00 PM',
            pay: '1,200',
            status: 'pending',
            date: 'Jan 29, 2026'
        },
        {
            id: 2,
            title: 'Event Staff',
            company: 'Marriott Hotel',
            location: 'Kathmandu',
            time: '4:00 PM - 11:00 PM',
            pay: '1,500',
            status: 'pending',
            date: 'Jan 30, 2026'
        },
        {
            id: 3,
            title: 'Warehouse Helper',
            company: 'Daraz Nepal',
            location: 'Bhaktapur',
            time: '8:00 AM - 4:00 PM',
            pay: '1,000',
            status: 'accepted',
            date: 'Jan 28, 2026'
        },
    ];

    // Active Jobs Data
    const activeJobs = [
        {
            id: 1,
            title: 'Kitchen Helper',
            company: 'Hotel Himalaya',
            location: 'Lalitpur',
            time: '6:00 AM - 2:00 PM',
            pay: '1,200',
            startDate: 'Jan 28, 2026',
            progress: 65,
            contact: '+977 9841234567'
        },
        {
            id: 2,
            title: 'Event Staff',
            company: 'Marriott Hotel',
            location: 'Kathmandu',
            time: '4:00 PM - 11:00 PM',
            pay: '1,500',
            startDate: 'Jan 29, 2026',
            progress: 30,
            contact: '+977 9851234567'
        },
    ];

    // Completed Jobs Data (History)
    const completedJobs = [
        {
            id: 1,
            title: 'Kitchen Helper',
            company: 'Hotel Himalaya',
            location: 'Lalitpur',
            date: 'Jan 25, 2026',
            pay: '1,200',
            rating: 5,
            feedback: 'Excellent work! Very punctual and hardworking.'
        },
        {
            id: 2,
            title: 'Event Staff',
            company: 'Hyatt Regency',
            location: 'Boudha',
            date: 'Jan 22, 2026',
            pay: '1,500',
            rating: 5,
            feedback: 'Great attitude and professional service.'
        },
        {
            id: 3,
            title: 'Warehouse Helper',
            company: 'Daraz Nepal',
            location: 'Bhaktapur',
            date: 'Jan 20, 2026',
            pay: '1,000',
            rating: 4,
            feedback: 'Good work. Could improve on speed.'
        },
        {
            id: 4,
            title: 'Restaurant Server',
            company: 'Cafe Mitra',
            location: 'Patan',
            date: 'Jan 18, 2026',
            pay: '1,100',
            rating: 5,
            feedback: 'Outstanding customer service!'
        },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'accepted':
                return 'bg-emerald-100 text-emerald-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const renderRequests = () => (
        <div className="space-y-4">
            {requests.map((request, index) => (
                <div
                    key={request.id}
                    className="glass-card rounded-2xl p-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                request.status === 'pending' ? 'bg-amber-100' :
                                request.status === 'accepted' ? 'bg-emerald-100' :
                                'bg-red-100'
                            }`}>
                                <FileText size={24} className={`${
                                    request.status === 'pending' ? 'text-amber-600' :
                                    request.status === 'accepted' ? 'text-emerald-600' :
                                    'text-red-600'
                                }`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#032A33] text-lg mb-1">{request.title}</h3>
                                <div className="flex items-center gap-2 text-[#888888] text-sm mb-2">
                                    <Building size={14} />
                                    {request.company}
                                </div>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="flex items-center gap-1 text-[#032A33]">
                                        <MapPin size={14} className="text-[#82ACAB]" />
                                        {request.location}
                                    </span>
                                    <span className="flex items-center gap-1 text-[#032A33]">
                                        <Clock size={14} className="text-[#82ACAB]" />
                                        {request.time}
                                    </span>
                                    <span className="flex items-center gap-1 text-[#032A33] font-semibold">
                                        <DollarSign size={14} className="text-[#82ACAB]" />
                                        Rs {request.pay}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(request.status)}`}>
                                {request.status}
                            </span>
                            <span className="text-sm text-[#888888]">{request.date}</span>
                            {request.status === 'pending' && (
                                <div className="flex gap-2 mt-2">
                                    <button className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                                        <CheckCircle size={18} />
                                    </button>
                                    <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderActive = () => (
        <div className="space-y-6">
            {activeJobs.map((job, index) => (
                <div
                    key={job.id}
                    className="glass-card rounded-2xl p-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center relative">
                                    <Briefcase size={28} className="text-blue-600" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-[#032A33] text-xl">{job.title}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Active</span>
                                    </div>
                                    <p className="text-[#0B4B54] font-medium">{job.company}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={16} className="text-[#82ACAB]" />
                                    <span className="text-[#032A33]">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock size={16} className="text-[#82ACAB]" />
                                    <span className="text-[#032A33]">{job.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign size={16} className="text-[#82ACAB]" />
                                    <span className="text-[#032A33] font-semibold">Rs {job.pay}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="text-[#82ACAB]" />
                                    <span className="text-[#032A33]">{job.contact}</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[#888888]">Shift Progress</span>
                                    <span className={`font-semibold ${
                                        job.progress >= 75 ? 'text-emerald-600' : 
                                        job.progress >= 50 ? 'text-blue-600' : 
                                        job.progress >= 25 ? 'text-amber-600' : 'text-red-500'
                                    }`}>{job.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            job.progress >= 75 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                                            job.progress >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 
                                            job.progress >= 25 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                                        }`}
                                        style={{ width: `${job.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B4B54] text-white font-medium hover:bg-[#0D5A65] transition-colors">
                                <MessageCircle size={18} />
                                <span>Contact</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D3E4E7] text-[#032A33] font-medium hover:bg-[#82ACAB]/30 transition-colors">
                                <Navigation size={18} />
                                <span>Navigate</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderHistory = () => (
        <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Jobs', value: '24', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
                    { label: 'This Month', value: '8', icon: Calendar, color: 'text-blue-600 bg-blue-100' },
                    { label: 'Total Earned', value: 'Rs 28,400', icon: DollarSign, color: 'text-purple-600 bg-purple-100' },
                    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-amber-600 bg-amber-100' },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-xl p-4 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[1]} flex items-center justify-center mb-3`}>
                            <stat.icon size={20} className={stat.color.split(' ')[0]} />
                        </div>
                        <p className="text-2xl font-bold text-[#032A33]">{stat.value}</p>
                        <p className="text-sm text-[#888888]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Completed Job Cards */}
            <div className="space-y-4">
                {completedJobs.map((job, index) => (
                    <div
                        key={job.id}
                        className="glass-card rounded-2xl p-6 animate-fade-in-up"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle size={28} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#032A33] text-lg mb-1">{job.title}</h3>
                                    <div className="flex items-center gap-2 text-[#888888] text-sm mb-2">
                                        <Building size={14} />
                                        {job.company}
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="flex items-center gap-1 text-[#032A33]">
                                            <MapPin size={14} className="text-[#82ACAB]" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1 text-[#032A33]">
                                            <Calendar size={14} className="text-[#82ACAB]" />
                                            {job.date}
                                        </span>
                                        <span className="flex items-center gap-1 text-[#032A33] font-semibold">
                                            <DollarSign size={14} className="text-[#82ACAB]" />
                                            Rs {job.pay}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < job.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-[#888888] max-w-xs text-right italic">"{job.feedback}"</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">My Shifts</h1>
                    <p className="text-[#888888]">Manage all your shift requests, active shifts, and history</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-[#D3E4E7]/50 rounded-xl w-fit">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-[#0B4B54] text-white shadow-lg'
                                        : 'text-[#032A33] hover:bg-white/50'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                {activeTab === 'requests' && renderRequests()}
                {activeTab === 'active' && renderActive()}
                {activeTab === 'history' && renderHistory()}
            </div>
        </WorkerLayout>
    );
};

export default MyShifts;
