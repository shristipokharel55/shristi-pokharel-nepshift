// frontend/src/pages/worker/AppliedShifts.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import WorkerLayout from "../../components/worker/WorkerLayout";

const AppliedShifts = () => {
  // State to store the applications data
  const [applications, setApplications] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // useEffect runs when component mounts (loads for the first time)
  useEffect(() => {
    // Function to fetch applications from backend
    const fetchApplications = async () => {
      try {
        setLoading(true); // Show loading indicator

        // Make API call to get worker's applications
        const response = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          {
            withCredentials: true, // Send cookies with request for authentication
          }
        );

        // Store the applications in state
        setApplications(response.data.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        // If something goes wrong, store the error message
        console.error("Error fetching applications:", err);
        setError(
          err.response?.data?.message || "Failed to load applications"
        );
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    // Call the function
    fetchApplications();
  }, []); // Empty array means this runs only once when component loads

  // Function to get the color for each status
  const getStatusColor = (status) => {
    // Return different Tailwind classes based on status
    if (status === "pending") return "text-yellow-600 bg-yellow-50"; // Yellow for pending
    if (status === "approved") return "text-green-600 bg-green-50"; // Green for approved
    if (status === "rejected") return "text-red-600 bg-red-50"; // Red for rejected
    return "text-gray-600 bg-gray-50"; // Default gray
  };

  // Function to format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <WorkerLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Track the status of your shift applications
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54]"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Check if there are any applications */}
            {applications.length === 0 ? (
              // Show this if no applications found
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  You haven't applied for any shifts yet
                </p>
                <p className="text-gray-400 mt-2">
                  Start browsing available shifts to apply
                </p>
              </div>
            ) : (
              // Show this if applications exist
              applications.map((application) => (
                // Card for each application
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    {/* Left side - Shift details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {application.shift?.title || "Shift Title"}
                      </h3>

                      {/* Shift Date */}
                      {application.shift?.shiftDate && (
                        <p className="text-gray-600 mb-1">
                          📅 Shift Date:{" "}
                          {formatDate(application.shift.shiftDate)}
                        </p>
                      )}

                      {/* Location */}
                      {application.shift?.location && (
                        <p className="text-gray-600 mb-1">
                          📍 Location: {application.shift.location}
                        </p>
                      )}

                      {/* Hourly Rate */}
                      {application.shift?.hourlyRate && (
                        <p className="text-gray-600 mb-1">
                          💰 Rate: Rs. {application.shift.hourlyRate}/hour
                        </p>
                      )}

                      {/* Applied Date */}
                      <p className="text-gray-500 text-sm mt-3">
                        Applied on: {formatDate(application.appliedAt)}
                      </p>
                    </div>

                    {/* Right side - Status badge */}
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm uppercase ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && applications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Applications */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-blue-600 text-2xl font-bold">
                {applications.length}
              </p>
              <p className="text-blue-800 font-medium">Total Applications</p>
            </div>

            {/* Pending Applications */}
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-yellow-600 text-2xl font-bold">
                {
                  applications.filter((app) => app.status === "pending")
                    .length
                }
              </p>
              <p className="text-yellow-800 font-medium">Pending</p>
            </div>

            {/* Approved Applications */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-green-600 text-2xl font-bold">
                {
                  applications.filter((app) => app.status === "approved")
                    .length
                }
              </p>
              <p className="text-green-800 font-medium">Approved</p>
            </div>
          </div>
        )}
      </div>
    </WorkerLayout>
  );
};

export default AppliedShifts;
