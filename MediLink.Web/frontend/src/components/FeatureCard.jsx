import * as Icons from "lucide-react";

function FeatureCard({ title, description, iconName, color }) {
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-start`}>
      <div className={`p-4 rounded-xl ${selectedColor.bg} ${selectedColor.text} mb-6`}>
        <IconComponent className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
