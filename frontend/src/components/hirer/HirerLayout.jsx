import {
    Bell,
    Briefcase,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Settings,
    User,
    Users,
    X,
    XCircle
} from 'lucide-react';
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

    // Sample notifications data with types for color coding
    const notifications = [
        { id: 1, title: 'New applicant', message: 'Ram Sharma applied for Kitchen Helper', time: '5 min ago', unread: true, type: 'info' },
        { id: 2, title: 'Shift completed', message: 'Kitchen Helper shift completed successfully', time: '1 hour ago', unread: true, type: 'success' },
        { id: 3, title: 'Payment processed', message: 'Rs 1,200 released to worker', time: '2 hours ago', unread: true, type: 'success' },
        { id: 4, title: 'Shift starting soon', message: 'Event Staff shift starts in 2 hours', time: '1 day ago', unread: false, type: 'warning' },
    ];

    // Get notification icon color based on type
    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-100 text-emerald-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'error': return 'bg-red-100 text-red-600';
            case 'info': 
            default: return 'bg-blue-100 text-blue-600';
        }
    };

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
        { name: 'Dashboard', path: '/hirer/dashboard', icon: LayoutDashboard },
        { name: 'Post a Shift', path: '/hirer/post-shift', icon: Plus, highlighted: true },
        { name: 'Manage Jobs', path: '/hirer/manage-jobs', icon: Briefcase },
        { name: 'Applicants', path: '/hirer/applicants', icon: Users },
        { name: 'Payments', path: '/hirer/payments', icon: CreditCard },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hirer-dashboard flex min-h-screen">
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
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            if (item.highlighted) {
                                return (
                                    <li key={item.path} className="pt-2 pb-3">
                                        <Link
                                            to={item.path}
                                            className="
                                                flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl
                                                bg-gradient-to-r from-amber-500 to-orange-500
                                                text-white font-semibold
                                                shadow-lg shadow-amber-500/30
                                                hover:shadow-amber-500/50 hover:scale-[1.02]
                                                transition-all duration-200
                                                animate-slide-in-left
                                            "
                                            style={{ animationDelay: `${index * 30}ms` }}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Icon size={20} />
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

                {/* User Dropdown */}
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
                            <ChevronDown 
                                size={18} 
                                className={`text-[#888888] transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                            />
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
                                    <User size={18} className="text-[#0B4B54]" />
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
                                    <Settings size={18} className="text-[#0B4B54]" />
                                    <span>Settings</span>
                                </Link>
                                <div className="my-2 border-t border-[#82ACAB]/20" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
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

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search applicants, jobs..."
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
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={() => {
                                        setIsNotificationOpen(!isNotificationOpen);
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="
                                        relative p-3 rounded-xl 
                                        bg-white/60 hover:bg-white 
                                        text-[#0B4B54] 
                                        transition-all duration-200
                                        shadow-sm hover:shadow-md
                                    "
                                >
                                    <Bell size={20} />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                        {notifications.filter(n => n.unread).length}
                                    </span>
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#82ACAB]/20 animate-fade-in-up z-50">
                                        <div className="p-4 border-b border-[#82ACAB]/20">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-[#032A33]">Notifications</h3>
                                                <button className="text-xs text-[#0B4B54] hover:underline">Mark all as read</button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${notification.unread ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getNotificationColor(notification.type)}`}>
                                                            {notification.type === 'success' && <CheckCircle size={16} />}
                                                            {notification.type === 'warning' && <Clock size={16} />}
                                                            {notification.type === 'error' && <XCircle size={16} />}
                                                            {notification.type === 'info' && <Bell size={16} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-[#032A33] text-sm">{notification.title}</p>
                                                                {notification.unread && (
                                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                                                )}
                                                            </div>
                                                            <p className="text-[#888888] text-xs mt-0.5 truncate">{notification.message}</p>
                                                            <p className="text-[#82ACAB] text-xs mt-1">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-[#82ACAB]/20">
                                            <button 
                                                onClick={() => {
                                                    navigate('/hirer/notifications');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="w-full text-center text-sm text-[#0B4B54] font-medium hover:underline"
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile */}
                            <div className="relative flex items-center gap-3 pl-4 border-l border-[#82ACAB]/30" ref={profileDropdownRef}>
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-[#032A33]">{firstName}</p>
                                    <p className="text-xs text-[#888888]">Employer</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                        setIsNotificationOpen(false);
                                    }}
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
                                            <User size={18} className="text-[#0B4B54]" />
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
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
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

export default HirerLayout;
