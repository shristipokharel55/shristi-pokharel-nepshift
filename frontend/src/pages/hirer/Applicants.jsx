import {
    Briefcase,
    Calendar,
    Clock,
    Mail,
    MapPin,
    Phone,
    Search,
    Star,
    UserCheck,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import HirerLayout from '../../components/hirer/HirerLayout';
import api from '../../utils/api';

const Applicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch all applicants
    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const response = await api.get('/shifts/applicants');
            if (response.data.success) {
                setApplicants(response.data.data);
                setFilteredApplicants(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter applicants when search query or status filter changes
    useEffect(() => {
        let filtered = applicants;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(app =>
                app.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.shift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.shift.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredApplicants(filtered);
    }, [searchQuery, statusFilter, applicants]);

    // Get stats
    const stats = {
        total: applicants.length,
        pending: applicants.filter(a => a.status === 'pending').length,
        accepted: applicants.filter(a => a.status === 'accepted').length,
        rejected: applicants.filter(a => a.status === 'rejected').length,
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle },
            accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
        };

        const badge = badges[status];
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                <Icon className="w-4 h-4" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <HirerLayout>
                <div className="min-h-screen bg-[#E0F0F3] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B4B54] mx-auto"></div>
                        <p className="mt-4 text-[#032A33]">Loading applicants...</p>
                    </div>
                </div>
            </HirerLayout>
        );
    }

    return (
        <HirerLayout>
            <div className="min-h-screen bg-[#E0F0F3] p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#032A33]">Applicants</h1>
                        <p className="text-[#888888] mt-2">Manage applications for your posted shifts</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#888888]">Total Applicants</p>
                                    <p className="text-3xl font-bold text-[#032A33] mt-1">{stats.total}</p>
                                </div>
                                <Users className="w-12 h-12 text-[#82ACAB]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#888888]">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                                </div>
                                <AlertCircle className="w-12 h-12 text-yellow-400" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#888888]">Accepted</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.accepted}</p>
                                </div>
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#888888]">Rejected</p>
                                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                                </div>
                                <XCircle className="w-12 h-12 text-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                <input
                                    type="text"
                                    placeholder="Search by name, job title, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4B54]"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4B54]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Applicants List */}
                    {filteredApplicants.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <Users className="w-16 h-16 text-[#82ACAB] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#032A33] mb-2">No Applicants Found</h3>
                            <p className="text-[#888888]">
                                {applicants.length === 0
                                    ? "You haven't received any applications yet."
                                    : "No applicants match your search criteria."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredApplicants.map((applicant) => (
                                <div key={applicant.applicantId} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Applicant Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Avatar */}
                                            <div className="w-16 h-16 rounded-full bg-[#0B4B54] flex items-center justify-center text-white text-xl font-bold shrink-0">
                                                {applicant.worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-[#032A33]">{applicant.worker.name}</h3>

                                                <div className="mt-2 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-[#888888]">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span>Applied for: <strong className="text-[#032A33]">{applicant.shift.title}</strong></span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-[#888888]">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-[#888888]">
                                                        {applicant.worker.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{applicant.worker.email}</span>
                                                            </div>
                                                        )}
                                                        {applicant.worker.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{applicant.worker.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            {getStatusBadge(applicant.status)}

                                            {applicant.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-[#0B4B54] text-white rounded-lg hover:bg-[#032A33] transition-colors">
                                                        Accept
                                                    </button>
                                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </HirerLayout>
    );
};

export default Applicants;
