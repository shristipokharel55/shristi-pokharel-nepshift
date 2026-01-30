import {
    Bell,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronRight,
    DollarSign,
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    Star,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const WorkerLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const firstName = user?.fullName?.split(" ")[0] || "Worker";

    const navItems = [
        { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/worker/profile', icon: User },
        { name: 'Availability & Schedule', path: '/worker/availability', icon: Calendar },
        { name: 'Nearby Jobs', path: '/worker/nearby-jobs', icon: MapPin },
        { name: 'Job Requests', path: '/worker/job-requests', icon: FileText },
        { name: 'Active Jobs', path: '/worker/active-jobs', icon: Briefcase },
        { name: 'Completed Jobs', path: '/worker/completed-jobs', icon: CheckCircle },
        { name: 'Earnings & Payments', path: '/worker/earnings', icon: DollarSign },
        { name: 'Ratings & Reviews', path: '/worker/ratings', icon: Star },
        { name: 'Notifications', path: '/worker/notifications', icon: Bell },
        { name: 'Support / Help', path: '/worker/support', icon: HelpCircle },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="worker-dashboard flex min-h-screen">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Vertical Sidebar Navigation */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 
          bg-[#D3E4E7]/30 backdrop-blur-sm
          flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          worker-scrollbar overflow-y-auto
        `}
            >
                {/* Logo Section */}
                <div className="px-6 py-6 flex items-center justify-between">
                    <Link to="/worker/dashboard" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#0B4B54]/20 group-hover:shadow-[#0B4B54]/30 transition-shadow">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-2xl font-bold text-[#032A33] tracking-tight">Nepshift</span>
                    </Link>
                    <button
                        className="lg:hidden p-2 text-[#032A33] hover:bg-[#82ACAB]/20 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200 group
                      animate-slide-in-left
                      ${active
                                                ? 'bg-[#0B4B54] text-white shadow-lg shadow-[#0B4B54]/20'
                                                : 'text-[#032A33] hover:bg-[#82ACAB]/20'
                                            }
                    `}
                                        style={{ animationDelay: `${index * 30}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Icon
                                            size={20}
                                            className={`
                        transition-transform duration-200 
                        ${active ? 'text-white' : 'text-[#0B4B54]'}
                        group-hover:scale-110
                      `}
                                        />
                                        <span className={`font-medium ${active ? 'text-white' : ''}`}>
                                            {item.name}
                                        </span>
                                        {active && (
                                            <ChevronRight size={16} className="ml-auto text-[#82ACAB]" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="px-4 py-6 border-t border-[#82ACAB]/20">
                    <button
                        onClick={handleLogout}
                        className="
              flex items-center gap-3 px-4 py-3 w-full rounded-xl
              text-red-500 hover:bg-red-50 
              transition-all duration-200 group
            "
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 bg-[#D3E4E7]/50 backdrop-blur-md">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-[#032A33] hover:bg-[#82ACAB]/20 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Search Bar (Optional placeholder) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search jobs, workers..."
                                    className="
                    w-full px-5 py-2.5 pl-12 rounded-xl
                    bg-white/80 border border-[#82ACAB]/30
                    text-[#222222] placeholder-[#888888]
                    focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10
                    transition-all duration-200
                  "
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="
                relative p-3 rounded-xl 
                bg-white/60 hover:bg-white 
                text-[#0B4B54] 
                transition-all duration-200
                shadow-sm hover:shadow-md
              ">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                    3
                                </span>
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center gap-3 pl-4 border-l border-[#82ACAB]/30">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-[#032A33]">{firstName}</p>
                                    <p className="text-xs text-[#888888]">Helper</p>
                                </div>
                                <button
                                    onClick={() => navigate('/worker/profile')}
                                    className="
                    w-10 h-10 rounded-xl 
                    gradient-primary
                    flex items-center justify-center 
                    text-white font-semibold
                    shadow-lg shadow-[#0B4B54]/20
                    hover:scale-105 transition-transform duration-200
                  "
                                >
                                    {firstName.charAt(0).toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default WorkerLayout;
