import React from 'react';
import {
    Briefcase,
    Clock,
    MapPin,
    DollarSign,
    Phone,
    MessageCircle,
    Navigation
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerActiveJobs = () => {
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

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Active Jobs</h1>
                    <p className="text-[#888888]">Your currently active shifts and jobs</p>
                </div>

                {/* Active Job Cards */}
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
                                        <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
                                            <Briefcase size={28} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#032A33] text-xl mb-1">{job.title}</h3>
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
                                            <span className="font-semibold text-[#0B4B54]">{job.progress}%</span>
                                        </div>
                                        <div className="h-3 bg-[#D3E4E7] rounded-full overflow-hidden">
                                            <div
                                                className="h-full gradient-primary rounded-full transition-all duration-500"
                                                style={{ width: `${job.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex lg:flex-col gap-3">
                                    <button className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors flex items-center justify-center gap-2">
                                        <MessageCircle size={18} />
                                        Contact
                                    </button>
                                    <button className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-[#D3E4E7] text-[#0B4B54] font-semibold hover:bg-[#82ACAB]/30 transition-colors flex items-center justify-center gap-2">
                                        <Navigation size={18} />
                                        Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activeJobs.length === 0 && (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <Briefcase size={48} className="mx-auto text-[#82ACAB] mb-4" />
                        <h3 className="text-xl font-semibold text-[#032A33] mb-2">No Active Jobs</h3>
                        <p className="text-[#888888]">You don't have any active jobs at the moment.</p>
                    </div>
                )}
            </div>
        </WorkerLayout>
    );
};

export default WorkerActiveJobs;
