import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FiActivity, FiBriefcase, FiArrowRight } from 'react-icons/fi';

function TrackApplication() {
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
                <FiActivity size={28} />
                Track Application
              </h1>
              <p className="text-blue-100">Monitor your job application progress</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                <FiBriefcase size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Track Your Applications</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                View the status of all your job applications in one place.
              </p>
              <Link to="/applications" className="btn-primary inline-flex items-center gap-2">
                View Applications <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default TrackApplication;
