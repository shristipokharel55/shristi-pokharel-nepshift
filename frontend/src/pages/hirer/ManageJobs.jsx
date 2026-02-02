import {
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    Edit,
    Eye,
    FileText,
    MapPin,
    MoreVertical,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';

const ManageJobs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'active', label: 'Active', icon: Briefcase, count: 3 },
        { id: 'drafts', label: 'Drafts', icon: FileText, count: 2 },
        { id: 'history', label: 'History', icon: Calendar, count: 12 },
    ];

    const activeJobs = [
        {
            id: 1,
            title: 'Kitchen Helper',
            category: 'Kitchen Staff',
            location: 'Lalitpur',
            date: 'Jan 31, 2026',
            time: '6:00 AM - 2:00 PM',
            budget: 1200,
            workersNeeded: 3,
            workersHired: 2,
            applicants: 8,
            status: 'active'
        },
        {
            id: 2,
            title: 'Event Staff',
            category: 'Events',
            location: 'Kathmandu',
            date: 'Feb 1, 2026',
            time: '4:00 PM - 11:00 PM',
            budget: 1500,
            workersNeeded: 5,
            workersHired: 5,
            applicants: 12,
            status: 'filled'
        },
        {
            id: 3,
            title: 'Warehouse Helper',
            category: 'Warehouse',
            location: 'Bhaktapur',
            date: 'Feb 2, 2026',
            time: '8:00 AM - 4:00 PM',
            budget: 1000,
            workersNeeded: 2,
            workersHired: 1,
            applicants: 5,
            status: 'active'
        },
    ];

    const draftJobs = [
        {
            id: 4,
            title: 'Restaurant Server',
            category: 'Restaurant',
            location: 'Patan',
            lastEdited: '2 days ago',
            completion: 60
        },
        {
            id: 5,
            title: 'Cleaning Staff',
            category: 'Cleaning',
            location: '',
            lastEdited: '5 days ago',
            completion: 30
        },
    ];

    const historyJobs = [
        {
            id: 6,
            title: 'Kitchen Helper',
            category: 'Kitchen Staff',
            location: 'Lalitpur',
            date: 'Jan 25, 2026',
            budget: 1200,
            workersHired: 3,
            totalSpent: 3600,
            rating: 4.8,
            status: 'completed'
        },
        {
            id: 7,
            title: 'Event Staff',
            category: 'Events',
            location: 'Kathmandu',
            date: 'Jan 20, 2026',
            budget: 1500,
            workersHired: 4,
            totalSpent: 6000,
            rating: 4.9,
            status: 'completed'
        },
        {
            id: 8,
            title: 'Warehouse Helper',
            category: 'Warehouse',
            location: 'Bhaktapur',
            date: 'Jan 15, 2026',
            budget: 1000,
            workersHired: 2,
            totalSpent: 2000,
            rating: 4.5,
            status: 'completed'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-700';
            case 'filled': return 'bg-emerald-100 text-emerald-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderActiveJobs = () => (
        <div className="space-y-4">
            {activeJobs.map((job, index) => (
                <div key={job.id} className="bg-white/70 rounded-xl border border-[#82ACAB]/20 p-6 hover:shadow-md transition-all hover:border-[#0B4B54]/30 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center shrink-0">
                                    <Briefcase size={24} className="text-[#0B4B54]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-[#032A33] text-lg">{job.title}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${getStatusColor(job.status)}`}>
                                            {job.status === 'filled' ? 'Fully Staffed' : job.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-[#888888]">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {job.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {job.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={14} />
                                            Rs {job.budget}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-center px-4 py-2 bg-[#D3E4E7]/50 rounded-lg">
                                <p className="text-lg font-bold text-[#0B4B54]">{job.workersHired}/{job.workersNeeded}</p>
                                <p className="text-xs text-[#888888]">Workers</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-[#0B4B54]/10 rounded-lg">
                                <p className="text-lg font-bold text-[#0B4B54]">{job.applicants}</p>
                                <p className="text-xs text-[#888888]">Applicants</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate('/hirer/applicants')}
                                    className="px-4 py-2 bg-[#0B4B54] text-white text-sm font-medium rounded-lg hover:bg-[#0B4B54]/90 transition-colors"
                                >
                                    View Applicants
                                </button>
                                <button className="p-2 hover:bg-[#D3E4E7]/50 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-[#82ACAB]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDrafts = () => (
        <div className="space-y-4">
            {draftJobs.map((job, index) => (
                <div key={job.id} className="bg-white/70 rounded-xl border border-[#82ACAB]/20 p-6 hover:shadow-md transition-all hover:border-[#0B4B54]/30 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#D3E4E7]/50 flex items-center justify-center">
                                <FileText size={24} className="text-[#82ACAB]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#032A33] text-lg">{job.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-[#888888] mt-1">
                                    <span>{job.category}</span>
                                    {job.location && (
                                        <>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span>Last edited {job.lastEdited}</span>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-[#D3E4E7]/50 rounded-full max-w-[200px]">
                                            <div 
                                                className="h-full bg-[#0B4B54] rounded-full"
                                                style={{ width: `${job.completion}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-[#888888]">{job.completion}% complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-[#0B4B54] text-white text-sm font-medium rounded-lg hover:bg-[#0B4B54]/90 transition-colors flex items-center gap-2">
                                <Edit size={16} />
                                Continue Editing
                            </button>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-4">
            {historyJobs.map((job, index) => (
                <div key={job.id} className="bg-white/70 rounded-xl border border-[#82ACAB]/20 p-6 hover:shadow-md transition-all hover:border-[#0B4B54]/30 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Briefcase size={24} className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-[#032A33] text-lg">{job.title}</h3>
                                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        Completed
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#888888]">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {job.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-center px-4 py-2 bg-[#D3E4E7]/50 rounded-lg">
                                <p className="text-lg font-bold text-[#032A33]">{job.workersHired}</p>
                                <p className="text-xs text-[#888888]">Workers</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-emerald-50 rounded-lg">
                                <p className="text-lg font-bold text-emerald-600">Rs {job.totalSpent.toLocaleString()}</p>
                                <p className="text-xs text-[#888888]">Total Spent</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-[#0B4B54]/10 rounded-lg">
                                <p className="text-lg font-bold text-[#0B4B54]">★ {job.rating}</p>
                                <p className="text-xs text-[#888888]">Rating</p>
                            </div>
                            <button className="p-2 hover:bg-[#D3E4E7]/50 rounded-lg transition-colors">
                                <Eye size={18} className="text-[#82ACAB]" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <HirerLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    <div>
                        <h1 className="text-2xl font-bold text-[#032A33]">Manage Jobs</h1>
                        <p className="text-[#888888]">View and manage all your posted shifts</p>
                    </div>
                    <button 
                        onClick={() => navigate('/hirer/post-shift')}
                        className="px-5 py-2.5 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0B4B54]/30 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Post New Shift
                    </button>
                </div>

                {/* Search and Tabs */}
                <div className="glass-card rounded-2xl border border-[#82ACAB]/20 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="p-4 border-b border-[#82ACAB]/20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Tabs */}
                            <div className="flex gap-2 p-1 bg-[#D3E4E7]/50 rounded-xl w-fit">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                                ${activeTab === tab.id
                                                    ? 'bg-white text-[#0B4B54] shadow-sm'
                                                    : 'text-[#888888] hover:text-[#032A33]'
                                                }
                                            `}
                                        >
                                            <Icon size={16} />
                                            {tab.label}
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                activeTab === tab.id ? 'bg-[#0B4B54]/10 text-[#0B4B54]' : 'bg-[#D3E4E7] text-[#888888]'
                                            }`}>
                                                {tab.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82ACAB]" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-lg border border-[#82ACAB]/30 text-sm focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10 bg-white/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'active' && renderActiveJobs()}
                        {activeTab === 'drafts' && renderDrafts()}
                        {activeTab === 'history' && renderHistory()}
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default ManageJobs;
