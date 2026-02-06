// frontend/src/pages/hirer/ViewApplicants.jsx
import axios from "axios";
import { CheckCircle, Clock, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";

const ViewApplicants = () => {
  // Get shiftId from URL (e.g., /hirer/applicants/:shiftId)
  const { shiftId } = useParams();

  // State to store applicants data
  const [applicants, setApplicants] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);
  // State to track which button is being clicked
  const [processingId, setProcessingId] = useState(null);

  // Fetch applicants when component loads
  useEffect(() => {
    fetchApplicants();
  }, [shiftId]);

  // Function to get applicants from backend
  const fetchApplicants = async () => {
    try {
      setLoading(true);

      // Make API call to get applicants for this shift
      const response = await axios.get(
        `http://localhost:5000/api/applications/shift/${shiftId}`,
        {
          withCredentials: true, // Send cookies for authentication
        }
      );

      // Store applicants in state
      setApplicants(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError(err.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Accept button click
  const handleAccept = async (applicationId) => {
    try {
      setProcessingId(applicationId); // Show loading on this button

      // Make API call to update status to 'approved'
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: "approved" },
        { withCredentials: true }
      );

      // Update the UI: Change status in the applicants array
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status: "approved" } : app
        )
      );

      alert("Applicant approved successfully!");
    } catch (err) {
      console.error("Error approving applicant:", err);
      alert(err.response?.data?.message || "Failed to approve applicant");
    } finally {
      setProcessingId(null); // Remove loading indicator
    }
  };

  // Function to handle Reject button click
  const handleReject = async (applicationId) => {
    try {
      setProcessingId(applicationId); // Show loading on this button

      // Make API call to update status to 'rejected'
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: "rejected" },
        { withCredentials: true }
      );

      // Update the UI: Change status in the applicants array
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status: "rejected" } : app
        )
      );

      alert("Applicant rejected");
    } catch (err) {
      console.error("Error rejecting applicant:", err);
      alert(err.response?.data?.message || "Failed to reject applicant");
    } finally {
      setProcessingId(null); // Remove loading indicator
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status) => {
    // Return different styled badges based on status
    if (status === "pending") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <Clock size={14} />
          Pending
        </span>
      );
    }
    if (status === "approved") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <CheckCircle size={14} />
          Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <HirerLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shift Applicants
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage workers who applied for this shift
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54]"></div>
            <p className="mt-4 text-gray-600">Loading applicants...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Applicants List */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Check if there are any applicants */}
            {applicants.length === 0 ? (
              // Show this if no applicants
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <User className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg">
                  No applicants for this shift yet
                </p>
                <p className="text-gray-400 mt-2">
                  Workers will appear here when they apply
                </p>
              </div>
            ) : (
              // Show applicants
              <div className="grid gap-4">
                {applicants.map((application) => (
                  // Card for each applicant
                  <div
                    key={application._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left side - Worker details */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Profile Picture or Initial */}
                        <div className="w-16 h-16 bg-[#0B4B54] rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {application.worker?.fullName?.charAt(0) || "W"}
                        </div>

                        {/* Worker Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.worker?.fullName || "Worker Name"}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Role: {application.worker?.role || "helper"}
                          </p>
                          <p className="text-gray-600 mb-2">
                            📧 Email: {application.worker?.email || "N/A"}
                          </p>
                          {application.worker?.phone && (
                            <p className="text-gray-600 mb-2">
                              📞 Phone: {application.worker.phone}
                            </p>
                          )}
                          <p className="text-gray-500 text-sm mt-3">
                            Applied on: {formatDate(application.appliedAt)}
                          </p>

                          {/* View Profile Link */}
                          <a
                            href={`/hirer/worker/${application.worker?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0B4B54] hover:underline text-sm font-medium mt-2 inline-block"
                          >
                            View Full Profile →
                          </a>
                        </div>
                      </div>

                      {/* Right side - Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        {getStatusBadge(application.status)}

                        {/* Action Buttons - Only show if status is pending */}
                        {application.status === "pending" && (
                          <div className="flex gap-2 mt-2">
                            {/* Accept Button */}
                            <button
                              onClick={() => handleAccept(application._id)}
                              disabled={processingId === application._id}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingId === application._id
                                ? "Processing..."
                                : "Accept"}
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => handleReject(application._id)}
                              disabled={processingId === application._id}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingId === application._id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && applicants.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Applicants */}
            <div className="bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-blue-600 text-3xl font-bold">
                {applicants.length}
              </p>
              <p className="text-blue-800 font-medium mt-1">
                Total Applicants
              </p>
            </div>

            {/* Pending Count */}
            <div className="bg-yellow-50 rounded-lg p-5 text-center">
              <p className="text-yellow-600 text-3xl font-bold">
                {applicants.filter((app) => app.status === "pending").length}
              </p>
              <p className="text-yellow-800 font-medium mt-1">
                Pending Review
              </p>
            </div>

            {/* Approved Count */}
            <div className="bg-green-50 rounded-lg p-5 text-center">
              <p className="text-green-600 text-3xl font-bold">
                {applicants.filter((app) => app.status === "approved").length}
              </p>
              <p className="text-green-800 font-medium mt-1">Approved</p>
            </div>
          </div>
        )}
      </div>
    </HirerLayout>
  );
};

export default ViewApplicants;
