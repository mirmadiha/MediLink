import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Pencil, Trash2, Plus, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight, Activity, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import { api, getApiErrorMessage } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Deletion Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToRemove, setDoctorToRemove] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [doctorRows, profileResponse] = await Promise.all([
          api.listDoctors(),
          api.profile(),
        ]);

        if (!isMounted) {
          return;
        }

        setDoctors(
          (doctorRows || []).map((doc) => ({
            id: doc.id,
            name: doc.fullName,
            username: doc.email,
            specialization: doc.specialization,
            stateRegistrationNumber: doc.stateRegistrationNumber,
          }))
        );
        setProfile(profileResponse || null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (loadError.status === 401) {
          navigate("/login");
          return;
        }

        if (loadError.status === 403) {
          setError("You are signed in but do not have access to the hospital admin dashboard.");
          return;
        }

        setError(getApiErrorMessage(loadError, "Unable to load dashboard."));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleRemoveClick = (doctor) => {
    setDoctorToRemove(doctor);
    setShowDeleteModal(true);
  };

  const confirmRemove = async () => {
    if (doctorToRemove) {
      try {
        await api.deleteDoctor(doctorToRemove.id);
        setDoctors((prev) => prev.filter((doc) => doc.id !== doctorToRemove.id));
      } catch (removeError) {
        setError(getApiErrorMessage(removeError, "Unable to remove doctor."));
      } finally {
        setShowDeleteModal(false);
        setDoctorToRemove(null);
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/admin/edit-doctor/${id}`);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic customizable Navbar */}
      <Navbar
        showLinks={false}
        customRight={
          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border border-white"></span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  HA
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">{profile?.fullName || "Admin"}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{profile?.userName || "admin"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-bold text-slate-800">{profile?.fullName || "Admin"}</p>
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
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Welcome Back,
            </h1>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {profile?.fullName || "Hospital Administrator"}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-blue-500 uppercase">Affiliated Hospital</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.hospitalName || "Hospital"}</p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Doctors with Access Header */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Doctors with Access
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage medical practitioners authorized to access patient vaults at your clinic.
              </p>
            </div>
            {doctors.length > 0 && (
              <Link
                to="/admin/create-doctor"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Create Doctor</span>
              </Link>
            )}
          </div>

          {/* Table or Empty State */}
          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm text-slate-500 text-sm">
              Loading doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                <Activity className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">No doctors have been added yet.</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Add practitioners to your hospital roster to grant them secure MediLink lookups and script management.
                </p>
              </div>
              <div>
                <Link
                  to="/admin/create-doctor"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Create Doctor</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Responsive Table Wrapper */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">State Registration Number</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-slate-900">{doctor.name}</td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-500">{doctor.username}</td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                            {doctor.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-600 font-mono">{doctor.stateRegistrationNumber}</td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(doctor.id)}
                            className="inline-flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveClick(doctor)}
                            className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Remove Doctor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Section */}
              <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-800">1</span> to{" "}
                  <span className="font-semibold text-slate-800">{doctors.length}</span> of{" "}
                  <span className="font-semibold text-slate-800">{doctors.length}</span> practitioners
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

      {/* Deletion Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>

          {/* Modal Dialog Card */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in duration-200">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Remove Doctor?</h3>
                <p className="text-sm text-slate-500 leading-normal">
                  Are you sure you want to remove Dr. {doctorToRemove?.name}'s access? They will no longer be authorized to lookup patient archives at {profile?.hospitalName || "Hospital"}.
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
