import { Link } from 'react-router-dom';
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiTwitter,
} from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FiBriefcase size={18} />
              </div>
              <span className="text-xl font-bold text-white">
                Job<span className="text-blue-400">Portal</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Find your dream job or hire top talent. The best platform to
              connect job seekers and employers.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Jobs', to: '/dashboard' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2">
              {[
                'Full Stack Developer',
                'MERN Developer',
                'Java Developer',
                'Data Analyst',
                'DevOps Engineer',
                'UI/UX Designer',
              ].map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-gray-400">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMapPin size={14} className="text-blue-400 flex-shrink-0" />
                Bangalore, India
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMail size={14} className="text-blue-400 flex-shrink-0" />
                support@jobportal.in
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiPhone size={14} className="text-blue-400 flex-shrink-0" />
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ using the MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
