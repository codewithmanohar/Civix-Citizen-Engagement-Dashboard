import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart2,
  Users,
  ClipboardList,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  const userName = localStorage.getItem("name") || "User";
  const userLocation = localStorage.getItem("location") || "Unknown";
  const role = localStorage.getItem("userRole"); // ✅ get role
  const currentRoute = useLocation(); // ✅ get current route

  const links = [
    {
      to: role === "citizen" ? "/dashboard/citizen" : "/dashboard/official",
      label: "Dashboard",
      icon: Home,
    },
    {
      to: role === "citizen"
        ? "/dashboard/citizen/petitions"
        : "/dashboard/official/petitions",
      label: "Petitions",
      icon: FileText,
    },
    { to: "/polls", label: "Polls", icon: BarChart2 },
    { to: "/officials", label: "Officials", icon: Users },
    { to: "/reports", label: "Reports", icon: ClipboardList },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-blue-50 border-r shadow-sm flex flex-col min-h-screen">
      {/* Profile */}
      <div className="p-6 border-b text-center bg-blue-100">
        <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold mx-auto">
          {userName.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-3 font-semibold text-gray-800">{userName}</h2>
        <p className="text-xs text-gray-500">
          {role === "official" ? "Official" : "Citizen"}
        </p>
        <p className="text-xs text-gray-400">📍 {userLocation}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = currentRoute.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
