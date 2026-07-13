import { useState, useEffect, useRef } from "react";
import { User, LogOut, Settings, Shield } from "lucide-react";

function ProfileDropdown({ fullName = "Admin", email = "admin@medilink.com", role = "Administrator", onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return "ML";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile options"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-sm">
          {getInitials(fullName)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-slate-700 leading-none">{fullName}</p>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5 leading-none">{role}</p>
        </div>
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info header info */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {getInitials(fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate leading-snug">{fullName}</p>
              <p className="text-xs text-slate-500 truncate leading-normal">{email}</p>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                <Shield className="w-2.5 h-2.5 mr-1" />
                {role}
              </span>
            </div>
          </div>

          {/* Links list */}
          <div className="py-1">
            <button
              onClick={handleLinkClick}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors cursor-pointer"
              role="menuitem"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              onClick={handleLinkClick}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors cursor-pointer"
              role="menuitem"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-1"></div>

          {/* Logout trigger */}
          <div className="py-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors cursor-pointer font-medium"
              role="menuitem"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
