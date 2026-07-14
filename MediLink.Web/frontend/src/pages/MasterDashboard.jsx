import { useEffect, useMemo, useState } from "react";
import { Bell, Plus, Pencil, Trash2, Landmark, Users, AlertTriangle, X, Building2 } from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileDropdown from "../components/ProfileDropdown";
import { api, getApiErrorMessage } from "../services/api";

function MasterDashboard() {
  const [profile, setProfile] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [hospitalToRemove, setHospitalToRemove] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({ name: "", address: "" });
  const [hospitalErrors, setHospitalErrors] = useState({});

  const [adminForm, setAdminForm] = useState({
    hospitalId: "",
    name: "",
    contactNumber: "",
    username: "",
    password: "",
  });
  const [adminErrors, setAdminErrors] = useState({});

  const totalHospitals = hospitals.length;
  const totalAdminsCount = adminCount;

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ id: h.id, name: h.name })),
    [hospitals]
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [profileData, hospitalRows, adminsCountResponse] = await Promise.all([
          api.profile(),
          api.listHospitals(),
          api.adminCount(),
        ]);
        if (!mounted) {
          return;
        }

        setProfile(profileData || null);
        setAdminCount(Number(adminsCountResponse?.count || 0));
        setHospitals(
          (hospitalRows || []).map((h) => ({
            id: h.id,
            name: h.name,
            address: h.address,
            status: "Active",
          }))
        );
      } catch (e) {
        if (!mounted) {
          return;
        }
        setError(getApiErrorMessage(e, "Unable to load master dashboard."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      window.location.href = "/login";
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
    setHospitalForm({ name: hospital.name || "", address: hospital.address || "" });
    setHospitalErrors({});
    setShowHospitalModal(true);
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!hospitalForm.name.trim()) {
      errors.name = "Hospital name is required";
    }
    if (!hospitalForm.address.trim()) {
      errors.address = "Hospital address is required";
    }

    if (Object.keys(errors).length > 0) {
      setHospitalErrors(errors);
      return;
    }

    try {
      if (isEditMode && editingHospitalId) {
        await api.updateHospital(editingHospitalId, {
          hospitalName: hospitalForm.name,
          address: hospitalForm.address,
        });

        setHospitals((prev) =>
          prev.map((h) =>
            h.id === editingHospitalId ? { ...h, name: hospitalForm.name, address: hospitalForm.address } : h
          )
        );
      } else {
        const created = await api.createHospital({
          hospitalName: hospitalForm.name,
          address: hospitalForm.address,
        });

        setHospitals((prev) => [
          ...prev,
          {
            id: created?.id,
            name: hospitalForm.name,
            address: hospitalForm.address,
            status: "Active",
          },
        ]);
      }

      setShowHospitalModal(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save hospital."));
    }
  };

  const handleRemoveClick = (hospital) => {
    setHospitalToRemove(hospital);
    setShowDeleteModal(true);
  };

  const confirmRemove = async () => {
    if (!hospitalToRemove) {
      return;
    }

    try {
      await api.deleteHospital(hospitalToRemove.id);
      setHospitals((prev) => prev.filter((h) => h.id !== hospitalToRemove.id));
      setShowDeleteModal(false);
      setHospitalToRemove(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to delete hospital."));
    }
  };

  const handleAdminCreateClick = () => {
    setAdminForm({
      hospitalId: hospitalOptions[0]?.id?.toString() || "",
      name: "",
      contactNumber: "",
      username: "",
      password: "",
    });
    setAdminErrors({});
    setShowAdminModal(true);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!adminForm.hospitalId) {
      errors.hospitalId = "Affiliated hospital is required";
    }
    if (!adminForm.name.trim()) {
      errors.name = "Admin name is required";
    }
    if (!adminForm.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    }
    if (!adminForm.username.trim()) {
      errors.username = "Username is required";
    }
    if (!adminForm.password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setAdminErrors(errors);
      return;
    }

    try {
      await api.createHospitalAdmin({
        hospitalId: Number(adminForm.hospitalId),
        adminFullName: adminForm.name,
        adminEmail: adminForm.username,
        adminPassword: adminForm.password,
        contact: adminForm.contactNumber,
      });

      setAdminCount((prev) => prev + 1);
      setShowAdminModal(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create hospital admin."));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar
        showLinks={false}
        customRight={
          <div className="flex items-center space-x-4">
            <button type="button" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white"></span>
            </button>
            <ProfileDropdown
              fullName={profile?.fullName || "Master Admin"}
              email={profile?.userName || "masteradmin@medilink.com"}
              role="Master Administrator"
              onLogout={handleLogout}
            />
          </div>
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Master Admin Dashboard</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage hospitals and assign admins across the platform.</p>
        </section>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><Landmark className="h-6 w-6" /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Hospitals</p><h4 className="text-2xl font-black text-slate-900 mt-1">{totalHospitals}</h4></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl"><Users className="h-6 w-6" /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospital Admins</p><h4 className="text-2xl font-black text-slate-900 mt-1">{totalAdminsCount}</h4></div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hospitals</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage all registered hospitals.</p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button onClick={handleHospitalCreateClick} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"><Plus className="mr-1.5 h-4 w-4" /><span>Add Hospital</span></button>
              {hospitals.length > 0 && <button onClick={handleAdminCreateClick} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-all cursor-pointer"><Plus className="mr-1.5 h-4 w-4" /><span>Create Admin</span></button>}
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm text-slate-500 text-sm">Loading hospitals...</div>
          ) : hospitals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center"><Building2 className="h-8 w-8" /></div>
              <h3 className="text-lg font-bold text-slate-900">No hospitals have been added yet.</h3>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50"><tr><th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Name</th><th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th><th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th></tr></thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {hospitals.map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{hospital.name}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{hospital.address}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          <button onClick={() => handleHospitalEditClick(hospital)} className="inline-flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"><Pencil className="h-4.5 w-4.5" /></button>
                          <button onClick={() => handleRemoveClick(hospital)} className="inline-flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"><Trash2 className="h-4.5 w-4.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {showHospitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowHospitalModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 z-55">
            <div className="flex justify-between items-start">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{isEditMode ? "Edit Hospital" : "Add Hospital"}</h3>
              <button onClick={() => setShowHospitalModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              <input name="name" value={hospitalForm.name} onChange={(e) => setHospitalForm((p) => ({ ...p, name: e.target.value }))} placeholder="Hospital name" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              {hospitalErrors.name && <p className="text-xs text-red-500">{hospitalErrors.name}</p>}
              <input name="address" value={hospitalForm.address} onChange={(e) => setHospitalForm((p) => ({ ...p, address: e.target.value }))} placeholder="Hospital address" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              {hospitalErrors.address && <p className="text-xs text-red-500">{hospitalErrors.address}</p>}
              <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer">Save Hospital</button>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAdminModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 z-55">
            <div className="flex justify-between items-start">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Create Admin</h3>
              <button onClick={() => setShowAdminModal(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <select value={adminForm.hospitalId} onChange={(e) => setAdminForm((p) => ({ ...p, hospitalId: e.target.value }))} className="block w-full py-2.5 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50">
                {hospitalOptions.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <input value={adminForm.name} onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))} placeholder="Admin full name" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              <input value={adminForm.contactNumber} onChange={(e) => setAdminForm((p) => ({ ...p, contactNumber: e.target.value }))} placeholder="Contact number" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              <input value={adminForm.username} onChange={(e) => setAdminForm((p) => ({ ...p, username: e.target.value }))} placeholder="Admin email" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              <input type="password" value={adminForm.password} onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))} placeholder="Admin password" className="block w-full px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200" />
              {Object.values(adminErrors).length > 0 && <p className="text-xs text-red-500">Please fill all required fields.</p>}
              <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer">Save Admin</button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 z-55">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex-shrink-0"><AlertTriangle className="h-6 w-6" /></div>
              <div className="space-y-1"><h3 className="text-lg font-bold text-slate-900">Remove Hospital?</h3><p className="text-sm text-slate-500 leading-normal">Are you sure you want to remove {hospitalToRemove?.name}?</p></div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center">Cancel</button>
              <button onClick={confirmRemove} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer text-center">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterDashboard;
