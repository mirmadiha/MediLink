import { Link, useNavigate } from "react-router-dom";
import { Activity, ShieldAlert, LogOut } from "lucide-react";

function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Basic Dashboard Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Medi<span className="text-teal-500">Link</span>
            </span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-semibold ml-2">
              Patient Portal
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Panel Placeholder */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to Your Health Dashboard
            </h1>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Your patient account has been verified. In the upcoming versions, you will be able to review diagnostics, script sheets, and manage record share consents here.
            </p>
          </div>
          <div className="pt-4 flex justify-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Go to Landing Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple fallback icon to avoid imports mismatch
function CheckCircleIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export default PatientDashboard;
