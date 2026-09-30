import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindJobs from './pages/FindJobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import ApplicationStatus from './pages/ApplicationStatus';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import TrackApplication from './pages/TrackApplication';
import UploadResume from './pages/UploadResume';
import Companies from './pages/Companies';
import Updates from './pages/Updates';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-jobs" element={<FindJobs />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route
        path="/jobs/:id/apply"
        element={
          <ProtectedRoute>
            <ApplyJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applied-jobs"
        element={
          <ProtectedRoute>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/track-application"
        element={
          <ProtectedRoute>
            <TrackApplication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-resume"
        element={
          <ProtectedRoute>
            <UploadResume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/updates"
        element={
          <ProtectedRoute>
            <Updates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
