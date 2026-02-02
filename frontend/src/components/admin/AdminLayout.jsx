import {
    Bell,
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
                name: 'Verification',
                path: '/admin/verification',
                icon: ShieldCheck,
                badge: 5,
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
                    bg-[#F8FAFC] flex flex-col
                    transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                    lg:translate-x-0 lg:static lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    border-r border-slate-200/80
                `}
            >
                {/* Logo Section */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/50">
                    <Link to="/admin/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg leading-none">N</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Nepshift
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
                    {navGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    size={18}
                                                    strokeWidth={2}
                                                    className={`transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}
                                                />
                                                <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            {item.badge && (
                                                <span className={`
                                                    px-1.5 py-0.5 text-[10px] font-bold rounded-full
                                                    ${isActive
                                                        ? 'bg-slate-900 text-white'
                                                        : 'bg-slate-100 text-slate-500'
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
                <div className="p-4 border-t border-slate-200/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-md transition-all duration-200 group"
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

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Global Search */}
                <div className="hidden md:flex items-center gap-3 w-full max-w-md">
                    <div className="relative w-full group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all placeholder:text-slate-400"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                            <span className="text-[10px] font-medium text-slate-500 border border-slate-300 rounded px-1">/</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Feedback / Help */}
                <button className="hidden sm:flex text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                    Feedback
                </button>
                <button className="hidden sm:flex text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                    Help
                </button>

                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

                {/* Notifications */}
                <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Profile Menu */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="h-8 w-8 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 ring-2 ring-white shadow-sm cursor-pointer hover:ring-slate-100 transition-all">
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
        <div className="min-h-screen bg-[#FFFFFF] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0 bg-[#F9FAFB]">
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
