import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";

function Navbar({ showLinks = true, customRight = null, customRightMobile = null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Security & Trust", href: "#trust" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Medi<span className="text-teal-500">Link</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {showLinks &&
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {customRight ? (
              customRight
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-950 hover:bg-slate-100 focus:outline-none transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100 border-t border-slate-200" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {showLinks &&
            navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          {customRightMobile ? (
            customRightMobile
          ) : (
            <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-2 px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
