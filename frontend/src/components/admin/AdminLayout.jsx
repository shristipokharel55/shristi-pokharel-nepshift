import {
    Bell,
    CheckCircle,
    Clock,
    Info,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

// Structured Navigation Groups
const navGroups = [
    {
        title: 'OVERVIEW',
        items: [
            {
                name: 'Dashboard',
                path: '/admin/dashboard',
                icon: LayoutDashboard,
            },
        ]
    },
    {
        title: 'MANAGEMENT',
        items: [
            {
                name: 'Worker Verification',
                path: '/admin/verification',
                icon: ShieldCheck,
                badge: 5,
            },
            {
                name: 'Hirer Verification',
                path: '/admin/hirer-verification',
                icon: ShieldCheck,
            },
            {
                name: 'Users',
                path: '/admin/users',
                icon: Users,
            },
        ]
    },
    {
        title: 'FINANCE',
        items: [
            {
                name: 'Financials',
                path: '/admin/financials',
                icon: Wallet,
            },
        ]
    },
    {
        title: 'SYSTEM',
        items: [
            {
                name: 'Settings',
                path: '/admin/settings',
                icon: Settings,
            },
        ]
    }
];

// Sidebar Component
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-72
                    bg-white/95 backdrop-blur-xl flex flex-col
                    transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                    lg:translate-x-0 lg:static lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    border-r border-[#ece4f4]
                `}
            >
                {/* Logo Section */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-[#ece4f4]">
                    <Link to="/admin/dashboard" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-linear-to-br from-[#07A3B2] via-[#4bb8a4] to-[#5dbf8a] rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg leading-none">N</span>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-[#2c2143] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Nepshift
                            </span>
                            <p className="text-[10px] text-[#8a7ba7] font-medium">Admin</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 text-[#8a7ba7] hover:bg-[#f4eef9] rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
                    {navGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className="px-3 mb-2 text-[11px] font-bold text-[#9d90b6] uppercase tracking-wider">
                                {group.title}
                            </h3>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                            className={`
                                                relative flex items-center justify-between px-3 py-2 rounded-md
                                                transition-all duration-200 group
                                                ${isActive
                                                    ? 'bg-[#f4eef9] text-[#55406f] shadow-sm ring-1 ring-[#e2d8ef]'
                                                    : 'text-[#6f6487] hover:bg-[#f7f2fb] hover:text-[#2c2143]'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    size={18}
                                                    strokeWidth={2}
                                                    className={`transition-colors ${isActive ? 'text-[#55406f]' : 'text-[#a194ba] group-hover:text-[#6f6487]'}`}
                                                />
                                                <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            {item.badge && (
                                                <span className={`
                                                    px-1.5 py-0.5 text-[10px] font-bold rounded-full
                                                    ${isActive
                                                        ? 'bg-linear-to-r from-[#07A3B2] to-[#5dbf8a] text-white'
                                                        : 'bg-[#f4eef9] text-[#7f7199]'
                                                    }
                                                `}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User & Logout Section */}
                <div className="p-4 border-t border-[#ece4f4]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-[#7f7199] hover:text-red-600 hover:bg-red-50/50 rounded-md transition-all duration-200 group"
                    >
                        <LogOut size={18} strokeWidth={2} className="group-hover:text-red-600 transition-colors" />
                        <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// Header Component
const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                if (res.data.success) {
                    setNotifications(res.data.data || []);
                    setUnreadCount(res.data.unreadCount || 0);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'error': return XCircle;
            case 'warning': return Clock;
            case 'info':
            default: return Info;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-100 text-emerald-600';
            case 'error': return 'bg-red-100 text-red-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'info':
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-[#ece4f4] shadow-[0_10px_28px_rgba(122,105,165,0.06)] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-[#8a7ba7] hover:text-[#2c2143] hover:bg-[#f7f2fb] rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Global Search */}
                <div className="hidden md:flex items-center gap-3 w-full max-w-md">
                    <div className="relative w-full group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a194ba] group-focus-within:text-[#6f6487] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-[#f7f2fb] border border-[#ece4f4] text-[#2c2143] text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#07A3B2]/15 focus:bg-white transition-all placeholder:text-[#a194ba]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                            <span className="text-[10px] font-medium text-[#8a7ba7] border border-[#d9cfe7] rounded px-1">/</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Feedback / Help */}
                <button className="hidden sm:flex text-xs font-medium text-[#8a7ba7] hover:text-[#2c2143] transition-colors">
                    Feedback
                </button>
                <button className="hidden sm:flex text-xs font-medium text-[#8a7ba7] hover:text-[#2c2143] transition-colors">
                    Help
                </button>

                <div className="h-4 w-px bg-[#ece4f4] hidden sm:block"></div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative text-[#8a7ba7] hover:text-[#07A3B2] transition-colors"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#ece4f4] animate-fade-in-up z-50">
                            <div className="p-4 border-b border-[#ece4f4]">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-[#2c2143]">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-[#07A3B2] hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-[#8a7ba7]">
                                        <Bell size={32} className="mx-auto mb-2 text-[#d9cfe7]" />
                                        <p className="text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 5).map((notification) => {
                                        const Icon = getNotificationIcon(notification.type);
                                        return (
                                            <div
                                                key={notification._id}
                                                className={`p-4 hover:bg-[#f7f2fb] cursor-pointer border-b border-[#f2ecf8] last:border-b-0 ${!notification.read ? 'bg-[#f4eef9]' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-[#2c2143] text-sm">{notification.title}</p>
                                                            {!notification.read && (
                                                                <span className="w-2 h-2 rounded-full bg-[#07A3B2] shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-[#7f7199] text-xs mt-0.5 truncate">{notification.message}</p>
                                                        <p className="text-[#a194ba] text-xs mt-1">{getTimeAgo(notification.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-[#ece4f4]">
                                    <Link
                                        to="/admin/notifications"
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="block w-full text-center text-sm text-[#07A3B2] font-medium hover:underline"
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Menu */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="h-8 w-8 bg-linear-to-tr from-[#07A3B2] to-[#5dbf8a] rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm cursor-pointer hover:ring-[#eaf7f8] transition-all">
                        <span style={{ fontFamily: "'Inter', sans-serif" }}>
                            {user?.fullName?.charAt(0) || 'A'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Main Admin Layout
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#f7f2fb_42%,#f4eef9_100%)] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0 bg-transparent">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 max-w-[1600px] w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
