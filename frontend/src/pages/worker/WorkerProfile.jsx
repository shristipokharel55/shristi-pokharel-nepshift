import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Star,
    Briefcase,
    Edit,
    Camera,
    Shield,
    Award
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerProfile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const firstName = user?.fullName?.split(" ")[0] || "Worker";
    const fullName = user?.fullName || "John Doe";
    const email = user?.email || "worker@nepshift.com";
    const phone = user?.phone || "+977 9841234567";

    const skills = [
        'Hospitality', 'Kitchen Work', 'Event Management',
        'Cleaning', 'Customer Service', 'Warehouse'
    ];

    const achievements = [
        { icon: Award, title: 'Top Performer', description: '10+ jobs completed with 5-star rating' },
        { icon: Shield, title: 'Verified Worker', description: 'Identity verified by Nepshift' },
        { icon: Star, title: 'Trusted Helper', description: 'Consistent positive reviews' },
    ];

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl gradient-primary flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-[#0B4B54]/30">
                                {firstName.charAt(0)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#82ACAB] text-white flex items-center justify-center shadow-lg hover:bg-[#0B4B54] transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-[#032A33] mb-2">{fullName}</h1>
                            <p className="text-[#0B4B54] font-medium mb-4">Professional Helper</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#888888]">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-[#82ACAB]" />
                                    {email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-[#82ACAB]" />
                                    {phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-[#82ACAB]" />
                                    Kathmandu, Nepal
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button className="px-6 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20">
                            <Edit size={18} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Jobs Completed', value: '24', color: '#0B4B54' },
                        { label: 'Rating', value: '4.9', color: '#F59E0B' },
                        { label: 'Experience', value: '2 Years', color: '#82ACAB' },
                        { label: 'Response Rate', value: '98%', color: '#10B981' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-2xl p-5 text-center animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <p className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[#888888] text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Skills Section */}
                <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-semibold text-[#032A33] text-lg mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 rounded-xl bg-[#D3E4E7] text-[#0B4B54] font-medium text-sm hover:bg-[#82ACAB]/30 transition-colors cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="font-semibold text-[#032A33] text-lg mb-4">Achievements</h3>
                    <div className="space-y-4">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[#D3E4E7]/30 hover:bg-[#D3E4E7]/50 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
                                        <Icon size={24} className="text-[#0B4B54]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#032A33]">{achievement.title}</h4>
                                        <p className="text-sm text-[#888888]">{achievement.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerProfile;
