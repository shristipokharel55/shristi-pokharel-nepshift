import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HirerLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const { user, logout } = useAuth();

    const firstName = user?.fullName?.split(" ")[0] || "Employer";

    // Sample notifications data
    const notifications = [];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/hirer/dashboard', icon: 'ph-squares-four' },
        { name: 'Post a Shift', path: '/hirer/post-shift', icon: 'ph-plus-circle', highlighted: true },
        { name: 'Manage Jobs', path: '/hirer/manage-jobs', icon: 'ph-briefcase' },
        { name: 'Applicants', path: '/hirer/applicants', icon: 'ph-users' },
        { name: 'Payments', path: '/hirer/payments', icon: 'ph-credit-card' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hirer-dashboard flex min-h-screen bg-[#E0F0F3]">
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
                    flex flex-col z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    worker-scrollbar overflow-y-auto
                `}
            >
                {/* Logo Section */}
                <div className="px-6 py-6 flex items-center justify-between">
                    <Link to="/hirer/dashboard" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#0B4B54]/20 group-hover:shadow-[#0B4B54]/30 transition-shadow">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-2xl font-bold text-[#032A33] tracking-tight">Nepshift</span>
                    </Link>
                    <button
                        className="lg:hidden p-2 text-[#032A33] hover:bg-[#82ACAB]/20 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <i className="ph ph-x text-2xl"></i>
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-4">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => {
                            const active = isActive(item.path);

                            if (item.highlighted) {
                                return (
                                    <li key={item.path} className="pb-2">
                                        <Link
                                            to={item.path}
                                            className="
                                                flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl
                                                bg-[#0B4B54]
                                                text-white font-semibold
                                                shadow-lg shadow-[#0B4B54]/20
                                                hover:shadow-[#0B4B54]/40 hover:scale-[1.02]
                                                transition-all duration-200
                                                animate-slide-in-left
                                            "
                                            style={{ animationDelay: `${index * 30}ms` }}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <i className={`ph ${item.icon} text-xl`}></i>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            }

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl
                                            transition-all duration-200 group
                                            animate-slide-in-left
                                            ${active
                                                ? 'bg-[#1F4E5F] text-white shadow-md'
                                                : 'text-[#032A33] hover:bg-[#82ACAB]/20'
                                            }
                                        `}
                                        style={{ animationDelay: `${index * 30}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <i className={`ph ${item.icon} text-xl transition-transform duration-200 group-hover:scale-110`}></i>
                                        <span className={`font-medium`}>
                                            {item.name}
                                        </span>
                                        {active && (
                                            <i className="ph ph-caret-right ml-auto text-white/70"></i>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Dropdown (Footer) */}
                <div className="px-4 py-6 border-t border-[#82ACAB]/20" ref={userDropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className="
                                flex items-center gap-3 px-4 py-3 w-full rounded-xl
                                hover:bg-[#82ACAB]/20 
                                transition-all duration-200 group
                            "
                        >
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold shadow-lg shadow-[#0B4B54]/20">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-[#032A33]">{firstName}</p>
                                <p className="text-xs text-[#888888]">Employer</p>
                            </div>
                            <i className={`ph ph-caret-down text-lg text-[#888888] transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {isUserDropdownOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 py-2 bg-white rounded-xl shadow-lg border border-[#82ACAB]/20 animate-fade-in-up z-50">
                                <Link
                                    to="/hirer/profile"
                                    onClick={() => {
                                        setIsUserDropdownOpen(false);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[#032A33] hover:bg-[#D3E4E7]/50 transition-colors"
                                >
                                    <i className="ph ph-user text-lg text-[#0B4B54]"></i>
                                    <span>My Profile</span>
                                </Link>
                                <Link
                                    to="/hirer/settings"
                                    onClick={() => {
                                        setIsUserDropdownOpen(false);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[#032A33] hover:bg-[#D3E4E7]/50 transition-colors"
                                >
                                    <i className="ph ph-gear text-lg text-[#0B4B54]"></i>
                                    <span>Settings</span>
                                </Link>
                                <div className="my-2 border-t border-[#82ACAB]/20" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <i className="ph ph-sign-out text-lg"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 bg-[#E0F0F3]/90 backdrop-blur-md">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-[#032A33] hover:bg-[#82ACAB]/20 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <i className="ph ph-list text-2xl"></i>
                        </button>

                        {/* Centered Search Bar */}
                        <div className="hidden md:flex flex-1 justify-center mx-8">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search applicants, jobs..."
                                    className="
                                        w-full px-5 py-3 pl-12 rounded-full
                                        bg-white border-0 shadow-sm
                                        text-[#222222] placeholder-[#888888]
                                        focus:outline-none focus:ring-2 focus:ring-[#0B4B54]/20
                                        transition-all duration-200
                                    "
                                />
                                <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#888888]"></i>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => {
                                        setIsNotificationOpen(!isNotificationOpen);
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="
                                        relative p-3 rounded-full 
                                        bg-white hover:bg-gray-50 
                                        text-[#0B4B54] 
                                        transition-all duration-200
                                        shadow-sm hover:shadow-md
                                    "
                                >
                                    <i className="ph ph-bell text-xl"></i>
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#82ACAB]/10 animate-fade-in-up z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-[#032A33]">Notifications</h3>
                                                <button className="text-xs text-[#0B4B54] hover:underline">Mark all as read</button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${notification.unread ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#E0F2F1] flex items-center justify-center shrink-0">
                                                            <i className="ph ph-info text-[#00695C]"></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-[#032A33] text-sm">{notification.title}</p>
                                                            <p className="text-[#888888] text-xs mt-0.5 truncate">{notification.message}</p>
                                                            <p className="text-[#82ACAB] text-[10px] mt-1">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 bg-gray-50 text-center">
                                            <button
                                                onClick={() => {
                                                    navigate('/hirer/notifications');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="text-sm text-[#0B4B54] font-medium hover:underline"
                                            >
                                                View all
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile (Header Icon) */}
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => {
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                        setIsNotificationOpen(false);
                                    }}
                                    className="
                                        w-10 h-10 rounded-full 
                                        gradient-primary
                                        flex items-center justify-center 
                                        text-white font-semibold
                                        shadow-md hover:shadow-lg
                                        hover:scale-105 transition-all duration-200
                                    "
                                >
                                    {firstName.charAt(0).toUpperCase()}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#82ACAB]/20 animate-fade-in-up z-50 py-2">
                                        <button
                                            onClick={() => {
                                                navigate('/hirer/profile');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 w-full text-[#032A33] hover:bg-[#D3E4E7]/50 transition-colors"
                                        >
                                            <i className="ph ph-user text-lg text-[#0B4B54]"></i>
                                            <span>My Profile</span>
                                        </button>
                                        <div className="my-2 border-t border-[#82ACAB]/20" />
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <i className="ph ph-sign-out text-lg"></i>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default HirerLayout;
