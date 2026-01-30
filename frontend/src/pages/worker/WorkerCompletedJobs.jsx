import React from 'react';
import {
    CheckCircle,
    Clock,
    MapPin,
    DollarSign,
    Star,
    Calendar,
    Building
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerCompletedJobs = () => {
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

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Completed Jobs</h1>
                    <p className="text-[#888888]">Your job history and past shifts</p>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Jobs', value: '24', icon: CheckCircle },
                        { label: 'This Month', value: '8', icon: Calendar },
                        { label: 'Total Earned', value: 'Rs 28,400', icon: DollarSign },
                        { label: 'Avg Rating', value: '4.9', icon: Star },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-xl p-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <stat.icon size={20} className="text-[#0B4B54] mb-2" />
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
                                        <div className="flex flex-wrap gap-4 text-sm text-[#888888]">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#82ACAB]" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} className="text-[#82ACAB]" />
                                                {job.date}
                                            </span>
                                            <span className="flex items-center gap-1">
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
                                                size={18}
                                                className={i < job.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#888888] italic max-w-[200px] text-right">"{job.feedback}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerCompletedJobs;
