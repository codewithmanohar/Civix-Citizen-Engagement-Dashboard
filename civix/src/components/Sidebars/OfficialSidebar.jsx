// OfficialSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart2,
  Users,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const OfficialSidebar = () => {
  const userName = localStorage.getItem("name") || "Official";
  const userLocation = localStorage.getItem("location") || "Unknown";
  const role = localStorage.getItem("userRole") || "official";
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.clear(); // ✅ clear session
    navigate("/"); // ✅ redirect to homepage/login
  };


  const links = [
    { to: "/dashboard/official", label: "Dashboard", icon: Home },
    {
      label: "Petitions",
      icon: FileText,
      children: [
        { to: "/dashboard/official/petitions/pending", label: "Active" },
        { to: "/dashboard/official/petitions/approved", label: "Under Review" },
        { to: "/dashboard/official/petitions/resolved", label: "Resolved" },
      ],
    },
    { to: "/dashboard/official/polls", label: "Polls", icon: BarChart2 },
    { to: "/dashboard/official/profile", label: "Profile", icon: Users },
    { to: "/dashboard/official/reports", label: "Reports", icon: ClipboardList },
    { to: "/dashboard/official/settings", label: "Settings", icon: Settings },
    { to: "/dashboard/official/help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-blue-50 border-r shadow-sm flex flex-col min-h-screen">
      {/* Profile */}
      <div className="p-6 border-b text-center bg-blue-100">
        <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold mx-auto">
          {userName.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-3 font-semibold text-gray-800">{userName}</h2>
        <p className="text-xs text-gray-500">Official</p>
        <p className="text-xs text-gray-400">📍 {userLocation}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon, children }) => {
          if (children) {
            return (
              <div key={label}>
                <div className="flex items-center gap-3 px-4 py-2 text-gray-500 font-semibold">
                  <Icon size={18} className="text-gray-500" />
                  {label}
                </div>
                <div className="ml-6 space-y-1">
                  {children.map(({ to: childTo, label: childLabel }) => {
                    const isActive = location.pathname === childTo;
                    return (
                      <Link
                        key={childTo}
                        to={childTo}
                        className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                          isActive
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-gray-700 hover:bg-blue-100"
                        }`}
                      >
                        {childLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = location.pathname === to;
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
              {Icon && (
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-gray-500"}
                />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
       {/* ✅ Signout Button at bottom */}
      <div className="p-4 border-t">
        <button
          onClick={handleSignout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
        >
          <LogOut size={18} />
          Signout
        </button>
      </div>
    </div>
  );
};

export default OfficialSidebar;
