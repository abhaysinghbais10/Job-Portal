import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FiSearch,
  FiFilter,
  FiBriefcase,
  FiX,
} from 'react-icons/fi';

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend', 'Data Science', 'DevOps', 'Design', 'Mobile'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [jobType, setJobType] = useState('All');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      if (jobType !== 'All') params.set('type', jobType);
      params.set('page', page);
      params.set('limit', 9);

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, jobType, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    const params = {};
    if (searchInput) params.search = searchInput;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleTypeChange = (type) => {
    setJobType(type);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategory('All');
    setJobType('All');
    setPage(1);
    setSearchParams({});
  };

  const hasFilters = search || category !== 'All' || jobType !== 'All';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 min-w-0">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            {user ? `Welcome back, ${user.name.split(' ')[0]}! 👋` : 'Browse All Jobs'}
          </h1>
          <p className="text-blue-100 mb-6">
            {total > 0 ? `${total} opportunities available` : 'Find your next opportunity'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search jobs, skills, or companies..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
            </div>
            <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white bg-opacity-20 text-white px-4 py-3 rounded-xl hover:bg-opacity-30 transition-colors flex items-center gap-2 border border-white border-opacity-30"
            >
              <FiFilter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Job Type</p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        jobType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                <FiX size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-600 text-sm">
            {loading ? 'Loading...' : `Showing ${jobs.length} of ${total} jobs`}
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiBriefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
