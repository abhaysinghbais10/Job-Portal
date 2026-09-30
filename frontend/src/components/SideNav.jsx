import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiActivity,
  FiUpload,
  FiBriefcase,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const navItems = [
  {
    to: '/track-application',
    label: 'Track Application',
    icon: FiActivity,
    description: 'Monitor application status',
  },
  {
    to: '/upload-resume',
    label: 'Upload Resume',
    icon: FiUpload,
    description: 'Manage your resume',
  },
  {
    to: '/companies',
    label: 'Your Companies',
    icon: FiBriefcase,
    description: 'Followed companies',
  },
  {
    to: '/updates',
    label: 'Updates',
    icon: FiBell,
    description: 'Notifications & alerts',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: FiSettings,
    description: 'Account preferences',
  },
];

function SideNav() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Open sidebar"
      >
        <FiMenu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40
          transition-all duration-300 flex flex-col
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar header */}
        <div className={`flex items-center h-14 border-b border-gray-100 px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-700 tracking-wide">MENU</span>
          )}
          <div className="flex items-center gap-1">
            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map(({ to, label, icon: Icon, description }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-xl mb-1
                  transition-all duration-150 relative
                  ${active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                {!collapsed && (
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${active ? 'text-blue-600' : ''}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{description}</p>
                  </div>
                )}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">JobPortal v1.0</p>
          </div>
        )}
      </aside>

      {/* Spacer to push content right on desktop */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`} />
    </>
  );
}

export default SideNav;
