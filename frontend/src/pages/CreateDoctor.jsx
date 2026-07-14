import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, User, Mail, Lock, Stethoscope, FileText, CheckCircle2, Server, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

function CreateDoctor({ doctors, setDoctors }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    specialization: "",
    stateRegistrationNumber: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing doctor details in Edit mode
  useEffect(() => {
    if (isEditMode) {
      const doc = doctors.find((d) => d.id === id);
      if (doc) {
        setFormData({
          name: doc.name || "",
          username: doc.username || "",
          password: "mockpassword123", // Pre-fill with placeholder for validation
          specialization: doc.specialization || "",
          stateRegistrationNumber: doc.stateRegistrationNumber || "",
        });
      } else {
        // Redirect if doctor ID is invalid
        navigate("/admin/dashboard");
      }
    }
  }, [id, isEditMode, doctors, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Doctor's name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username/Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.username)) {
        newErrors.username = "Please enter a valid email address (e.g. name@hospital.com)";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!formData.stateRegistrationNumber.trim()) {
      newErrors.stateRegistrationNumber = "State registration number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      const doctorObject = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        specialization: formData.specialization,
        stateRegistrationNumber: formData.stateRegistrationNumber,
      };

      // Log the doctor object to the console as requested
      console.log(isEditMode ? "Updating doctor record:" : "Creating doctor record:", doctorObject);

      // TODO:
      // Replace with backend API

      setTimeout(() => {
        setIsSubmitting(false);

        if (isEditMode) {
          // Update in local dummy state
          setDoctors((prev) =>
            prev.map((doc) =>
              doc.id === id
                ? {
                    ...doc,
                    name: formData.name,
                    username: formData.username,
                    specialization: formData.specialization,
                    stateRegistrationNumber: formData.stateRegistrationNumber,
                  }
                : doc
            )
          );
        } else {
          // Append new doctor to local dummy state
          const newDoc = {
            id: Date.now().toString(),
            name: formData.name,
            username: formData.username,
            specialization: formData.specialization,
            stateRegistrationNumber: formData.stateRegistrationNumber,
          };
          setDoctors((prev) => [...prev, newDoc]);
        }

        navigate("/admin/dashboard");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        showLinks={false}
        customRight={
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-105 hover:bg-slate-200 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 px-3 flex flex-col">
            <Link
              to="/admin/dashboard"
              className="w-full text-center py-2.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        }
      />

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Backdrop shapes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
          
          {/* Left Column (Shared Security Vault Illustration Panel) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-slate-900 border border-slate-800 text-white rounded-3xl relative overflow-hidden shadow-2xl">
            {/* Background design glow */}
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

            {/* Live Vault Status details */}
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

              {/* Secure features list */}
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

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-slate-800">
              <span>Security Hash: #ml-pt-v4</span>
              <span>HIPAA & SOC-2 Ready</span>
            </div>
          </div>

          {/* Right Column ( Roster Form Card ) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 max-w-xl w-full mx-auto relative">
              
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isEditMode ? "Edit Doctor Account" : "Create Doctor Account"}
                </h1>
                <p className="text-sm text-slate-500 leading-normal">
                  {isEditMode
                    ? "Update the doctor's roster parameters and credentials."
                    : "Add a doctor to your hospital roster and grant access to MediLink."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Doctor Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter doctor's full name"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username (email address)"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                        errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
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
                      placeholder="Enter access password"
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

                {/* Specialization & State Registration Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Specialization */}
                  <div>
                    <label htmlFor="specialization" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Specialization
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Cardiology"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                          errors.specialization ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                      />
                    </div>
                    {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization}</p>}
                  </div>

                  {/* State Registration Number */}
                  <div>
                    <label htmlFor="stateRegistrationNumber" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      State Reg Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="stateRegistrationNumber"
                        name="stateRegistrationNumber"
                        value={formData.stateRegistrationNumber}
                        onChange={handleChange}
                        placeholder="e.g. JKMC123456"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                          errors.stateRegistrationNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                      />
                    </div>
                    {errors.stateRegistrationNumber && <p className="text-xs text-red-500 mt-1">{errors.stateRegistrationNumber}</p>}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    {isSubmitting
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                      ? "Update Doctor"
                      : "Save Doctor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Back
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default CreateDoctor;
