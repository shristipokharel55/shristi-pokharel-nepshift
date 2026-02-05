import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    AlertCircle,
    Camera,
    CheckCircle,
    FileText,
    Loader2,
    MapPin,
    Phone,
    Save,
    Shield,
    Upload,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";
import { getDistricts, getMunicipalities, getWards } from "../../utils/nepalLocations";

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

export default function HirerProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    address: {
      latitude: 27.7172,
      longitude: 85.324,
      district: "",
      municipality: "",
      ward: "",
      street: ""
    },
    verificationDocs: {
      citizenshipFront: "",
      citizenshipBack: "",
      selfieWithId: ""
    },
    verificationStatus: "unverified",
    isVerified: false
  });

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  // For nested dropdowns
  const [districts] = useState(getDistricts());
  const [municipalities, setMunicipalities] = useState([]);
  const [wards, setWards] = useState([]);

  // For document uploads
  const [uploadedFiles, setUploadedFiles] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    selfieWithId: null
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update municipalities when district changes
  useEffect(() => {
    if (profileData.address.district) {
      const munis = getMunicipalities(profileData.address.district);
      setMunicipalities(munis);
    } else {
      setMunicipalities([]);
      setWards([]);
    }
  }, [profileData.address.district]);

  // Update wards when municipality changes
  useEffect(() => {
    if (profileData.address.district && profileData.address.municipality) {
      const wardList = getWards(profileData.address.district, profileData.address.municipality);
      setWards(wardList);
    } else {
      setWards([]);
    }
  }, [profileData.address.district, profileData.address.municipality]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/helper/hirer/profile");

      if (response.data.success) {
        const { user, profileCompletion, canSubmitForVerification } = response.data.data;
        
        setProfileData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          address: user.address || {
            latitude: 27.7172,
            longitude: 85.324,
            district: "",
            municipality: "",
            ward: "",
            street: ""
          },
          verificationDocs: user.verificationDocs || {},
          verificationStatus: user.verificationStatus || "unverified",
          isVerified: user.isVerified || false
        });

        setProfileCompletion(profileCompletion);
        setCanSubmit(canSubmitForVerification);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleMapClick = (position) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ...position
      }
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await api.put("/helper/hirer/profile", {
        fullName: profileData.fullName,
        phone: profileData.phone,
        bio: profileData.bio,
        address: profileData.address
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setProfileCompletion(response.data.data.profileCompletion);
        setCanSubmit(response.data.data.canSubmitForVerification);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and PDF files are allowed");
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [docType]: file
      }));
    }
  };

  const handleUploadDocuments = async () => {
    try {
      setUploading(true);

      const formData = new FormData();
      if (uploadedFiles.citizenshipFront) {
        formData.append('citizenshipFront', uploadedFiles.citizenshipFront);
      }
      if (uploadedFiles.citizenshipBack) {
        formData.append('citizenshipBack', uploadedFiles.citizenshipBack);
      }
      if (uploadedFiles.selfieWithId) {
        formData.append('selfieWithId', uploadedFiles.selfieWithId);
      }

      const response = await api.post("/helper/hirer/upload-documents", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Documents uploaded successfully!");
        setProfileData(prev => ({
          ...prev,
          verificationDocs: response.data.data.verificationDocs
        }));
        setProfileCompletion(response.data.data.profileCompletion);
        setCanSubmit(response.data.data.canSubmitForVerification);
        setUploadedFiles({
          citizenshipFront: null,
          citizenshipBack: null,
          selfieWithId: null
        });
      }
    } catch (error) {
      console.error("Failed to upload documents:", error);
      toast.error(error.response?.data?.message || "Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setSubmittingVerification(true);
      const response = await api.post("/helper/hirer/submit-verification");

      if (response.data.success) {
        toast.success(response.data.message);
        setProfileData(prev => ({
          ...prev,
          verificationStatus: 'pending'
        }));
      }
    } catch (error) {
      console.error("Failed to submit verification:", error);
      toast.error(error.response?.data?.message || "Failed to submit verification");
    } finally {
      setSubmittingVerification(false);
    }
  };

  const getVerificationStatusBadge = () => {
    const statusConfig = {
      unverified: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Not Verified"
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Pending Review"
      },
      approved: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Verified"
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected"
      }
    };

    const config = statusConfig[profileData.verificationStatus] || statusConfig.unverified;

    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <HirerLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
        </div>
      </HirerLayout>
    );
  }

  return (
    <HirerLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#032A33]">My Profile</h1>
            <p className="text-[#888888] mt-1">Complete your profile to start hiring workers</p>
          </div>
          {getVerificationStatusBadge()}
        </div>

        {/* Profile Completion Bar */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#032A33]">Profile Strength</h3>
              <p className="text-sm text-[#888888]">
                {profileCompletion}% complete
              </p>
            </div>
            <div className="text-2xl font-bold text-[#0B4B54]">{profileCompletion}%</div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0B4B54] to-[#82ACAB] transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-[#888888]">
            <p>✓ Basic Info (Bio): {profileData.bio ? '40%' : '0%'}</p>
            <p>✓ Phone: {profileData.phone ? '20%' : '0%'}</p>
            <p>✓ Location: {profileData.address?.district ? '20%' : '0%'}</p>
            <p>✓ Documents: {profileData.verificationDocs?.citizenshipFront && profileData.verificationDocs?.citizenshipBack && profileData.verificationDocs?.selfieWithId ? '20%' : '0%'}</p>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[#0B4B54]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#032A33]">Personal Details</h2>
              <p className="text-sm text-[#888888]">Basic information about you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
                placeholder="9801234567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all resize-none"
                placeholder="Tell workers about yourself and what kind of work you offer..."
              />
              <p className="text-sm text-[#888888] mt-1">
                {profileData.bio?.length || 0}/500 characters
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-[#0B4B54] text-white rounded-xl font-semibold hover:bg-[#0D5A65] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </div>

        {/* Section 2: Precise Location */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#0B4B54]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#032A33]">Precise Location</h2>
              <p className="text-sm text-[#888888]">Help workers find you easily</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                District *
              </label>
              <select
                value={profileData.address.district}
                onChange={(e) => {
                  handleAddressChange('district', e.target.value);
                  handleAddressChange('municipality', '');
                  handleAddressChange('ward', '');
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Municipality *
              </label>
              <select
                value={profileData.address.municipality}
                onChange={(e) => {
                  handleAddressChange('municipality', e.target.value);
                  handleAddressChange('ward', '');
                }}
                disabled={!profileData.address.district}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Municipality</option>
                {municipalities.map(muni => (
                  <option key={muni.name} value={muni.name}>{muni.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Ward *
              </label>
              <select
                value={profileData.address.ward}
                onChange={(e) => handleAddressChange('ward', parseInt(e.target.value))}
                disabled={!profileData.address.municipality}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Ward</option>
                {wards.map(ward => (
                  <option key={ward} value={ward}>Ward {ward}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={profileData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#82ACAB]/30 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
                placeholder="e.g., New Road, Thamel, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-2">
              Click on the map to set your exact location
            </label>
            <div className="h-[400px] rounded-xl overflow-hidden border-2 border-[#82ACAB]/20">
              <MapContainer
                center={[
                  profileData.address.latitude || 27.7172,
                  profileData.address.longitude || 85.324
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={profileData.address} 
                  setPosition={handleMapClick} 
                />
              </MapContainer>
            </div>
            {profileData.address.latitude && profileData.address.longitude && (
              <p className="text-sm text-[#888888] mt-2">
                Coordinates: {profileData.address.latitude.toFixed(6)}, {profileData.address.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-[#0B4B54] text-white rounded-xl font-semibold hover:bg-[#0D5A65] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Location
              </>
            )}
          </button>
        </div>

        {/* Section 3: Identity Verification */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#0B4B54]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#032A33]">Identity Verification</h2>
              <p className="text-sm text-[#888888]">Upload your documents for verification</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Privacy Notice</p>
                <p>Your citizenship photos are only visible to admins for verification. Workers will only see a "Verified" badge once approved.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Citizenship Front */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Citizenship Front *
              </label>
              <div className="border-2 border-dashed border-[#82ACAB]/30 rounded-xl p-6 text-center hover:border-[#0B4B54] transition-all">
                {profileData.verificationDocs?.citizenshipFront ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                    <p className="text-sm text-emerald-600 font-medium">Uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 mx-auto text-[#888888]" />
                    <p className="text-sm text-[#888888]">No file uploaded</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'citizenshipFront')}
                  className="hidden"
                  id="citizenshipFront"
                />
                <label
                  htmlFor="citizenshipFront"
                  className="mt-3 inline-block px-4 py-2 bg-white border border-[#82ACAB]/30 rounded-lg text-sm font-medium text-[#032A33] hover:bg-gray-50 cursor-pointer transition-all"
                >
                  Choose File
                </label>
                {uploadedFiles.citizenshipFront && (
                  <p className="text-xs text-[#0B4B54] mt-2">{uploadedFiles.citizenshipFront.name}</p>
                )}
              </div>
            </div>

            {/* Citizenship Back */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Citizenship Back *
              </label>
              <div className="border-2 border-dashed border-[#82ACAB]/30 rounded-xl p-6 text-center hover:border-[#0B4B54] transition-all">
                {profileData.verificationDocs?.citizenshipBack ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                    <p className="text-sm text-emerald-600 font-medium">Uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 mx-auto text-[#888888]" />
                    <p className="text-sm text-[#888888]">No file uploaded</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'citizenshipBack')}
                  className="hidden"
                  id="citizenshipBack"
                />
                <label
                  htmlFor="citizenshipBack"
                  className="mt-3 inline-block px-4 py-2 bg-white border border-[#82ACAB]/30 rounded-lg text-sm font-medium text-[#032A33] hover:bg-gray-50 cursor-pointer transition-all"
                >
                  Choose File
                </label>
                {uploadedFiles.citizenshipBack && (
                  <p className="text-xs text-[#0B4B54] mt-2">{uploadedFiles.citizenshipBack.name}</p>
                )}
              </div>
            </div>

            {/* Selfie with ID */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Selfie with ID *
              </label>
              <div className="border-2 border-dashed border-[#82ACAB]/30 rounded-xl p-6 text-center hover:border-[#0B4B54] transition-all">
                {profileData.verificationDocs?.selfieWithId ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                    <p className="text-sm text-emerald-600 font-medium">Uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 mx-auto text-[#888888]" />
                    <p className="text-sm text-[#888888]">No file uploaded</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'selfieWithId')}
                  className="hidden"
                  id="selfieWithId"
                />
                <label
                  htmlFor="selfieWithId"
                  className="mt-3 inline-block px-4 py-2 bg-white border border-[#82ACAB]/30 rounded-lg text-sm font-medium text-[#032A33] hover:bg-gray-50 cursor-pointer transition-all"
                >
                  Choose File
                </label>
                {uploadedFiles.selfieWithId && (
                  <p className="text-xs text-[#0B4B54] mt-2">{uploadedFiles.selfieWithId.name}</p>
                )}
              </div>
            </div>
          </div>

          {(uploadedFiles.citizenshipFront || uploadedFiles.citizenshipBack || uploadedFiles.selfieWithId) && (
            <button
              onClick={handleUploadDocuments}
              disabled={uploading}
              className="mt-6 px-6 py-3 bg-[#0B4B54] text-white rounded-xl font-semibold hover:bg-[#0D5A65] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Documents
                </>
              )}
            </button>
          )}
        </div>

        {/* Submit for Verification */}
        {canSubmit && profileData.verificationStatus === 'unverified' && (
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#032A33] mb-1">
                  Ready for Verification!
                </h3>
                <p className="text-sm text-[#888888]">
                  Your profile is complete. Submit it for admin review to get verified.
                </p>
              </div>
              <button
                onClick={handleSubmitVerification}
                disabled={submittingVerification}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingVerification ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Submit for Verification
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {profileData.verificationStatus === 'pending' && (
          <div className="glass-card rounded-2xl p-6 bg-amber-50 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  Verification Pending
                </h3>
                <p className="text-sm text-amber-800">
                  Your documents are being reviewed by our admin team. This usually takes 1-2 business days. You'll be notified once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {profileData.verificationStatus === 'rejected' && (
          <div className="glass-card rounded-2xl p-6 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Verification Rejected
                </h3>
                <p className="text-sm text-red-800">
                  Your verification was rejected. Please review your documents and submit again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </HirerLayout>
  );
}
