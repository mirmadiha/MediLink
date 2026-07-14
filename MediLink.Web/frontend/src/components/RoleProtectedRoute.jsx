import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, getCachedProfile } from "../services/api";

function normalizeRole(role) {
  return (role || "").toLowerCase();
}

export function getDashboardPathByRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "masteradmin") {
    return "/master/dashboard";
  }

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (normalizedRole === "doctor") {
    return "/doctor/dashboard";
  }

  return "/patient/dashboard";
}

function RoleProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, authorized: false, redirectPath: "/login" });
  const allowed = (allowedRoles || []).map((x) => x.toLowerCase());
  const allowedKey = allowed.join("|");

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      try {
        const cachedProfile = getCachedProfile();
        if (cachedProfile) {
          const cachedRole = normalizeRole(cachedProfile?.role);
          if (allowed.includes(cachedRole)) {
            setState({ loading: false, authorized: true, redirectPath: "" });
            return;
          }

          setState({
            loading: false,
            authorized: false,
            redirectPath: getDashboardPathByRole(cachedRole),
          });
          return;
        }

        const profile = await api.profile();
        const normalizedRole = normalizeRole(profile?.role);

        if (!isMounted) {
          return;
        }

        if (allowed.includes(normalizedRole)) {
          setState({ loading: false, authorized: true, redirectPath: "" });
          return;
        }

        setState({
          loading: false,
          authorized: false,
          redirectPath: getDashboardPathByRole(normalizedRole),
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({ loading: false, authorized: false, redirectPath: "/login" });
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [allowedKey]);

  if (state.loading) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!state.authorized) {
    return <Navigate to={state.redirectPath} replace state={{ from: location }} />;
  }

  return children;
}

export default RoleProtectedRoute;
