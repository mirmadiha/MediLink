import { Link } from "react-router-dom";
import { Activity, ShieldAlert, FileText, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { name: "Features", href: "#features" },
      { name: "Roles Preview", href: "#roles" },
      { name: "Why MediLink", href: "#why-medilink" },
      { name: "Trust & Safety", href: "#trust" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms & Conditions", href: "#terms" },
      { name: "Patient Consent Form", href: "#consent" },
    ],
    contact: [
      { name: "Support Center", href: "mailto:support@medilink.com" },
      { name: "System Status", href: "#status" },
      { name: "Security Response", href: "#security" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-900/40 rounded-lg border border-blue-800">
                <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Medi<span className="text-teal-400">Link</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              MediLink is a secure, centralized digital healthcare platform built to protect patient records, eliminate duplications, and empower physicians with reliable patient histories.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200"
                aria-label="MediLink GitHub repository"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
              <div className="flex items-center space-x-1 text-xs bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {links.platform.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5">
              {links.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Support Column */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-2.5">
              {links.contact.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-lg bg-slate-800/40 border border-slate-800 flex items-start space-x-2">
              <ShieldAlert className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-normal">
                If you suspect unauthorized record access or a security vulnerability, contact our Response Team immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-slate-500">
            © {currentYear} MediLink. All Rights Reserved. Designed for 24h Hackathon MVP.
          </p>
          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" />
            <span>for Better Patient Care</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
