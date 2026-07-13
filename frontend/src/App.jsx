import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MasterDashboard from "./pages/MasterDashboard";

function App() {
  const [doctors, setDoctors] = useState([
    { id: "1", name: "Dr. Adrian Carter", email: "dr.carter@medilink.com", specialization: "Cardiology", stateRegistrationNumber: "JKMC123456" },
    { id: "2", name: "Dr. Sarah Jenkins", email: "dr.jenkins@medilink.com", specialization: "Neurology", stateRegistrationNumber: "JKMC987654" }
  ]);

  const [hospitals, setHospitals] = useState([
    { id: "1", name: "District Hospital Srinagar", address: "Srinagar", adminName: "Amina Khan", status: "Active" },
    { id: "2", name: "SMHS Hospital", address: "Srinagar", adminName: "Ahmed Shah", status: "Active" },
    { id: "3", name: "SKIMS", address: "Srinagar", adminName: "Fatima Ali", status: "Active" }
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard doctors={doctors} setDoctors={setDoctors} />} />
        <Route path="/master-admin/dashboard" element={<MasterDashboard hospitals={hospitals} setHospitals={setHospitals} doctorsCount={doctors.length} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;