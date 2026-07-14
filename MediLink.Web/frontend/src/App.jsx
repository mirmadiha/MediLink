import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateDoctor from "./pages/CreateDoctor";

function App() {
  const [doctors, setDoctors] = useState([
    { id: "1", name: "Dr. Adrian Carter", username: "dr.carter@medilink.com", specialization: "Cardiology", stateRegistrationNumber: "JKMC123456" },
    { id: "2", name: "Dr. Sarah Jenkins", username: "dr.jenkins@medilink.com", specialization: "Neurology", stateRegistrationNumber: "JKMC987654" }
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard doctors={doctors} setDoctors={setDoctors} />} />
        <Route path="/admin/create-doctor" element={<CreateDoctor doctors={doctors} setDoctors={setDoctors} />} />
        <Route path="/admin/edit-doctor/:id" element={<CreateDoctor doctors={doctors} setDoctors={setDoctors} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;