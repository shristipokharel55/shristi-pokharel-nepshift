import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, open, completed, cancelled

  useEffect(() => {
    fetchShifts();
  }, [filter]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      // If filter is "all", don't send status param
      const url = filter === "all" ? "/shifts/my-shifts" : `/shifts/my-shifts?status=${filter}`;
      const response = await api.get(url);

      if (response.data.success) {
        setShifts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <HirerLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#032A33]">Manage Shifts</h1>
            <p className="text-[#888888] mt-2">View and manage all your posted shifts</p>
          </div>
          <Link
            to="/hirer/post-shift"
            className="bg-[#0B4B54] text-white px-6 py-3 rounded-lg hover:bg-[#0D5A65] transition flex items-center gap-2"
          >
            <i className="ph ph-plus-circle text-lg"></i>
            Post New Shift
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-[#82ACAB]/20">
          <div className="flex items-center gap-4">
            <i className="ph ph-funnel text-xl text-[#888888]"></i>
            <div className="flex gap-2">
              {["all", "open", "in-progress", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                      ? "bg-[#0B4B54] text-white"
                      : "bg-[#D3E4E7] text-[#032A33] hover:bg-[#82ACAB]/30"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shifts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54] mx-auto"></div>
            <p className="text-[#888888] mt-4">Loading shifts...</p>
          </div>
        ) : shifts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#82ACAB]/20">
            <i className="ph ph-briefcase text-6xl text-[#82ACAB] mb-4"></i>
            <h3 className="text-lg font-medium text-[#032A33] mb-2">No shifts found</h3>
            <p className="text-[#888888]">
              {filter === "all" ? "You haven't posted any shifts yet" : `No ${filter} shifts`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {shifts.map((shift) => (
              <div
                key={shift._id}
                className="bg-white rounded-xl shadow-sm p-6 border border-[#82ACAB]/20 hover:border-[#0B4B54] transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#032A33]">{shift.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${shift.status === "open"
                            ? "bg-green-100 text-green-700"
                            : shift.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : shift.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                          }`}
                      >
                        {shift.status}
                      </span>
                    </div>
                    <p className="text-[#888888]">{shift.description}</p>
                  </div>
                  <span className="bg-[#D3E4E7] text-[#0B4B54] px-3 py-1 rounded-full text-sm font-medium">
                    {shift.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-calendar text-lg"></i>
                    <span className="text-sm">{formatDate(shift.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-clock text-lg"></i>
                    <span className="text-sm">
                      {shift.time.start} - {shift.time.end}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-map-pin text-lg"></i>
                    <span className="text-sm">{shift.location.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-currency-dollar text-lg"></i>
                    <span className="text-sm">
                      NPR {shift.pay.min} - {shift.pay.max}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#82ACAB]/20">
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-users text-xl"></i>
                    <span className="font-medium">
                      {shift.applicants.length} applicant{shift.applicants.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Link
                    to={`/hirer/shift/${shift._id}`}
                    className="text-[#0B4B54] hover:text-[#0D5A65] font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HirerLayout>
  );
}
