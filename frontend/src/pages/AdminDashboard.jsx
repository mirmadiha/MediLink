import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Pencil, Trash2, Plus, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight, Activity, LogOut, Search, X, User, Mail, Lock, Eye, EyeOff, Stethoscope, FileText } from "lucide-react";
import Navbar from "../components/Navbar";

function AdminDashboard({ doctors, setDoctors }) {
  const navigate = useNavigate();

  // Profile Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Deletion Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToRemove, setDoctorToRemove] = useState(null);

  // Create/Edit Doctor Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // Form State
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    stateRegistrationNumber: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form error state
  const [formErrors, setFormErrors] = useState({});

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers for deletion modal
  const handleRemoveClick = (doctor) => {
    setDoctorToRemove(doctor);
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    if (doctorToRemove) {
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctorToRemove.id));
      setShowDeleteModal(false);
      setDoctorToRemove(null);
    }
  };

  // Handlers for Create/Edit Modal
  const handleCreateClick = () => {
    setIsEditMode(false);
    setEditingDoctorId(null);
    setDoctorForm({
      name: "",
      email: "",
      password: "",
      specialization: "",
      stateRegistrationNumber: "",
    });
    setFormErrors({});
    setShowPassword(false);
    setShowFormModal(true);
  };

  const handleEditClick = (doctor) => {
    setIsEditMode(true);
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      name: doctor.name || "",
      email: doctor.email || "",
      password: "mockpassword123", // Pre-fill placeholder for password validation
      specialization: doctor.specialization || "",
      stateRegistrationNumber: doctor.stateRegistrationNumber || "",
    });
    setFormErrors({});
    setShowPassword(false);
    setShowFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!doctorForm.name.trim()) {
      newErrors.name = "Doctor's name is required";
    }

    if (!doctorForm.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(doctorForm.email)) {
        newErrors.email = "Please enter a valid email address (e.g. name@hospital.com)";
      }
    }

    if (!doctorForm.password) {
      newErrors.password = "Password is required";
    } else if (doctorForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!doctorForm.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!doctorForm.stateRegistrationNumber.trim()) {
      newErrors.stateRegistrationNumber = "State registration number is required";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const doctorObject = {
        name: doctorForm.name,
        email: doctorForm.email,
        password: doctorForm.password,
        specialization: doctorForm.specialization,
        stateRegistrationNumber: doctorForm.stateRegistrationNumber,
      };

      // Log to console as requested
      console.log(
        isEditMode ? "Updating doctor record:" : "Creating doctor record:",
        doctorObject
      );

      // TODO:
      // Replace with backend API

      if (isEditMode) {
        // Update local state
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === editingDoctorId
              ? {
                ...doc,
                name: doctorForm.name,
                email: doctorForm.email,
                specialization: doctorForm.specialization,
                stateRegistrationNumber: doctorForm.stateRegistrationNumber,
              }
              : doc
          )
        );
      } else {
        // Append new doctor to local state
        const newDoc = {
          id: Date.now().toString(),
          name: doctorForm.name,
          email: doctorForm.email,
          specialization: doctorForm.specialization,
          stateRegistrationNumber: doctorForm.stateRegistrationNumber,
        };
        setDoctors((prev) => [...prev, newDoc]);
      }

      setShowFormModal(false);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        showLinks={false}
        customRight={
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white"></span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  HA
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">Admin</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">admin@dh-srinagar.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 px-3 flex flex-col space-y-2">
            <div className="flex items-center space-x-3 px-3 py-1.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                HA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Hospital Admin</p>
                <p className="text-xs text-slate-400">District Hospital Srinagar</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-center py-2.5 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
            >
              Logout
            </button>
          </div>
        }
      />

      {/* Main Panel Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Welcome Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Hospital Portal
            </h1>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, Hospital Administrator
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Hospital: <span className="font-bold text-slate-800">District Hospital Srinagar</span>
          </p>
        </section>

        {/* Doctors Section Header */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Doctors with Access
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage doctors authorized to access patient records.
              </p>
            </div>
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              <span>Create Doctor</span>
            </button>
          </div>

          {/* Search bar & List */}
          {doctors.length > 0 && (
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors by name or username"
                className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Table or Empty State */}
          {filteredDoctors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                <Activity className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {searchQuery ? "No matching doctors found." : "No doctors have been added yet."}
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? "Try adjusting search terms or clear the filter."
                    : "Add practitioners to your hospital roster to grant them secure MediLink lookup privileges."}
                </p>
              </div>
              {!searchQuery && (
                <div>
                  <button
                    onClick={handleCreateClick}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    <span>Create Doctor</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Responsive Roster Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">State Registration Number</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{doctor.name}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{doctor.email}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                            {doctor.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-mono">{doctor.stateRegistrationNumber}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(doctor)}
                            className="inline-flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer border border-transparent hover:border-blue-100"
                            title="Edit doctor roster parameters"
                            aria-label="Edit Doctor"
                          >
                            <Pencil className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveClick(doctor)}
                            className="inline-flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Remove doctor access"
                            aria-label="Remove Doctor"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Section */}
              <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4.5 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-800">1</span> to{" "}
                  <span className="font-semibold text-slate-800">{filteredDoctors.length}</span> of{" "}
                  <span className="font-semibold text-slate-800">{filteredDoctors.length}</span> practitioners
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled
                    className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed opacity-50 text-xs font-medium"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled
                    className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed opacity-50 text-xs font-medium"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Roster Add/Edit Doctor Modal overlay */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            onClick={() => setShowFormModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>

          {/* Modal Dialog Card Container */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 z-55 animate-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {isEditMode ? "Edit Doctor Account" : "Create Doctor Account"}
                </h3>
                <p className="text-sm text-slate-500 leading-normal">
                  {isEditMode
                    ? "Update the doctor's roster parameters and credentials."
                    : "Add a doctor to your hospital roster and grant access to MediLink."}
                </p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    value={doctorForm.name}
                    onChange={handleFormChange}
                    placeholder="Enter doctor's full name"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${formErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Username (Immutable in Edit Mode) */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={doctorForm.email}
                    onChange={handleFormChange}
                    disabled={isEditMode}
                    placeholder="Enter username (email address)"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${isEditMode
                      ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                      : formErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                  />
                </div>
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
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
                    value={doctorForm.password}
                    onChange={handleFormChange}
                    placeholder="Enter access password"
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 border ${formErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
              </div>

              {/* Specialization & State Reg Grid */}
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
                      value={doctorForm.specialization}
                      onChange={handleFormChange}
                      placeholder="e.g. Cardiology"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${formErrors.specialization
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {formErrors.specialization && <p className="text-xs text-red-500 mt-1">{formErrors.specialization}</p>}
                </div>

                {/* State Reg Number */}
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
                      value={doctorForm.stateRegistrationNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. JKMC123456"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${formErrors.stateRegistrationNumber
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                    />
                  </div>
                  {formErrors.stateRegistrationNumber && <p className="text-xs text-red-500 mt-1">{formErrors.stateRegistrationNumber}</p>}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  {isEditMode ? "Update Doctor" : "Save Doctor"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>

          {/* Modal Dialog Card */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in duration-200 z-55">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Remove Doctor?</h3>
                <p className="text-sm text-slate-500 leading-normal">
                  Are you sure you want to remove Dr. {doctorToRemove?.name}'s access?
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors cursor-pointer text-center"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
