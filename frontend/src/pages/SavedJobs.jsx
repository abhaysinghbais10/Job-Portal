import { useState } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { FiBookmark, FiBriefcase } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Saved jobs use localStorage for persistence
const getSavedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem('savedJobs') || '[]');
  } catch {
    return [];
  }
};

function SavedJobs() {
  const [savedJobs] = useState(getSavedJobs);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
                <FiBookmark size={28} />
                Saved Jobs
              </h1>
              <p className="text-blue-100">
                {savedJobs.length > 0
                  ? `${savedJobs.length} saved job${savedJobs.length > 1 ? 's' : ''}`
                  : 'Jobs you bookmark will appear here'}
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {savedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <FiBriefcase size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No saved jobs yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Browse jobs and click the bookmark icon to save them for later.
                </p>
                <Link to="/find-jobs" className="btn-primary inline-flex">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SavedJobs;
