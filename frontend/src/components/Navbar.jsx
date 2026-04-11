import { useState } from 'react';
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
} from 'react-icons/fi';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <FiBriefcase size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Job<span className="text-blue-600">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`transition-colors font-medium ${isActive('/')}`}>
              Home
            </Link>
            <Link
              to={user ? '/dashboard' : '/login'}
              className={`transition-colors font-medium ${isActive('/dashboard')}`}
            >
              Jobs
            </Link>
            {user && (
              <Link
                to="/applications"
                className={`transition-colors font-medium ${isActive('/applications')}`}
              >
                My Applications
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/applications"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiFileText size={16} />
                      My Applications
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
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-gray-700 font-medium"
            >
              Home
            </Link>
            <Link
              to={user ? '/dashboard' : '/login'}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-gray-700 font-medium"
            >
              Jobs
            </Link>
            {user && (
              <Link
                to="/applications"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-gray-700 font-medium"
              >
                My Applications
              </Link>
            )}
            <hr className="border-gray-100" />
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium py-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            ) : (
              <div className="flex gap-3">
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
