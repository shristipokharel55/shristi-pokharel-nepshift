import {
    Briefcase,
    Calendar,
    Camera,
    Edit2,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    Star,
    Upload
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import HirerLayout from "../../components/hirer/HirerLayout";
import VerifiedBadge from "../../components/ui/VerifiedBadge";
import api from "../../utils/api";

const HirerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const profilePhotoRef = useRef(null);
    const coverPhotoRef = useRef(null);
    
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        profilePhoto: null,
        coverPhoto: null,
        address: {
            municipality: '',
            district: '',
            ward: '',
            street: ''
        },
        isVerified: false,
        rating: 0,
        totalHires: 0,
        createdAt: null
    });

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        bio: '',
        address: {
            municipality: '',
            district: '',
            ward: '',
            street: ''
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/hirer/profile');
            
            if (response.data.success) {
                const data = response.data.data.user || response.data.data;
                setProfile({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    profilePhoto: data.profilePhoto || null,
                    coverPhoto: data.coverPhoto || null,
                    address: data.address || {
                        municipality: '',
                        district: '',
                        ward: '',
                        street: ''
                    },
                    isVerified: data.isVerified || false,
                    rating: data.rating || 0,
                    totalHires: data.totalHires || 0,
                    createdAt: data.createdAt || data.joinedAt
                });

                setFormData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    address: data.address || {
                        municipality: '',
                        district: '',
                        ward: '',
                        street: ''
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const response = await api.put('/hirer/profile', formData);
            
            if (response.data.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                await fetchProfile();
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (file, type) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('type', type);

        try {
            if (type === 'profile') {
                setUploadingPhoto(true);
            } else {
                setUploadingCover(true);
            }

            const response = await api.post('/hirer/upload-photo', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} photo updated!`);
                await fetchProfile();
            }
        } catch (error) {
            console.error('Failed to upload photo:', error);
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
            if (type === 'profile') {
                setUploadingPhoto(false);
            } else {
                setUploadingCover(false);
            }
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/')) {
            return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    const getMemberSinceDate = () => {
        if (!profile.createdAt) return 'N/A';
        try {
            return new Date(profile.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getLocationString = () => {
        const { municipality, district } = profile.address;
        if (!municipality && !district) return 'Not specified';
        return [municipality, district].filter(Boolean).join(', ');
    };

    if (loading) {
        return (
            <HirerLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4A9287]" />
                </div>
            </HirerLayout>
        );
    }

    return (
        <HirerLayout>
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    {/* Cover Photo */}
                    <div className="h-48 bg-gradient-to-br from-[#4A9287] via-[#3d7a71] to-[#2d6a61] relative">
                        <input
                            ref={coverPhotoRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e.target.files[0], 'cover')}
                            className="hidden"
                        />
                        {profile.coverPhoto && (
                            <img 
                                src={getImageUrl(profile.coverPhoto)} 
                                alt="Cover" 
                                className="w-full h-full object-cover"
                            />
                        )}
                        <button 
                            onClick={() => coverPhotoRef.current?.click()}
                            disabled={uploadingCover}
                            className="absolute top-4 right-4 px-4 py-2 bg-black/30 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-black/40 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {uploadingCover ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Camera size={16} />
                                    Change Cover
                                </>
                            )}
                        </button>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16">
                            {/* Avatar Section */}
                            <div className="flex items-end gap-6">
                                <div className="relative">
                                    <input
                                        ref={profilePhotoRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhotoUpload(e.target.files[0], 'profile')}
                                        className="hidden"
                                    />
                                    <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden">
                                        {profile.profilePhoto ? (
                                            <img 
                                                src={getImageUrl(profile.profilePhoto)} 
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#4A9287] to-[#3d7a71] flex items-center justify-center text-4xl font-bold text-white">
                                                {profile.fullName?.charAt(0)?.toUpperCase() || 'H'}
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => profilePhotoRef.current?.click()}
                                        disabled={uploadingPhoto}
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#4A9287] text-white rounded-xl flex items-center justify-center hover:bg-[#3d7a71] transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {uploadingPhoto ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Camera size={18} />
                                        )}
                                    </button>
                                </div>
                                
                                {/* Name & Verification */}
                                <div className="pb-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-slate-800">
                                            {profile.fullName || 'Hirer Name'}
                                        </h1>
                                        <VerifiedBadge 
                                            isVerified={profile.isVerified} 
                                            size="lg" 
                                            variant="badge" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <Star size={16} className="fill-amber-400 text-amber-400" />
                                            <span className="font-semibold text-slate-800">
                                                {profile.rating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="text-sm">Rating</span>
                                        </div>
                                        <span className="text-slate-300">•</span>
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={16} />
                                            <span className="font-semibold text-slate-800">
                                                {profile.totalHires || 0}
                                            </span>
                                            <span className="text-sm">Hires</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Edit Button */}
                            <button 
                                onClick={() => {
                                    if (isEditing) {
                                        handleSaveProfile();
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                                disabled={saving}
                                className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors ${
                                    isEditing 
                                        ? 'bg-[#4A9287] text-white hover:bg-[#3d7a71]' 
                                        : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Edit2 size={18} />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-800">
                                    {profile.totalHires || 0}
                                </p>
                                <p className="text-sm text-slate-500">Total Hires</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
                                <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-800">
                                    {profile.rating?.toFixed(1) || '0.0'}
                                </p>
                                <p className="text-sm text-slate-500">Average Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-800">
                                    {getMemberSinceDate()}
                                </p>
                                <p className="text-sm text-slate-500">Member Since</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">About</h3>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about your business or what you're looking for in workers..."
                                    className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#4A9287] focus:ring-2 focus:ring-[#4A9287]/20 resize-none"
                                    maxLength={500}
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    {profile.bio || 'No bio added yet. Click "Edit Profile" to add information about your business.'}
                                </p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6">Contact Information</h3>
                            <div className="space-y-5">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={20} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                                        <p className="text-slate-800 font-medium break-all">
                                            {profile.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={20} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#4A9287] focus:ring-2 focus:ring-[#4A9287]/20"
                                            />
                                        ) : (
                                            <p className="text-slate-800 font-medium">
                                                {profile.phone || 'Not provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={20} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Location</p>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={formData.address.municipality}
                                                    onChange={(e) => setFormData({ 
                                                        ...formData, 
                                                        address: { ...formData.address, municipality: e.target.value }
                                                    })}
                                                    placeholder="Municipality"
                                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#4A9287] focus:ring-2 focus:ring-[#4A9287]/20"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.address.district}
                                                    onChange={(e) => setFormData({ 
                                                        ...formData, 
                                                        address: { ...formData.address, district: e.target.value }
                                                    })}
                                                    placeholder="District"
                                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#4A9287] focus:ring-2 focus:ring-[#4A9287]/20"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-slate-800 font-medium">
                                                {getLocationString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Verification Status */}
                    <div className="space-y-6">
                        {profile.isVerified ? (
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <Shield size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900">Verified Employer</h4>
                                        <p className="text-sm text-emerald-700">Identity confirmed</p>
                                    </div>
                                </div>
                                <p className="text-sm text-emerald-800 leading-relaxed">
                                    Your profile has been verified. Workers can trust that you're a legitimate employer.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                                        <Shield size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-900">Not Verified</h4>
                                        <p className="text-sm text-amber-700">Complete verification</p>
                                    </div>
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed mb-4">
                                    Get verified to build trust with workers and increase your chances of finding quality help.
                                </p>
                                <a
                                    href="/hirer/profile/complete"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    <Upload size={16} />
                                    Get Verified
                                </a>
                            </div>
                        )}

                        {/* Profile Completion Tip */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-semibold text-slate-800 mb-3">💡 Profile Tips</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#4A9287] mt-0.5">✓</span>
                                    <span>Add a professional profile photo to build trust</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#4A9287] mt-0.5">✓</span>
                                    <span>Write a clear bio about your business</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#4A9287] mt-0.5">✓</span>
                                    <span>Keep your contact information up to date</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#4A9287] mt-0.5">✓</span>
                                    <span>Complete verification to attract more workers</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerProfile;
