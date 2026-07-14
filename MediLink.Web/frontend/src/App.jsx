import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateDoctor from "./pages/CreateDoctor";
import DoctorDashboard from "./pages/DoctorDashboard";
import MasterDashboard from "./pages/MasterDashboard";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/patient/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Patient"]}>
              <PatientDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Doctor"]}>
              <DoctorDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/create-doctor"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <CreateDoctor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-doctor/:id"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <CreateDoctor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/master/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["MasterAdmin"]}>
              <MasterDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;