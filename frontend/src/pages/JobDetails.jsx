import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiTag,
} from 'react-icons/fi';

const categoryColors = {
  'Full Stack': 'bg-purple-100 text-purple-700',
  Frontend: 'bg-blue-100 text-blue-700',
  Backend: 'bg-green-100 text-green-700',
  'Data Science': 'bg-orange-100 text-orange-700',
  DevOps: 'bg-red-100 text-red-700',
  Design: 'bg-pink-100 text-pink-700',
  Mobile: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-700',
};

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch {
        setError('Job not found or no longer available');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/jobs/${id}/apply`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-500 text-lg">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            <FiArrowLeft size={16} /> Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryColors[job.category] || categoryColors['Other'];
  const companyInitial = job.company.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card animate-slide-up">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {companyInitial}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                  <p className="text-gray-500 text-lg">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`badge ${catStyle}`}>{job.category}</span>
                    <span className="badge bg-blue-100 text-blue-700">{job.type}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <FiMapPin size={18} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-700">{job.location}</p>
                </div>
                <div className="text-center">
                  <FiTrendingUp size={18} className="mx-auto text-green-500 mb-1" />
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm font-semibold text-gray-700">{job.experience}</p>
                </div>
                {job.salary && (
                  <div className="text-center">
                    <FiDollarSign size={18} className="mx-auto text-orange-500 mb-1" />
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="text-sm font-semibold text-gray-700">{job.salary}</p>
                  </div>
                )}
                <div className="text-center">
                  <FiClock size={18} className="mx-auto text-purple-500 mb-1" />
                  <p className="text-xs text-gray-500">Posted</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(job.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiTag size={16} className="text-gray-500" />
                  <h3 className="font-semibold text-gray-700">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About the Role</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FiCheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card */}
            <div className="card sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Interested in this role?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Apply now and take the next step in your career journey.
              </p>
              <button onClick={handleApply} className="btn-primary w-full justify-center py-3">
                Apply for this Job <FiArrowRight size={16} />
              </button>
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to apply
                </p>
              )}
            </div>

            {/* Company info */}
            <div className="card">
              <h3 className="text-base font-bold text-gray-800 mb-3">About {job.company}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                  {companyInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{job.company}</p>
                  <p className="text-sm text-gray-400">{job.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Leading company offering exciting career opportunities in tech.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default JobDetails;
