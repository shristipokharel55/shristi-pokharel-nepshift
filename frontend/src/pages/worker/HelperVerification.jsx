// src/pages/worker/HelperVerification.jsx
import {
    AlertCircle,
    Camera,
    CheckCircle,
    Clock,
    CreditCard,
    FileCheck,
    Loader2,
    Shield,
    Upload,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import WorkerLayout from "../../components/worker/WorkerLayout";
import api from "../../utils/api";

const HelperVerification = () => {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  
  const [verificationData, setVerificationData] = useState({
    citizenshipNumber: "",
    citizenshipFrontImage: null,
    citizenshipBackImage: null,
    frontPreview: null,
    backPreview: null
  });

  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    status: 'pending',
    rejectionReason: null,
    hasSubmittedDocuments: false
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/helper/verification-status");
      if (res.data.success) {
        setVerificationStatus(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching verification status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setVerificationData(prev => ({
        ...prev,
        [side === 'front' ? 'frontPreview' : 'backPreview']: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      if (side === 'front') setUploadingFront(true);
      else setUploadingBack(true);

      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post("/helper/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setVerificationData(prev => ({
          ...prev,
          [side === 'front' ? 'citizenshipFrontImage' : 'citizenshipBackImage']: res.data.data.url
        }));
        toast.success(`${side === 'front' ? 'Front' : 'Back'} image uploaded`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
      // Clear preview on error
      setVerificationData(prev => ({
        ...prev,
        [side === 'front' ? 'frontPreview' : 'backPreview']: null
      }));
    } finally {
      if (side === 'front') setUploadingFront(false);
      else setUploadingBack(false);
    }
  };

  const handleRemoveImage = (side) => {
    setVerificationData(prev => ({
      ...prev,
      [side === 'front' ? 'citizenshipFrontImage' : 'citizenshipBackImage']: null,
      [side === 'front' ? 'frontPreview' : 'backPreview']: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationData.citizenshipNumber.trim()) {
      toast.error("Please enter your citizenship number");
      return;
    }

    if (!verificationData.citizenshipFrontImage) {
      toast.error("Please upload the front of your citizenship");
      return;
    }

    if (!verificationData.citizenshipBackImage) {
      toast.error("Please upload the back of your citizenship");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/helper/verify", {
        citizenshipNumber: verificationData.citizenshipNumber,
        citizenshipFrontImage: verificationData.citizenshipFrontImage,
        citizenshipBackImage: verificationData.citizenshipBackImage
      });

      if (res.data.success) {
        toast.success("Verification documents submitted successfully!");
        setVerificationStatus({
          ...verificationStatus,
          status: 'pending',
          hasSubmittedDocuments: true
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  const ImageUploadBox = ({ side, preview, imageUrl, uploading }) => (
    <div className="relative">
      <input
        type="file"
        ref={side === 'front' ? frontInputRef : backInputRef}
        onChange={(e) => handleFileChange(e, side)}
        accept="image/*"
        className="hidden"
      />
      
      {preview || imageUrl ? (
        <div className="relative group">
          <img
            src={preview || imageUrl}
            alt={`Citizenship ${side}`}
            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(side)}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700">
            {side === 'front' ? 'Front Side' : 'Back Side'}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => (side === 'front' ? frontInputRef : backInputRef).current?.click()}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#4A9287] hover:bg-[#4A9287]/5 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-[#4A9287] animate-spin" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Camera size={24} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">
                  {side === 'front' ? 'Citizenship Front' : 'Citizenship Back'}
                </p>
                <p className="text-sm text-gray-400">Click to upload</p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <WorkerLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9287]" />
        </div>
      </WorkerLayout>
    );
  }

  // Already verified
  if (verificationStatus.isVerified) {
    return (
      <WorkerLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Verified!</h2>
            <p className="text-gray-500 mb-6">
              Your identity has been verified. You can now bid on shifts and accept jobs.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium">
              <Shield size={18} />
              Verified Helper
            </div>
          </div>
        </div>
      </WorkerLayout>
    );
  }

  // Verification pending
  if (verificationStatus.hasSubmittedDocuments && verificationStatus.status === 'pending') {
    return (
      <WorkerLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Under Review</h2>
            <p className="text-gray-500 mb-6">
              Your documents have been submitted and are being reviewed by our team.
              This usually takes 1-2 business days.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full font-medium">
              <Clock size={18} />
              Pending Review
            </div>
          </div>
        </div>
      </WorkerLayout>
    );
  }

  // Verification rejected
  if (verificationStatus.status === 'rejected') {
    return (
      <WorkerLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Rejected</h2>
            <p className="text-gray-500 mb-4">
              Unfortunately, your verification was not approved.
            </p>
            {verificationStatus.rejectionReason && (
              <div className="p-4 bg-red-50 rounded-xl text-left mb-6">
                <p className="text-sm font-medium text-red-700">Reason:</p>
                <p className="text-red-600">{verificationStatus.rejectionReason}</p>
              </div>
            )}
            <p className="text-gray-500 mb-6">
              Please submit new documents below to try again.
            </p>
          </div>

          {/* Show form again for rejected users */}
          <VerificationForm 
            verificationData={verificationData}
            setVerificationData={setVerificationData}
            handleSubmit={handleSubmit}
            submitting={submitting}
            uploadingFront={uploadingFront}
            uploadingBack={uploadingBack}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
            frontInputRef={frontInputRef}
            backInputRef={backInputRef}
            ImageUploadBox={ImageUploadBox}
          />
        </div>
      </WorkerLayout>
    );
  }

  // Initial verification form
  return (
    <WorkerLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#032A33]">
            Identity Verification
          </h1>
          <p className="text-gray-500 mt-2">
            Verify your identity to start bidding on shifts
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Why verify?</p>
            <p className="text-blue-600 text-sm">
              Verified helpers can bid on shifts and are trusted by hirers. 
              Your documents are securely stored and only used for verification.
            </p>
          </div>
        </div>

        <VerificationForm 
          verificationData={verificationData}
          setVerificationData={setVerificationData}
          handleSubmit={handleSubmit}
          submitting={submitting}
          uploadingFront={uploadingFront}
          uploadingBack={uploadingBack}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          frontInputRef={frontInputRef}
          backInputRef={backInputRef}
          ImageUploadBox={ImageUploadBox}
        />
      </div>
    </WorkerLayout>
  );
};

// Extracted form component
const VerificationForm = ({
  verificationData,
  setVerificationData,
  handleSubmit,
  submitting,
  uploadingFront,
  uploadingBack,
  ImageUploadBox
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Citizenship Number */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#4A9287]/10 flex items-center justify-center">
          <CreditCard size={20} className="text-[#4A9287]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Citizenship Number</h3>
          <p className="text-sm text-gray-500">Enter your citizenship card number</p>
        </div>
      </div>
      <input
        type="text"
        value={verificationData.citizenshipNumber}
        onChange={(e) => setVerificationData(prev => ({ ...prev, citizenshipNumber: e.target.value }))}
        placeholder="e.g., 123-456-78901"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287]"
      />
    </div>

    {/* Document Upload */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Upload size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Citizenship Photos</h3>
          <p className="text-sm text-gray-500">Upload clear photos of both sides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploadBox
          side="front"
          preview={verificationData.frontPreview}
          imageUrl={verificationData.citizenshipFrontImage}
          uploading={uploadingFront}
        />
        <ImageUploadBox
          side="back"
          preview={verificationData.backPreview}
          imageUrl={verificationData.citizenshipBackImage}
          uploading={uploadingBack}
        />
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Accepted formats: JPG, PNG, WebP. Max size: 5MB per image.
      </p>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={submitting || uploadingFront || uploadingBack}
      className="w-full py-4 bg-[#4A9287] text-white rounded-xl font-semibold hover:bg-[#407C74] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#4A9287]/20"
    >
      {submitting ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <FileCheck size={20} />
          Submit for Verification
        </>
      )}
    </button>
  </form>
);

export default HelperVerification;
