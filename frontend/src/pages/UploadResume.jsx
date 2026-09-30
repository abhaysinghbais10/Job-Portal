import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiX,
  FiDownload,
} from 'react-icons/fi';

function UploadResume() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const allowedTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setUploading(false);
    setUploaded(true);
    toast.success('Resume uploaded successfully!');
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
                <FiUpload size={28} />
                Upload Resume
              </h1>
              <p className="text-blue-100">Keep your resume up-to-date for job applications</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                  <FiUpload size={28} className="text-blue-500" />
                </div>
                <p className="text-gray-700 font-semibold mb-1">
                  Drag & drop your resume here
                </p>
                <p className="text-gray-400 text-sm mb-3">or click to browse files</p>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  PDF, DOC, DOCX · Max 5MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {/* Selected file */}
              {file && (
                <div className="mt-5 p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFile size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
                  </div>
                  {uploaded ? (
                    <FiCheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {uploaded ? (
                  <>
                    <div className="flex-1 flex items-center gap-2 justify-center py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                      <FiCheckCircle size={16} /> Resume uploaded
                    </div>
                    <button
                      onClick={() => { setFile(null); setUploaded(false); }}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FiUpload size={15} /> Replace
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <><FiUpload size={15} /> Upload Resume</>
                    )}
                  </button>
                )}
              </div>

              {/* Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm font-semibold text-blue-800 mb-2">💡 Resume Tips</p>
                <ul className="space-y-1.5 text-sm text-blue-700">
                  <li>• Keep your resume to 1-2 pages maximum</li>
                  <li>• Use clear, professional formatting</li>
                  <li>• Include relevant skills and experience</li>
                  <li>• Update your resume regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default UploadResume;
