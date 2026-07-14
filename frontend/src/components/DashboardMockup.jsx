import { Shield, Key, Stethoscope, FileText, CheckCircle2, Lock, User } from "lucide-react";

function DashboardMockup() {
  return (
    <div className="w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-4 sm:p-6 font-sans overflow-hidden text-left relative group hover:border-slate-700 transition-all duration-300">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-colors duration-300"></div>
      
      {/* Window Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Mock browser buttons */}
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
        </div>
        <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-[11px] text-slate-500 font-mono w-48 justify-center">
          medilink.io/vault/pt-8942
        </div>
        <div className="flex items-center space-x-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 pt-4">
        {/* Mock Sidebar */}
        <div className="col-span-3 border-r border-slate-800/80 pr-3 space-y-3 hidden sm:block">
          <div className="h-2 w-12 bg-slate-800 rounded"></div>
          <div className="space-y-2">
            <div className="h-5 w-full bg-slate-850 rounded flex items-center px-1.5 space-x-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
              <span className="h-1.5 w-10 bg-slate-700 rounded"></span>
            </div>
            <div className="h-5 w-full rounded flex items-center px-1.5 space-x-2 hover:bg-slate-800/40 transition-colors">
              <span className="w-2.5 h-2.5 rounded bg-slate-800"></span>
              <span className="h-1.5 w-8 bg-slate-800 rounded"></span>
            </div>
            <div className="h-5 w-full rounded flex items-center px-1.5 space-x-2 hover:bg-slate-800/40 transition-colors">
              <span className="w-2.5 h-2.5 rounded bg-slate-800"></span>
              <span className="h-1.5 w-12 bg-slate-800 rounded"></span>
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <div className="h-2 w-8 bg-slate-800 rounded"></div>
            <div className="h-4 w-full bg-slate-850/60 rounded"></div>
          </div>
        </div>

        {/* Mock Main Panel */}
        <div className="col-span-12 sm:col-span-9 space-y-4">
          
          {/* Header Status Card */}
          <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-950 text-blue-400 rounded-lg">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                <p className="text-[10px] text-slate-500">ID: ML-9024 • AB Positive</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 bg-blue-950 text-blue-400 border border-blue-900 px-2.5 py-1 rounded-full text-[10px] font-semibold">
              <CheckCircle2 className="h-3 w-3 text-blue-400" />
              <span>Access Approved</span>
            </div>
          </div>

          {/* Records Timeline */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Recent Clinical Events
            </div>

            {/* Timeline Item 1 */}
            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-850/30 transition-colors">
              <div className="p-1.5 bg-emerald-950 text-emerald-400 rounded-md border border-emerald-900/50 mt-0.5">
                <Stethoscope className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h5 className="text-xs font-medium text-white truncate">Cardiology Report Uploaded</h5>
                  <span className="text-[9px] text-slate-500 flex-shrink-0">5m ago</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Dr. Adrian Carter • St. Jude Medical Clinic</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-850/30 transition-colors">
              <div className="p-1.5 bg-blue-950 text-blue-400 rounded-md border border-blue-900/50 mt-0.5">
                <Key className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h5 className="text-xs font-medium text-white truncate">One-Time Consent Granted</h5>
                  <span className="text-[9px] text-slate-500 flex-shrink-0">1h ago</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Authorized via SMS OTP Verification</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-850/30 transition-colors">
              <div className="p-1.5 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50 mt-0.5">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h5 className="text-xs font-medium text-white truncate">MRI Scan Diagnostic Added</h5>
                  <span className="text-[9px] text-slate-500 flex-shrink-0">Yesterday</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Central Lab Services • PDF Report Encrypted</p>
              </div>
            </div>

          </div>

          {/* Audit trail alert */}
          <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-[9px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Lock className="h-3 w-3 text-slate-600" />
              <span>Audit Trail: Log hash #0d8a1f signed</span>
            </div>
            <span className="text-blue-500 font-semibold cursor-pointer hover:underline">Verify Integrity</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardMockup;
