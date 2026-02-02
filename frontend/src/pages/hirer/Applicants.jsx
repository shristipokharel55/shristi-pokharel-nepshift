import {
    Briefcase,
    Calendar,
    ChevronDown,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    Star,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import HirerLayout from '../../components/hirer/HirerLayout';

const Applicants = () => {
    const [selectedJob, setSelectedJob] = useState('all');
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const jobs = [
        { id: 'all', title: 'All Jobs' },
        { id: 1, title: 'Kitchen Helper - Lalitpur' },
        { id: 2, title: 'Event Staff - Kathmandu' },
        { id: 3, title: 'Warehouse Helper - Bhaktapur' },
    ];

    const applicants = {
        pending: [
            {
                id: 1,
                name: 'Ramesh Karki',
                avatar: 'RK',
                rating: 4.8,
                completedJobs: 45,
                skills: ['Kitchen', 'Cleaning', 'Event'],
                location: 'Lalitpur',
                experience: '3 years',
                appliedFor: 'Kitchen Helper',
                appliedAt: '2 hours ago',
                phone: '+977 9841234567',
                email: 'ramesh@example.com'
            },
            {
                id: 2,
                name: 'Sita Sharma',
                avatar: 'SS',
                rating: 4.5,
                completedJobs: 32,
                skills: ['Kitchen', 'Restaurant'],
                location: 'Kathmandu',
                experience: '2 years',
                appliedFor: 'Kitchen Helper',
                appliedAt: '3 hours ago',
                phone: '+977 9851234567',
                email: 'sita@example.com'
            },
            {
                id: 3,
                name: 'Bikash Thapa',
                avatar: 'BT',
                rating: 4.9,
                completedJobs: 78,
                skills: ['Events', 'Security', 'Warehouse'],
                location: 'Bhaktapur',
                experience: '5 years',
                appliedFor: 'Event Staff',
                appliedAt: '4 hours ago',
                phone: '+977 9861234567',
                email: 'bikash@example.com'
            },
        ],
        interviewing: [
            {
                id: 4,
                name: 'Gita Gurung',
                avatar: 'GG',
                rating: 4.7,
                completedJobs: 56,
                skills: ['Kitchen', 'Cleaning', 'Restaurant'],
                location: 'Lalitpur',
                experience: '4 years',
                appliedFor: 'Kitchen Helper',
                appliedAt: '1 day ago',
                interviewDate: 'Jan 30, 2026 at 10:00 AM',
                phone: '+977 9871234567',
                email: 'gita@example.com'
            },
        ],
        hired: [
            {
                id: 5,
                name: 'Hari Bahadur',
                avatar: 'HB',
                rating: 4.9,
                completedJobs: 120,
                skills: ['Kitchen', 'Events', 'Warehouse'],
                location: 'Kathmandu',
                experience: '6 years',
                appliedFor: 'Kitchen Helper',
                hiredAt: '2 days ago',
                startDate: 'Jan 31, 2026',
                phone: '+977 9881234567',
                email: 'hari@example.com'
            },
            {
                id: 6,
                name: 'Maya Tamang',
                avatar: 'MT',
                rating: 4.6,
                completedJobs: 38,
                skills: ['Events', 'Catering'],
                location: 'Patan',
                experience: '2 years',
                appliedFor: 'Event Staff',
                hiredAt: '3 days ago',
                startDate: 'Feb 1, 2026',
                phone: '+977 9891234567',
                email: 'maya@example.com'
            },
        ],
    };

    const columns = [
        { id: 'pending', title: 'Pending Review', color: 'amber', icon: UserPlus },
        { id: 'interviewing', title: 'Interviewing', color: 'blue', icon: Users },
        { id: 'hired', title: 'Hired', color: 'emerald', icon: UserCheck },
    ];

    const getColumnStyles = (color) => {
        switch (color) {
            case 'amber': return { header: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700' };
            case 'blue': return { header: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700' };
            case 'emerald': return { header: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' };
            default: return { header: 'bg-gray-50 border-gray-200', badge: 'bg-gray-100 text-gray-700' };
        }
    };

    const ApplicantCard = ({ applicant, column }) => (
        <div
            onClick={() => setSelectedApplicant(applicant)}
            className="bg-white rounded-xl border border-[#82ACAB]/20 p-4 hover:shadow-md hover:border-[#82ACAB]/40 transition-all cursor-pointer"
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-medium text-sm">
                    {applicant.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#032A33] truncate">{applicant.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center text-amber-500">
                            <Star size={12} className="fill-current" />
                            <span className="ml-0.5 text-[#888888]">{applicant.rating}</span>
                        </span>
                        <span className="text-[#82ACAB]">•</span>
                        <span className="text-[#888888]">{applicant.completedJobs} jobs</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
                {applicant.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-[#D3E4E7]/50 text-[#0B4B54] text-xs rounded-lg">
                        {skill}
                    </span>
                ))}
                {applicant.skills.length > 2 && (
                    <span className="px-2 py-0.5 bg-[#D3E4E7]/50 text-[#0B4B54] text-xs rounded-lg">
                        +{applicant.skills.length - 2}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#888888] mb-3">
                <MapPin size={12} />
                {applicant.location}
                <span className="text-[#82ACAB]">•</span>
                <Clock size={12} />
                {applicant.experience}
            </div>

            <div className="pt-3 border-t border-[#82ACAB]/20">
                <p className="text-xs text-[#888888]">
                    {column === 'pending' && `Applied ${applicant.appliedAt}`}
                    {column === 'interviewing' && (
                        <span className="flex items-center gap-1 text-blue-600">
                            <Calendar size={12} />
                            {applicant.interviewDate}
                        </span>
                    )}
                    {column === 'hired' && (
                        <span className="flex items-center gap-1 text-emerald-600">
                            <Calendar size={12} />
                            Starts {applicant.startDate}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );

    const ApplicantModal = ({ applicant, onClose }) => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-[#82ACAB]/20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl gradient-primary text-white flex items-center justify-center font-semibold text-xl">
                                {applicant.avatar}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#032A33]">{applicant.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-[#888888]">
                                    <span className="flex items-center text-amber-500">
                                        <Star size={14} className="fill-current" />
                                        <span className="ml-1">{applicant.rating}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{applicant.completedJobs} completed jobs</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-[#D3E4E7]/50 rounded-lg transition-colors">
                            <X size={20} className="text-[#888888]" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Applied For */}
                    <div className="flex items-center gap-3 p-4 bg-[#D3E4E7]/30 rounded-xl">
                        <Briefcase size={20} className="text-[#0B4B54]" />
                        <div>
                            <p className="text-sm text-[#888888]">Applied for</p>
                            <p className="font-semibold text-[#032A33]">{applicant.appliedFor}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#032A33] mb-3">Contact Information</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-[#82ACAB]" />
                                <span className="text-gray-600">{applicant.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-gray-600">{applicant.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-gray-600">{applicant.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 bg-[#1F4E5F]/10 text-[#1F4E5F] text-sm rounded-lg font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Experience</h3>
                        <p className="text-gray-600">{applicant.experience} of experience</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 flex items-center gap-3">
                    <button className="flex-1 px-4 py-2.5 bg-[#1F4E5F] text-white font-semibold rounded-xl hover:bg-[#2D6A7A] transition-colors flex items-center justify-center gap-2">
                        <UserCheck size={18} />
                        Hire Now
                    </button>
                    <button className="flex-1 px-4 py-2.5 border border-[#1F4E5F] text-[#1F4E5F] font-semibold rounded-xl hover:bg-[#1F4E5F]/5 transition-colors flex items-center justify-center gap-2">
                        <Calendar size={18} />
                        Schedule Interview
                    </button>
                    <button className="p-2.5 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
                        <MessageCircle size={18} />
                    </button>
                    <button className="p-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                        <UserMinus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <HirerLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#032A33]">Applicants</h1>
                        <p className="text-[#888888]">Manage and review job applicants</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Job Filter */}
                        <div className="relative">
                            <select
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-[#82ACAB]/30 text-sm focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10 bg-white"
                            >
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" />
                        </div>
                        {/* Search */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border border-[#82ACAB]/30 text-sm focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => {
                        const styles = getColumnStyles(column.color);
                        const Icon = column.icon;
                        const columnApplicants = applicants[column.id] || [];
                        
                        return (
                            <div key={column.id} className="bg-[#D3E4E7]/20 rounded-2xl border border-[#82ACAB]/20">
                                {/* Column Header */}
                                <div className={`p-4 rounded-t-2xl border-b ${styles.header}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon size={18} className={`text-${column.color}-600`} />
                                            <h3 className="font-semibold text-[#032A33]">{column.title}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-lg text-sm font-semibold ${styles.badge}`}>
                                            {columnApplicants.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Column Content */}
                                <div className="p-4 space-y-4 min-h-[400px]">
                                    {columnApplicants.length === 0 ? (
                                        <div className="text-center py-8 text-[#82ACAB]">
                                            <Users size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No applicants</p>
                                        </div>
                                    ) : (
                                        columnApplicants.map((applicant) => (
                                            <ApplicantCard
                                                key={applicant.id}
                                                applicant={applicant}
                                                column={column.id}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Applicant Modal */}
                {selectedApplicant && (
                    <ApplicantModal
                        applicant={selectedApplicant}
                        onClose={() => setSelectedApplicant(null)}
                    />
                )}
            </div>
        </HirerLayout>
    );
};

export default Applicants;
