// frontend/src/pages/hirer/WorkerProfileView.jsx
import axios from "axios";
import { Award, Briefcase, CheckCircle, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";

const WorkerProfileView = () => {
  // useParams() is a React Router hook that extracts parameters from the URL
  // For example, if the URL is /hirer/worker/123abc, then id = "123abc"
  const { id } = useParams();

  // State to store worker profile data
  const [worker, setWorker] = useState(null);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // useEffect runs when component loads or when 'id' changes
  useEffect(() => {
    // Function to fetch worker profile from backend
    const fetchWorkerProfile = async () => {
      try {
        setLoading(true);

        // Make API call to get worker's public profile
        // The ${id} in the URL comes from useParams() above
        const response = await axios.get(
          `http://localhost:5000/api/users/worker/${id}`
        );

        // Store the worker data in state
        setWorker(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching worker profile:", err);
        setError(err.response?.data?.message || "Failed to load worker profile");
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch data
    fetchWorkerProfile();
  }, [id]); // Re-run this effect if the 'id' changes

  // Function to format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <HirerLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54]"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Worker Profile Content */}
        {!loading && !error && worker && (
          <div className="space-y-6">
            {/* Header Section with Name and Verified Badge */}
            <div className="bg-gradient-to-r from-[#0B4B54] to-[#155e63] text-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  {/* Profile Picture */}
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#0B4B54] text-3xl font-bold shadow-lg">
                    {worker.profilePhoto ? (
                      <img
                        src={worker.profilePhoto}
                        alt={worker.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      worker.fullName.charAt(0)
                    )}
                  </div>

                  {/* Name and Category */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{worker.fullName}</h1>
                      {/* Verified Badge - Only show if worker is verified */}
                      {worker.isVerified && (
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                          <CheckCircle size={16} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-blue-100">{worker.skillCategory}</p>
                    <p className="text-sm text-blue-200 mt-1">
                      Member since {formatDate(worker.memberSince)}
                    </p>
                  </div>
                </div>

                {/* Availability Badge */}
                <div>
                  {/* Show BOOKED badge if worker has upcoming approved applications */}
                  {worker.hasUpcomingBooking ? (
                    <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold">
                      Booked
                    </span>
                  ) : worker.isAvailable ? (
                    <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-semibold">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Experience */}
              <div className="bg-white rounded-lg p-4 shadow-md text-center border border-gray-100">
                <div className="flex justify-center mb-2">
                  <Briefcase className="text-[#0B4B54]" size={28} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{worker.yearsOfExperience}</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>

              {/* Jobs Completed */}
              <div className="bg-white rounded-lg p-4 shadow-md text-center border border-gray-100">
                <div className="flex justify-center mb-2">
                  <Award className="text-[#0B4B54]" size={28} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{worker.totalJobsCompleted}</p>
                <p className="text-sm text-gray-600">Jobs Completed</p>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-lg p-4 shadow-md text-center border border-gray-100">
                <div className="flex justify-center mb-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={28} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {worker.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">
                  {worker.totalRatings} Reviews
                </p>
              </div>

              {/* Hourly Rate */}
              <div className="bg-white rounded-lg p-4 shadow-md text-center border border-gray-100">
                <div className="flex justify-center mb-2">
                  <Clock className="text-[#0B4B54]" size={28} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {worker.hourlyRate}
                </p>
                <p className="text-sm text-gray-600">Per Hour</p>
              </div>
            </div>

            {/* About Me Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-[#0B4B54] rounded"></div>
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{worker.aboutMe}</p>
            </div>

            {/* Experience & Skills Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-[#0B4B54] rounded"></div>
                Experience & Skills
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Primary Skill</p>
                    <p className="text-gray-600">{worker.skillCategory}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Years of Experience</p>
                    <p className="text-gray-600">{worker.yearsOfExperience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Rating</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(Math.round(worker.averageRating))}</div>
                      <span className="text-gray-600">
                        ({worker.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-[#0B4B54] rounded"></div>
                Location
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{worker.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">City</p>
                    <p className="text-gray-600">{worker.location.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-[#0B4B54] rounded"></div>
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="text-[#0B4B54]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">{worker.email}</p>
                  </div>
                </div>
                {worker.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-[#0B4B54]" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">{worker.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </HirerLayout>
  );
};

export default WorkerProfileView;
