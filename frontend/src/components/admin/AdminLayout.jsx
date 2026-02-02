import {
    Bell,
    ChevronDown,
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

// Sidebar Navigation Items
const navItems = [
    {
        name: 'Overview',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Verification',
        path: '/admin/verification',
        icon: ShieldCheck,
        badge: 5, // Notification badge
    },
    {
        name: 'User Management',
        path: '/admin/users',
        icon: Users,
    },
    {
        name: 'Financials',
        path: '/admin/financials',
        icon: Wallet,
    },
    {
        name: 'Settings',
        path: '/admin/settings',
        icon: Settings,
    },
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
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-72
                    bg-slate-900 text-white
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A9287] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                Nepshift
                            </h1>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-xl
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-[#4A9287] text-white shadow-lg shadow-[#4A9287]/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#4A9287]'} />
                                    <span className="font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {item.name}
                                    </span>
                                </div>
                                {item.badge && (
                                    <span className={`
                                        px-2 py-0.5 text-xs font-bold rounded-full
                                        ${isActive ? 'bg-white text-[#4A9287]' : 'bg-red-500 text-white'}
                                    `}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Logout
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5 w-80">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users, transactions..."
                        className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Admin Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4A9287] to-[#3d7a71] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.fullName?.charAt(0) || 'A'}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {user?.fullName || 'Administrator'}
                        </p>
                        <p className="text-xs text-slate-500">System Admin</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
                </div>
            </div>
        </header>
    );
};

// Main Admin Layout
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
