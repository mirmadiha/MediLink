import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Plus, Pencil, Trash2, Home, Landmark, Users, Stethoscope, AlertTriangle, ShieldCheck, Activity, X, Building2, UserPlus, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileDropdown from "../components/ProfileDropdown";

function MasterDashboard({ hospitals, setHospitals, doctorsCount }) {
  const navigate = useNavigate();

  // Dialog State controls
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit/Create context indicators
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [hospitalToRemove, setHospitalToRemove] = useState(null);

  // Form State - Add/Edit Hospital
  const [hospitalForm, setHospitalForm] = useState({
    name: "",
    address: "",
  });
  const [hospitalErrors, setHospitalErrors] = useState({});

  // Form State - Create Admin
  const [adminForm, setAdminForm] = useState({
    hospitalId: "",
    name: "",
    contactNumber: "",
    username: "",
    password: "",
  });
  const [adminErrors, setAdminErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Stats computation
  const totalHospitals = hospitals.length;
  const totalAdminsCount = hospitals.filter(h => h.adminName && h.adminName !== "Unassigned").length;

  const handleLogout = () => {
    navigate("/login");
  };

  // Remove Handlers
  const handleRemoveClick = (hospital) => {
    setHospitalToRemove(hospital);
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    if (hospitalToRemove) {
      setHospitals((prev) => prev.filter((h) => h.id !== hospitalToRemove.id));
      setShowDeleteModal(false);
      setHospitalToRemove(null);
    }
  };

  // Hospital Form handlers
  const handleHospitalChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm((prev) => ({ ...prev, [name]: value }));
    if (hospitalErrors[name]) {
      setHospitalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleHospitalCreateClick = () => {
    setIsEditMode(false);
    setEditingHospitalId(null);
    setHospitalForm({ name: "", address: "" });
    setHospitalErrors({});
    setShowHospitalModal(true);
  };

  const handleHospitalEditClick = (hospital) => {
    setIsEditMode(true);
    setEditingHospitalId(hospital.id);
    setHospitalForm({
      name: hospital.name || "",
      address: hospital.address || "",
    });
    setHospitalErrors({});
    setShowHospitalModal(true);
  };

  const handleHospitalSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!hospitalForm.name.trim()) errors.name = "Hospital name is required";
    if (!hospitalForm.address.trim()) errors.address = "Hospital address is required";

    if (Object.keys(errors).length > 0) {
      setHospitalErrors(errors);
      return;
    }

    const hospitalObject = {
      name: hospitalForm.name,
      address: hospitalForm.address,
    };

    console.log(isEditMode ? "Updating hospital record:" : "Creating hospital record:", hospitalObject);

    // TODO:
    // Replace with backend API later

    if (isEditMode) {
      setHospitals((prev) =>
        prev.map((h) =>
          h.id === editingHospitalId
            ? { ...h, name: hospitalForm.name, address: hospitalForm.address }
            : h
        )
      );
    } else {
      const newHospital = {
        id: Date.now().toString(),
        name: hospitalForm.name,
        address: hospitalForm.address,
        adminName: "Unassigned",
        status: "Active",
      };
      setHospitals((prev) => [...prev, newHospital]);
    }

    setShowHospitalModal(false);
  };

  // Admin Form Handlers
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
    if (adminErrors[name]) {
      setAdminErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAdminCreateClick = () => {
    setAdminForm({
      hospitalId: hospitals[0]?.id || "",
      name: "",
      contactNumber: "",
      username: "",
      password: "",
    });
    setAdminErrors({});
    setShowPassword(false);
    setShowAdminModal(true);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!adminForm.hospitalId) errors.hospitalId = "Affiliated hospital is required";
    if (!adminForm.name.trim()) errors.name = "Admin name is required";
    
    const phoneRegex = /^\d{10}$/;
    if (!adminForm.contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!phoneRegex.test(adminForm.contactNumber)) {
      errors.contactNumber = "Contact number must contain only digits and be exactly 10 digits";
    }

    if (!adminForm.username.trim()) {
      errors.username = "Username/Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminForm.username)) {
        errors.username = "Please enter a valid email address (e.g. name@hospital.com)";
      }
    }

    if (!adminForm.password) {
      errors.password = "Admin password is required";
    } else if (adminForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setAdminErrors(errors);
      return;
    }

    const adminObject = {
      hospitalId: adminForm.hospitalId,
      name: adminForm.name,
      contactNumber: adminForm.contactNumber,
      username: adminForm.username,
      password: adminForm.password,
    };

    console.log("Creating hospital administrator account:", adminObject);

    // TODO:
    // Replace with backend API later

    // Update local state: find the hospital and assign the new admin name
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === adminForm.hospitalId ? { ...h, adminName: adminForm.name } : h
      )
    );

    setShowAdminModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        showLinks={false}
        customRight={
          <div className="flex items-center space-x-4">
            {/* Notification trigger icon */}
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white"></span>
            </button>

            {/* Reusable Profile Dropdown component */}
            <ProfileDropdown
              fullName="Master Admin"
              email="master@medilink.com"
              role="Master Administrator"
              onLogout={handleLogout}
            />
          </div>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 px-3 flex flex-col space-y-2">
            <div className="flex items-center space-x-3 px-3 py-1.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                MA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Master Admin</p>
                <p className="text-xs text-slate-400">Platform Administrator</p>
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

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Welcome Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Master Admin Control
            </h1>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, Master Administrator
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage hospitals and hospital administrators across the MediLink platform.
          </p>
        </section>

        {/* Statistics Cards grid layout */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Hospitals */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Hospitals</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{totalHospitals}</h4>
            </div>
          </div>

          {/* Card 2: Hospital Admins */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospital Admins</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{totalAdminsCount}</h4>
            </div>
          </div>

          {/* Card 3: Registered Doctors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Doctors</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{doctorsCount}</h4>
            </div>
          </div>
        </section>

        {/* Hospital Registry Manager */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hospitals</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage all registered hospitals within MediLink.</p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleHospitalCreateClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Add Hospital</span>
              </button>
              {hospitals.length > 0 && (
                <button
                  onClick={handleAdminCreateClick}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Create Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Table display list or Empty state */}
          {hospitals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">No hospitals have been added yet.</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Register clinical branches and clinic networks to enable digital vault directories.
                </p>
              </div>
              <div>
                <button
                  onClick={handleHospitalCreateClick}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Add Hospital</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Name</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Admin</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {hospitals.map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{hospital.name}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{hospital.address}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                          {hospital.adminName === "Unassigned" ? (
                            <span className="text-slate-400 italic text-xs">Unassigned</span>
                          ) : (
                            <span className="font-medium text-slate-800">{hospital.adminName}</span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          <button
                            onClick={() => handleHospitalEditClick(hospital)}
                            className="inline-flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer border border-transparent hover:border-blue-100"
                            title="Edit hospital details"
                            aria-label="Edit Hospital"
                          >
                            <Pencil className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveClick(hospital)}
                            className="inline-flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Remove hospital access"
                            aria-label="Remove Hospital"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* If there are hospitals but NO hospital admins are assigned */}
          {hospitals.length > 0 && totalAdminsCount === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">No hospital administrators have been created yet.</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Create administrative credentials to grant access permissions for registered hospitals.
                </p>
              </div>
              <div>
                <button
                  onClick={handleAdminCreateClick}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  <span>Create Admin</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Add / Edit Hospital Modal Overlay */}
      {showHospitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowHospitalModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {isEditMode ? "Edit Hospital" : "Add Hospital"}
                </h3>
                <p className="text-sm text-slate-500">
                  {isEditMode ? "Update hospital branches details." : "Register a hospital node to the MediLink network."}
                </p>
              </div>
              <button
                onClick={() => setShowHospitalModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="hospitalName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="hospitalName"
                    name="name"
                    value={hospitalForm.name}
                    onChange={handleHospitalChange}
                    placeholder="e.g. District Hospital Srinagar"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      hospitalErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {hospitalErrors.name && <p className="text-xs text-red-500 mt-1">{hospitalErrors.name}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="hospitalAddress" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Home className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="hospitalAddress"
                    name="address"
                    value={hospitalForm.address}
                    onChange={handleHospitalChange}
                    placeholder="e.g. Srinagar"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      hospitalErrors.address
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {hospitalErrors.address && <p className="text-xs text-red-500 mt-1">{hospitalErrors.address}</p>}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Hospital
                </button>
                <button
                  type="button"
                  onClick={() => setShowHospitalModal(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Admin Modal Overlay */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAdminModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Create Admin</h3>
                <p className="text-sm text-slate-500">Provide administrative access to an affiliated hospital.</p>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Hospital Dropdown Selection */}
              <div>
                <label htmlFor="hospitalSelect" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital
                </label>
                <select
                  id="hospitalSelect"
                  name="hospitalId"
                  value={adminForm.hospitalId}
                  onChange={handleAdminChange}
                  className="block w-full py-2.5 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
                {adminErrors.hospitalId && <p className="text-xs text-red-500 mt-1">{adminErrors.hospitalId}</p>}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="adminName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="adminName"
                    name="name"
                    value={adminForm.name}
                    onChange={handleAdminChange}
                    placeholder="Enter administrator full name"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      adminErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {adminErrors.name && <p className="text-xs text-red-500 mt-1">{adminErrors.name}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={adminForm.contactNumber}
                    onChange={handleAdminChange}
                    placeholder="e.g. 9876543210"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      adminErrors.contactNumber
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {adminErrors.contactNumber && <p className="text-xs text-red-500 mt-1">{adminErrors.contactNumber}</p>}
              </div>

              {/* Username (Email address) */}
              <div>
                <label htmlFor="adminUsername" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Username (Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="adminUsername"
                    name="username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                    placeholder="e.g. name@hospital.com"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      adminErrors.username
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                </div>
                {adminErrors.username && <p className="text-xs text-red-500 mt-1">{adminErrors.username}</p>}
              </div>

              {/* Admin Password */}
              <div>
                <label htmlFor="adminPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="adminPassword"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    placeholder="Enter access password"
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 border ${
                      adminErrors.password
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
                {adminErrors.password && <p className="text-xs text-red-500 mt-1">{adminErrors.password}</p>}
              </div>

              {/* Actions footer buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hospital Deletion Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in duration-200 z-55">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Remove Hospital?</h3>
                <p className="text-sm text-slate-500 leading-normal">
                  Are you sure you want to remove {hospitalToRemove?.name}? This will sever all administrator profiles and credentials connected to this branch.
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

export default MasterDashboard;
