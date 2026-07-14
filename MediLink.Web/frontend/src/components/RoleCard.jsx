import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

function RoleCard({ roleKey, name, description, iconName, accentColor }) {
  // Dynamically resolve icon from lucide-react
  const IconComponent = Icons[iconName] || Icons.User;

  // Map of borders and text hover colors based on accentColor
  const borderClasses = {
    blue: "hover:border-blue-500 border-t-4 border-t-blue-600",
    teal: "hover:border-teal-500 border-t-4 border-t-teal-500",
    green: "hover:border-emerald-500 border-t-4 border-t-emerald-500",
    purple: "hover:border-purple-500 border-t-4 border-t-purple-500",
  };

  const bgIconClasses = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const buttonClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    teal: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
    green: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
  };

  return (
    <div className={`flex flex-col justify-between p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${borderClasses[accentColor] || borderClasses.blue}`}>
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-lg ${bgIconClasses[accentColor] || bgIconClasses.blue}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>
      
      <Link
        to={`/login?role=${roleKey}`}
        className={`w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClasses[accentColor] || buttonClasses.blue} group`}
      >
        <span>Continue as {name}</span>
        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  );
}

export default RoleCard;
