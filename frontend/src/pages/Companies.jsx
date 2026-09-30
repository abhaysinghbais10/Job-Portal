import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiBriefcase, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/jobs?limit=50');
        const jobs = res.data.jobs || [];
        // Extract unique companies from job listings
        const companyMap = {};
        jobs.forEach((job) => {
          if (!companyMap[job.company]) {
            companyMap[job.company] = {
              name: job.company,
              jobs: [],
              locations: new Set(),
            };
          }
          companyMap[job.company].jobs.push(job);
          companyMap[job.company].locations.add(job.location);
        });
        setCompanies(Object.values(companyMap));
      } catch {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

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
                <FiBriefcase size={28} />
                Your Companies
              </h1>
              <p className="text-blue-100">
                {companies.length > 0
                  ? `${companies.length} companies hiring`
                  : 'Explore companies that are hiring'}
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : companies.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <FiBriefcase size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No companies found</h3>
                <p className="text-gray-500 mb-6">Companies will appear here as jobs are posted.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {companies.map((company) => (
                  <div
                    key={company.name}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{company.name}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                          <FiMapPin size={11} />
                          <span className="truncate">
                            {[...company.locations].slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <FiBriefcase size={14} />
                        {company.jobs.length} open position{company.jobs.length !== 1 ? 's' : ''}
                      </span>
                      <Link
                        to={`/find-jobs?company=${encodeURIComponent(company.name)}`}
                        className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700"
                      >
                        View Jobs <FiArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
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

export default Companies;
