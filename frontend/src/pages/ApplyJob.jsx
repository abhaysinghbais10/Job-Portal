import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiUpload,
  FiArrowLeft,
  FiCheckCircle,
  FiBriefcase,
} from 'react-icons/fi';

function ApplyJob() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch {
        toast.error('Job not found');
        navigate('/dashboard');
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.coverLetter.trim()) errs.coverLetter = 'Cover letter is required';
    else if (form.coverLetter.trim().length < 50)
      errs.coverLetter = 'Cover letter must be at least 50 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('coverLetter', form.coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(true);
      toast.success('Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <FiCheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Application Submitted! 🎉
            </h2>
            <p className="text-gray-500 mb-2">
              Your application for{' '}
              <span className="font-semibold text-gray-700">{job?.title}</span> at{' '}
              <span className="font-semibold text-gray-700">{job?.company}</span> has been submitted successfully.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              The hiring team will review your application and get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/applications" className="btn-primary flex-1 justify-center">
                Track Application
              </Link>
              <Link to="/dashboard" className="btn-secondary flex-1 justify-center">
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Job Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply for Position</h1>
              <p className="text-gray-500 mb-6">
                Complete the form below to submit your application
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your contact number"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Resume <span className="text-gray-400">(PDF/DOC/DOCX, max 5MB)</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <FiUpload size={24} className="text-gray-400 mb-2" />
                      {resumeFile ? (
                        <p className="text-sm font-medium text-blue-600">{resumeFile.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">
                            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <textarea
                      name="coverLetter"
                      value={form.coverLetter}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us why you're a great fit for this role... (min. 50 characters)"
                      className={`input-field pl-10 resize-none ${errors.coverLetter ? 'border-red-400' : ''}`}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    {errors.coverLetter ? (
                      <p className="text-red-500 text-xs">{errors.coverLetter}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-gray-400">{form.coverLetter.length} chars</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center py-3.5 text-base"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>

          {/* Job Summary Sidebar */}
          <div>
            {job && (
              <div className="card sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBriefcase size={18} className="text-blue-600" />
                  Job Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Position</p>
                    <p className="font-semibold text-gray-800">{job.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                    <p className="font-semibold text-gray-700">{job.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-gray-700">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>
                    <p className="text-gray-700">{job.experience}</p>
                  </div>
                  {job.salary && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Salary</p>
                      <p className="text-gray-700">{job.salary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ApplyJob;
