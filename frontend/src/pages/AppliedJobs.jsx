// Applied Jobs redirects to the Application Status page which shows all applied jobs
import { Navigate } from 'react-router-dom';

function AppliedJobs() {
  return <Navigate to="/applications" replace />;
}

export default AppliedJobs;
