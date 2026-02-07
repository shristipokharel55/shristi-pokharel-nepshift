import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle,
    Clock,
    FileCheck,
    Loader2,
    Shield,
    Upload,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";

const HirerVerification = () => {
    const navigate = useNavigate();
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);
    const selfieInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState({
        citizenshipFront: false,
        citizenshipBack: false,
        selfieWithId: false
    });

    const [profile, setProfile] = useState(null);
    const [verificationDocs, setVerificationDocs] = useState({
        citizenshipFront: null,
        citizenshipBack: null,
        selfieWithId: null,
        previews: {
            citizenshipFront: null,
            citizenshipBack: null,
            selfieWithId: null
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/helper/hirer/profile');
            if (response.data.success) {
                const { user } = response.data.data;
                setProfile(user);

                // If they already have docs, we can show them or status
                setVerificationDocs(prev => ({
                    ...prev,
                    citizenshipFront: user.verificationDocs?.citizenshipFront || null,
                    citizenshipBack: user.verificationDocs?.citizenshipBack || null,
                    selfieWithId: user.verificationDocs?.selfieWithId || null
                }));
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load verification status');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            toast.error("Please select an image or PDF file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        // Create preview if it's an image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVerificationDocs(prev => ({
                    ...prev,
                    previews: {
                        ...prev.previews,
                        [docType]: reader.result
                    }
                }));
            };
            reader.readAsDataURL(file);
        }

        // Upload file immediately
        try {
            setUploading(prev => ({ ...prev, [docType]: true }));

            const formData = new FormData();
            formData.append(docType, file);

            const res = await api.post("/helper/hirer/upload-documents", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setVerificationDocs(prev => ({
                    ...prev,
                    [docType]: res.data.data.verificationDocs[docType]
                }));
                toast.success("Document uploaded successfully");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload document");
            // Clear preview on error
            setVerificationDocs(prev => ({
                ...prev,
                previews: {
                    ...prev.previews,
                    [docType]: null
                }
            }));
        } finally {
            setUploading(prev => ({ ...prev, [docType]: false }));
        }
    };

    const handleRemoveDocument = (docType) => {
        setVerificationDocs(prev => ({
            ...prev,
            [docType]: null,
            previews: {
                ...prev.previews,
                [docType]: null
            }
        }));
    };

    const handleSubmitForVerification = async () => {
        if (!verificationDocs.citizenshipFront || !verificationDocs.citizenshipBack || !verificationDocs.selfieWithId) {
            toast.error("Please upload all required documents");
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.post("/helper/hirer/submit-verification");
            if (res.data.success) {
                toast.success(res.data.message);
                setProfile(prev => ({ ...prev, verificationStatus: 'pending' }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit for verification");
        } finally {
            setSubmitting(false);
        }
    };

    const DocumentUploadBox = ({ docType, label, icon: Icon, preview, imageUrl, isUploading }) => (
        <div className="relative">
            <input
                type="file"
                ref={docType === 'citizenshipFront' ? frontInputRef : docType === 'citizenshipBack' ? backInputRef : selfieInputRef}
                onChange={(e) => handleFileChange(e, docType)}
                accept="image/*,application/pdf"
                className="hidden"
            />

            {preview || imageUrl ? (
                <div className="relative group">
                    <div className="w-full h-48 rounded-2xl border-2 border-[#82ACAB]/20 overflow-hidden bg-gray-50">
                        {preview || (imageUrl && !imageUrl.toLowerCase().endsWith('.pdf')) ? (
                            <img
                                src={preview || imageUrl}
                                alt={label}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <FileCheck size={40} className="text-[#0B4B54]" />
                                <span className="text-xs font-medium text-gray-500">PDF Document</span>
                            </div>
                        )}
                    </div>
                    {profile?.verificationStatus === 'unverified' && (
                        <button
                            type="button"
                            onClick={() => handleRemoveDocument(docType)}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-[#032A33] uppercase tracking-wider shadow-sm">
                        {label}
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => (docType === 'citizenshipFront' ? frontInputRef : docType === 'citizenshipBack' ? backInputRef : selfieInputRef).current?.click()}
                    disabled={isUploading || profile?.verificationStatus !== 'unverified'}
                    className="w-full h-48 border-2 border-dashed border-[#82ACAB]/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#0B4B54] hover:bg-[#0B4B54]/5 transition-all group disabled:opacity-50"
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={32} className="text-[#0B4B54] animate-spin" />
                            <span className="text-sm text-gray-500 font-medium">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#0B4B54]/10 group-hover:text-[#0B4B54] transition-colors">
                                <Icon size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-[#032A33] text-sm">{label}</p>
                                <p className="text-xs text-[#888888] mt-0.5">Click to upload</p>
                            </div>
                        </>
                    )}
                </button>
            )}
        </div>
    );

    if (loading) {
        return (
            <HirerLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
                </div>
            </HirerLayout>
        );
    }

    return (
        <HirerLayout>
            <div className="max-w-4xl mx-auto pb-12">
                {/* Back Button & Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/hirer/profile')}
                            className="flex items-center gap-2 text-[#0B4B54] hover:text-[#032A33] font-medium transition-colors mb-4"
                        >
                            <ArrowLeft size={18} />
                            <span>Back to Profile</span>
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#032A33] flex items-center gap-3">
                            Identity Verification
                            {profile?.isVerified && <CheckCircle className="text-emerald-500" size={24} />}
                        </h1>
                        <p className="text-[#888888] mt-1 font-medium italic">
                            Help us build a trusted marketplace by verifying your identity.
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start md:self-auto">
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm tracking-tight ${profile?.verificationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                profile?.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    profile?.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}>
                            {profile?.verificationStatus === 'approved' ? <Shield size={16} /> :
                                profile?.verificationStatus === 'pending' ? <Clock size={16} /> :
                                    profile?.verificationStatus === 'rejected' ? <XCircle size={16} /> :
                                        <AlertCircle size={16} />}
                            <span className="uppercase">
                                {profile?.verificationStatus === 'approved' ? 'Fully Verified' :
                                    profile?.verificationStatus === 'pending' ? 'Pending Review' :
                                        profile?.verificationStatus === 'rejected' ? 'Rejected' :
                                            'Not Verified'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Case: Verified */}
                {profile?.isVerified && (
                    <div className="glass-card rounded-3xl p-10 text-center mb-8 bg-gradient-to-br from-emerald-50/50 to-white">
                        <div className="w-24 h-24 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                            <CheckCircle size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#032A33] mb-3">Identity Successfully Verified</h2>
                        <p className="text-[#888888] max-w-md mx-auto mb-8 font-medium">
                            Your account is now fully verified. You can post shifts, hire workers, and manage your team with full access.
                        </p>
                        <button
                            onClick={() => navigate('/hirer/dashboard')}
                            className="px-8 py-3 bg-[#0B4B54] text-white rounded-xl font-bold hover:bg-[#032A33] transition-all shadow-lg shadow-[#0B4B54]/20"
                        >
                            Explore Dashboard
                        </button>
                    </div>
                )}

                {/* Case: Pending */}
                {!profile?.isVerified && profile?.verificationStatus === 'pending' && (
                    <div className="glass-card rounded-3xl p-10 text-center mb-8 bg-gradient-to-br from-amber-50/50 to-white">
                        <div className="w-24 h-24 bg-amber-100/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
                            <Clock size={48} className="text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#032A33] mb-3">Documents Under Review</h2>
                        <p className="text-[#888888] max-w-md mx-auto font-medium mb-2">
                            Our team is currently reviewing your documents. This process typically takes 24-48 business hours.
                        </p>
                        <p className="text-xs text-amber-600 font-bold bg-amber-50 px-4 py-2 rounded-full inline-block border border-amber-100">
                            You'll be notified via email once approved.
                        </p>
                    </div>
                )}

                {/* Case: Rejected */}
                {profile?.verificationStatus === 'rejected' && (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-8 flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900 mb-1">Verification Rejected</h3>
                            <p className="text-red-700 text-sm mb-4 font-medium">
                                Unfortunately, your identity verification was not approved. Please review the reason below and resubmit clear documents.
                            </p>
                            {profile?.rejectionReason && (
                                <div className="p-4 bg-white/50 rounded-xl border border-red-200">
                                    <p className="text-xs font-bold text-red-900 uppercase tracking-tighter mb-1 opacity-50">Reason for rejection</p>
                                    <p className="text-sm text-red-700 italic font-medium">"{profile.rejectionReason}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Verification Form */}
                {profile?.verificationStatus !== 'approved' && profile?.verificationStatus !== 'pending' && (
                    <div className="space-y-8">
                        {/* Why Verify Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                                <div className="p-3 bg-[#0B4B54]/10 rounded-xl text-[#0B4B54]">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#032A33] text-sm mb-1">Build Trust</p>
                                    <p className="text-xs text-[#888888] font-medium leading-relaxed">Verified employers attract top-tier workers more easily.</p>
                                </div>
                            </div>
                            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Upload size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#032A33] text-sm mb-1">Secure Data</p>
                                    <p className="text-xs text-[#888888] font-medium leading-relaxed">Your documents are encrypted and only accessible by admins.</p>
                                </div>
                            </div>
                            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#032A33] text-sm mb-1">Unlock Perks</p>
                                    <p className="text-xs text-[#888888] font-medium leading-relaxed">Access premium features and hire without restrictions.</p>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div className="glass-card rounded-3xl p-8 border border-[#82ACAB]/10 shadow-lg shadow-[#0B4B54]/5">
                            <h3 className="text-xl font-bold text-[#032A33] mb-6">Government Issued ID</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DocumentUploadBox
                                    docType="citizenshipFront"
                                    label="Citizenship Front"
                                    icon={Camera}
                                    preview={verificationDocs.previews.citizenshipFront}
                                    imageUrl={verificationDocs.citizenshipFront}
                                    isUploading={uploading.citizenshipFront}
                                />
                                <DocumentUploadBox
                                    docType="citizenshipBack"
                                    label="Citizenship Back"
                                    icon={Camera}
                                    preview={verificationDocs.previews.citizenshipBack}
                                    imageUrl={verificationDocs.citizenshipBack}
                                    isUploading={uploading.citizenshipBack}
                                />
                            </div>
                        </div>

                        {/* Selfie Section */}
                        <div className="glass-card rounded-3xl p-8 border border-[#82ACAB]/10 shadow-lg shadow-[#0B4B54]/5">
                            <h3 className="text-xl font-bold text-[#032A33] mb-6">Real-time Authentication</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2">
                                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 mb-0 h-full flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <AlertCircle className="text-blue-500" size={20} />
                                            <h4 className="font-bold text-[#032A33]">Selfie with your ID</h4>
                                        </div>
                                        <p className="text-[#888888] text-sm font-medium mb-4 leading-relaxed">
                                            Please hold your citizenship card near your face and take a clear photo.
                                            Make sure both your face and the ID details are visible and sharp.
                                        </p>
                                        <ul className="text-xs text-blue-700/70 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                Natural lighting (avoid harsh shadows)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                High resolution (details must be readable)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                Face must be centered
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <DocumentUploadBox
                                        docType="selfieWithId"
                                        label="Selfie With ID"
                                        icon={Camera}
                                        preview={verificationDocs.previews.selfieWithId}
                                        imageUrl={verificationDocs.selfieWithId}
                                        isUploading={uploading.selfieWithId}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleSubmitForVerification}
                                disabled={submitting || !verificationDocs.citizenshipFront || !verificationDocs.citizenshipBack || !verificationDocs.selfieWithId}
                                className="w-full md:w-auto px-12 py-4 bg-[#0B4B54] text-white rounded-2xl font-bold hover:bg-[#032A33] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#0B4B54]/20 flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>Submitting to Admin...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileCheck size={24} />
                                        <span>Submit Verification Request</span>
                                    </>
                                )}
                            </button>
                            <p className="mt-4 text-[10px] text-[#888888] font-bold uppercase tracking-[0.2em]">
                                Verification usually takes 1-2 business days
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </HirerLayout>
    );
};

export default HirerVerification;
