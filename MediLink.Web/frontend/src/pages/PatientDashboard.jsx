import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, Heart, FileText, Clipboard, Pill, ShieldCheck, CheckCircle2, 
  X, AlertTriangle, HelpCircle, ArrowRight, ArrowDown, Activity, Calendar, Download, Sparkles, Upload
} from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileDropdown from "../components/ProfileDropdown";
import { api } from "../services/api";

function PatientDashboard() {
  const navigate = useNavigate();

  // State hooks for interactive modals
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null); // Detailed prescription modal
  const [activeReport, setActiveReport] = useState(null); // Report modal
  const [activeExplanationReport, setActiveExplanationReport] = useState(null); // AI Explain modal
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false); // Toggle to show more prescriptions
  const [showNavigationAlert, setShowNavigationAlert] = useState(false); // AI detailed analysis CTA toast/alert
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [newlyUploadedId, setNewlyUploadedId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "Blood Test",
    hospital: "",
    date: new Date().toISOString().split("T")[0],
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [profileIdentity, setProfileIdentity] = useState({
    fullName: "Aisha Ahmad",
    email: "aisha@gmail.com",
    abhaId: "1234-5678-9012",
  });

  // Mock patient profile
  const patientProfile = {
    name: "Aisha Ahmad",
    abhaId: "1234-5678-9012",
    age: "46 Years",
    gender: "Female",
    bloodGroup: "B+"
  };

  useEffect(() => {
    let mounted = true;

    async function loadProfileIdentity() {
      try {
        const profile = await api.profile();
        if (!mounted) {
          return;
        }

        setProfileIdentity({
          fullName: profile?.fullName || "Aisha Ahmad",
          email: profile?.userName || "aisha@gmail.com",
          abhaId: profile?.abhaId || "1234-5678-9012",
        });
      } catch {
        // Keep hardcoded fallback when API is unavailable.
      }
    }

    loadProfileIdentity();

    return () => {
      mounted = false;
    };
  }, []);

  // Chronic conditions checklist for Medical History modal
  const medicalHistoryData = {
    chronicConditions: ["Type 2 Diabetes", "Hypertension"],
    allergies: ["Penicillin Allergy"],
    surgeries: [
      { name: "Appendectomy", year: "2019" }
    ],
    immunizations: ["COVID-19 Booster", "Hepatitis B Vaccine"],
    previousDiagnoses: [
      { condition: "Mild Asthmatic Bronchitis", date: "2024-11-12" },
      { condition: "Dyslipidemia", date: "2025-06-15" }
    ]
  };

  // Complete prescription history list
  const prescriptionsHistory = [
    {
      id: "pr1",
      doctorName: "Dr. Maqbool Khan",
      specialization: "Cardiology",
      date: "12 July 2026",
      hospital: "District Hospital Srinagar",
      medicineCount: 4,
      diagnosis: "Type 2 Diabetes & Essential Hypertension",
      medicines: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily (after meals)", duration: "90 Days" },
        { name: "Telmisartan", dosage: "40mg", frequency: "Once daily (morning)", duration: "90 Days" },
        { name: "Atorvastatin", dosage: "10mg", frequency: "Once daily (night)", duration: "90 Days" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily (after lunch)", duration: "90 Days" }
      ],
      notes: "Monitor blood pressure twice daily. Follow a low sodium, low sugar diet. Exercise at least 30 minutes daily."
    },
    {
      id: "pr2",
      doctorName: "Dr. Sarah Mir",
      specialization: "Neurology",
      date: "03 July 2026",
      hospital: "SMHS Hospital",
      medicineCount: 2,
      diagnosis: "Migraine with Aura",
      medicines: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed (at onset of headache)", duration: "10 Days" },
        { name: "Propranolol", dosage: "40mg", frequency: "Twice daily (for migraine prophylaxis)", duration: "30 Days" }
      ],
      notes: "Avoid bright light, high volume noise, and dehydration triggers. Maintain a sleep log."
    },
    {
      id: "pr3",
      doctorName: "Dr. Maqbool Khan",
      specialization: "Cardiology",
      date: "15 April 2026",
      hospital: "District Hospital Srinagar",
      medicineCount: 3,
      diagnosis: "Essential Hypertension",
      medicines: [
        { name: "Telmisartan", dosage: "40mg", frequency: "Once daily (morning)", duration: "90 Days" },
        { name: "Atorvastatin", dosage: "10mg", frequency: "Once daily (night)", duration: "90 Days" },
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily (evening)", duration: "30 Days" }
      ],
      notes: "Reduce salt intake. Restrict high lipid index food ingredients."
    }
  ];

  // Lab reports state data
  const [reportsList, setReportsList] = useState([
    {
      id: "lr1",
      name: "CBC Report",
      date: "12 July 2026",
      type: "Complete Blood Count",
      result: "Hemoglobin: 12.5 g/dL (Normal), White Blood Cells: 6,500 /uL (Normal), Platelets: 250,000 /uL (Normal).",
      aiExplanation: "Your Complete Blood Count (CBC) report is completely healthy. Your hemoglobin, white blood cells, and platelets are all within their standard reference ranges. This indicates that you do not have anemia, your body has a strong capacity to fight common infections, and blood clotting parameters are normal."
    },
    {
      id: "lr2",
      name: "HbA1c Test",
      date: "10 July 2026",
      type: "Glycated Hemoglobin",
      result: "HbA1c: 6.8% (Elevated).",
      aiExplanation: "Your HbA1c is 6.8%, which is slightly elevated above the optimal threshold of 5.7% to 6.4%. In clinical contexts, this indicates either pre-diabetes or managed diabetes. It is important to continue taking Metformin, restrict refined sugars, and follow up with a blood sugar log."
    },
    {
      id: "lr3",
      name: "Lipid Profile",
      date: "15 June 2026",
      type: "Cholesterol Panel",
      result: "Total Cholesterol: 210 mg/dL (Borderline High), LDL: 135 mg/dL (Elevated), HDL: 45 mg/dL (Normal).",
      aiExplanation: "Your lipid panel shows a borderline high total cholesterol of 210 mg/dL and slightly elevated LDL ('bad cholesterol') of 135 mg/dL. The prescribed Atorvastatin will help lower these numbers. Balance with high-fiber grains and minimize saturated fats."
    }
  ]);

  // Recent activity timeline data
  const recentActivities = [
    { text: "CBC Report uploaded", time: "Yesterday", status: "completed" },
    { text: "Prescription updated", time: "3 days ago", status: "completed" },
    { text: "AI Summary generated", time: "Last week", status: "completed" },
    { text: "Doctor reviewed your records", time: "2 weeks ago", status: "completed" }
  ];

  // Clear newlyUploadedId success status after 3 seconds
  useEffect(() => {
    if (newlyUploadedId) {
      const timer = setTimeout(() => {
        setNewlyUploadedId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newlyUploadedId]);

  // Helper date formatter
  const formatReportDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const handleFileSelected = (file) => {
    setUploadError("");
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a PDF, PNG, or JPG/JPEG report.");
      setSelectedFile(null);
      return;
    }
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size exceeds 20 MB limit.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!uploadForm.title) {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setUploadForm(prev => ({ ...prev, title: baseName }));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!selectedFile) {
      setUploadError("Please select or drag a report file to upload.");
      return;
    }
    if (!uploadForm.title.trim()) {
      errors.title = "Report Title is required";
    }
    if (!uploadForm.hospital.trim()) {
      errors.hospital = "Hospital / Laboratory is required";
    }
    if (!uploadForm.date) {
      errors.date = "Report Date is required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let aiExplanation = "";
    if (uploadForm.type === "X-Ray" || uploadForm.type === "MRI" || uploadForm.type === "CT Scan") {
      aiExplanation = `Your uploaded ${uploadForm.type} scan of the anatomical region has been successfully processed. The scans show normal structural integrity, intact joint alignment, and no signs of acute trauma or skeletal disruptions. Clear soft tissue outlines are observed.`;
    } else if (uploadForm.type === "Blood Test" || uploadForm.type === "Urine Test") {
      aiExplanation = `Your uploaded ${uploadForm.type} details have been parsed by MediLink's AI. Core metabolic panels, blood cell levels, and chemical components lie within stable baseline boundaries. No anomalies or severe flags are detected.`;
    } else {
      aiExplanation = `Your uploaded ${uploadForm.title} report has been analyzed by MediLink AI. All indicators appear healthy and lie within the normal reference thresholds. Please review these results with your attending clinician during follow-up visits.`;
    }

    const newReportId = "lr_" + Date.now();
    const newReport = {
      id: newReportId,
      name: uploadForm.title,
      date: formatReportDate(uploadForm.date),
      type: uploadForm.type,
      result: `File: ${selectedFile.name} | Facility: ${uploadForm.hospital} | Notes: ${uploadForm.notes || "None"}`,
      aiExplanation: aiExplanation
    };

    setReportsList((prev) => [newReport, ...prev]);
    setNewlyUploadedId(newReportId);

    // Reset and close
    setSelectedFile(null);
    setUploadForm({
      title: "",
      type: "Blood Test",
      hospital: "",
      date: new Date().toISOString().split("T")[0],
      notes: ""
    });
    setFormErrors({});
    setShowUploadModal(false);
  };

  // Mock download prescription function
  const handleDownloadPrescription = (e) => {
    e.stopPropagation();
    alert("Downloading detailed prescription PDF...");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Header / Navigation Bar */}
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

            {/* Profile Dropdown loaded with Patient info */}
            <ProfileDropdown
              fullName={profileIdentity.fullName}
              email={profileIdentity.email}
              role="Patient"
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
                AA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{profileIdentity.fullName}</p>
                <p className="text-xs text-slate-400">ABHA ID: {profileIdentity.abhaId}</p>
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-in fade-in duration-300">
        
        {/* Welcome Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Patient Portal
            </h1>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {profileIdentity.fullName}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Access your secure digital health record, review prescriptions, understand your health using AI, and manage your medical information.
          </p>
        </section>

        {/* Patient Profile Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
            {/* Left: Patient details */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-blue-200 flex-shrink-0 shadow-sm relative overflow-hidden">
                <span className="relative z-10">AA</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">{profileIdentity.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ABHA ID: {profileIdentity.abhaId}</p>
              </div>
            </div>

            {/* Right: Demographics Grid */}
            <div className="grid grid-cols-3 gap-6 lg:gap-12 text-xs border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{patientProfile.age}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{patientProfile.gender}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</p>
                <p className="text-sm font-bold text-red-600 mt-0.5 flex items-center">
                  <Heart className="w-3.5 h-3.5 fill-red-500 mr-1 text-red-500" />
                  <span>{patientProfile.bloodGroup}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Column Diagnostic & Care cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Medical History */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  <Clipboard className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">Checked</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Medical History</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Chronic conditions, allergies, surgeries, immunizations, and previous diagnoses.
                </p>
                {/* Sample realistic preview items */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 text-[10px] font-semibold">Type 2 Diabetes</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 text-[10px] font-semibold">Hypertension</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-semibold">Penicillin Allergy</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">Appendectomy (2019)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer text-center"
            >
              View History
            </button>
          </section>

          {/* Card 2: Prescriptions (💊) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
                  <Pill className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">Rx Files</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Prescriptions</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Complete list of historical and active scripts prescribed by your doctor.
                </p>

                {/* Sublist mapping with hover elevation animations */}
                <div className="space-y-2.5">
                  {prescriptionsHistory
                    .slice(0, showAllPrescriptions ? prescriptionsHistory.length : 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActivePrescription(item)}
                        className="group p-3 bg-slate-50 border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2"
                      >
                        <div className="flex justify-between items-start min-w-0">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
                              {item.doctorName}
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-none mt-1">{item.hospital}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                          <span>{item.medicineCount} Medicines</span>
                          <span className="text-teal-600 font-bold group-hover:underline flex items-center">
                            <span>View</span>
                            <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {prescriptionsHistory.length > 2 && (
              <button
                onClick={() => setShowAllPrescriptions((prev) => !prev)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer text-center"
              >
                {showAllPrescriptions ? "View Fewer Prescriptions" : "View All Prescriptions"}
              </button>
            )}
          </section>

          {/* Card 3: Lab Reports */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded">Scans</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Lab Reports</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Blood tests, radiology reports, diagnostic scans, and pathology results.
                </p>

                {/* Lab reports lists */}
                <div className="space-y-2">
                  {reportsList.map((report) => {
                    const isNew = report.id === newlyUploadedId;
                    return (
                      <div 
                        key={report.id} 
                        className={`p-3 border rounded-xl flex items-center justify-between space-x-2 transition-all duration-500 ${
                          isNew 
                            ? "bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-300/30 scale-[1.02]" 
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{report.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{report.date}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveReport(report)}
                            className="px-2 py-1 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveExplanationReport(report)}
                            className="px-2 py-1 text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded hover:bg-purple-100 cursor-pointer flex items-center animate-pulse"
                          >
                            <Sparkles className="w-2.5 h-2.5 mr-0.5 animate-spin" style={{ animationDuration: '3s' }} />
                            <span>AI Explain</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Upload Report trigger at the bottom of the card */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="w-full py-2.5 text-xs font-bold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </button>
          </section>

        </div>

        {/* Featured AI Health Summary Section (Visual Highlight Centerpiece) */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50/20 border border-purple-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl mt-0.5">🧠</span>
                <div>
                  <h3 className="text-lg font-extrabold text-purple-950 tracking-tight">AI Health Summary</h3>
                  <p className="text-xs text-purple-600 font-medium">
                    AI-generated insights based on your medical history, prescriptions, diagnoses, allergies, and lab reports.
                  </p>
                </div>
              </div>

              {/* Status & progress score display */}
              <div className="flex items-center space-x-4 bg-white/80 border border-purple-100 rounded-xl px-4 py-2 flex-shrink-0 shadow-xs">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Health Status</p>
                  <p className="text-xs font-extrabold text-emerald-600 flex items-center mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                    <span>Stable</span>
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Health Score</p>
                  <p className="text-xs font-extrabold text-purple-800 mt-0.5">
                    86 <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Greeting */}
            <div className="text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-800">Hello {profileIdentity.fullName?.split(" ")[0] || "Patient"},</p>
              <p className="text-slate-500 mt-1">Based on your available health records, here is an easy-to-understand summary of your current health.</p>
            </div>

            {/* Main AI Insights list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Insight panel */}
              <div className="bg-white/80 border border-slate-100 rounded-xl p-4.5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Patient Insights</h4>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <p className="flex items-start">
                    <span className="text-emerald-600 mr-2">✅</span>
                    <span>Your diabetes appears well managed with your current medications.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-emerald-600 mr-2">✅</span>
                    <span>Your blood pressure has remained stable over recent visits.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2">🧪</span>
                    <span>Recent blood reports show most values are within the normal range.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span>Mild Vitamin D deficiency was detected.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">❤️</span>
                    <span>No immediate high-risk health concerns were identified.</span>
                  </p>
                </div>
              </div>

              {/* Alert list & Follow-ups */}
              <div className="space-y-4">
                {/* Important Alerts */}
                <div className="bg-red-50/30 border border-red-100 rounded-xl p-4.5 space-y-3">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Important Alerts</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 text-xs font-semibold">
                      ⚠ Severe Penicillin Allergy
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
                      ⚠ Continue monitoring blood sugar regularly
                    </span>
                  </div>
                </div>

                {/* Follow up grid */}
                <div className="bg-white/80 border border-slate-100 rounded-xl p-4.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Follow-up</h4>
                  <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                    <p className="flex items-center">• Repeat HbA1c in 3 months</p>
                    <p className="flex items-center">• Schedule your annual physician visit</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Recommendations & Suggestions list */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4.5 space-y-2.5">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">Lifestyle Suggestions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-purple-950">
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  <span>Reduce sugar intake</span>
                </p>
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  <span>Exercise 30 mins daily</span>
                </p>
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  <span>Stay hydrated</span>
                </p>
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  <span>Take daily medications</span>
                </p>
              </div>
            </div>

            {/* CTA Trigger */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowNavigationAlert(true)}
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>View Detailed AI Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            </div>

          </div>
        </section>

        {/* Recent Activity Timeline card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological timeline of active diagnostic uploads and updates.</p>
          </div>

          <div className="relative pl-6 border-l border-slate-200 space-y-5 py-1">
            {recentActivities.map((act, index) => (
              <div key={index} className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                
                <div>
                  <p className="text-xs font-semibold text-slate-800">{act.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 1. Medical History Details Modal Overlay */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowHistoryModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">📋</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Medical History Summary</h3>
                  <p className="text-xs text-slate-400">Verifiably synchronized EHR clinical records</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Chronic Conditions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Chronic Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {medicalHistoryData.chronicConditions.map((cond, i) => (
                    <span key={i} className="inline-flex px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-100 text-xs font-semibold">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Active Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {medicalHistoryData.allergies.map((allergy, i) => (
                    <span key={i} className="inline-flex px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Surgeries */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Previous Surgeries</h4>
                <div className="space-y-1">
                  {medicalHistoryData.surgeries.map((s, i) => (
                    <p key={i} className="text-xs font-semibold text-slate-700">
                      • {s.name} <span className="text-slate-400 font-normal">({s.year})</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Immunizations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vaccination & Immunization History</h4>
                <div className="flex flex-wrap gap-2">
                  {medicalHistoryData.immunizations.map((imm, i) => (
                    <span key={i} className="inline-flex px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                      {imm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Previous Diagnoses */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Previous Diagnoses</h4>
                <div className="space-y-1.5">
                  {medicalHistoryData.previousDiagnoses.map((diag, i) => (
                    <div key={i} className="text-xs font-semibold text-slate-700 flex justify-between">
                      <span>• {diag.condition}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">{diag.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Detailed Prescription Sheet Modal Overlay */}
      {activePrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActivePrescription(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">💊</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Prescription Sheet</h3>
                  <p className="text-xs text-slate-400">Date: {activePrescription.date}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePrescription(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Doctor Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescribing Doctor</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{activePrescription.doctorName}</p>
                  <p className="text-[10px] text-slate-400">{activePrescription.specialization}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Facility</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{activePrescription.hospital}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{activePrescription.diagnosis}</p>
              </div>

              {/* Medicines List */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Medicines</p>
                <div className="space-y-2">
                  {activePrescription.medicines.map((med, i) => (
                    <div key={i} className="flex justify-between items-start p-2.5 bg-slate-50/50 border border-slate-150 rounded-lg text-xs">
                      <div>
                        <p className="font-bold text-slate-800">• {med.name} ({med.dosage})</p>
                        <p className="text-[10px] text-slate-400 ml-3.5 mt-0.5">{med.frequency}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 border border-slate-200 rounded flex-shrink-0">
                        {med.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor's Notes */}
              {activePrescription.notes && (
                <div className="p-3.5 bg-amber-50/20 border border-amber-100 rounded-xl">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Doctor's Notes</p>
                  <p className="text-xs text-slate-600 italic leading-relaxed mt-1">"{activePrescription.notes}"</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleDownloadPrescription}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setActivePrescription(null)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Lab Report File Detail Modal Overlay */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveReport(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in zoom-in duration-200 z-55">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{activeReport.name}</h3>
                <p className="text-xs text-slate-400 font-medium">Uploaded: {activeReport.date}</p>
                <p className="text-[10px] text-slate-400 italic mt-0.5">{activeReport.type}</p>
                
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-700 font-mono leading-relaxed">{activeReport.result}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI Lab Explanation Report Modal Overlay */}
      {activeExplanationReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveExplanationReport(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in zoom-in duration-200 z-55">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Report Explanation</h3>
                  <p className="text-xs text-slate-400">Simplifying clinical diagnostics for patients</p>
                </div>
              </div>
              <button
                onClick={() => setActiveExplanationReport(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Report summary */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Lab File</p>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">{activeExplanationReport.name} ({activeExplanationReport.type})</h4>
              </div>

              {/* Patient result review */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raw Diagnostics Result</p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-1">
                  <p className="text-xs text-slate-700 font-mono">{activeExplanationReport.result}</p>
                </div>
              </div>

              {/* AI Translation response block */}
              <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
                <h5 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
                  <span>AI Simplified Explanation</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeExplanationReport.aiExplanation}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveExplanationReport(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-105 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close AI Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Detailed AI analysis CTA Navigation Toast Alert Overlay */}
      {showNavigationAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4.5 flex items-start space-x-4 max-w-sm">
            <div className="p-2 bg-purple-600 rounded-lg text-white mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold tracking-wide">Navigating to AI Analysis</h5>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                Detailed AI Analysis page is a future roadmap module. Live API prompt pipelines will synchronize here during backend staging.
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNavigationAlert(false)}
                  className="px-2.5 py-1 text-[9px] font-bold text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Upload Lab Report Modal Overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-350">
          <div
            onClick={() => setShowUploadModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 z-55 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Lab Report</h3>
                  <p className="text-xs text-slate-400">Add a new medical scan or report to your secure database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag & Drop Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  File Upload
                </label>
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelected(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? "border-blue-500 bg-blue-50/20" 
                      : selectedFile 
                        ? "border-emerald-300 bg-emerald-50/10" 
                        : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
                  }`}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input 
                    type="file" 
                    id="fileInput" 
                    accept=".pdf,.png,.jpg,.jpeg" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileSelected(file);
                    }}
                  />
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[300px] mx-auto">{selectedFile.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-blue-600 hover:underline">Browse Files</span>
                        <span className="mx-1">or drag & drop your report here</span>
                        <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG up to 20MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label htmlFor="reportTitleInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Report Title
                  </label>
                  <input
                    type="text"
                    id="reportTitleInput"
                    value={uploadForm.title}
                    onChange={(e) => {
                      setUploadForm((prev) => ({ ...prev, title: e.target.value }));
                      if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="e.g. CBC Report"
                    className={`block w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border ${
                      formErrors.title ? "border-red-500" : "border-slate-200"
                    } text-slate-900 placeholder-slate-400 focus:outline-none`}
                  />
                  {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="reportTypeSelect" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Report Type
                  </label>
                  <select
                    id="reportTypeSelect"
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="block w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="Urine Test">Urine Test</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="ECG">ECG</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hospital / Lab */}
                <div>
                  <label htmlFor="reportHospitalInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Hospital / Laboratory
                  </label>
                  <input
                    type="text"
                    id="reportHospitalInput"
                    value={uploadForm.hospital}
                    onChange={(e) => {
                      setUploadForm((prev) => ({ ...prev, hospital: e.target.value }));
                      if (formErrors.hospital) setFormErrors((prev) => ({ ...prev, hospital: "" }));
                    }}
                    placeholder="e.g. District Hospital Srinagar"
                    className={`block w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border ${
                      formErrors.hospital ? "border-red-500" : "border-slate-200"
                    } text-slate-900 placeholder-slate-400 focus:outline-none`}
                  />
                  {formErrors.hospital && <p className="text-xs text-red-500 mt-1">{formErrors.hospital}</p>}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="reportDateInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Report Date
                  </label>
                  <input
                    type="date"
                    id="reportDateInput"
                    value={uploadForm.date}
                    onChange={(e) => {
                      setUploadForm((prev) => ({ ...prev, date: e.target.value }));
                      if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: "" }));
                    }}
                    className={`block w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border ${
                      formErrors.date ? "border-red-500" : "border-slate-200"
                    } text-slate-700 focus:outline-none`}
                  />
                  {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="reportNotesInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Optional Notes
                </label>
                <textarea
                  id="reportNotesInput"
                  rows="2"
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information..."
                  className="block w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none"
                ></textarea>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Upload Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientDashboard;