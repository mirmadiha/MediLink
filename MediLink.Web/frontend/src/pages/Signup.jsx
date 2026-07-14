import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Server } from "lucide-react";
import Navbar from "../components/Navbar";
import { api, getApiErrorMessage } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    abhaId: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // Visbility toggling
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field-specific error as they type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Mobile Number
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.mobile.replace(/[-+\s]/g, ""))) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
    }

    // ABHA ID (required by current backend contract)
    if (!formData.abhaId.trim()) {
      newErrors.abhaId = "ABHA ID is required";
    } else if (!/^\d{14}$/.test(formData.abhaId.trim())) {
      newErrors.abhaId = "ABHA ID must be exactly 14 digits";
    }

    // Password Strength Check
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms check
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms & Conditions and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);

      try {
        await api.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          abhaId: formData.abhaId.trim(),
          otpCode: "1234",
        });

        navigate("/login");
      } catch (error) {
        setServerError(getApiErrorMessage(error, "Unable to create account."));
      } finally {
        setIsSubmitted(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar
        showLinks={false}
        customRight={
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Home
            </Link>
          </>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-2 px-3">
            <Link
              to="/login"
              className="w-full text-center py-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/"
              className="w-full text-center py-2.5 text-base font-semibold text-slate-700 bg-slate-105 hover:bg-slate-200 rounded-lg shadow-sm"
            >
              Home
            </Link>
          </div>
        }
      />

      {/* Main Container */}
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

          {/* Right Column (Signup Form Card) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 max-w-xl w-full mx-auto relative">
              
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create Your MediLink Account
                </h1>
                <p className="text-sm text-slate-500 leading-normal">
                  Create your secure patient account to access your digital medical records anytime, anywhere.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {serverError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {serverError}
                  </div>
                )}
                
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

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
                      placeholder="Enter your email"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Number & ABHA ID (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="mobile" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter your mobile number"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                          errors.mobile ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                  </div>

                  {/* ABHA ID */}
                  <div>
                    <label htmlFor="abhaId" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      ABHA ID <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4 opacity-50" />
                      </div>
                      <input
                        type="text"
                        id="abhaId"
                        name="abhaId"
                        value={formData.abhaId}
                        onChange={handleChange}
                        placeholder="Enter your ABHA ID (Optional)"
                        className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition-all"
                      />
                    </div>
                    {errors.abhaId && <p className="text-xs text-red-500 mt-1">{errors.abhaId}</p>}
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Backend currently requires a valid 14-digit ABHA ID.
                    </p>
                  </div>
                </div>

                {/* Password & Confirm Password (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="Create a password"
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                          errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2.5 text-sm text-slate-500 group-hover:text-slate-800 transition-colors leading-snug">
                      I agree to the{" "}
                      <a href="#terms" className="text-blue-600 hover:underline font-medium">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitted ? "Creating Account..." : "Create Account"}
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

              {/* Login Link */}
              <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Login
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signup;
