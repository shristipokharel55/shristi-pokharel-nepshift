import {
    AlertCircle,
    Award,
    Camera,
    ChevronRight,
    Clock,
    Edit,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

// Verification Status Badge Component
const VerificationStatusBadge = ({ status, onClick }) => {
    const config = {
        verified: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            icon: ShieldCheck,
            label: 'Verified'
        },
        pending: {
            bg: 'bg-amber-100',
            text: 'text-amber-700',
            icon: Clock,
            label: 'Pending Verification'
        },
        rejected: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            icon: ShieldAlert,
            label: 'Verification Rejected'
        },
        not_submitted: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            icon: AlertCircle,
            label: 'Not Verified'
        }
    };

    const statusConfig = config[status] || config.not_submitted;
    const IconComponent = statusConfig.icon;

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.text} font-semibold flex items-center gap-2 text-sm hover:opacity-80 transition-opacity`}
        >
            <IconComponent size={16} />
            {statusConfig.label}
            {status !== 'verified' && <ChevronRight size={14} />}
        </button>
    );
};

// Profile Completion Progress Component
const ProfileCompletionProgress = ({ percentage, onClick }) => (
    <div
        className="glass-card rounded-2xl p-5 mb-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#032A33]">Profile Completion</h4>
            <span className="text-[#0B4B54] font-bold text-lg">{percentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
                className="h-full bg-gradient-to-r from-[#0B4B54] to-[#82ACAB] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
        <p className="text-sm text-[#888888]">
            {percentage < 100
                ? 'Complete your profile to unlock more job opportunities'
                : 'Great! Your profile is complete'
            }
        </p>
    </div>
);

const WorkerProfile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const firstName = user?.fullName?.split(" ")[0] || "Worker";
    const fullName = user?.fullName || "John Doe";
    const email = user?.email || "worker@nepshift.com";
    const phone = user?.phone || "+977 9841234567";

    const [profileData, setProfileData] = useState(null);
    const [stats, setStats] = useState({
        completed: 0,
        active: 0,
        pending: 0,
        earnings: 0,
        averageRating: 0,
        totalJobsCompleted: 0
    });
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('not_submitted');
    const [profileExists, setProfileExists] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const [profileRes, verificationRes, statsRes] = await Promise.all([
                    api.get('/helper/profile'),
                    api.get('/helper/verification-status'),
                    api.get('/helper/stats')
                ]);

                if (profileRes.data.profileExists === false) {
                    setProfileExists(false);
                    setProfileData(null);
                } else {
                    setProfileExists(true);
                    setProfileData(profileRes.data?.data || null);
                }

                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }

                setVerificationStatus(verificationRes.data?.data?.verificationStatus || 'not_submitted');
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const skills = profileData?.skillCategory
        ? [profileData.skillCategory]
        : ['Hospitality', 'Kitchen Work', 'Event Management', 'Cleaning', 'Customer Service', 'Warehouse'];

    const achievements = [
        {
            icon: Award,
            title: 'Top Performer',
            description: '10+ jobs completed with 4.5+ rating',
            earned: (stats.totalJobsCompleted >= 10 && stats.averageRating >= 4.5)
        },
        {
            icon: Shield,
            title: 'Verified Worker',
            description: 'Identity verified by Nepshift',
            earned: verificationStatus === 'verified'
        },
        {
            icon: Star,
            title: 'Trusted Helper',
            description: 'Maintain 4.0+ rating and 1+ job',
            earned: (stats.averageRating >= 4.0 && stats.totalJobsCompleted >= 1)
        },
    ];

    const handleVerificationClick = () => {
        if (verificationStatus !== 'verified') {
            navigate('/worker/verification');
        }
    };

    if (loading) {
        return (
            <WorkerLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
                </div>
            </WorkerLayout>
        );
    }

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                {/* Profile Not Created Alert */}
                {!profileExists && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4 animate-fade-in-up">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <AlertCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-amber-800 mb-1">Your profile is incomplete</h3>
                            <p className="text-amber-700 mb-4">
                                You haven't set up your helper profile yet. Completing your profile will help you get hired faster.
                            </p>
                            <Link
                                to="/worker/complete-profile"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                            >
                                Create Profile <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Profile Completion Progress */}
                {profileExists && profileData && (
                    <ProfileCompletionProgress
                        percentage={profileData.profileCompletionPercentage || 0}
                        onClick={() => navigate('/worker/complete-profile')}
                    />
                )}

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
                            {verificationStatus === 'verified' && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                                    <ShieldCheck size={16} />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-[#032A33]">{fullName}</h1>
                                <VerificationStatusBadge
                                    status={verificationStatus}
                                    onClick={handleVerificationClick}
                                />
                            </div>
                            <p className="text-[#0B4B54] font-medium mb-4">
                                {profileData?.skillCategory || 'Professional Helper'}
                                {profileData?.yearsOfExperience ? ` • ${profileData.yearsOfExperience} years experience` : ''}
                            </p>

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
                                    {profileData?.location?.address || 'Kathmandu, Nepal'}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/worker/complete-profile')}
                            className="px-6 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20"
                        >
                            <Edit size={18} />
                            {profileExists ? 'Edit Profile' : 'Create Profile'}
                        </button>
                    </div>

                    {/* About Me Section */}
                    {profileData?.aboutMe && (
                        <div className="mt-6 pt-6 border-t border-[#82ACAB]/20">
                            <h4 className="font-semibold text-[#032A33] mb-2">About Me</h4>
                            <p className="text-[#888888]">{profileData.aboutMe}</p>
                        </div>
                    )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: 'Jobs Completed',
                            value: stats.totalJobsCompleted || 0,
                            color: '#0B4B54'
                        },
                        {
                            label: 'Rating',
                            value: typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : '0.0',
                            color: '#F59E0B'
                        },
                        {
                            label: 'Experience',
                            value: (profileData?.yearsOfExperience || 0) + (profileData?.yearsOfExperience === 1 ? ' Year' : ' Years'),
                            color: '#82ACAB'
                        },
                        {
                            label: 'Total Earned',
                            value: `Rs ${(stats.earnings || 0).toLocaleString()}`,
                            color: '#10B981'
                        },
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
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${achievement.earned
                                        ? 'bg-[#D3E4E7]/30 hover:bg-[#D3E4E7]/50'
                                        : 'bg-gray-100/50 opacity-60'
                                        }`}
                                    onClick={() => {
                                        if (!achievement.earned && achievement.title === 'Verified Worker') {
                                            navigate('/worker/verification');
                                        }
                                    }}
                                    style={{ cursor: !achievement.earned && achievement.title === 'Verified Worker' ? 'pointer' : 'default' }}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.earned ? 'bg-[#0B4B54]/10' : 'bg-gray-200'
                                        }`}>
                                        <Icon size={24} className={achievement.earned ? 'text-[#0B4B54]' : 'text-gray-400'} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${achievement.earned ? 'text-[#032A33]' : 'text-gray-500'}`}>
                                            {achievement.title}
                                        </h4>
                                        <p className="text-sm text-[#888888]">{achievement.description}</p>
                                    </div>
                                    {!achievement.earned && achievement.title === 'Verified Worker' && (
                                        <button className="px-3 py-1.5 rounded-lg bg-[#0B4B54] text-white text-sm font-medium hover:bg-[#0D5A65] transition-colors">
                                            Get Verified
                                        </button>
                                    )}
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
