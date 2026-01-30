import React from 'react';
import {
    FileText,
    Clock,
    MapPin,
    DollarSign,
    CheckCircle,
    XCircle,
    Building
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerJobRequests = () => {
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

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Job Requests</h1>
                    <p className="text-[#888888]">Manage your job applications and requests</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${tab === 'All'
                                    ? 'bg-[#0B4B54] text-white'
                                    : 'bg-white text-[#032A33] hover:bg-[#D3E4E7]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Request Cards */}
                <div className="space-y-4">
                    {requests.map((request, index) => (
                        <div
                            key={request.id}
                            className="glass-card rounded-2xl p-6 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#032A33] text-lg mb-1">{request.title}</h3>
                                        <div className="flex items-center gap-2 text-[#888888] text-sm mb-2">
                                            <Building size={14} />
                                            {request.company}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-[#888888]">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#82ACAB]" />
                                                {request.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} className="text-[#82ACAB]" />
                                                {request.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-[#82ACAB]" />
                                                Rs {request.pay}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusStyles(request.status)}`}>
                                        {request.status}
                                    </span>
                                    <span className="text-sm text-[#888888]">{request.date}</span>
                                    {request.status === 'pending' && (
                                        <div className="flex gap-2">
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
            </div>
        </WorkerLayout>
    );
};

export default WorkerJobRequests;
