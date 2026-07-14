import * as Icons from "lucide-react";

function StatsCard({ value, label, iconName, color }) {
  const IconComponent = Icons[iconName] || Icons.TrendingUp;

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
      <div className={`p-3 rounded-lg mr-4 border ${selectedColor}`}>
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        <div className="text-sm font-medium text-slate-500 mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
