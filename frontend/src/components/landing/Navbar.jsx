import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'helper') return '/worker/dashboard';
    if (user?.role === 'hirer') return '/hirer/dashboard';
    return '/';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* Logo — left on desktop */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F4E5F] to-[#4A9287] flex items-center justify-center shadow-md shadow-teal-500/20">
              <span className="text-white font-black text-base leading-none">N</span>
            </div>
            <span className="text-xl font-bold text-[#1F2937] tracking-tight">Nepshift</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#1F2937]/70 hover:text-[#4A9287] transition-colors">Home</Link>
            <a href="#features" className="text-sm font-medium text-[#1F2937]/70 hover:text-[#4A9287] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#1F2937]/70 hover:text-[#4A9287] transition-colors">How It Works</a>
          </div>

          {/* Right auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-sm font-medium text-[#1F2937]/70 hover:text-[#4A9287] transition-colors px-3 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-2"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1F2937]/70 hover:text-[#1F2937] transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-[#1F4E5F] to-[#4A9287] hover:from-[#1a3f4d] hover:to-[#3d7a72] px-5 py-2 rounded-full shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#1F2937]/70 hover:text-[#1F2937] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg">
          <div className="px-5 pt-3 pb-6 flex flex-col gap-1">
            <Link
              to="/"
              className="px-3 py-3 text-sm font-medium text-[#1F2937] hover:bg-teal-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="px-3 py-3 text-sm font-medium text-[#1F2937] hover:bg-teal-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-3 text-sm font-medium text-[#1F2937] hover:bg-teal-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mt-2 text-sm font-semibold text-white text-center bg-gradient-to-r from-[#1F4E5F] to-[#4A9287] px-5 py-3 rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

