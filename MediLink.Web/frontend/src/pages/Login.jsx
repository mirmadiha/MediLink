import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Mail, Lock, CheckCircle2, Server } from "lucide-react";
import Navbar from "../components/Navbar";
import { api, getApiErrorMessage } from "../services/api";

function Login() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email Check
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password Check
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await api.login({
          email: formData.email,
          password: formData.password,
        });

        const profile = await api.profile({ forceFresh: true });
        const role = (profile?.role || "").toLowerCase();

        if (role === "masteradmin") {
          navigate("/master/dashboard");
          return;
        }

        if (role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        if (role === "doctor") {
          navigate("/doctor/dashboard");
          return;
        }

        if (role === "patient") {
          navigate("/patient/dashboard");
          return;
        }

        navigate("/patient/dashboard");
      } catch (error) {
        setServerError(getApiErrorMessage(error, "Unable to login."));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        showLinks={false}
        customRight={
          <>
            <Link
              to="/"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Sign Up
            </Link>
          </>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-2 px-3">
            <Link
              to="/"
              className="w-full text-center py-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/signup"
              className="w-full text-center py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
          
          {/* Left Column (Desktop Illustration Only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-slate-900 border border-slate-800 text-white rounded-3xl relative overflow-hidden shadow-2xl">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header branding */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-800 text-xs font-semibold text-blue-400">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Patient Health Vault</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Your Health Records.<br />
                Under Your Control.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                MediLink secures patient profiles using state-of-the-art cryptographic guidelines, giving you final consent power over who accesses your histories.
              </p>
            </div>

            {/* Simulated Live Record Monitor */}
            <div className="my-8 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-teal-400" />
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Live Vault Status</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>AES-256</span>
                </div>
              </div>

              {/* Secure features items */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2.5 text-xs">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">Full Encryption Guarantee</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Records are locked before they leave local browser sandboxes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">Granular Consent Authorization</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Authorize clinical file decryptions via live SMS OTP authentication.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">Centralized Patient Dashboard</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Access lab diagnostics, clinic visits, and active scripts in one place.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-slate-800">
              <span>Security Hash: #ml-pt-v4</span>
              <span>HIPAA & SOC-2 Ready</span>
            </div>
          </div>

          {/* Right Column (Login Form Card) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 max-w-xl w-full mx-auto relative">
              
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-sm text-slate-500 leading-normal">
                  Sign in to securely access your digital medical records and healthcare history.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {serverError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {serverError}
                  </div>
                )}
                
                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-slate-500 group-hover:text-slate-800 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 text-xs uppercase text-slate-400 bg-white font-semibold tracking-widest">
                  OR
                </span>
              </div>

              {/* Signup Link */}
              <div className="text-center text-sm text-slate-500 space-y-1">
                <div>Don't have an account?</div>
                <Link to="/signup" className="font-bold text-blue-600 hover:underline">
                  Create Patient Account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;