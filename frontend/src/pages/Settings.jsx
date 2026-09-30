import { useState } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiSettings,
  FiBell,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';

function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailApplications: true,
    emailNewJobs: true,
    emailUpdates: false,
    pushApplications: true,
    pushNewJobs: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    resumeVisible: false,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPwd: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const toggle = (group, key) => {
    if (group === 'notifications') {
      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPwd !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPwd.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Password updated successfully!');
    setPasswords({ current: '', newPwd: '', confirm: '' });
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

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
                <FiSettings size={28} />
                Settings
              </h1>
              <p className="text-blue-100">Manage your account preferences</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FiBell size={18} className="text-blue-600" />
                <h2 className="font-bold text-gray-800">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'emailApplications', label: 'Application status updates', sub: 'Email' },
                  { key: 'emailNewJobs', label: 'New job recommendations', sub: 'Email' },
                  { key: 'emailUpdates', label: 'Product updates & news', sub: 'Email' },
                  { key: 'pushApplications', label: 'Application status updates', sub: 'Push' },
                  { key: 'pushNewJobs', label: 'New job alerts', sub: 'Push' },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{sub} notification</p>
                    </div>
                    <ToggleSwitch
                      enabled={notifications[key]}
                      onToggle={() => toggle('notifications', key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FiEye size={18} className="text-blue-600" />
                <h2 className="font-bold text-gray-800">Privacy Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'profileVisible', label: 'Make profile visible to recruiters', sub: 'Recruiters can find your profile' },
                  { key: 'resumeVisible', label: 'Make resume publicly accessible', sub: 'Anyone with link can view your resume' },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                    <ToggleSwitch
                      enabled={privacy[key]}
                      onToggle={() => toggle('privacy', key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiLock size={18} className="text-blue-600" />
                  <h2 className="font-bold text-gray-800">Change Password</h2>
                </div>
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  {showPasswords ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                  {showPasswords ? 'Hide' : 'Show'}
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                {[
                  { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                  { key: 'newPwd', label: 'New Password', placeholder: 'Enter new password' },
                  { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FiMail size={18} className="text-blue-600" />
                <h2 className="font-bold text-gray-800">Account Information</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    Job Seeker
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
