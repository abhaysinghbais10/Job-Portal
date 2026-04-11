import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import {
  FiFileText,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';

const statusConfig = {
  Applied: {
    color: 'bg-blue-100 text-blue-700',
    icon: FiFileText,
    description: 'Your application has been received',
    step: 1,
  },
  'Under Review': {
    color: 'bg-yellow-100 text-yellow-700',
    icon: FiEye,
    description: 'The hiring team is reviewing your application',
    step: 2,
  },
  Shortlisted: {
    color: 'bg-purple-100 text-purple-700',
    icon: FiCheckCircle,
    description: "Congratulations! You've been shortlisted",
    step: 3,
  },
  Selected: {
    color: 'bg-green-100 text-green-700',
    icon: FiCheckCircle,
    description: "🎉 Congratulations! You've been selected!",
    step: 4,
  },
  Rejected: {
    color: 'bg-red-100 text-red-700',
    icon: FiAlertCircle,
    description: "We're sorry, your application was not selected this time",
    step: 0,
  },
};

const statusSteps = ['Applied', 'Under Review', 'Shortlisted', 'Selected'];

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data.applications);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">My Applications</h1>
          <p className="text-blue-100">
            {applications.length > 0
              ? `Tracking ${applications.length} application${applications.length > 1 ? 's' : ''}`
              : 'Track all your job applications here'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Application History
          </h2>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiBriefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start applying to jobs to track your application status here
            </p>
            <Link to="/dashboard" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const config = statusConfig[app.status] || statusConfig['Applied'];
              const StatusIcon = config.icon;
              const isRejected = app.status === 'Rejected';
              const currentStep = config.step;

              return (
                <div
                  key={app._id}
                  className="card hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {app.job?.company?.charAt(0).toUpperCase() || 'J'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {app.job?.title || 'Job Position'}
                        </h3>
                        <p className="text-gray-500">{app.job?.company}</p>
                      </div>
                    </div>
                    <span className={`badge ${config.color} flex items-center gap-1.5 whitespace-nowrap`}>
                      <StatusIcon size={12} />
                      {app.status}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-5">
                    {app.job?.location && (
                      <div className="flex items-center gap-1.5">
                        <FiMapPin size={13} />
                        {app.job.location}
                      </div>
                    )}
                    {app.job?.type && (
                      <div className="flex items-center gap-1.5">
                        <FiBriefcase size={13} />
                        {app.job.type}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <FiClock size={13} />
                      Applied {getTimeAgo(app.createdAt)}
                    </div>
                  </div>

                  {/* Status description */}
                  <div className={`p-3 rounded-lg text-sm mb-5 flex items-center gap-2 ${config.color} bg-opacity-50`}>
                    <StatusIcon size={15} />
                    {config.description}
                  </div>

                  {/* Progress Steps */}
                  {!isRejected && (
                    <div className="relative">
                      <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                        <div
                          className="absolute top-3.5 left-0 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, ((currentStep - 1) / (statusSteps.length - 1)) * 100)}%`,
                          }}
                        />

                        {statusSteps.map((step, idx) => {
                          const stepNum = idx + 1;
                          const isCompleted = stepNum < currentStep;
                          const isCurrent = stepNum === currentStep;
                          return (
                            <div
                              key={step}
                              className="flex flex-col items-center relative z-10"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  isCompleted
                                    ? 'bg-blue-600 text-white'
                                    : isCurrent
                                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {isCompleted ? <FiCheckCircle size={14} /> : stepNum}
                              </div>
                              <p
                                className={`text-xs mt-2 font-medium text-center max-w-[60px] leading-tight ${
                                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tech stack */}
                  {app.job?.techStack && app.job.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
                      {app.job.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ApplicationStatus;
