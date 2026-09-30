import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
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

const typeColors = {
  'Full-time': 'bg-emerald-100 text-emerald-700',
  'Part-time': 'bg-amber-100 text-amber-700',
  Contract: 'bg-blue-100 text-blue-700',
  Internship: 'bg-violet-100 text-violet-700',
  Remote: 'bg-cyan-100 text-cyan-700',
};

function JobCard({ job }) {
  const categoryStyle =
    categoryColors[job.category] || categoryColors['Other'];
  const typeStyle = typeColors[job.type] || typeColors['Full-time'];

  // Get company initial for logo placeholder
  const companyInitial = job.company.charAt(0).toUpperCase();

  return (
    <div className="card group hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Company Logo Placeholder */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {companyInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>
        <span className={`badge ${typeStyle} flex-shrink-0`}>{job.type}</span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <FiMapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <FiTrendingUp size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{job.experience}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <FiDollarSign size={13} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <FiClock size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {new Date(job.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
          >
            {tech}
          </span>
        ))}
        {job.techStack.length > 4 && (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
            +{job.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Category badge */}
      <div className="mb-4">
        <span className={`badge ${categoryStyle}`}>{job.category}</span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 text-center py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all text-sm font-medium"
        >
          View Details
        </Link>
        <Link
          to={`/jobs/${job._id}/apply`}
          className="flex-1 btn-primary text-sm py-2.5 justify-center"
        >
          Apply Now <FiArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
