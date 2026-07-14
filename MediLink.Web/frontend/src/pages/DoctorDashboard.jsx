import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, AlertTriangle, ShieldCheck, Activity, X, Heart, Eye, EyeOff, User, Mail, ShieldAlert, Plus, Trash2, Calendar, FileText, CheckCircle2, ChevronDown, ChevronUp, Stethoscope, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileDropdown from "../components/ProfileDropdown";
import { api, getApiErrorMessage } from "../services/api";

function DoctorDashboard() {
  const navigate = useNavigate();

  // Search States
  const [abhaId, setAbhaId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searched, setSearched] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [resolvedPatientName, setResolvedPatientName] = useState("Aisha Ahmad");
  const [resolvedPatientAbhaId, setResolvedPatientAbhaId] = useState("");
  const [doctorProfile, setDoctorProfile] = useState({
    fullName: "Doctor",
    userName: "",
    specialization: "General",
    hospitalName: "Hospital",
  });

  // Modal display states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeReport, setActiveReport] = useState(null); // Report modal state

  // Dummy Patient Database
  const dummyPatient = {
    name: "Aisha Ahmad",
    abhaId: "1234-5678-9012",
    age: "46 Years",
    gender: "Female",
    bloodGroup: "B+",
    chronicDiseases: ["Diabetes", "Hypertension", "Asthma"],
    allergies: ["Penicillin", "Sulfa Drugs"],
    surgeries: [
      { name: "Appendectomy", year: "2018" },
      { name: "Cataract Surgery", year: "2022" }
    ],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Telmisartan", dosage: "40mg", frequency: "Once daily" }
    ],
    vaccinations: ["COVID-19 Booster", "Hepatitis B"],
    reports: [
      { id: "r1", name: "Blood Test", date: "2026-06-12", result: "HbA1c: 6.8% (Elevated), Serum Creatinine: 0.9 mg/dL" },
      { id: "r2", name: "X-Ray Chest", date: "2026-05-30", result: "Normal lung fields. No cardiomegaly." },
      { id: "r3", name: "MRI Brain", date: "2026-03-15", result: "No acute infarct or hemorrhage. Mild microvascular changes." },
      { id: "r4", name: "ECG", date: "2026-06-25", result: "Sinus bradycardia. No ST-T abnormalities." }
    ]
  };

  // Prescription list state
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "p1",
      date: "2026-06-25",
      doctor: "Dr. Maqbool Khan",
      specialization: "Cardiology",
      diagnosis: "Essential Hypertension",
      medicines: [
        { name: "Telmisartan", dosage: "40mg", frequency: "Once Daily", duration: "30 Days" }
      ],
      instructions: "Monitor blood pressure twice daily. Low sodium diet."
    },
    {
      id: "p2",
      date: "2026-07-03",
      doctor: "Dr. Sarah Mir",
      specialization: "Neurology",
      diagnosis: "Migraine with Aura",
      medicines: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As Needed", duration: "10 Days" }
      ],
      instructions: "Take at the onset of headache. Avoid bright lights."
    }
  ]);

  // Expandable row state in History modal
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Search/Filters inside History modal
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [historyFilterSpecialization, setHistoryFilterSpecialization] = useState("");

  // Add Prescription Form State
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    instructions: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let mounted = true;

    async function loadDoctorProfile() {
      try {
        const profile = await api.profile();
        if (!mounted) {
          return;
        }

        setDoctorProfile({
          fullName: profile?.fullName || "Doctor",
          userName: profile?.userName || "",
          specialization: profile?.specialization || "General",
          hospitalName: profile?.hospitalName || "Hospital",
        });
      } catch {
        // Non-blocking profile fallback.
      }
    }

    loadDoctorProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const runPatientSearch = async () => {
    setSearchError("");
    if (!abhaId.trim()) {
      setSearchError("ABHA ID cannot be empty");
      setSearched(false);
      setPatientFound(false);
      setResolvedPatientAbhaId("");
      return;
    }

    try {
      const response = await api.doctorDashboard(abhaId.trim());
      const backendName = response?.patient?.fullName;

      if (!backendName) {
        setPatientFound(false);
        setResolvedPatientName(dummyPatient.name);
        setResolvedPatientAbhaId("");
        setSearched(true);
        return;
      }

      setResolvedPatientName(backendName);
      setResolvedPatientAbhaId(abhaId.trim());
      setPatientFound(true);
    } catch (error) {
      setSearchError(getApiErrorMessage(error, "Unable to fetch patient details."));
      setPatientFound(false);
      setResolvedPatientName(dummyPatient.name);
      setResolvedPatientAbhaId("");
    }

    setSearched(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await runPatientSearch();
  };

  // Medicine dynamically-rendered row handlers
  const handleAddMedicineRow = () => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dosage: "", frequency: "", duration: "" }]
    }));
  };

  const handleRemoveMedicineRow = (index) => {
    if (prescriptionForm.medicines.length === 1) return;
    setPrescriptionForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm((prev) => ({
      ...prev,
      medicines: updatedMedicines
    }));
    // Clear errors
    if (formErrors[`med_${index}_${field}`]) {
      setFormErrors((prev) => ({ ...prev, [`med_${index}_${field}`]: "" }));
    }
  };

  const handleInstructionsChange = (e) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      instructions: e.target.value
    }));
  };

  const handleDiagnosisChange = (e) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      diagnosis: e.target.value
    }));
    if (formErrors.diagnosis) {
      setFormErrors((prev) => ({ ...prev, diagnosis: "" }));
    }
  };

  const validatePrescriptionForm = () => {
    const errors = {};
    if (!prescriptionForm.diagnosis.trim()) {
      errors.diagnosis = "Diagnosis is required";
    }

    prescriptionForm.medicines.forEach((med, index) => {
      if (!med.name.trim()) errors[`med_${index}_name`] = "Required";
      if (!med.dosage.trim()) errors[`med_${index}_dosage`] = "Required";
      if (!med.frequency.trim()) errors[`med_${index}_frequency`] = "Required";
      if (!med.duration.trim()) errors[`med_${index}_duration`] = "Required";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (validatePrescriptionForm()) {
      const today = new Date().toISOString().split("T")[0];
      const prescriptionObject = {
        date: today,
        doctor: "Dr. Adrian Carter",
        specialization: "Cardiology",
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        instructions: prescriptionForm.instructions
      };

      console.log("Saving new patient prescription:", prescriptionObject);

      // TODO:
      // Replace with backend API integration later

      setPrescriptions((prev) => [
        {
          id: Date.now().toString(),
          ...prescriptionObject
        },
        ...prev
      ]);

      setShowPrescriptionModal(false);
    }
  };

  const filteredHistory = prescriptions.filter((item) => {
    const matchesSearch =
      item.diagnosis.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.doctor.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.medicines.some((med) => med.name.toLowerCase().includes(historySearchQuery.toLowerCase()));

    const matchesSpecialization = historyFilterSpecialization
      ? item.specialization === historyFilterSpecialization
      : true;

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic customizable Header */}
      <Navbar
        showLinks={false}
        customRight={
          <div className="flex items-center space-x-4">
            {/* Notification bell */}
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white"></span>
            </button>

            {/* Profile Dropdown loaded with Doctor info */}
            <ProfileDropdown
              fullName={doctorProfile.fullName}
              email={doctorProfile.userName}
              role="Doctor"
              onLogout={async () => {
                await api.logout();
                navigate("/login");
              }}
            />
          </div>
        }
        customRightMobile={
          <div className="pt-4 pb-2 border-t border-slate-100 px-3 flex flex-col space-y-2">
            <div className="flex items-center space-x-3 px-3 py-1.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                AC
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{doctorProfile.fullName}</p>
                <p className="text-xs text-slate-400">{doctorProfile.specialization} • {doctorProfile.hospitalName}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await api.logout();
                navigate("/login");
              }}
              className="w-full text-center py-2.5 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
            >
              Logout
            </button>
          </div>
        }
      />

      {/* Main Panel Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">

        {/* Welcome Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Clinician Portal
            </h1>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, Doctor
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Search patients using their ABHA ID and make informed clinical decisions using their complete medical history.
          </p>
        </section>

        {/* Find Patient search block */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Find Patient</h2>
            <p className="text-xs text-slate-500">Search a patient using their unique ABHA ID (Demo: 1234-5678-9012).</p>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="Enter Patient ABHA ID (e.g. 1234-5678-9012)"
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-slate-50 border ${searchError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
              />
            </div>
            <button
              type="button"
              onClick={runPatientSearch}
              disabled={abhaId.trim() === ""}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center cursor-pointer ${abhaId.trim() === ""
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                }`}
            >
              Search Patient
            </button>
          </form>
          {searchError && <p className="text-xs text-red-500 mt-1">{searchError}</p>}
        </section>

        {/* Results Block */}
        {searched && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {!patientFound ? (
              /* Empty not found banner */
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">No patient found with this ABHA ID.</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Verify that the identifier was entered correctly, or request the patient register a credentials profile.
                  </p>
                </div>
              </div>
            ) : (
              /* Patient Profile Details Section */
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 1. Patient Snapshot Card */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border border-blue-100 flex-shrink-0">
                        AA
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{resolvedPatientName}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">ABHA ID: {resolvedPatientAbhaId || abhaId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 lg:gap-12 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{dummyPatient.age}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{dummyPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</p>
                        <p className="text-sm font-bold text-red-600 mt-0.5 flex items-center">
                          <Heart className="w-3.5 h-3.5 fill-red-500 mr-1 text-red-500" />
                          <span>{dummyPatient.bloodGroup}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Clinical Badges Inside Snapshot */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chronic Diseases:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dummyPatient.chronicDiseases.map((d, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drug Allergies:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dummyPatient.allergies.map((a, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. AI Medical Summary (Highest Priority - Move directly below Snapshot) */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      🧠
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 leading-snug">AI Medical Summary</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        View an AI-generated summary of the patient's complete medical history, including allergies, repeat medication alerts, and clinical guidelines.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center whitespace-nowrap"
                  >
                    View AI Summary
                  </button>
                </section>

                {/* 3. Medical History (Grouped Section) */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">Patient Medical History</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Read-only diagnostic records retrieved from patient health vault.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 border-t border-slate-50">
                    {/* Column 1: Current Medications */}
                    <div className="space-y-3 md:border-r border-slate-100 pr-4 last:border-0">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Medications</h4>
                      <div className="space-y-2">
                        {dummyPatient.medications.map((m, i) => (
                          <div key={i} className="text-xs font-semibold text-slate-700">
                            <p>• {m.name} ({m.dosage})</p>
                            <p className="text-[10px] text-slate-400 font-normal ml-3">{m.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Previous Surgeries */}
                    <div className="space-y-3 md:border-r border-slate-100 pr-4 last:border-0">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Surgeries</h4>
                      <div className="space-y-2">
                        {dummyPatient.surgeries.map((s, i) => (
                          <div key={i} className="text-xs font-semibold text-slate-700 flex justify-between">
                            <span>• {s.name}</span>
                            <span className="text-slate-400 font-normal">({s.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Vaccination History */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vaccination History</h4>
                      <div className="flex flex-wrap gap-2">
                        {dummyPatient.vaccinations.map((v, i) => (
                          <div key={i} className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2.5 py-1 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Recent Medical Reports */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Medical Reports</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Click reports to preview original medical file scans.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dummyPatient.reports.map((r) => (
                      <div
                        key={r.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between space-x-3 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 truncate">{r.name}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">{r.date}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveReport(r)}
                          className="bg-white text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg py-1 px-3 text-xs font-semibold shadow-xs cursor-pointer flex-shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Consultation Actions (Grouped side by side at bottom) */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Action 1: Create Prescription */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Add Prescription</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Create a new medical prescription, diagnosis details, and dosages for today's visit.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="w-full py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center"
                    >
                      Create Prescription
                    </button>
                  </div>

                  {/* Action 2: View History */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Previous Prescriptions</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Search and review all historical prescriptions, chronic treatments, and diagnostic logs.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowHistoryModal(true)}
                      className="w-full py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center"
                    >
                      View History
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Summary Modal Overlay */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSummaryModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🧠</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AI Medical Summary</h3>
                  <p className="text-xs text-slate-400">Intelligent clinical summary for {resolvedPatientName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Patient Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Summary</h4>
                <p className="text-sm text-slate-700 leading-relaxed mt-1">
                  {resolvedPatientName} is a 46-year-old female presenting with a history of type-2 diabetes and essential hypertension. Her recent records display a high chronic glycemic index (HbA1c: 6.8%). She displays documented penicillin hypersensitivity and recurrent respiratory infections.
                </p>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chronic Illnesses</h5>
                  <p className="text-xs text-slate-700 font-semibold mt-1">• Diabetes Mellitus (HbA1c 6.8%)</p>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">• Essential Hypertension</p>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">• Mild Bronchial Asthma</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allergies & Surgeries</h5>
                  <p className="text-xs text-red-600 font-bold mt-1">• Allergy: Penicillin (Severe)</p>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">• Surgery: Appendectomy (2018)</p>
                </div>
              </div>

              {/* Warning Alert Repeated Antibiotic */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3.5">
                <div className="p-2 bg-amber-600 text-white rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-amber-800">Repeated Antibiotic Usage Alert</h5>
                  <p className="text-xs text-amber-700 leading-normal mt-0.5">
                    Patient was prescribed Amoxicillin 10 days ago (2026-07-03) for secondary bronchial infection. Repeated antibiotic usage within short intervals may trigger resistance thresholds.
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Clinical Recommendations</h4>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4.5 space-y-2.5">
                  <div className="flex items-start space-x-2 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <p className="text-blue-800 font-medium">Avoid prescribing Penicillin or related beta-lactam classes due to documented severe allergy.</p>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <p className="text-blue-800 font-medium">Amoxicillin script completed 10 days ago. Assess for bacterial clearance before any additional antibiosis.</p>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <p className="text-blue-800 font-medium">Monitor blood pressure. Telmisartan dosage is 40mg once daily; confirm patient compliance.</p>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <p className="text-blue-800 font-medium">Review kidney function indexes (e.g. serum creatinine) before adding new NSAID analgesics.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal Overlay */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowPrescriptionModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">💊</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Create Prescription</h3>
                  <p className="text-xs text-slate-400">Add digital script details for {resolvedPatientName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              {/* Date & Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Consultation Date
                  </label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toISOString().split("T")[0]}
                    className="block w-full px-3 py-2 text-sm rounded-lg bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="diagnosisInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    id="diagnosisInput"
                    value={prescriptionForm.diagnosis}
                    onChange={handleDiagnosisChange}
                    placeholder="Enter clinical diagnosis"
                    className={`block w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border ${formErrors.diagnosis
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                  />
                  {formErrors.diagnosis && <p className="text-xs text-red-500 mt-1">{formErrors.diagnosis}</p>}
                </div>
              </div>

              {/* Medicines row list */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Medicines</h4>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                {prescriptionForm.medicines.map((med, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative space-y-3">
                    {prescriptionForm.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Medicine Name
                        </label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                          placeholder="e.g. Paracetamol"
                          className={`block w-full px-3 py-1.5 text-xs rounded-lg bg-white border ${formErrors[`med_${index}_name`] ? "border-red-500" : "border-slate-200"
                            } text-slate-900 placeholder-slate-400 focus:outline-none`}
                        />
                      </div>
                      {/* Dosage */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                          placeholder="e.g. 500mg"
                          className={`block w-full px-3 py-1.5 text-xs rounded-lg bg-white border ${formErrors[`med_${index}_dosage`] ? "border-red-500" : "border-slate-200"
                            } text-slate-900 placeholder-slate-400 focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Frequency */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Frequency
                        </label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                          placeholder="e.g. Once Daily / Twice Daily"
                          className={`block w-full px-3 py-1.5 text-xs rounded-lg bg-white border ${formErrors[`med_${index}_frequency`] ? "border-red-500" : "border-slate-200"
                            } text-slate-900 placeholder-slate-400 focus:outline-none`}
                        />
                      </div>
                      {/* Duration */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                          placeholder="e.g. 5 Days / 30 Days"
                          className={`block w-full px-3 py-1.5 text-xs rounded-lg bg-white border ${formErrors[`med_${index}_duration`] ? "border-red-500" : "border-slate-200"
                            } text-slate-900 placeholder-slate-400 focus:outline-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <label htmlFor="instructionsInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Instructions
                </label>
                <textarea
                  id="instructionsInput"
                  rows="2"
                  value={prescriptionForm.instructions}
                  onChange={handleInstructionsChange}
                  placeholder="e.g. Take after meals, monitor BP..."
                  className="block w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-all"
                ></textarea>
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-105 hover:bg-slate-200 rounded-lg shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Previous Prescriptions History Modal Overlay */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowHistoryModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Previous Prescriptions</h3>
                  <p className="text-xs text-slate-400">Clinical logs for {resolvedPatientName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Smart Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder="Search diagnosis, medicine or doctor..."
                  className="block w-full pl-10 pr-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
                {historySearchQuery && (
                  <button
                    onClick={() => setHistorySearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <select
                  value={historyFilterSpecialization}
                  onChange={(e) => setHistoryFilterSpecialization(e.target.value)}
                  className="block w-full py-2 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-slate-50 focus:outline-none"
                >
                  <option value="">All Specializations</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>
            </div>

            {/* History Table */}
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-semibold text-slate-500">No prescriptions match your query.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diagnosis</th>
                        <th className="relative px-5 py-3.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredHistory.map((item) => {
                        const isExpanded = expandedRowId === item.id;
                        return (
                          <React.Fragment key={item.id}>
                            <tr
                              onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                              className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                            >
                              <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-slate-800">{item.date}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-700">{item.doctor}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">
                                  {item.specialization}
                                </span>
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-800 font-semibold">{item.diagnosis}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-right text-slate-400">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-50/50">
                                <td colSpan="5" className="px-5 py-4 border-t border-slate-100">
                                  <div className="space-y-3.5 text-xs text-slate-700">
                                    <div>
                                      <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">Prescribed Medicines</h5>
                                      <div className="space-y-1.5">
                                        {item.medicines.map((med, mIndex) => (
                                          <p key={mIndex} className="font-semibold text-slate-800 flex flex-wrap gap-x-2">
                                            <span>• {med.name}</span>
                                            <span className="text-slate-400 font-normal">| Dosage: {med.dosage}</span>
                                            <span className="text-slate-400 font-normal">| Frequency: {med.frequency}</span>
                                            <span className="text-slate-400 font-normal">| Duration: {med.duration}</span>
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                    {item.instructions && (
                                      <div>
                                        <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Additional Instructions</h5>
                                        <p className="text-slate-600 italic font-medium">"{item.instructions}"</p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clickable Report Detail Dialog Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveReport(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in duration-200 z-55">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{activeReport.name}</h3>
                <p className="text-xs text-slate-400">Date: {activeReport.date}</p>
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-700 font-mono leading-relaxed">{activeReport.result}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-105 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline helper for React.Fragment support
import React from "react";

export default DoctorDashboard;