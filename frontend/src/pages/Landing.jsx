import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import {
  FiSearch,
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiStar,
  FiCode,
  FiDatabase,
  FiLayers,
  FiBarChart2,
  FiSmartphone,
  FiCloud,
} from 'react-icons/fi';

const categories = [
  { name: 'Full Stack', icon: FiLayers, color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50' },
  { name: 'Frontend', icon: FiCode, color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50' },
  { name: 'Backend', icon: FiDatabase, color: 'from-green-500 to-green-700', bg: 'bg-green-50' },
  { name: 'Data Science', icon: FiBarChart2, color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50' },
  { name: 'DevOps', icon: FiCloud, color: 'from-red-500 to-red-700', bg: 'bg-red-50' },
  { name: 'Mobile', icon: FiSmartphone, color: 'from-pink-500 to-pink-700', bg: 'bg-pink-50' },
];

const stats = [
  { label: 'Active Jobs', value: '500+', icon: FiBriefcase },
  { label: 'Companies Hiring', value: '200+', icon: FiUsers },
  { label: 'Successful Placements', value: '10K+', icon: FiCheckCircle },
  { label: 'Job Seekers', value: '50K+', icon: FiTrendingUp },
];

function Landing() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=6');
        setFeaturedJobs(res.data.jobs);
      } catch {
        // Silently fail for landing page
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-30 text-blue-100 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm border border-blue-400 border-opacity-30">
              <FiStar size={14} />
              <span>#1 Job Portal in India</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Find Your{' '}
              <span className="text-yellow-400 relative">
                Dream Job
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none">
                  <path d="M3 9C118.957 4.47226 238.043 4.47226 355 9" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Connect with top companies and find opportunities that match your
              skills. Thousands of jobs in tech, data, and more.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Search Jobs <FiArrowRight size={18} />
              </button>
            </form>

            <p className="text-blue-200 text-sm mt-4">
              Popular: MERN Developer, Java, React, Python, DevOps
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-lg mb-2">
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">
              Explore thousands of job opportunities across different tech domains
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/dashboard?category=${cat.name}`}
                className={`${cat.bg} rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1 group`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white mb-3 mx-auto group-hover:scale-110 transition-transform`}
                >
                  <cat.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-gray-700">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">Featured Jobs</h2>
              <p className="text-gray-500">Latest opportunities from top companies</p>
            </div>
            <Link
              to="/dashboard"
              className="btn-secondary text-sm py-2 px-4 hidden sm:flex"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/dashboard" className="btn-primary">
              Explore All Jobs <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Choose JobPortal?</h2>
            <p className="section-subtitle">Everything you need to land your dream job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiSearch,
                title: 'Smart Job Search',
                description: 'Find jobs matching your skills with our intelligent search and filtering system.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: FiBriefcase,
                title: 'Top Companies',
                description: 'Access exclusive job openings from leading tech companies and startups.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: FiCheckCircle,
                title: 'Easy Application',
                description: 'Apply to multiple jobs with a single profile and track all applications.',
                color: 'bg-purple-50 text-purple-600',
              },
            ].map((feature) => (
              <div key={feature.title} className="card text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of professionals who found their dream jobs through JobPortal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
              Create Free Account
            </Link>
            <Link to="/dashboard" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-blue-600 transition-colors">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
