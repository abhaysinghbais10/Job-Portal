import { useState } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { FiBell, FiCheckCircle, FiBriefcase, FiStar, FiInfo } from 'react-icons/fi';

const mockUpdates = [
  {
    id: 1,
    type: 'application',
    icon: FiBriefcase,
    color: 'bg-blue-100 text-blue-600',
    title: 'Application Status Updated',
    message: 'Your application for "Full Stack Developer" at TechCorp has moved to "Under Review".',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'job',
    icon: FiStar,
    color: 'bg-yellow-100 text-yellow-600',
    title: 'New Jobs Matching Your Profile',
    message: '5 new React Developer positions have been posted that match your skills.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    icon: FiInfo,
    color: 'bg-purple-100 text-purple-600',
    title: 'Profile Completion Reminder',
    message: 'Complete your profile to increase your chances of getting hired by 3x.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'application',
    icon: FiCheckCircle,
    color: 'bg-green-100 text-green-600',
    title: 'Application Submitted',
    message: 'You successfully applied for "Backend Engineer" at InnovateLabs.',
    time: '2 days ago',
    read: true,
  },
];

function Updates() {
  const [updates, setUpdates] = useState(mockUpdates);

  const markAllRead = () => {
    setUpdates((prev) => prev.map((u) => ({ ...u, read: true })));
  };

  const markRead = (id) => {
    setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, read: true } : u)));
  };

  const unreadCount = updates.filter((u) => !u.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
                <FiBell size={28} />
                Updates
                {unreadCount > 0 && (
                  <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-2.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-blue-100">Stay up-to-date with your job search</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {/* Actions */}
            {unreadCount > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={markAllRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
                >
                  <FiCheckCircle size={14} /> Mark all as read
                </button>
              </div>
            )}

            <div className="space-y-3">
              {updates.map((update) => {
                const Icon = update.icon;
                return (
                  <div
                    key={update.id}
                    onClick={() => markRead(update.id)}
                    className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                      update.read ? 'border-gray-100' : 'border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${update.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold text-sm ${update.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {update.title}
                          </p>
                          {!update.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{update.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{update.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Updates;
