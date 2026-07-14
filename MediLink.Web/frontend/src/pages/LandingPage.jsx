import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import StatsCard from "../components/StatsCard";
import Footer from "../components/Footer";
import DashboardMockup from "../components/DashboardMockup";

function LandingPage() {
  const features = [
    {
      title: "Secure Digital Records",
      description: "Encrypted at rest and in transit. All patient medical histories are stored using enterprise-grade cryptographic standards to prevent unauthorized access.",
      iconName: "Lock",
      color: "blue",
    },
    {
      title: "Consent-Driven Access",
      description: "Doctors can view a patient's historical reports only after explicit OTP or biometric authorization from the patient. Complete transparency.",
      iconName: "Zap",
      color: "teal",
    },
    {
      title: "AI-Powered Insights",
      description: "Generate instant structured summaries from unstructured clinical records and run automatic checks for drug-to-drug or drug-to-allergy interactions.",
      iconName: "Sparkles",
      color: "emerald",
    },
  ];

  const stats = [
    {
      value: "100+",
      label: "Partner Hospitals",
      iconName: "Building",
      color: "blue",
    },
    {
      value: "500+",
      label: "Active Doctors",
      iconName: "UserCheck",
      color: "teal",
    },
    {
      value: "10,000+",
      label: "Electronic Records",
      iconName: "FileText",
      color: "emerald",
    },
    {
      value: "100%",
      label: "Secure & Compliant",
      iconName: "ShieldCheck",
      color: "amber",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-200">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Next-Gen HIPAA-Compliant Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
                Smart Healthcare.<br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Connected Records.</span><br />
                Better Decisions.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Securely manage patient medical records, connect hospitals, empower doctors with complete patient history, and improve healthcare through a centralized digital health platform.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all duration-200"
                >
                  Learn More
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Consent Governed</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">AES-256 Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Audit Trail Active</span>
                </div>
              </div>
            </div>

            {/* Right Dashboard Mockup Column */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <DashboardMockup />
            </div>

          </div>
        </div>
      </section>

      {/* Why MediLink Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Centralized & Secure Record Ecosystem
            </h2>
            <p className="mt-4 text-lg text-slate-500 text-balance">
              Designed to solve critical gaps in modern care. MediLink provides full patient histories with consent-driven safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat) => (
              <FeatureCard
                key={feat.title}
                title={feat.title}
                description={feat.description}
                iconName={feat.iconName}
                color={feat.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section id="trust" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Built on Trust and Real Metrics
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Connecting hospitals, laboratories, and clinics under a unified, trusted interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatsCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                iconName={stat.iconName}
                color={stat.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 py-12 px-6 sm:py-16 sm:px-12 shadow-2xl text-center">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/20 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="relative max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Transform Healthcare with MediLink
              </h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                Empower your doctors with accurate histories, reduce medical diagnostic errors, and simplify record collection. Get started in minutes.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
