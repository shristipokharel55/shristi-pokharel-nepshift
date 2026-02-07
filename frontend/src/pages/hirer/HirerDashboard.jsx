import { Briefcase, Calendar, CheckCircle, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import VerifiedBadge from "../../components/ui/VerifiedBadge";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

// Stat Card Component  
const StatCard = ({ title, value, icon, trend, trendValue, delay }) => (
  <div
    className="bg-white rounded-2xl p-6 shadow-sm border border-[#82ACAB]/20 hover:shadow-md transition-all animate-fade-in-up opacity-0"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-linear-to-br from-[#0B4B54] to-[#0D5A65]">
        <i className={`ph ${icon} text-2xl text-white`}></i>
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
        >
          <i className={`ph ${trend === "up" ? "ph-trend-up" : "ph-trend-down"} font-bold`}></i>
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold text-[#032A33] mb-1">{value}</h3>
    <p className="text-[#888888] font-medium">{title}</p>
  </div>
);

export default function HirerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State to store the hirer's posted shifts
  const [myShifts, setMyShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    isVerified: false,
    verificationStatus: 'unverified',
    totalHires: 0,
    memberSince: null
  });
  const [stats, setStats] = useState({
    totalShifts: 0,
    openShifts: 0,
    totalApplicants: 0,
    completedShifts: 0,
  });

  const firstName = user?.fullName?.split(" ")[0] || "Employer";

  // Fetch my shifts and profile data when component loads
  useEffect(() => {
    fetchMyShifts();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get("/helper/hirer/profile");
      if (response.data.success) {
        const { user: userData, stats: profileStats } = response.data.data;
        setProfileData({
          isVerified: userData.isVerified || false,
          verificationStatus: userData.verificationStatus || 'unverified',
          totalHires: userData.totalHires || 0,
          memberSince: profileStats.memberSince || userData.joinedAt || userData.createdAt
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const fetchMyShifts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/shifts/my-shifts");

      if (response.data.success) {
        const shifts = response.data.data;
        setMyShifts(shifts);

        // Calculate statistics from the shifts
        const totalApplicants = shifts.reduce((sum, shift) => sum + shift.applicants.length, 0);
        const openShifts = shifts.filter((s) => s.status === "open").length;
        const completedShifts = shifts.filter((s) => s.status === "completed").length;

        setStats({
          totalShifts: shifts.length,
          openShifts,
          totalApplicants,
          completedShifts,
        });
      }
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <HirerLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#032A33] mb-2">
                {getGreeting()}, <span className="text-[#0B4B54]">{firstName}</span>! 👋
              </h1>
              <p className="text-[#888888] font-medium">Here's what's happening with your shifts today</p>
            </div>
            <button
              onClick={() => navigate("/hirer/post-shift")}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#0B4B54] to-[#0F6974] text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <i className="ph ph-plus-circle text-lg"></i>
              Post a Shift
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Shifts */}
          <StatCard title="Total Shifts" value={stats.totalShifts} icon="ph-briefcase" delay={100} />

          {/* Open Shifts */}
          <StatCard title="Open Shifts" value={stats.openShifts} icon="ph-clock-countdown" delay={200} />

          {/* Total Applicants */}
          <StatCard
            title="Total Applicants"
            value={stats.totalApplicants}
            icon="ph-users"
            trend="up"
            trendValue={`${stats.totalApplicants} total`}
            delay={300}
          />

          {/* Completed Shifts */}
          <StatCard title="Completed" value={stats.completedShifts} icon="ph-check-circle" delay={400} />
        </div>

        {/* Trust Indicators Card */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-[#032A33]">{user?.fullName}</h3>
                  <VerifiedBadge isVerified={profileData.isVerified} size="sm" variant="badge" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#888888]">
                  {profileData.totalHires > 0 ? (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-[#032A33]">{profileData.totalHires}</span> Total Hires
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-[#032A33]">New Hirer {profileData.isVerified && '- Identity Verified'}. Ready to post first shift!</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member Since {new Date(profileData.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  {profileData.isVerified && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      Identity Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!profileData.isVerified && (
              <button
                onClick={() => navigate("/hirer/profile/edit")}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Shield className="w-5 h-5" />
                Get Verified
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Post New Shift Card */}
          <Link
            to="/hirer/post-shift"
            className="bg-linear-to-r from-[#0B4B54] to-[#0F6974] rounded-xl shadow-sm p-6 text-white hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Post a New Shift</h3>
                <p className="text-white/80">Find the right worker for your job</p>
              </div>
              <i className="ph ph-arrow-right text-3xl group-hover:translate-x-1 transition"></i>
            </div>
          </Link>

          {/* Browse Workers Card */}
          <Link
            to="/hirer/workers"
            className="bg-white rounded-xl shadow-sm p-6 border border-[#82ACAB]/20 hover:border-[#0B4B54] transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#032A33]">Browse Workers</h3>
                <p className="text-[#888888]">View and contact available workers</p>
              </div>
              <i className="ph ph-arrow-right text-3xl text-[#888888] group-hover:text-[#0B4B54] group-hover:translate-x-1 transition"></i>
            </div>
          </Link>
        </div>

        {/* Your Recent Shifts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#82ACAB]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#032A33] flex items-center gap-2">
              <i className="ph ph-clock-countdown text-[#0B4B54]"></i>
              Your Recent Shifts
            </h2>
            <Link to="/hirer/manage-jobs" className="text-[#0B4B54] hover:text-[#0D5A65] font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            // Loading state
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54] mx-auto"></div>
              <p className="text-[#888888] mt-4">Loading your shifts...</p>
            </div>
          ) : myShifts.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <i className="ph ph-briefcase text-6xl text-[#82ACAB] mb-4"></i>
              <h3 className="text-lg font-medium text-[#032A33] mb-2">No shifts posted yet</h3>
              <p className="text-[#888888] mb-6">Get started by posting your first shift</p>
              <button
                onClick={() => navigate("/hirer/post-shift")}
                className="inline-block bg-[#0B4B54] text-white px-6 py-3 rounded-lg hover:bg-[#0D5A65] transition"
              >
                Post Your First Shift
              </button>
            </div>
          ) : (
            // Shifts list
            <div className="space-y-4">
              {myShifts.slice(0, 5).map((shift, idx) => (
                <div
                  key={shift._id}
                  className="border border-[#82ACAB]/20 rounded-xl p-4 hover:border-[#0B4B54] transition animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${500 + idx * 50}ms`, animationFillMode: "forwards" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#032A33]">{shift.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${shift.status === "open"
                              ? "bg-green-100 text-green-700"
                              : shift.status === "completed"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {shift.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#888888] mb-3">
                        <div className="flex items-center gap-1">
                          <i className="ph ph-calendar"></i>
                          {formatDate(shift.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ph ph-clock"></i>
                          {shift.time.start} - {shift.time.end}
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ph ph-map-pin"></i>
                          {shift.location.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ph ph-currency-dollar"></i>
                          NPR {shift.pay.min} - {shift.pay.max}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <i className="ph ph-users text-[#82ACAB]"></i>
                        <span className="text-[#888888]">
                          {shift.applicants.length} applicant{shift.applicants.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/hirer/shift/${shift._id}`}
                      className="text-[#0B4B54] hover:text-[#0D5A65] font-medium text-sm ml-4"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HirerLayout>
  );
}
