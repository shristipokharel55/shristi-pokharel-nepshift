import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    Briefcase,
    Calendar,
    Camera,
    Check,
    Edit2,
    Globe,
    Mail,
    MapPin,
    Phone,
    Shield,
    Star,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import HirerLayout from "../../components/hirer/HirerLayout";
import VerifiedBadge from "../../components/ui/VerifiedBadge";
import api from "../../utils/api";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map marker component
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return position && position.latitude && position.longitude ? (
    <Marker position={[position.latitude, position.longitude]} />
  ) : null;
}

const HirerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        description: '',
        industry: 'Food & Hospitality',
        companySize: '50-100 employees',
        verified: false,
        rating: 4.8,
        totalHires: 0,
        memberSince: 'January 2024'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/helper/hirer/profile');
            
            if (response.data.success) {
                const data = response.data.data;
                setProfile({
                    name: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.address ? `${data.address.municipality || ''}, ${data.address.district || ''}`.trim().replace(/^,|,$/g, '') : '',
                    bio: data.bio || '',
                    verified: data.isVerified || false,
                    totalHires: data.totalHires || 0,
                    memberSince: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Hires', value: profile.totalHires, icon: Briefcase, color: 'blue' },
        { label: 'Rating', value: `★ ${profile.rating}`, icon: Star, color: 'amber' },
        { label: 'Member Since', value: profile.memberSince, icon: Calendar, color: 'emerald' },
    ];

    const recentHires = [
        { name: 'Hari Bahadur', role: 'Kitchen Helper', date: 'Jan 28, 2026', rating: 5 },
        { name: 'Maya Tamang', role: 'Event Staff', date: 'Jan 25, 2026', rating: 4 },
        { name: 'Gita Gurung', role: 'Server', date: 'Jan 22, 2026', rating: 5 },
    ];

    return (
        <HirerLayout>
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-[#1F4E5F] to-[#2D6A7A] relative">
                        <button className="absolute right-4 top-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2">
                            <Camera size={14} />
                            Change Cover
                        </button>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl bg-[#1F4E5F]/10 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#1F4E5F]">
                                    NR
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1F4E5F] text-white rounded-lg flex items-center justify-center hover:bg-[#2D6A7A] transition-colors">
                                    <Camera size={14} />
                                </button>
                            </div>
                            
                            {/* Name & Badge */}
                            <div className="flex-1 pt-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-800">{profile.name || 'Hirer Name'}</h1>
                                    <VerifiedBadge isVerified={profile.verified} size="md" variant="badge" />
                                </div>
                                <p className="text-gray-500">{profile.industry} • {profile.companySize}</p>
                            </div>
                            
                            {/* Edit Button */}
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors ${
                                    isEditing 
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            blue: 'bg-blue-100 text-blue-600',
                            amber: 'bg-amber-100 text-amber-600',
                            emerald: 'bg-emerald-100 text-emerald-600',
                        };
                        
                        return (
                            <div key={idx} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${colorClasses[stat.color]}`}>
                                    <Icon size={24} />
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">About</h3>
                            {isEditing ? (
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 resize-none"
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Mail size={18} className="text-gray-500" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1F4E5F]"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800">{profile.email}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Phone size={18} className="text-gray-500" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1F4E5F]"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-800">{profile.phone}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <MapPin size={18} className="text-gray-500" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1F4E5F]"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="text-gray-800">{profile.location}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Globe size={18} className="text-gray-500" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.website}
                                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1F4E5F]"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <p className="text-[#1F4E5F]">{profile.website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Hires */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Recent Hires</h3>
                            <div className="space-y-4">
                                {recentHires.map((hire, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1F4E5F]/10 flex items-center justify-center">
                                            <User size={18} className="text-[#1F4E5F]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">{hire.name}</p>
                                            <p className="text-xs text-gray-500">{hire.role}</p>
                                        </div>
                                        <div className="flex items-center text-amber-500 text-sm">
                                            <Star size={12} className="fill-current" />
                                            <span className="ml-0.5">{hire.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verification Status */}
                        {profile.verified ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <Shield size={18} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-800">Verified Employer</h4>
                                        <p className="text-sm text-emerald-600">Identity confirmed</p>
                                    </div>
                                </div>
                                <p className="text-sm text-emerald-700">
                                    Your business has been verified. Workers can trust that you're a legitimate employer.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <Shield size={18} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-amber-800">Not Verified Yet</h4>
                                        <p className="text-sm text-amber-600">Complete verification</p>
                                    </div>
                                </div>
                                <p className="text-sm text-amber-700 mb-3">
                                    Get verified to build trust with workers and increase your hires.
                                </p>
                                <a
                                    href="/hirer/profile/edit"
                                    className="inline-block px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Get Verified
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default HirerProfile;
