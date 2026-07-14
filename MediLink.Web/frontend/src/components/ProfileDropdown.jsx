import { useState } from "react";
import { LogOut } from "lucide-react";

function getInitials(fullName) {
  if (!fullName) {
    return "U";
  }

  const parts = fullName
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "U";
  }

  return parts.map((x) => x[0].toUpperCase()).join("");
}

function ProfileDropdown({ fullName, email, role, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {getInitials(fullName)}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-slate-700">{fullName || role || "User"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-200">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-bold text-slate-800 truncate">{fullName || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{email || ""}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
