import {
    ArrowRight,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldAlert,
    ShieldCheck,
    Star,
    Users,
    XCircle
} from "lucide-react";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";


/**
 * Hirer Profile Page
 * 
 * Data Flow:
 * 1. Initial Registration: Basic info (name, email, phone) from registration
 * 2. Profile Data: Fetched from /hirer/profile API endpoint on component mount
 * 3. Verification Data: Populated when hirer uploads documents via /hirer/verify page
 *    - Email: Automatically verified (required for registration)
 *    - Phone: Verified if provided during registration/profile update
 *    - Government ID: Verified when citizenship documents are uploaded
 *    - Selfie with ID: Verified when selfie is uploaded during verification
 * 4. Statistics: Automatically calculated from user activity (shifts, hires, bids, ratings)
 * 
 * Profile Updates:
 * - Basic info can be edited via HirerProfileEdit page
 * - Verification documents uploaded via /hirer/verify page
 * - Admin reviews and approves/rejects verification (changes verificationStatus)
 */

const HirerProfile = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);

    // Profile state - Initially populated with Auth data from registration
    const [profile, setProfile] = useState({
        fullName: authUser?.fullName || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
        memberSince: '',
        isVerified: authUser?.isVerified || false,
        verificationStatus: authUser?.verificationStatus || 'unverified',
        bio: authUser?.bio || '',
        address: {
            district: authUser?.address?.district || '',
            municipality: authUser?.address?.municipality || '',
            ward: authUser?.address?.ward || 0,
            street: authUser?.address?.street || ''
        },
        stats: {
            activeShifts: 0,
            totalHires: 0,
            bidsReceived: 0,
            rating: 0,
            totalRatings: 0
        },
        verification: {
            email: !!authUser?.email,
            phone: !!authUser?.phone,
            governmentId: !!(authUser?.verificationDocs?.citizenshipFront && authUser?.verificationDocs?.citizenshipBack),
            businessLicense: !!authUser?.verificationDocs?.selfieWithId
        }
    });

    // Fetch profile data from API
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            // Call the backend API to get hirer profile and statistics
            const response = await api.get('/helper/hirer/profile');


            if (response.data.success) {
                const { user, stats } = response.data.data;

                // Merge API response with existing profile data
                setProfile(prev => ({
                    ...prev,
                    fullName: user.fullName || prev.fullName,
                    email: user.email || prev.email,
                    phone: user.phone || prev.phone,
                    memberSince: formatMemberSince(user.joinedAt || user.createdAt),
                    isVerified: user.isVerified || false,
                    verificationStatus: user.verificationStatus || 'unverified',
                    bio: user.bio || '',
                    address: {
                        district: user.address?.district || prev.address.district,
                        municipality: user.address?.municipality || prev.address.municipality,
                        ward: user.address?.ward || prev.address.ward,
                        street: user.address?.street || prev.address.street
                    },
                    stats: {
                        activeShifts: stats?.activeShifts || 0,
                        totalHires: stats?.totalHires || 0,
                        bidsReceived: stats?.totalBidsReceived || 0,
                        rating: stats?.averageRating || 0,
                        totalRatings: stats?.totalRatings || 0
                    },
                    verification: {
                        email: !!user.email,
                        phone: !!user.phone,
                        governmentId: !!(user.verificationDocs?.citizenshipFront && user.verificationDocs?.citizenshipBack),
                        businessLicense: !!user.verificationDocs?.selfieWithId
                    }
                }));
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
        if (!name || name.trim() === '') return 'U';
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
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#0D4747' }}></div>
                        <div className="text-gray-600">Loading your profile...</div>
                    </div>
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

                                    {/* Name, Member Since and Edit Button */}
                                    <div className="text-center sm:text-left pb-2">
                                        <h1 className="text-3xl font-bold mb-1" style={{ color: '#0D4747' }}>
                                            {profile.fullName || 'User Name'}
                                        </h1>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={16} />
                                                <span>Member since {profile.memberSince || 'N/A'}</span>
                                            </div>
                                            <button
                                                onClick={() => navigate('/hirer/profile/edit')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-[#0D4747] text-xs font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                <Edit size={12} />
                                                EDIT PROFILE
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Verification Badge */}
                                <div className="flex justify-center sm:justify-end pb-2">
                                    <button
                                        onClick={handleVerifyIdentity}
                                        disabled={profile.isVerified}
                                        className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-wider font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${profile.isVerified ? 'bg-emerald-500 text-white cursor-default shadow-md shadow-emerald-500/20' :
                                            profile.verificationStatus === 'pending' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' :
                                                profile.verificationStatus === 'rejected' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' :
                                                    'bg-gray-400 text-white hover:bg-[#0D4747]'
                                            }`}
                                    >
                                        {profile.isVerified ? <ShieldCheck size={14} /> :
                                            profile.verificationStatus === 'pending' ? <Clock size={14} /> :
                                                profile.verificationStatus === 'rejected' ? <XCircle size={14} /> :
                                                    <ShieldAlert size={14} />}

                                        {profile.isVerified ? 'Verified' :
                                            profile.verificationStatus === 'pending' ? 'Pending Review' :
                                                profile.verificationStatus === 'rejected' ? 'Rejected' :
                                                    'Get Verified'}
                                    </button>
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
                                {profile.stats.rating > 0 ? profile.stats.rating.toFixed(1) : '0.0'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {profile.stats.totalRatings > 0 ? `${profile.stats.totalRatings} Reviews` : 'No ratings yet'}
                            </div>
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
                                    {profile.bio || 'No business profile description provided yet. Add information about your business to help workers learn more about you.'}
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
                                                {profile.email || 'Not provided'}
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
                                                {profile.phone || 'Not provided'}
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
                                                {(profile.address.district || profile.address.municipality)
                                                    ? `${profile.address.district || profile.address.municipality}${profile.address.ward ? `, Ward ${profile.address.ward}` : ''}`
                                                    : 'Not specified'}
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
                                <div
                                    className="mb-6 cursor-pointer group"
                                    onClick={handleVerifyIdentity}
                                >
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 group-hover:text-[#0D4747] transition-colors">Verification Progress</span>
                                        <span className="font-semibold" style={{ color: '#0D4747' }}>
                                            {progress.completed}/{progress.total}
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500 group-hover:brightness-110"
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
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${profile.verification.email ? 'bg-emerald-500' : 'bg-gray-300'
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
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${profile.verification.phone ? 'bg-emerald-500' : 'bg-gray-300'
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
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${profile.verification.governmentId ? 'bg-emerald-500' : 'bg-gray-300'
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
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${profile.verification.businessLicense ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`}>
                                            {profile.verification.businessLicense && (
                                                <CheckCircle size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className={profile.verification.businessLicense ? 'text-gray-700' : 'text-gray-400'}>
                                            Selfie with ID
                                        </span>
                                    </div>
                                </div>

                                {/* Helper text based on verification status */}
                                {!profile.isVerified && profile.verificationStatus !== 'pending' && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            Complete verification to unlock all features and gain trust from workers.
                                        </p>
                                    </div>
                                )}

                                {profile.verificationStatus === 'pending' && (
                                    <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                                        <p className="text-xs text-amber-700">
                                            Your documents are under review. You'll be notified once verified.
                                        </p>
                                    </div>
                                )}

                                {/* Verify Identity Button - Primary Teal */}
                                {!profile.isVerified && (
                                    <button
                                        onClick={handleVerifyIdentity}
                                        disabled={profile.verificationStatus === 'pending'}
                                        className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${profile.verificationStatus === 'pending'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'hover:opacity-90'
                                            }`}
                                        style={{ backgroundColor: profile.verificationStatus === 'pending' ? undefined : '#0D4747' }}
                                    >
                                        {profile.verificationStatus === 'pending' ? 'Verification Pending' : 'Verify Identity'}
                                        {profile.verificationStatus !== 'pending' && <ArrowRight size={18} />}
                                    </button>
                                )}

                                {profile.isVerified && (
                                    <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
                                            <CheckCircle size={20} />
                                            <span>Fully Verified</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerProfile;
