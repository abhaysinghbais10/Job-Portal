import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiBriefcase,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiFileText,
  FiChevronDown,
  FiGrid,
  FiSearch,
  FiBookmark,
  FiCheckSquare,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5'
      : 'text-gray-600 hover:text-blue-600 transition-colors';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const authenticatedNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/find-jobs', label: 'Find Jobs', icon: FiSearch },
    { to: '/applications', label: 'My Applications', icon: FiFileText },
    { to: '/applied-jobs', label: 'Applied Jobs', icon: FiCheckSquare },
    { to: '/saved-jobs', label: 'Saved Jobs', icon: FiBookmark },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <FiBriefcase size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Job<span className="text-blue-600">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              authenticatedNavLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={`text-sm font-medium ${isActive(to)}`}>
                  {label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" className={`font-medium ${isActive('/')}`}>Home</Link>
                <Link to="/find-jobs" className={`font-medium ${isActive('/find-jobs')}`}>Find Jobs</Link>
              </>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiUser size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiFileText size={16} />
                      My Applications
                    </Link>
                    <Link
                      to="/saved-jobs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiBookmark size={16} />
                      Saved Jobs
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-3 px-2 mb-2 bg-blue-50 rounded-lg">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                {authenticatedNavLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-2 rounded-lg font-medium text-sm ${
                      location.pathname === to
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 py-2.5 px-2 rounded-lg font-medium text-sm ${
                    location.pathname === '/profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiUser size={17} />
                  Profile
                </Link>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-red-600 font-medium text-sm hover:bg-red-50 w-full"
                >
                  <FiLogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/find-jobs"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Find Jobs
                </Link>
                <hr className="my-2 border-gray-100" />
                <div className="flex gap-3 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary text-sm flex-1 justify-center py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm flex-1 justify-center py-2"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
