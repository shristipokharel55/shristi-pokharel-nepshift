import {
    ArrowRight,
    Briefcase,
    Calendar,
    CheckCircle,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    Star,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";


const HirerProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Profile state - Replace with actual API data
    const [profile, setProfile] = useState({
        fullName: 'Sarah Chen',
        email: 'sarah@chenscafe.com',
        phone: '+1 (555) 123-4567',
        memberSince: 'March 2023',
        isVerified: false,
        verificationStatus: 'unverified', // 'unverified', 'pending', 'approved'
        bio: "Owner of Chen's Café, a local coffee shop serving specialty brews since 2018. We're always looking for reliable baristas and kitchen staff for our busy weekend shifts. We pride ourselves on creating a positive work environment and fair compensation for all team members.",
        // Address information
        address: {
            district: 'Downtown District',
            municipality: 'Kathmandu',
            ward: 5,
            street: 'Main Street'
        },
        // Statistics
        stats: {
            activeShifts: 3,
            totalHires: 47,
            bidsReceived: 156,
            rating: 4.8,
            totalRatings: 32
        },
        // Verification checklist
        verification: {
            email: true,
            phone: true,
            governmentId: false,
            businessLicense: false
        }
    });

    // Fetch profile data from API
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/hirer/profile');
            
            if (response.data.success) {
                const { user, stats } = response.data.data;
                
                // Map API response to profile state
                setProfile({
                    fullName: user.fullName || 'User Name',
                    email: user.email || '',
                    phone: user.phone || 'Not provided',
                    memberSince: formatMemberSince(user.createdAt),
                    isVerified: user.isVerified || false,
                    verificationStatus: user.verificationStatus || 'unverified',
                    bio: user.bio || '',
                    address: {
                        district: user.address?.district || 'Not specified',
                        municipality: user.address?.municipality || 'Not specified',
                        ward: user.address?.ward || 0,
                        street: user.address?.street || ''
                    },
                    stats: {
                        activeShifts: stats?.activeShifts || 0,
                        totalHires: stats?.totalHires || 0,
                        bidsReceived: stats?.totalBidsReceived || 0,
                        rating: stats?.averageRating || 0,
                        totalRatings: stats?.totalRatings || 0
                    },
                    verification: {
                        email: true, // Email is verified if they can log in
                        phone: !!user.phone,
                        governmentId: user.verificationDocs?.citizenshipFront ? true : false,
                        businessLicense: false // Add when available
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format member since date
    const formatMemberSince = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    // Calculate verification progress (out of 4 steps)
    const verificationProgress = () => {
        const checks = profile.verification;
        const completed = Object.values(checks).filter(Boolean).length;
        const total = Object.values(checks).length;
        return { completed, total, percentage: (completed / total) * 100 };
    };

    const progress = verificationProgress();

    // Navigate to verification page
    const handleVerifyIdentity = () => {
        navigate('/hirer/verify');
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <HirerLayout>
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0fafa' }}>
                    <div className="text-[#0D4747] text-lg">Loading profile...</div>
                </div>
            </HirerLayout>
        );
    }

    return (
        <HirerLayout>
            {/* Background matches project theme */}
            <div className="min-h-screen" style={{ backgroundColor: '#f0fafa' }}>
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                    
                    {/* HERO CARD - Slim teal banner with circular avatar */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Teal Banner Background */}
                        <div className="h-32 bg-gradient-to-r from-[#0D4747] to-[#1a6b6b] relative"></div>
                        
                        {/* Profile Content */}
                        <div className="px-6 pb-6 -mt-16 relative">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                {/* Left: Avatar + Name + Member Info */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                                    {/* Circular Avatar */}
                                    <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-bold" style={{ color: '#0D4747' }}>
                                        {getInitials(profile.fullName)}
                                    </div>
                                    
                                    {/* Name and Member Since */}
                                    <div className="text-center sm:text-left pb-2">
                                        <h1 className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                            {profile.fullName}
                                        </h1>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                                            <Calendar size={16} />
                                            <span>Member since {profile.memberSince}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right: Verification Badge */}
                                <div className="flex justify-center sm:justify-end pb-2">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                                        profile.isVerified 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-amber-500 text-white'
                                    }`}>
                                        <ShieldCheck size={16} />
                                        {profile.isVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATS ROW - 4 column grid of square cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Active Shifts */}
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Briefcase size={24} className="text-blue-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                {profile.stats.activeShifts}
                            </div>
                            <div className="text-sm text-gray-500">Active Shifts</div>
                        </div>

                        {/* Total Hires */}
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Users size={24} className="text-purple-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                {profile.stats.totalHires}
                            </div>
                            <div className="text-sm text-gray-500">Total Hires</div>
                        </div>

                        {/* Bids Received */}
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                                    <MessageSquare size={24} className="text-teal-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                {profile.stats.bidsReceived}
                            </div>
                            <div className="text-sm text-gray-500">Bids Received</div>
                        </div>

                        {/* Rating */}
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Star size={24} className="text-amber-500" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                {profile.stats.rating.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500">Rating</div>
                        </div>
                    </div>

                    {/* TWO COLUMN GRID - Left and Right sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT COLUMN - Spans 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* ABOUT CARD */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4" style={{ color: '#0D4747' }}>
                                    About Me / Business Profile
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {profile.bio || 'No business profile description provided yet.'}
                                </p>
                            </div>

                            {/* CONTACT INFORMATION CARD */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-6" style={{ color: '#0D4747' }}>
                                    Contact Information
                                </h2>
                                
                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Email</div>
                                            <div className="font-semibold" style={{ color: '#0D4747' }}>
                                                {profile.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone size={20} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Phone</div>
                                            <div className="font-semibold" style={{ color: '#0D4747' }}>
                                                {profile.phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Location</div>
                                            <div className="font-semibold" style={{ color: '#0D4747' }}>
                                                {profile.address.district}, Ward {profile.address.ward}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Trust & Verification */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-6" style={{ color: '#0D4747' }}>
                                    Trust & Verification
                                </h2>

                                {/* Verification Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Verification Progress</span>
                                        <span className="font-semibold" style={{ color: '#0D4747' }}>
                                            {progress.completed}/{progress.total}
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${progress.percentage}%`,
                                                backgroundColor: '#0D4747'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Verification Checklist */}
                                <div className="space-y-3 mb-6">
                                    {/* Email verified */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                            profile.verification.email ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}>
                                            {profile.verification.email && (
                                                <CheckCircle size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className={profile.verification.email ? 'text-gray-700' : 'text-gray-400'}>
                                            Email verified
                                        </span>
                                    </div>

                                    {/* Phone verified */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                            profile.verification.phone ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}>
                                            {profile.verification.phone && (
                                                <CheckCircle size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className={profile.verification.phone ? 'text-gray-700' : 'text-gray-400'}>
                                            Phone verified
                                        </span>
                                    </div>

                                    {/* Government ID */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                            profile.verification.governmentId ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}>
                                            {profile.verification.governmentId && (
                                                <CheckCircle size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className={profile.verification.governmentId ? 'text-gray-700' : 'text-gray-400'}>
                                            Government ID
                                        </span>
                                    </div>

                                    {/* Business License */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                            profile.verification.businessLicense ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}>
                                            {profile.verification.businessLicense && (
                                                <CheckCircle size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className={profile.verification.businessLicense ? 'text-gray-700' : 'text-gray-400'}>
                                            Business license
                                        </span>
                                    </div>
                                </div>

                                {/* Verify Identity Button - Primary Teal */}
                                <button
                                    onClick={handleVerifyIdentity}
                                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                    style={{ backgroundColor: '#0D4747' }}
                                >
                                    Verify Identity
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerProfile;
